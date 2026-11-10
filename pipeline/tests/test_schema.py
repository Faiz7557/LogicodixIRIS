import sqlite3

import pytest

from conftest import insert_harga, insert_inventaris, read_csv

CSV_TABEL = [
    "katalog_item",
    "paket_minimum",
    "referensi_pergub",
    "harga_item",
    "sumber_data",
    "dq_issue",
]


def test_rejects_berfungsi_above_total(conn):
    with pytest.raises(sqlite3.IntegrityError):
        insert_inventaris(conn, total=2, berfungsi=3)

def test_price_requires_source(conn):
    with pytest.raises(sqlite3.IntegrityError):
        insert_harga(conn, sumber="")

def test_manual_price_rows_have_source():
    assert read_csv("harga_item.csv")["sumber"].str.len().min() > 0

def test_package_values():
    assert dict(read_csv("paket_minimum.csv")[["item_kode", "target"]].values) == {
        "dana_operasi": 1, "pompa_jinjing": 1, "selang_keluar": 10, "sumur_bor": 5}


def test_valid_inventaris_accepted(conn):
    insert_inventaris(conn, total=2, berfungsi=2)

def test_valid_price_accepted(conn):
    insert_harga(conn, sumber="Uji")

def test_ext_years_param():
    from pipeline.params import PARAMS

    assert PARAMS["ext_years"] == ("2015,2019,2023,2026", "parameter")

def test_manual_csv_columns_match_schema(conn):
    # Baris pompa_jinjing dari baris induk akan bentrok dengan katalog_item.csv.
    conn.execute("DELETE FROM katalog_item")
    for tabel in CSV_TABEL:
        df = read_csv(f"{tabel}.csv")
        kolom_db = [r[1] for r in conn.execute(f"PRAGMA table_info({tabel})")]
        assert list(df.columns) == kolom_db, tabel
        rows = df.astype(object).where(df.notna(), None).values.tolist()
        marks = ",".join("?" for _ in kolom_db)
        conn.executemany(
            f"INSERT INTO {tabel} ({','.join(kolom_db)}) VALUES ({marks})", rows)
