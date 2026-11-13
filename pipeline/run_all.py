"""Jalankan seluruh pipeline dan tulis `data/siapkemarau.db` (TRD bagian 5).

Urutan: baca FIRMS -> batas desa + gambut -> hitung desa-tahun -> paparan,
backtest, gerbang -> ekspor. Angka kontrol ditulis ke `pipeline/run_output.txt`.
"""

import io
import json
import sys
from pathlib import Path

import geopandas as gpd
import pandas as pd

try:  # `python -m pipeline.run_all` dari akar repo
    from pipeline.backtest import blind_spot_groups, backtest_fold, gate
    from pipeline.export import build_db, json_meta, load_manual, meta_frame
    from pipeline.firms import assign_to_desa, desa_month, desa_year, load_detections, sensor_summary
    from pipeline.paparan import exposure, kecamatan_exposure, shrink_desa
    from pipeline.params import PARAMS
    from pipeline.wilayah import load_desa, peat_fraction, simplify_geom
except ImportError:  # `python pipeline/run_all.py`
    from backtest import blind_spot_groups, backtest_fold, gate
    from export import build_db, json_meta, load_manual, meta_frame
    from firms import assign_to_desa, desa_month, desa_year, load_detections, sensor_summary
    from paparan import exposure, kecamatan_exposure, shrink_desa
    from params import PARAMS
    from wilayah import load_desa, peat_fraction, simplify_geom

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT_DB = ROOT / "data" / "siapkemarau.db"
OUT_LOG = ROOT / "pipeline" / "run_output.txt"
PROV = ["61", "62"]  # Kalimantan Barat, Kalimantan Tengah
# Desa jangkar untuk cetak riwayat: "Kali Bandung" (Kubu Raya) = Kalibandung pada arsip Mongabay.
ANCHOR_KODE = "6112070019"
YEARS = list(range(2012, 2027))
TAHUN_UJI = [2019, 2023, 2026]
P = {k: v[0] for k, v in PARAMS.items()}
EXT = [int(t) for t in P["ext_years"].split(",")]
FREEZE_YEAR = int(P["freeze_date"][:4])


def _raw_detections() -> tuple[list[str], pd.DataFrame, pd.DataFrame]:
    paths = sorted(str(p) for p in (RAW / "firms").glob("*.csv"))
    if not paths:
        sys.exit("data/raw/firms kosong. Jalankan `uv run python pipeline/fetch_firms.py`.")
    parts, mentah = [], []
    for p in paths:
        df = pd.read_csv(p, dtype=str, usecols=lambda c: c in {
            "latitude", "longitude", "acq_date", "satellite", "confidence", "type"})
        df["sumber"] = "NRT" if "_NRT_" in Path(p).name else "SP"
        mentah.append(df[["satellite", "sumber"]])
        parts.append(df)
    sebelum = pd.concat(mentah, ignore_index=True)
    det = load_detections(paths)
    return paths, sebelum, det


def _gambut_layer(raw: Path = RAW) -> pd.DataFrame:
    """Desa bergambut seluruh Kalimantan: CSV + geometri dari GeoJSON teammate."""
    csv_path = raw / "gambut_kalimantan" / "desa_gambut.csv"
    geo_path = raw / "gambut_kalimantan" / "desa_gambut.geojson"
    if not (csv_path.exists() and geo_path.exists()):
        try:
            from pipeline.gambut_kalimantan import main as hitung_gambut
        except ImportError:
            from gambut_kalimantan import main as hitung_gambut
        hitung_gambut()
    df = pd.read_csv(csv_path, dtype={"kode": str})
    geo = json.loads(geo_path.read_text(encoding="utf-8"))
    geom = {str(f["properties"]["kode"]): json.dumps(f["geometry"], separators=(",", ":"))
            for f in geo["features"]}
    df["geom_json"] = df["kode"].map(geom)
    if df["geom_json"].isna().any():
        raise ValueError("desa_gambut.csv dan desa_gambut.geojson tidak sinkron")
    return df


