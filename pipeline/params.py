"""Parameter yang dicatat di tabel meta (TRD bagian 5). Nilai berupa string."""

PARAMS: dict[str, tuple[str, str]] = {
    "buffer_km": ("2", "parameter"),
    "min_det_days": ("2", "parameter"),
    "quiet_window": ("3", "parameter"),
    "s_desa": ("2", "parameter"),
    "freeze_date": ("2025-12-31", "parameter"),
    "gate_min_lift": ("1.5", "parameter"),
    "gate_min_exposed": ("30", "parameter"),
    "gate_min_ratio_aktif": ("0.6", "parameter"),
    "kec_min_share": ("0.5", "parameter"),
    "panjang_per_buah_m": ("30", "asumsi_tim"),
    "ext_years": ("2015,2019,2023,2026", "parameter"),
}
