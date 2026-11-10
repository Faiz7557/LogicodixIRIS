import numpy as np
import pandas as pd
import pytest

from pipeline.backtest import (
    backtest_fold, blind_spot_groups, gate, pr_auc, roc_auc, top_k_capture)

EXT = [2015, 2019, 2023]
_KODE = [f"D{i:02d}" for i in range(12)]


def _make_dy(seed=0):
    rng = np.random.RandomState(seed)
    out = []
    for kode in _KODE:
        for tahun in range(2012, 2027):
            days = int(rng.poisson(3 if tahun in EXT else 1))
            out.append((kode, tahun, days * 2, days, int(days >= 2)))
    return pd.DataFrame(out, columns=["kode", "tahun", "n_det", "det_days", "terpapar"])


dy = _make_dy()
desa = pd.DataFrame({
    "kode": _KODE,
    "kec_kode": ["K1"] * 4 + ["K2"] * 4 + ["K3"] * 4,
    "peat_frac": np.linspace(0, 1, len(_KODE)),
    "luas_ha": np.linspace(100, 1200, len(_KODE)),
})


def with_changed_2025_rows(d):
    d = d.copy()
    m = d.tahun == 2025
    d.loc[m, "det_days"] = d.loc[m, "det_days"] + 7
    d.loc[m, "n_det"] = d.loc[m, "n_det"] + 14
    d.loc[m, "terpapar"] = 1 - d.loc[m, "terpapar"]
    return d


def groups(aman, tanpa, aktif, strata_lulus=4):
    """Baris `semua` dan `q1`-`q4`. (n_desa, n_terpapar_2026) per grup.

    Kuartil ke-`strata_lulus`+1 dan seterusnya dibuat gagal rasio: tampak aman
    tanpa satu pun desa terpapar, sementara tanpa riwayat ekstrem terpapar.
    """
    out = []
    def add(strata, a, t, k):
        for grup, (n, x) in (("tampak_aman", a), ("tanpa_riwayat_ekstrem", t), ("aktif", k)):
            out.append((grup, strata, n, x, x / n if n else 0.0))
    add("semua", aman, tanpa, aktif)
    for i in range(4):
        lulus = i < strata_lulus
        q = lambda p: (p[0] // 4, p[1] // 4)
        a = q(aman) if lulus else (aman[0] // 4, 0)
        t = q(tanpa) if lulus else (tanpa[0] // 4, max(1, tanpa[1] // 4))
        add(f"q{i + 1}", a, t, q(aktif))
    return pd.DataFrame(out, columns=["grup", "strata", "n_desa", "n_terpapar_2026", "rate"])


def test_top_k_capture():
    assert top_k_capture([.9,.8,.1,.1], [1,0,1,0], 50) == 0.5

def test_top_k_ties_do_not_use_label():
    assert top_k_capture([1,1,1,1], [0,0,1,1], 50) == 0.0

def test_roc_ties():
    assert roc_auc([.5,.5], [1,0]) == 0.5

def test_pr_auc_order():
    assert pr_auc([.9,.8,.1], [1,0,1]) == pytest.approx(5/6)

def test_pr_auc_all_tied_is_base_rate():
    assert pr_auc([.5,.5,.5,.5], [1,0,0,0]) == 0.25

def test_fold_ignores_future_features():
    a = backtest_fold(dy, desa, 2023, EXT, 3, 2, 0.5)
    b = backtest_fold(with_changed_2025_rows(dy), desa, 2023, EXT, 3, 2, 0.5)
    pd.testing.assert_frame_equal(a, b)

def test_fold_metrics_complete():
    r = backtest_fold(dy, desa, 2026, EXT, 3, 2, 0.5)
    assert set(r.metrik) == {"capture_10","capture_20","capture_30","roc_auc","pr_auc"}
    assert set(r.strategi) == {"paparan","persistensi","total_riwayat","gambut","acak"}

def test_gate_keep():
    assert gate(groups(aman=(100,40), tanpa=(1000,200), aktif=(100,50)), 1.5, 30, 0.6)["keputusan"] == "pertahankan"

def test_gate_soften_when_far_below_active():
    assert gate(groups(aman=(100,40), tanpa=(1000,200), aktif=(100,90)), 1.5, 30, 0.6)["keputusan"] == "lunakkan"

def test_gate_needs_enough_exposed():
    assert gate(groups(aman=(50,20), tanpa=(1000,100), aktif=(100,30)), 1.5, 30, 0.6)["keputusan"] == "buang"

def test_gate_needs_three_area_strata():
    assert gate(groups(aman=(100,40), tanpa=(1000,200), aktif=(100,50), strata_lulus=2), 1.5, 30, 0.6)["keputusan"] == "buang"

def test_gate_zero_baseline_does_not_divide():
    assert gate(groups(aman=(100,40), tanpa=(1000,0), aktif=(100,50)), 1.5, 30, 0.6)["a"] is True


# Tambahan di luar rencana 06: blind_spot_groups tidak punya tes di sana.
def test_blind_spot_groups_disjoint_and_stratified():
    frozen = pd.DataFrame({
        "kode": ["A", "B", "C", "D"],
        "k_ext": [2, 0, 1, 0],
        "tahun_tenang": [6, 14, 0, 1],
        "tampak_aman": [1, 0, 0, 0],
    })
    y2026 = pd.Series([1, 0, 1, 1], index=["A", "B", "C", "D"])
    luas = pd.Series([10, 20, 30, 40], index=["A", "B", "C", "D"])
    g = blind_spot_groups(frozen, y2026, luas).set_index(["grup", "strata"])
    assert g.loc[("tampak_aman", "semua"), "n_desa"] == 1
    assert g.loc[("tanpa_riwayat_ekstrem", "semua"), "n_desa"] == 1
    assert tuple(g.loc[("aktif", "semua"), ["n_desa", "n_terpapar_2026", "rate"]]) == (2, 2, 1.0)
    assert g.loc[("tampak_aman", "q1"), "n_desa"] == 1
    assert g.xs("semua", level="strata").n_desa.sum() == 4
    assert set(g.index.get_level_values("strata")) == {"semua", "q1", "q2", "q3", "q4"}
