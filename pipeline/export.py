"""Ekspor tabel pipeline ke SQLite (TRD bagian 5, Task T23)."""

import json
import sqlite3
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_SQL = ROOT / "db" / "schema.sql"
MANUAL = ROOT / "data" / "manual"

# Urutan mengikuti kunci asing: induk lebih dulu.
TABLE_ORDER = [
    "meta", "sumber_data", "dq_issue", "katalog_item", "paket_minimum",
    "referensi_pergub", "harga_item", "deteksi_ringkas", "desa", "desa_gambut", "desa_tahun",
    "desa_paparan", "kecamatan_paparan", "backtest_metric", "backtest_grup",
]

MANUAL_TABLES = [
    "sumber_data", "dq_issue", "katalog_item", "paket_minimum",
    "referensi_pergub", "harga_item",
]


def _scalar(v):
    if v is None:
        return None
    if isinstance(v, float) and pd.isna(v):
        return None
    if hasattr(v, "item"):  # numpy.int64/float64
        v = v.item()
    if isinstance(v, float) and pd.isna(v):
        return None
    if isinstance(v, (pd.Timestamp,)):
        return v.isoformat()
    return v


def load_manual() -> dict[str, pd.DataFrame]:
    """Enam CSV manual apa adanya; NaN menjadi NULL."""
    return {n: pd.read_csv(MANUAL / f"{n}.csv") for n in MANUAL_TABLES}


def build_db(path, tables: dict[str, pd.DataFrame]) -> None:
    """Tulis DB baru di `path` dari skema dan tabel yang diberikan."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.unlink(missing_ok=True)
    c = sqlite3.connect(path)
    try:
        c.execute("PRAGMA foreign_keys = ON")
        c.executescript(SCHEMA_SQL.read_text(encoding="utf-8"))
        for name in TABLE_ORDER:
            df = tables.get(name)
            if df is None or df.empty:
                continue
            kolom = list(df.columns)
            sql = (f"INSERT INTO {name} ({','.join(kolom)}) "
                   f"VALUES ({','.join('?' for _ in kolom)})")
            rows = [tuple(_scalar(v) for v in r) for r in df.itertuples(index=False, name=None)]
            c.executemany(sql, rows)
        c.commit()
    finally:
        c.close()


def meta_frame(params: dict, extra: dict[str, tuple[str, str]]) -> pd.DataFrame:
    """PARAMS `(nilai, label)` ditambah kunci hasil (gate, tanggal akhir, sensitivitas)."""
    rows = [(k, v[0], v[1]) for k, v in params.items()]
    rows += [(k, v[0], v[1]) for k, v in extra.items()]
    return pd.DataFrame(rows, columns=["kunci", "nilai", "label"])


def json_meta(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
