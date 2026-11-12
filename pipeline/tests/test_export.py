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