def _desa_layer() -> gpd.GeoDataFrame:
    shp = sorted((RAW / "hdx").rglob("*admin4*.shp"))
    if not shp:
        sys.exit("data/raw/hdx tidak memuat ADM4 shapefile. Unduh HDX COD-AB lebih dulu.")
    desa = load_desa(str(shp[0]), PROV)
    peat_files = sorted((RAW / "peat").glob("*.geojson"))
    if not peat_files:
        sys.exit("data/raw/peat kosong. Unduh WRI/GFW Indonesia Peat Lands lebih dulu.")
    peat = gpd.read_file(peat_files[0])
    desa["peat_frac"] = peat_fraction(desa, peat)
    titik = desa.geometry.representative_point()
    desa["lat"] = titik.y
    desa["lon"] = titik.x
    desa["geom_json"] = [simplify_geom(g) for g in desa.geometry]
    return desa


def skor_desa(exp: pd.DataFrame, kec: pd.DataFrame, s_desa: float) -> pd.Series:
    p_mean = kec.set_index("kec_kode")["p_mean"]
    d = exp.merge(kec[["kec_kode", "p_mean"]], how="left", on="kec_kode")
    return shrink_desa(d.k_ext, d.n_ext, d.p_mean.fillna(0.0), s_desa)


def _join_kec(exp: pd.DataFrame, desa: pd.DataFrame) -> pd.DataFrame:
    return exp.merge(desa[["kode", "kec_kode"]], on="kode")


def paparan_mode(dy, desa, mode, ext, last_year) -> tuple[pd.DataFrame, pd.DataFrame]:
    sub = dy[dy["tahun"] <= last_year]
    exp = exposure(sub, ext, last_year, int(P["quiet_window"]))
    exp = _join_kec(exp, desa)
    kec = kecamatan_exposure(sub, desa, ext)
    exp["skor"] = skor_desa(exp, kec, float(P["s_desa"]))
    p = exp[["kode", "k_ext", "n_ext", "k_norm", "n_norm", "tahun_tenang",
             "tampak_aman", "tier", "skor"]].copy()
    p.insert(1, "mode", mode)
    k = kec.copy()
    k.insert(1, "mode", mode)
    return p, k


def _hitung(det, desa, buffer_km, min_det_days):
    a = assign_to_desa(det, desa, buffer_km)
    dy = desa_year(a, desa["kode"], YEARS, min_det_days)
    exp = exposure(dy, EXT, 2026, int(P["quiet_window"]))
    return _join_kec(exp, desa), dy


def sensitivitas(det, desa, dy, exp_live) -> dict:
    out = {"buffer_km": {}, "min_det_days": {}, "s_desa": {}}
    for b in (0, 2, 5):
        exp, _ = _hitung(det, desa, b, int(P["min_det_days"]))
        out["buffer_km"][str(b)] = {"tampak_aman": int(exp.tampak_aman.sum())}
    for m in (1, 2, 3):
        exp, _ = _hitung(det, desa, float(P["buffer_km"]), m)
        out["min_det_days"][str(m)] = {"tampak_aman": int(exp.tampak_aman.sum())}
    dasar = set(exp_live.nlargest(20, "skor")["kode"])
    _, kec = paparan_mode(dy, desa, "live", EXT, 2026)
    exp = _join_kec(exposure(dy, EXT, 2026, int(P["quiet_window"])), desa)
    for s in (0, 2, 5):
        e = exp.copy()
        e["skor"] = skor_desa(exp, kec, s)
        out["s_desa"][str(s)] = {"n_top20_berubah": len(dasar - set(e.nlargest(20, "skor")["kode"]))}
    return out


