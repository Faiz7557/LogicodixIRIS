"""Paparan desa dan rentang kecamatan (TRD bagian 5).

`dy` adalah tabel desa-tahun berkolom `kode, tahun, n_det, det_days, terpapar`,
satu baris per desa per tahun (lihat `firms.desa_year`).
"""

import pandas as pd


def tier(k_ext: int, n_ext: int) -> str:
    if k_ext == 0:
        return "rendah"
    return "tinggi" if n_ext and k_ext / n_ext >= 0.5 else "sedang"


def exposure(dy, ext_years, last_year, quiet_window) -> pd.DataFrame:
    """Ringkasan per desa sampai `last_year`. Baris sesudahnya ditolak."""
    if (dy["tahun"] > last_year).any():
        raise ValueError(f"kebocoran: dy memuat tahun di atas {last_year}")
    d = dy[["kode", "tahun"]].copy()
    t = dy["terpapar"].astype(int)
    e = dy["tahun"].isin(list(ext_years)).astype(int)
    d["k_ext"], d["n_ext"] = t * e, e
    d["k_norm"], d["n_norm"] = t * (1 - e), 1 - e
    # Tahun tenang: baris sesudah tahun terpapar terakhir. Tak pernah terpapar: semua baris.
    last_exp = dy.loc[t == 1].groupby("kode")["tahun"].max()
    d["tahun_tenang"] = (dy["tahun"] > dy["kode"].map(last_exp).fillna(float("-inf"))).astype(int)
    out = d.groupby("kode", as_index=False)[
        ["k_ext", "n_ext", "k_norm", "n_norm", "tahun_tenang"]].sum()
    out["tampak_aman"] = ((out.k_ext >= 1) & (out.tahun_tenang >= quiet_window)).astype(int)
    out["tier"] = [tier(k, n) for k, n in zip(out.k_ext, out.n_ext)]
    return out


def shrink_desa(k, n, p_kec, s):
    """Penyusutan ke rata-rata kecamatan dengan kekuatan tetap `s` (tidak diestimasi dari data).

    Hanya untuk mengurutkan. Bekerja juga pada Series/array.
    """
    return (k + s * p_kec) / (n + s)


def kecamatan_exposure(dy, desa, ext_years) -> pd.DataFrame:
    """p_mean = k/n atas desa-tahun di tahun ekstrem; rate_min/max = laju per tahun ekstrem."""
    d = dy[dy["tahun"].isin(list(ext_years))].merge(desa[["kode", "kec_kode"]], on="kode")
    d = d.assign(terpapar=d["terpapar"].astype(int))
    agg = d.groupby("kec_kode")["terpapar"].agg(k="sum", n="size")
    rate = d.groupby(["kec_kode", "tahun"])["terpapar"].mean().groupby("kec_kode").agg(
        rate_min="min", rate_max="max")
    out = desa.groupby("kec_kode")["kode"].nunique().rename("n_desa").to_frame()
    out = out.join(agg).join(rate).fillna(0)
    out[["k", "n"]] = out[["k", "n"]].astype(int)
    out["p_mean"] = (out.k / out.n.where(out.n > 0)).fillna(0.0)
    return out.reset_index()[["kec_kode", "n_desa", "k", "n", "p_mean", "rate_min", "rate_max"]]
