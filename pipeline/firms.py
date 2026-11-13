"""Deteksi satelit FIRMS per desa-tahun (TRD bagian 5)."""
from pathlib import Path

import geopandas as gpd
import pandas as pd

DET_COLS = ["lat", "lon", "tanggal", "tahun", "satellite", "sumber"]
KEEP_CONF = {"n", "h"}


def _sumber(path: str) -> str:
    # Nama dari fetch_firms: VIIRS_SNPP_SP_2012-01-20.csv. Arsip surel: fire_archive_* (SP), fire_nrt_* (NRT).
    tokens = {t.lower() for t in Path(path).stem.split("_")}
    if tokens & {"sp", "archive"}:
        return "SP"
    if "nrt" in tokens:
        return "NRT"
    raise ValueError(f"Sumber SP atau NRT tidak terbaca dari nama berkas {path}")


def load_detections(paths: list[str]) -> pd.DataFrame:
    parts = []
    for p in paths:
        df = pd.read_csv(p, dtype={"confidence": str, "satellite": str, "acq_date": str})
        conf = df["confidence"].astype(str).str.strip().str[:1].str.lower()
        keep = conf.isin(KEEP_CONF)
        if "type" in df.columns:
            keep &= df["type"] == 0
        df = df[keep]
        parts.append(pd.DataFrame({
            "lat": df["latitude"].astype(float),
            "lon": df["longitude"].astype(float),
            "tanggal": df["acq_date"].str.strip(),
            "tahun": df["acq_date"].str[:4].astype(int),
            "satellite": df["satellite"],
            "sumber": _sumber(p),
        }))
    if not parts:
        return pd.DataFrame(columns=DET_COLS)
    return pd.concat(parts, ignore_index=True)[DET_COLS]


def assign_to_desa(det, desa, buffer_km: float) -> pd.DataFrame:
    """Pasangkan deteksi ke setiap desa yang penyangganya memuat titik itu."""
    # ponytail: penyangga di EPSG:3857, jarak meter di sana membesar 1/cos(lintang).
    # Di Kalbar-Kalteng (lintang -4,5 sampai 2,5) galatnya di bawah 0,4 persen (2 km jadi
    # paling kecil 1,994 km sungguhan). Bila wilayah melebar menjauhi khatulistiwa, pakai
    # UTM per zona (EPSG:32749/32750) atau bagi jarak dengan cos(lintang) per desa.
    zones = gpd.GeoDataFrame(
        {"kode": desa["kode"].values},
        geometry=desa.geometry.to_crs(3857).buffer(buffer_km * 1000).values, crs=3857)
    pts = gpd.GeoDataFrame(
        det[["tanggal", "tahun"]].reset_index(drop=True),
        geometry=gpd.points_from_xy(det["lon"], det["lat"]), crs=4326).to_crs(3857)
    j = gpd.sjoin(pts, zones, predicate="within", how="inner")
    return j[["kode", "tanggal", "tahun"]].reset_index(drop=True)


def desa_year(assigned, kode_list, years, min_det_days: int) -> pd.DataFrame:
    """Satu baris per (kode, tahun) untuk semua kombinasi, termasuk yang tanpa deteksi."""
    full = pd.MultiIndex.from_product([list(kode_list), list(years)], names=["kode", "tahun"])
    agg = (assigned.groupby(["kode", "tahun"])
           .agg(n_det=("tanggal", "size"), det_days=("tanggal", "nunique")))
    out = agg.reindex(full, fill_value=0).astype(int).reset_index()
    out["terpapar"] = (out["det_days"] >= min_det_days).astype(int)
    return out[["kode", "tahun", "n_det", "det_days", "terpapar"]]


def desa_month(assigned, years) -> pd.DataFrame:
    """Satu baris per (kode, tahun, bulan) yang punya deteksi. Bulan tanpa deteksi tidak ditulis.

    Bulan dibaca dari `acq_date` FIRMS. Hari deteksi dihitung per bulan, jadi jumlah 12 bulan
    sama dengan `det_days` di `desa_year` (satu tanggal hanya jatuh di satu bulan).
    """
    a = assigned[assigned["tahun"].isin(list(years))]
    a = a.assign(bulan=a["tanggal"].str[5:7].astype(int))
    out = (a.groupby(["kode", "tahun", "bulan"])
           .agg(n_det=("tanggal", "size"), det_days=("tanggal", "nunique"))
           .reset_index())
    out[["tahun", "bulan", "n_det", "det_days"]] = out[["tahun", "bulan", "n_det", "det_days"]].astype(int)
    return out[["kode", "tahun", "bulan", "n_det", "det_days"]]


def sensor_summary(det) -> pd.DataFrame:
    return (det.groupby(["tahun", "satellite", "sumber"]).size()
            .rename("n_det").reset_index())
