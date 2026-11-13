"""Tambahkan tabel `desa_bulan` ke DB yang sudah ada tanpa membangun ulang seluruh DB.

`run_all.py` menghapus dan membuat ulang DB, sehingga akun, inventaris, dan usulan ikut hilang.
Skrip ini hanya menghitung ulang sebaran per bulan dari data FIRMS mentah yang sama, memeriksa
bahwa jumlah per tahun persis sama dengan `desa_tahun` di DB, lalu mengganti isi `desa_bulan`.

    .venv/Scripts/python.exe pipeline/tambah_desa_bulan.py [--db data/siapkemarau.db]
"""
import argparse
import sqlite3
import sys
from pathlib import Path

try:
    from pipeline.firms import assign_to_desa, desa_month, load_detections
    from pipeline.params import PARAMS
    from pipeline.wilayah import load_desa
except ImportError:
    from firms import assign_to_desa, desa_month, load_detections
    from params import PARAMS
    from wilayah import load_desa

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
SCHEMA_SQL = ROOT / "db" / "schema.sql"
YEARS = list(range(2012, 2027))
PROV = ["61", "62"]


def _ddl_desa_bulan() -> str:
    s = SCHEMA_SQL.read_text(encoding="utf-8")
    awal = s.index("CREATE TABLE desa_bulan")
    return s[awal:s.index(");", awal) + 2]


def _hdx() -> tuple[str, str | None]:
    shp = sorted((RAW / "hdx").rglob("*admin4*.shp"))
    if shp:
        return str(shp[0]), None
    gdb = sorted((RAW / "hdx").glob("*.gdb.zip"))
    if gdb:
        return str(gdb[0]), "idn_admin4"
    sys.exit("data/raw/hdx tidak memuat batas desa HDX (admin4 .shp atau .gdb.zip).")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=str(ROOT / "data" / "siapkemarau.db"))
    db = Path(ap.parse_args().db)
    if not db.exists():
        sys.exit(f"{db} tidak ada.")

    paths = sorted(str(p) for p in (RAW / "firms").glob("*.csv"))
    if not paths:
        sys.exit("data/raw/firms kosong.")
    det = load_detections(paths)
    print(f"Berkas FIRMS: {len(paths)}, deteksi sesudah filter: {len(det)}")

    path, layer = _hdx()
    desa = load_desa(path, PROV, layer=layer)
    c = sqlite3.connect(db)
    try:
        kode_db = {r[0] for r in c.execute("SELECT kode FROM desa")}
        desa = desa[desa.kode.isin(kode_db)].reset_index(drop=True)
        if set(desa.kode) != kode_db:
            sys.exit(f"Batas HDX tidak memuat {len(kode_db - set(desa.kode))} desa yang ada di DB.")

        a = assign_to_desa(det, desa, float(PARAMS["buffer_km"][0]))
        m = desa_month(a, YEARS)

        # Pemeriksaan: jumlah 12 bulan harus sama persis dengan desa_tahun di DB.
        per_tahun = m.groupby(["kode", "tahun"])[["n_det", "det_days"]].sum()
        tahun_db = {(k, t): (n, d) for k, t, n, d in c.execute(
            "SELECT kode, tahun, n_det, det_days FROM desa_tahun WHERE n_det > 0")}
        hitung = {k: tuple(int(x) for x in v) for k, v in zip(per_tahun.index, per_tahun.values)}
        beda = {k for k in tahun_db.keys() | hitung.keys() if tahun_db.get(k) != hitung.get(k)}
        if beda:
            contoh = sorted(beda)[:5]
            sys.exit(f"{len(beda)} desa-tahun tidak cocok dengan desa_tahun, contoh: "
                     + ", ".join(f"{k}: DB {tahun_db.get(k)} vs hitung {hitung.get(k)}" for k in contoh))
        print(f"Cocok dengan desa_tahun: {len(tahun_db)} desa-tahun berdeteksi.")

        with c:
            c.execute("DROP TABLE IF EXISTS desa_bulan")
            c.execute(_ddl_desa_bulan())
            c.executemany(
                "INSERT INTO desa_bulan (kode, tahun, bulan, n_det, det_days) VALUES (?,?,?,?,?)",
                [(str(k), int(t), int(b), int(n), int(d)) for k, t, b, n, d in m.itertuples(index=False)])
        print(f"desa_bulan: {len(m)} baris ditulis ke {db}")
    finally:
        c.close()


if __name__ == "__main__":
    main()