def main() -> None:
    log = io.StringIO()

    def tulis(*a):
        print(*a)
        print(*a, file=log)

    paths, sebelum, det = _raw_detections()
    tulis(f"Berkas FIRMS: {len(paths)}")
    tulis("Deteksi sebelum filter per satelit/sumber:")
    tulis(sebelum.value_counts(["satellite", "sumber"]).to_string())
    tulis("Deteksi sesudah filter per satelit/sumber:")
    tulis(det.value_counts(["satellite", "sumber"]).to_string())
    for s in ("SP", "NRT"):
        sub = det[det.sumber == s]
        tulis(f"Tanggal terakhir {s}: {sub.tanggal.max() if len(sub) else '-'}")
    sp_max = det.loc[det.sumber == "SP", "tanggal"].max()
    nrt_min = det.loc[det.sumber == "NRT", "tanggal"].min()
    tulis(f"Celah SP->NRT: {sp_max} sampai {nrt_min}")

    gambut = _gambut_layer()
    tulis(f"Desa bergambut 5 provinsi: {len(gambut)}; "
          f"luas gambut {gambut.peat_ha.sum() / 1e6:.2f} juta ha")
    tulis(gambut.groupby("prov_nama")["kode"].size().to_string())

    desa = _desa_layer()
    tulis(f"Desa: {len(desa)}")
    tulis(desa.groupby("prov_nama")["kode"].nunique().to_string())
    tulis(f"Desa dengan peat_frac > 0: {int((desa.peat_frac > 0).sum())}")

    assigned = assign_to_desa(det, desa, float(P["buffer_km"]))
    dy = desa_year(assigned, desa["kode"], YEARS, int(P["min_det_days"]))
    tulis("Desa-tahun terpapar per tahun:")
    tulis(dy.groupby("tahun")["terpapar"].sum().to_string())

    frozen, kec_frozen = paparan_mode(dy, desa, "frozen", [t for t in EXT if t <= FREEZE_YEAR], FREEZE_YEAR)
    live, kec_live = paparan_mode(dy, desa, "live", EXT, 2026)
    semua = pd.concat([frozen, live], ignore_index=True)
    kec = pd.concat([kec_frozen.assign(mode="frozen"), kec_live.assign(mode="live")], ignore_index=True)
    tulis(f"Desa tampak aman (live): {int(live.tampak_aman.sum())}")

    folds = [backtest_fold(dy, desa[["kode", "kec_kode", "peat_frac"]], t, EXT,
                           int(P["quiet_window"]), float(P["s_desa"]), float(P["kec_min_share"]))
             for t in TAHUN_UJI]
    metrik = pd.concat(folds, ignore_index=True)
    tulis("Metrik backtest:")
    tulis(metrik.to_string(index=False))

    y2026 = dy[dy.tahun == 2026][["kode", "terpapar"]]
    grup = blind_spot_groups(frozen, y2026, desa[["kode", "luas_ha"]], int(P["quiet_window"]))
    tulis("Grup titik buta:")
    tulis(grup.to_string(index=False))
    g = gate(grup, float(P["gate_min_lift"]), int(P["gate_min_exposed"]),
             float(P["gate_min_ratio_aktif"]))
    tulis(f"Gerbang: {json.dumps(g, sort_keys=True)}")

    jangkar = desa[desa.kode == ANCHOR_KODE]
    kalibandung = dy[dy.kode == ANCHOR_KODE]
    if len(kalibandung):
        r = jangkar.iloc[0]
        tulis(f"Riwayat {r.nama} ({r.kec_nama}, {r.kab_nama}; HDX {ANCHOR_KODE}) - Kalibandung:")
        tulis(kalibandung.to_string(index=False))

    sens = sensitivitas(det, desa, dy, live)
    extra = {
        "gate_hasil": (json_meta(g), "hasil"),
        "data_akhir_2026": (str(det.tanggal.max()), "hasil"),
        "sensitivitas": (json_meta(sens), "hasil"),
    }

    tabel = load_manual()
    tabel.update({
        "meta": meta_frame(PARAMS, extra),
        "deteksi_ringkas": sensor_summary(det),
        "desa": desa.drop(columns="geometry"),
        "desa_gambut": gambut,
        "desa_tahun": dy,
        "desa_bulan": desa_month(assigned, YEARS),
        "desa_paparan": semua,
        "kecamatan_paparan": kec,
        "backtest_metric": metrik,
        "backtest_grup": grup,
    })
    build_db(OUT_DB, tabel)
    ukuran = OUT_DB.stat().st_size / 1_000_000
    tulis(f"DB: {OUT_DB} ({ukuran:.1f} MB)")
    OUT_LOG.write_text(log.getvalue(), encoding="utf-8")


if __name__ == "__main__":
    main()
