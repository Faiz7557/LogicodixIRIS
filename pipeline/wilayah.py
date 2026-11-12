"""Batas desa HDX COD-AB, porsi gambut WRI, dan luas (TRD bagian 5)."""
import json
import re

import geopandas as gpd
import numpy as np
import pandas as pd
import shapely
from shapely.geometry import mapping

# Pemetaan kolom HDX COD-AB Indonesia level 4 (desa) ke kolom tabel desa.
# Unduhan 12 Nov 2026 memakai huruf kecil (`adm4_pcode`), versi lain huruf besar;
# pencocokan di `load_desa` tidak membedakan huruf.
# Tiap kolom punya beberapa nama kandidat: unduhan 2020 memakai `adm4_name`,
# varian lama memakai `ADM4_EN`.
HDX_COLS = {
    "kode": ["ADM4_PCODE"],
    "nama": ["ADM4_EN", "ADM4_NAME"],
    "kec_kode": ["ADM3_PCODE"],
    "kec_nama": ["ADM3_EN", "ADM3_NAME"],
    "kab_kode": ["ADM2_PCODE"],
    "kab_nama": ["ADM2_EN", "ADM2_NAME"],
    "prov_kode": ["ADM1_PCODE"],
    "prov_nama": ["ADM1_EN", "ADM1_NAME"],
}
# P-code COD-AB berawalan kode negara ("ID61"); dibuang agar prov_kode jadi "61".
PCODE_PREFIX = "ID"
AREA_CRS = 6933  # equal-area, untuk luas dan porsi gambut


def clean_name(name: str) -> str:
    """Ambil nama pertama dari bentuk alternatif "A/ B" dan rapikan spasi."""
    return re.sub(r"\s+", " ", str(name).split("/")[0]).strip()


def _strip_prefix(s: pd.Series) -> pd.Series:
    s = s.astype(str).str.strip()
    return s.where(~s.str.startswith(PCODE_PREFIX), s.str[len(PCODE_PREFIX):])


def load_desa(path: str, prov_codes: list[str], where: str | None = None) -> gpd.GeoDataFrame:
    raw = gpd.read_file(path, **({"where": where} if where else {}))
    lookup = {str(c).lower(): c for c in raw.columns}
    kolom = {k: next((lookup[x.lower()] for x in cand if x.lower() in lookup), None)
             for k, cand in HDX_COLS.items()}
    missing = [cand[0] for (k, cand) in HDX_COLS.items() if kolom[k] is None]
    if missing:
        raise ValueError(
            f"Kolom HDX COD-AB hilang: {', '.join(missing)}. Kolom yang ada: "
            f"{', '.join(map(str, raw.columns))}. Perbarui HDX_COLS di pipeline/wilayah.py.")
    if raw.crs is None:
        raise ValueError(f"{path} tidak memiliki CRS")
    d = gpd.GeoDataFrame({k: raw[v] for k, v in kolom.items()}, geometry=raw.geometry, crs=raw.crs)
    for k in ("kode", "kec_kode", "kab_kode", "prov_kode"):
        d[k] = _strip_prefix(d[k])
    for k in ("nama", "kec_nama", "kab_nama", "prov_nama"):
        d[k] = d[k].map(clean_name)
    d = d[d.prov_kode.isin([str(p) for p in prov_codes])].to_crs(4326)
    d["luas_ha"] = d.geometry.to_crs(AREA_CRS).area / 10_000
    cols = list(HDX_COLS) + ["luas_ha", "geometry"]
    return d[cols].reset_index(drop=True)


def peat_fraction(desa, peat) -> pd.Series:
    """Porsi luas desa yang tertutup gambut, 0 sampai 1, indeks sama dengan desa."""
    dg = desa.geometry.to_crs(AREA_CRS).make_valid()
    pg = peat.geometry.to_crs(AREA_CRS)
    minx, miny, maxx, maxy = dg.total_bounds
    pg = pg.cx[minx:maxx, miny:maxy]
    if pg.empty:
        return pd.Series(0.0, index=desa.index)
    peat_union = pg.make_valid().union_all()
    frac = dg.intersection(peat_union).area / dg.area
    return frac.fillna(0.0).clip(0, 1).set_axis(desa.index)


def _to_json(geom) -> str:
    g = shapely.transform(geom, lambda c: np.round(c, 5))
    return json.dumps(mapping(g), separators=(",", ":"))


def simplify_geom(geom, max_bytes: int = 4000) -> str:
    """GeoJSON geometry (string, koordinat 5 desimal) paling detail yang muat max_bytes."""
    s = _to_json(geom)
    tol = 1e-5
    while len(s.encode()) > max_bytes and tol < 1:
        s = _to_json(geom.simplify(tol, preserve_topology=True))
        tol *= 2
    if len(s.encode()) > max_bytes:
        # ponytail: desa dengan sangat banyak pulau bisa tetap kebesaran; jatuh ke kotak
        # pembatas. Ganti dengan membuang pulau terkecil bila ini muncul pada data nyata.
        s = _to_json(geom.envelope)
    return s
