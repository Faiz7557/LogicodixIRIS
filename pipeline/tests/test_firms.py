import geopandas as gpd
import pandas as pd
import pytest
from shapely.geometry import box

from pipeline.firms import assign_to_desa, desa_year, load_detections, sensor_summary

HEADER = "latitude,longitude,acq_date,acq_time,satellite,confidence,frp,daynight"


@pytest.fixture
def csv_with_l_n_h(tmp_path):
    p = tmp_path / "VIIRS_SNPP_SP_2019-08-01.csv"
    p.write_text(HEADER + "\n"
                 "0.01,110.01,2019-08-01,0530,N,l,1.0,D\n"
                 "0.02,110.02,2019-08-01,0530,N,n,2.0,D\n"
                 "0.03,110.03,2019-08-02,0530,N,h,3.0,D\n")
    return str(p)


@pytest.fixture
def csv_with_nominal_high_low(tmp_path):
    # Format arsip: confidence berupa kata, ada kolom type. Baris type 2 dibuang.
    p = tmp_path / "VIIRS_SNPP_NRT_2026-08-01.csv"
    p.write_text(HEADER + ",type\n"
                 "0.01,110.01,2026-08-01,0530,N,Low,1.0,D,0\n"
                 "0.02,110.02,2026-08-01,0530,N,nominal,2.0,D,0\n"
                 "0.03,110.03,2026-08-02,0530,N,High,3.0,D,0\n"
                 "0.04,110.04,2026-08-02,0530,N,high,3.0,D,2\n")
    return str(p)


@pytest.fixture
def sp_csv(csv_with_l_n_h):
    return csv_with_l_n_h


desa = gpd.GeoDataFrame({"kode": ["A"]}, geometry=[box(110.0, 0.0, 110.1, 0.1)], crs=4326)
# 1,5 km di timur tepi desa, di khatulistiwa 1 derajat bujur sekitar 111,32 km.
point_1_5km_out = pd.DataFrame({
    "lat": [0.05], "lon": [110.1 + 1.5 / 111.32], "tanggal": ["2019-08-01"], "tahun": [2019]})

three_same_day = pd.DataFrame({"kode": ["A"] * 3, "tanggal": ["2019-08-01"] * 3, "tahun": [2019] * 3})
two_days = pd.DataFrame({"kode": ["A"] * 2, "tanggal": ["2019-08-01", "2019-08-02"], "tahun": [2019] * 2})
empty_det = pd.DataFrame({"kode": pd.Series(dtype=str), "tanggal": pd.Series(dtype=str),
                          "tahun": pd.Series(dtype=int)})


@pytest.fixture
def mixed_det():
    return pd.DataFrame({
        "lat": [0.0] * 4, "lon": [110.0] * 4,
        "tanggal": ["2019-08-01", "2019-08-02", "2026-08-01", "2026-08-01"],
        "tahun": [2019, 2019, 2026, 2026],
        "satellite": ["N", "N", "N", "N"],
        "sumber": ["SP", "SP", "NRT", "NRT"],
    })


def test_low_confidence_dropped(csv_with_l_n_h):
    assert len(load_detections([csv_with_l_n_h])) == 2


def test_word_confidence_is_normalised(csv_with_nominal_high_low):
    assert len(load_detections([csv_with_nominal_high_low])) == 2


def test_source_comes_from_filename(sp_csv):
    assert load_detections([sp_csv]).sumber.unique().tolist() == ["SP"]


def test_buffer_includes_point_1_5km_outside():
    assert len(assign_to_desa(point_1_5km_out, desa, buffer_km=2)) == 1
    assert len(assign_to_desa(point_1_5km_out, desa, buffer_km=1)) == 0


def test_same_day_counts_once():
    r = desa_year(three_same_day, ["A"], [2019], 2).iloc[0]
    assert (r.n_det, r.det_days, r.terpapar) == (3, 1, 0)


def test_two_days_exposed():
    assert desa_year(two_days, ["A"], [2019], 2).iloc[0].terpapar == 1


def test_village_without_detection_gets_zero_rows():
    assert len(desa_year(empty_det, ["A"], [2018, 2019], 2)) == 2


def test_sensor_summary_keeps_sensor_and_source(mixed_det):
    assert set(sensor_summary(mixed_det).columns) == {"tahun", "satellite", "sumber", "n_det"}
