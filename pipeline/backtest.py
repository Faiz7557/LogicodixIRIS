"""Time Machine, kelompok titik buta, dan gerbang (TRD bagian 5).

Metrik ditulis sendiri dengan numpy/pandas. Kasus tak terdefinisi (tanpa
positif, atau tanpa negatif untuk ROC) menghasilkan NaN.
"""

import numpy as np
import pandas as pd

try:  # `py -m pytest` / `py -m pipeline.x` dari akar repo
    from pipeline.paparan import exposure, kecamatan_exposure, shrink_desa
    from pipeline.params import PARAMS
except ImportError:  # `python pipeline/run_all.py`
    from paparan import exposure, kecamatan_exposure, shrink_desa
    from params import PARAMS

STRATEGI = ["paparan", "persistensi", "total_riwayat", "gambut", "acak"]
K_PCTS = [10, 20, 30]
GRUP = ["tampak_aman", "aktif", "tanpa_riwayat_ekstrem"]
STRATA = ["semua", "q1", "q2", "q3", "q4"]


def top_k_capture(score, y, k_pct: float) -> float:
    """Bagian positif yang tertangkap di k% unit teratas.

    Seri dipecah oleh urutan masukan (sort stabil), tidak pernah oleh label.
    """
    s, y = np.asarray(score, float), np.asarray(y, int)
    if y.sum() == 0:
        return float("nan")
    n = max(1, int(np.ceil(len(s) * k_pct / 100 - 1e-9)))
    top = np.argsort(-s, kind="stable")[:n]
    return float(y[top].sum() / y.sum())


def roc_auc(score, y) -> float:
    """Mann-Whitney dengan rank rata-rata (seri bernilai setengah)."""
    s, y = pd.Series(score, dtype=float), np.asarray(y, int)
    n_pos, n_neg = int(y.sum()), int(len(y) - y.sum())
    if n_pos == 0 or n_neg == 0:
        return float("nan")
    r = s.rank(method="average").to_numpy()
    return float((r[y == 1].sum() - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg))


def pr_auc(score, y) -> float:
    """Σ (R_n - R_{n-1}) * P_n atas ambang skor unik, dari tertinggi."""
    y = np.asarray(y, int)
    if y.sum() == 0:
        return float("nan")
    g = pd.DataFrame({"s": np.asarray(score, float), "y": y}).groupby("s")["y"].agg(
        ["sum", "size"]).sort_index(ascending=False)
    tp = g["sum"].cumsum()
    precision = tp / g["size"].cumsum()
    recall = tp / y.sum()
    return float(((recall - recall.shift(fill_value=0.0)) * precision).sum())


def _metrics(score, y):
    out = {f"capture_{k}": top_k_capture(score, y, k) for k in K_PCTS}
    out["roc_auc"] = roc_auc(score, y)
    out["pr_auc"] = pr_auc(score, y)
    return out


def _acak(y):
    out = {f"capture_{k}": k / 100 for k in K_PCTS}
    out["roc_auc"] = 0.5
    out["pr_auc"] = float(np.mean(y)) if len(y) else float("nan")
    return out


def backtest_fold(dy, desa, tahun_uji, ext_years, quiet_window, s_desa, kec_min_share) -> pd.DataFrame:
    """Satu fold: fitur hanya dari `tahun < tahun_uji`, label = terpapar pada `tahun_uji`."""
    train = dy[dy["tahun"] < tahun_uji]
    ext = [t for t in ext_years if t < tahun_uji]
    exp = exposure(train, ext, tahun_uji - 1, quiet_window).set_index("kode")
    p_kec = kecamatan_exposure(train, desa, ext).set_index("kec_kode")["p_mean"]

    d = desa.set_index("kode")[["kec_kode", "peat_frac"]].copy()
    d = d.join(exp[["k_ext", "n_ext"]]).fillna({"k_ext": 0, "n_ext": 0})
    d["paparan"] = shrink_desa(d.k_ext, d.n_ext, d.kec_kode.map(p_kec).fillna(0.0), s_desa)
    d["persistensi"] = train[train.tahun == tahun_uji - 1].set_index("kode")["det_days"]
    d["total_riwayat"] = train.groupby("kode")["det_days"].sum()
    d["gambut"] = d["peat_frac"]
    d["y"] = dy[dy.tahun == tahun_uji].set_index("kode")["terpapar"].astype(int)
    d = d.fillna({"persistensi": 0, "total_riwayat": 0, "y": 0})

    kec = d.groupby("kec_kode")[STRATEGI[:-1] + ["y"]].mean()
    kec["y"] = (kec["y"] >= kec_min_share).astype(int)

    rows = []
    for unit, u in (("desa", d), ("kecamatan", kec)):
        for strategi in STRATEGI:
            m = _acak(u.y) if strategi == "acak" else _metrics(u[strategi], u.y)
            rows += [(tahun_uji, unit, strategi, metrik, nilai) for metrik, nilai in m.items()]
    return pd.DataFrame(rows, columns=["tahun_uji", "unit", "strategi", "metrik", "nilai"])


def _as_series(x, col):
    return x.set_index("kode")[col] if isinstance(x, pd.DataFrame) else pd.Series(x)


def blind_spot_groups(frozen, y2026, luas, quiet_window: int = int(PARAMS["quiet_window"][0])) -> pd.DataFrame:
    """Grup saling lepas per strata luas.

    `frozen`: keluaran `exposure` mode beku. `y2026` dan `luas`: Series ber-index
    kode, atau DataFrame berkolom `kode, terpapar` / `kode, luas_ha`.
    """
    f = frozen.set_index("kode")
    y = _as_series(y2026, "terpapar").reindex(f.index).fillna(0).astype(int)
    tenang = f.tahun_tenang >= quiet_window
    grup = np.where(~tenang, "aktif", np.where(f.k_ext >= 1, "tampak_aman", "tanpa_riwayat_ekstrem"))
    lu = _as_series(luas, "luas_ha").reindex(f.index)
    # rank 'first' agar tepi kuartil tidak kembar saat banyak luas sama.
    q = pd.qcut(lu.rank(method="first"), 4, labels=STRATA[1:])
    base = pd.DataFrame({"grup": grup, "q": q.astype(str), "y": y}, index=f.index)

    rows = []
    for strata in STRATA:
        b = base if strata == "semua" else base[base.q == strata]
        for g in GRUP:
            yy = b.y[b.grup == g]
            n, k = len(yy), int(yy.sum())
            rows.append((g, strata, n, k, k / n if n else 0.0))
    return pd.DataFrame(rows, columns=["grup", "strata", "n_desa", "n_terpapar_2026", "rate"])


def gate(groups, min_lift, min_exposed, min_ratio_aktif) -> dict:
    """Uji A dan B. Membandingkan `rate >= faktor * rate_pembanding`, tanpa pembagian."""
    r = groups.set_index(["grup", "strata"])

    def lift_ok(strata):
        return r.at[("tampak_aman", strata), "rate"] >= min_lift * r.at[("tanpa_riwayat_ekstrem", strata), "rate"]

    a = bool(
        lift_ok("semua")
        and r.at[("tampak_aman", "semua"), "n_terpapar_2026"] >= min_exposed
        and sum(lift_ok(q) for q in STRATA[1:]) >= 3
    )
    b = bool(r.at[("tampak_aman", "semua"), "rate"] >= min_ratio_aktif * r.at[("aktif", "semua"), "rate"])
    keputusan = "buang" if not a else ("pertahankan" if b else "lunakkan")
    return {"a": a, "b": b, "keputusan": keputusan}
