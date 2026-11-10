"""Ambil deteksi satelit VIIRS S-NPP lewat FIRMS area API (TRD bagian 4).

Jalankan dari akar repo: `py pipeline/fetch_firms.py`. Kunci dibaca dari env
`FIRMS_MAP_KEY` atau `.env` akar repo dan tidak pernah dicetak.
"""
import csv
import io
import os
import sys
import time
from datetime import date, timedelta
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "raw" / "firms"
BASE = "https://firms.modaps.eosdis.nasa.gov"
AREA = "108,-4.5,116.5,2.5"
MAX_DAYS = 5
NRT_END = date(2026, 11, 2)
PAUSE_S = 0.2


def date_windows(start: date, end: date, step: int = 5) -> list[tuple[date, int]]:
    """Jendela (tanggal awal, jumlah hari) yang menutup start sampai end inklusif."""
    out = []
    d = start
    while d <= end:
        n = min(step, (end - d).days + 1)
        out.append((d, n))
        d += timedelta(days=n)
    return out


def parse_availability(text: str, source: str) -> tuple[date, date]:
    for row in csv.DictReader(io.StringIO(text)):
        if row.get("data_id") == source:
            return date.fromisoformat(row["min_date"]), date.fromisoformat(row["max_date"])
    raise ValueError(f"respons FIRMS data_availability tidak memuat {source}")


def fetch_window(key: str, source: str, start: date, days: int, out_dir: Path, opener=urlopen) -> Path:
    if not 1 <= days <= MAX_DAYS:
        raise ValueError(f"DAY_RANGE harus 1 sampai {MAX_DAYS}, dapat {days}")
    out_dir = Path(out_dir)
    path = out_dir / f"{source}_{start.isoformat()}.csv"
    if path.exists():
        return path
    url = f"{BASE}/api/area/csv/{key}/{source}/{AREA}/{days}/{start.isoformat()}"
    with opener(url, timeout=120) as resp:
        body = resp.read()
    if not body.startswith(b"latitude"):
        # Potongan isi saja, tanpa URL, agar kunci tidak ikut tercetak.
        raise ValueError(f"respons FIRMS tidak sah untuk {source} {start}: {body[:100]!r}")
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".csv.tmp")
    tmp.write_bytes(body)
    tmp.replace(path)
    return path


def _load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def _availability(key: str, source: str, opener=urlopen) -> tuple[date, date]:
    with opener(f"{BASE}/api/data_availability/csv/{key}/{source}", timeout=60) as resp:
        return parse_availability(resp.read().decode("utf-8"), source)


def _fetch_range(key: str, source: str, start: date, end: date, out_dir: Path) -> int:
    n = 0
    for d, days in date_windows(start, end, MAX_DAYS):
        if (out_dir / f"{source}_{d.isoformat()}.csv").exists():
            continue
        fetch_window(key, source, d, days, out_dir)
        n += 1
        time.sleep(PAUSE_S)
    return n


def main() -> None:
    _load_dotenv(ROOT / ".env")
    key = os.environ.get("FIRMS_MAP_KEY", "").strip()
    if not key:
        sys.exit("FIRMS_MAP_KEY belum diisi di env atau .env akar repo.")

    sp_min, sp_max = _availability(key, "VIIRS_SNPP_SP")
    nrt_min, nrt_max = _availability(key, "VIIRS_SNPP_NRT")
    print(f"VIIRS_SNPP_SP {sp_min} sampai {sp_max}; VIIRS_SNPP_NRT {nrt_min} sampai {nrt_max}")

    n = _fetch_range(key, "VIIRS_SNPP_SP", sp_min, sp_max, OUT_DIR)
    print(f"VIIRS_SNPP_SP: {n} jendela baru")

    nrt_start = max(sp_max + timedelta(days=1), nrt_min)
    if nrt_start > sp_max + timedelta(days=1):
        print(f"CELAH: {sp_max + timedelta(days=1)} sampai {nrt_start - timedelta(days=1)} "
              "tidak ada di SP maupun NRT. Minta arsip surel FIRMS.")
    nrt_end = min(nrt_max, NRT_END)
    if nrt_end < NRT_END:
        print(f"PERINGATAN: NRT baru tersedia sampai {nrt_end}, target {NRT_END}.")
    n = _fetch_range(key, "VIIRS_SNPP_NRT", nrt_start, nrt_end, OUT_DIR)
    print(f"VIIRS_SNPP_NRT: {n} jendela baru, keluaran {OUT_DIR}")


if __name__ == "__main__":
    main()
