import math
import random

import geopandas as gpd
import pytest
from shapely.geometry import Polygon, box

from pipeline.wilayah import clean_name, load_desa, peat_fraction, simplify_geom

# Semua geometri sintetis, di sekitar khatulistiwa Kalimantan Barat.
square_desa = gpd.GeoDataFrame({"kode": ["A"]}, geometry=[box(110.0, 0.0, 110.1, 0.1)], crs=4326)
left_half_peat = gpd.GeoDataFrame(geometry=[box(109.9, -0.1, 110.05, 0.2)], crs=4326)
far_peat = gpd.GeoDataFrame(geometry=[box(115.0, 2.0, 115.1, 2.1)], crs=4326)

_rng = random.Random(7)
jagged_polygon = Polygon([
    (110 + (0.05 + 0.04 * _rng.random()) * math.cos(2 * math.pi * i / 3000),
     0 + (0.05 + 0.04 * _rng.random()) * math.sin(2 * math.pi * i / 3000))
    for i in range(3000)
])


def test_clean_name_takes_first_alternate():
    assert clean_name("Sungai Raya/ Sei Raya") == "Sungai Raya"


def test_peat_fraction_half_covered():
    assert peat_fraction(square_desa, left_half_peat).iloc[0] == pytest.approx(0.5, abs=0.01)


def test_peat_fraction_no_overlap_is_zero():
    assert peat_fraction(square_desa, far_peat).iloc[0] == 0


def test_simplify_geom_respects_limit():
    assert len(simplify_geom(jagged_polygon, max_bytes=4000)) <= 4000


def _hdx_like(tmp_path, drop=None):
    cols = {
        "ADM4_PCODE": ["ID6101012001", "ID6201012001", "ID3101012001"],
        "ADM4_EN": ["Sungai Raya/ Sei Raya", "Desa B", "Desa C"],
        "ADM3_PCODE": ["ID610101", "ID620101", "ID310101"],
        "ADM3_EN": ["Kec A", "Kec B", "Kec C"],
        "ADM2_PCODE": ["ID6101", "ID6201", "ID3101"],
        "ADM2_EN": ["Kab A", "Kab B", "Kab C"],
        "ADM1_PCODE": ["ID61", "ID62", "ID31"],
        "ADM1_EN": ["Kalimantan Barat", "Kalimantan Tengah", "DKI Jakarta"],
    }
    if drop:
        cols.pop(drop)
    g = gpd.GeoDataFrame(cols, geometry=[box(110, 0, 110.01, 0.01)] * 3, crs=4326)
    p = tmp_path / "adm4.geojson"
    g.to_file(p, driver="GeoJSON")
    return str(p)


def test_load_desa_filters_province_and_computes_area(tmp_path):
    d = load_desa(_hdx_like(tmp_path), ["61", "62"])
    assert d.prov_kode.tolist() == ["61", "62"]
    assert d.nama.iloc[0] == "Sungai Raya"
    # 0,01 derajat persegi di khatulistiwa sekitar 1,113 km x 1,106 km = sekitar 123 ha
    assert d.luas_ha.iloc[0] == pytest.approx(123, rel=0.02)
    assert list(d.columns) == ["kode", "nama", "kec_kode", "kec_nama", "kab_kode", "kab_nama",
                               "prov_kode", "prov_nama", "luas_ha", "geometry"]


def test_load_desa_names_missing_column(tmp_path):
    with pytest.raises(ValueError, match="ADM3_EN"):
        load_desa(_hdx_like(tmp_path, drop="ADM3_EN"), ["61"])
