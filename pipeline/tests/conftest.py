import sqlite3
from pathlib import Path

import pandas as pd
import pytest

ROOT = Path(__file__).resolve().parents[2]
SCHEMA_SQL = ROOT / "db" / "schema.sql"
DATA_MANUAL = ROOT / "data" / "manual"


@pytest.fixture
def conn():
    c = sqlite3.connect(":memory:")
    c.execute("PRAGMA foreign_keys = ON")
    c.executescript(SCHEMA_SQL.read_text(encoding="utf-8"))
    # Baris induk minimal agar kegagalan berasal dari CHECK, bukan foreign key.
    c.execute(
        "INSERT INTO desa (kode, nama, kec_kode, kec_nama, kab_kode, kab_nama, "
        "prov_kode, prov_nama, lat, lon, luas_ha, peat_frac, geom_json) "
        "VALUES ('D001', 'Desa Uji', 'K001', 'Kecamatan Uji', '61', 'Kabupaten Uji', "
        "'61', 'Kalimantan Barat', 0, 0, 100, 0, '{}')"
    )
    c.execute(
        "INSERT INTO katalog_item (kode, nama, satuan, bobot, kritis, bisa_dibeli, "
        "punya_rusak, hanya_gambut, urutan) "
        "VALUES ('pompa_jinjing', 'Pompa jinjing', 'unit', 20, 1, 1, 1, 0, 2)"
    )
    c.execute(
        "INSERT INTO akun (id, username, pass_hash, peran, desa_kode, nama_tampil) "
        "VALUES (1, 'uji', 'hash-uji', 'mpa', 'D001', 'Akun Uji')"
    )
    c.commit()
    yield c
    c.close()


def insert_inventaris(conn, total, berfungsi):
    conn.execute(
        "INSERT INTO inventaris_item (desa_kode, item_kode, total, berfungsi, catatan, "
        "updated_by, updated_at) VALUES ('D001', 'pompa_jinjing', ?, ?, NULL, 1, "
        "'2026-11-10T00:00:00Z')",
        (total, berfungsi),
    )
    conn.commit()


def insert_harga(conn, sumber):
    conn.execute(
        "INSERT INTO harga_item (item_kode, aksi, harga_rp, sumber, tanggal, catatan) "
        "VALUES ('pompa_jinjing', 'beli', 1000000, ?, '2026-11-09', NULL)",
        (sumber,),
    )
    conn.commit()


def read_csv(nama):
    return pd.read_csv(DATA_MANUAL / nama)
