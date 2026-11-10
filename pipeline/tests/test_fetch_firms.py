import io
from datetime import date

import pytest

from pipeline.fetch_firms import date_windows, fetch_window, parse_availability


def fake(body: bytes):
    calls = []

    def opener(url, **kw):
        calls.append(url)
        return io.BytesIO(body)

    opener.calls = calls
    return opener


def must_not_call(*args, **kw):
    raise AssertionError("opener tidak boleh dipanggil")


def test_windows_cover_range():
    assert date_windows(date(2012,1,20), date(2012,1,31)) == [
        (date(2012,1,20),5), (date(2012,1,25),5), (date(2012,1,30),2)]


def test_parse_availability():
    t = "data_id,min_date,max_date\nVIIRS_SNPP_SP,2012-01-20,2026-06-30\n"
    assert parse_availability(t, "VIIRS_SNPP_SP") == (date(2012,1,20), date(2026,6,30))


def test_error_body_raises(tmp_path):
    with pytest.raises(ValueError, match="respons FIRMS"):
        fetch_window("k", "VIIRS_SNPP_SP", date(2012,1,20), 5, tmp_path, opener=fake(b"Invalid MAP_KEY"))


def test_existing_file_is_skipped(tmp_path):
    (tmp_path / "VIIRS_SNPP_SP_2012-01-20.csv").write_text("latitude\n")
    fetch_window("k", "VIIRS_SNPP_SP", date(2012,1,20), 5, tmp_path, opener=must_not_call)


def test_valid_body_written_without_tmp(tmp_path):
    op = fake(b"latitude,longitude\n0.1,110.2\n")
    p = fetch_window("k", "VIIRS_SNPP_SP", date(2012,1,20), 5, tmp_path, opener=op)
    assert p == tmp_path / "VIIRS_SNPP_SP_2012-01-20.csv"
    assert p.read_bytes().startswith(b"latitude")
    assert not list(tmp_path.glob("*.tmp"))
    assert op.calls == [
        "https://firms.modaps.eosdis.nasa.gov/api/area/csv/k/VIIRS_SNPP_SP/108,-4.5,116.5,2.5/5/2012-01-20"]
