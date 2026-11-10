import pandas as pd
import pytest

from pipeline.paparan import exposure, kecamatan_exposure, shrink_desa, tier


def rows(kode, exposed, years=range(2012, 2026)):
    """Satu baris per tahun 2012-2025 (plus tahun di `exposed`), terpapar pada `exposed`."""
    ys = sorted(set(years) | set(exposed))
    hit = [y in exposed for y in ys]
    return pd.DataFrame({
        "kode": kode,
        "tahun": ys,
        "n_det": [4 if h else 0 for h in hit],
        "det_days": [2 if h else 0 for h in hit],
        "terpapar": [int(h) for h in hit],
    })


two_villages_a_2015_2019_b_2015 = pd.concat(
    [rows("A", [2015, 2019]), rows("B", [2015])], ignore_index=True)
desa_same_kec = pd.DataFrame({"kode": ["A", "B"], "kec_kode": ["K1", "K1"]})


EXT = [2015, 2019, 2023]
def test_blind_spot_case():
    r = exposure(rows("A", exposed=[2015, 2019]), EXT, 2025, 3).iloc[0]
    assert (r.k_ext, r.n_ext, r.tahun_tenang, r.tampak_aman, r.tier) == (2, 3, 6, 1, "tinggi")

def test_never_detected_is_not_blind_spot():
    r = exposure(rows("B", exposed=[]), EXT, 2025, 3).iloc[0]
    assert (r.k_ext, r.tahun_tenang, r.tampak_aman, r.tier) == (0, 14, 0, "rendah")

def test_recent_exposure_not_quiet():
    r = exposure(rows("C", exposed=[2015, 2025]), EXT, 2025, 3).iloc[0]
    assert (r.tahun_tenang, r.tampak_aman) == (0, 0)

def test_future_rows_rejected():
    with pytest.raises(ValueError, match="kebocoran"):
        exposure(rows("A", exposed=[2026]), EXT, 2025, 3)

def test_tier_boundaries():
    assert [tier(1, 2), tier(1, 3), tier(0, 3)] == ["tinggi", "sedang", "rendah"]

def test_shrink_desa():
    assert shrink_desa(2, 3, 0.4, 2) == pytest.approx(0.56)

def test_kecamatan_range():
    r = kecamatan_exposure(two_villages_a_2015_2019_b_2015, desa_same_kec, EXT).iloc[0]
    assert (r.k, r.n, r.p_mean, r.rate_min, r.rate_max) == (3, 6, 0.5, 0, 1)
