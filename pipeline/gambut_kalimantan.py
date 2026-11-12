"""Desa di Kalimantan yang punya tanah gambut: batas desa HDX COD-AB x WRI/GFW Indonesia Peat Lands.

Jalankan dari akar repo: `uv run python pipeline/gambut_kalimantan.py`.
Keluaran di `data/raw/gambut_kalimantan/` (sudah gitignored lewat `data/raw/`):
  desa_gambut.csv      atribut desa + luas gambut (ha) dan porsi gambut
  desa_gambut.geojson  poligon desa yang sama, disederhanakan

Sumber:
  batas desa  https://data.humdata.org/dataset/cod-ab-idn (CC BY-IGO)
  gambut      https://data.globalforestwatch.org/datasets/gfw::indonesia-peat-lands/about
"""

import json
from pathlib import Path

import geopandas as gpd

try:  # `python -m pipeline.gambut_kalimantan` dari akar repo
    from pipeline import fetch_inputs
    from pipeline.wilayah import clean_name, load_desa, peat_fraction, simplify_geom
except ImportError:  # `python pipeline/gambut_kalimantan.py`
    import fetch_inputs
    from wilayah import clean_name, load_desa, peat_fraction, simplify_geom

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = RAW / "gambut_kalimantan"
PROV = ["61", "62", "63", "64", "65"]  # seluruh Kalimantan
WHERE = "adm1_pcode IN (" + ",".join(f"'ID{p}'" for p in PROV) + ")"
COLS = ["kode", "nama", "kec_kode", "kec_nama", "kab_kode", "kab_nama",
        "prov_kode", "prov_nama", "lat", "lon", "luas_ha", "peat_ha", "peat_frac"]


def _props(r) -> dict:
    """Nilai baris pandas -> tipe JSON; nama desa dirapikan seperti di tabel desa."""
    return {k: (clean_name(r[k]) if k == "nama"
                else r[k].item() if hasattr(r[k], "item") else r[k])
            for k in COLS}


def main() -> None:
    fetch_inputs.hdx()
    fetch_inputs.peat()
    shp = next((RAW / "hdx").rglob("*admin4*.shp"))
    peat = gpd.read_file(next((RAW / "peat").glob("*.geojson")))
    desa = load_desa(str(shp), PROV, where=WHERE)
    desa["peat_frac"] = peat_fraction(desa, peat)
    desa["peat_ha"] = desa.peat_frac * desa.luas_ha
    titik = desa.geometry.representative_point()
    desa["lat"], desa["lon"] = titik.y, titik.x
    gambut = desa[desa.peat_frac > 0].sort_values(
        ["prov_kode", "kab_kode", "kec_kode", "nama"]).reset_index(drop=True)
    if gambut.kode.duplicated().any():
        raise ValueError("kode desa duplikat: COD-AB memuat beberapa versi batas")

    OUT.mkdir(parents=True, exist_ok=True)
    gambut[COLS].round({"lat": 6, "lon": 6, "luas_ha": 2, "peat_ha": 2, "peat_frac": 4}) \
        .to_csv(OUT / "desa_gambut.csv", index=False)
    feats = [{"type": "Feature", "properties": _props(r),
              "geometry": json.loads(simplify_geom(r.geometry))}
             for _, r in gambut.iterrows()]
    (OUT / "desa_gambut.geojson").write_text(json.dumps(
        {"type": "FeatureCollection", "features": feats}, separators=(",", ":")))

    print(f"Desa Kalimantan: {len(desa)}; punya gambut: {len(gambut)}; "
          f"gambut >= 50% luas desa: {int((gambut.peat_frac >= 0.5).sum())}")
    print(f"Total luas gambut terpetakan: {gambut.peat_ha.sum() / 1e6:.2f} juta ha")
    print(gambut.groupby("prov_nama").agg(
        desa=("kode", "size"), gambut_ha=("peat_ha", "sum")).assign(
        gambut_juta_ha=lambda d: (d.gambut_ha / 1e6).round(3)).drop(columns="gambut_ha").to_string())
    print(f"Keluaran: {OUT}")


if __name__ == "__main__":
    main()
