import json
import sqlite3

import pandas as pd

from pipeline.export import build_db, meta_frame


def katalog():
    return pd.DataFrame([{
        "kode": "pompa_jinjing", "nama": "Pompa jinjing", "satuan": "unit", "bobot": 20,
        "kritis": 1, "bisa_dibeli": 1, "punya_rusak": 1, "hanya_gambut": 0, "urutan": 2,
    }])


def desa():
    return pd.DataFrame([{
        "kode": "D001", "nama": "Desa Uji", "kec_kode": "K001", "kec_nama": "Kecamatan Uji",
        "kab_kode": "61", "kab_nama": "Kabupaten Uji", "prov_kode": "61",
        "prov_nama": "Kalimantan Barat", "lat": 0.0, "lon": 0.0, "luas_ha": 100.0,
        "peat_frac": 0.5, "geom_json": "{}",
    }])


def test_gate_result_is_json_in_meta(tmp_path):
    params = {"buffer_km": ("2", "parameter")}
    extra = {"gate_hasil": (json.dumps({"a": True, "b": False, "keputusan": "lunakkan"}), "hasil")}
    build_db(tmp_path / "x.db", {"meta": meta_frame(params, extra), "desa": desa()})
    c = sqlite3.connect(tmp_path / "x.db")
    nilai = c.execute("select nilai from meta where kunci='gate_hasil'").fetchone()[0]
    c.close()
    assert json.loads(nilai)["keputusan"] == "lunakkan"


def test_build_db_replaces_old_file(tmp_path):
    path = tmp_path / "x.db"
    build_db(path, {"desa": desa()})
    build_db(path, {"desa": desa()})
    c = sqlite3.connect(path)
    n = c.execute("select count(*) from desa").fetchone()[0]
    c.close()
    assert n == 1


def test_gambut_layer_merges_geometry(tmp_path):
    from pipeline.run_all import _gambut_layer

    (tmp_path / "gambut_kalimantan").mkdir()
    pd.DataFrame([{
        "kode": "D1", "nama": "Desa Gambut", "kec_kode": "K1", "kec_nama": "Kec",
        "kab_kode": "61", "kab_nama": "Kab", "prov_kode": "61", "prov_nama": "Kalimantan Barat",
        "lat": 0.0, "lon": 0.0, "luas_ha": 10.0, "peat_ha": 4.0, "peat_frac": 0.4,
    }]).to_csv(tmp_path / "gambut_kalimantan" / "desa_gambut.csv", index=False)
    geo = {"type": "FeatureCollection", "features": [{
        "type": "Feature", "properties": {"kode": "D1"},
        "geometry": {"type": "Point", "coordinates": [1.0, 2.0]},
    }]}
    (tmp_path / "gambut_kalimantan" / "desa_gambut.geojson").write_text(json.dumps(geo))
    df = _gambut_layer(tmp_path)
    assert json.loads(df.loc[0, "geom_json"])["coordinates"] == [1.0, 2.0]


def test_gambut_layer_rejects_unsynced_rows(tmp_path):
    from pipeline.run_all import _gambut_layer

    (tmp_path / "gambut_kalimantan").mkdir()
    pd.DataFrame([{"kode": "D1"}]).to_csv(tmp_path / "gambut_kalimantan" / "desa_gambut.csv", index=False)
    (tmp_path / "gambut_kalimantan" / "desa_gambut.geojson").write_text(
        json.dumps({"type": "FeatureCollection", "features": []}))
    import pytest
    with pytest.raises(ValueError):
        _gambut_layer(tmp_path)
