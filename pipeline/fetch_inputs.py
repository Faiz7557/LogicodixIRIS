"""Unduh data mentah non-FIRMS: batas desa HDX COD-AB dan gambut WRI/GFW.

Jalankan dari akar repo: `uv run python pipeline/fetch_inputs.py`.
Keluaran: `data/raw/hdx/idn_admin4.*` dan `data/raw/peat/indonesia_peat_lands.geojson`.
"""

import json
import sys
import zipfile
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
HDX_DIR = ROOT / "data" / "raw" / "hdx"
PEAT_DIR = ROOT / "data" / "raw" / "peat"
HDX_ZIP = ("https://data.humdata.org/dataset/84a1d98a-790b-4d66-9d14-bbfa48500802/"
           "resource/50b9aafa-47c5-483e-a361-826320bf75d5/download/idn_admin_boundaries.shp.zip")
PEAT_LAYER = ("https://gis-gfw.wri.org/arcgis/rest/services/country_data/asia/MapServer/10/query")
PAGE = 1000


def _unduh(url: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    with urlopen(url, timeout=600) as r, open(tmp, "wb") as f:
        while chunk := r.read(1 << 20):
            f.write(chunk)
    tmp.replace(path)


def hdx() -> None:
    if (HDX_DIR / "idn_admin4.shp").exists():
        print("HDX ADM4 sudah ada")
        return
    zip_path = HDX_DIR / "idn_admin_boundaries.shp.zip"
    _unduh(HDX_ZIP, zip_path)
    with zipfile.ZipFile(zip_path) as z:
        for n in z.namelist():
            if n.startswith("idn_admin4"):
                z.extract(n, HDX_DIR)
    zip_path.unlink()
    print(f"HDX ADM4 siap di {HDX_DIR}")


def peat() -> None:
    out = PEAT_DIR / "indonesia_peat_lands.geojson"
    if out.exists():
        print("Gambut WRI/GFW sudah ada")
        return
    feats, offset = [], 0
    while True:
        url = (f"{PEAT_LAYER}?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326"
               f"&f=geojson&resultOffset={offset}&resultRecordCount={PAGE}")
        with urlopen(url, timeout=300) as r:
            data = json.load(r)
        batch = data.get("features", [])
        feats += batch
        print(f"gambut: {len(feats)} poligon")
        if not batch or not data.get("exceededTransferLimit"):
            break
        offset += PAGE
    if not feats:
        sys.exit("Layer gambut tidak mengembalikan fitur.")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"type": "FeatureCollection", "features": feats}))
    print(f"Gambut siap: {out}")


def main() -> None:
    hdx()
    peat()


if __name__ == "__main__":
    main()
