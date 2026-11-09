# Karhutla data and model feasibility (free public data, 5-day student build)

Checked 9 Nov 2026. Status tags: **[LIVE]** = I hit the endpoint from this machine and saw real data today. **[LIVE-page]** = host/page answers, no data pulled. **[DOCS]** = read on the provider's page, not exercised. **[SNIPPET]** = search-result text only, full source not opened (many publishers returned 403). No API key or account was used, so anything needing one is untested.

## Q1. Data access: what is actually usable?

### Takeaway
A complete pipeline is buildable from free data: FIRMS, ERA5-Land, CHIRPS, ONI, WRI peat, HDX desa boundaries. Three things differ from what the brief assumes: VIIRS S-NPP appears to have stopped on 2 Nov 2026, SiPongi moved domains and has no documented API, and SIPALAGA/TMAT is not practically accessible.

### Cited Findings

**Core layers**

| Source | Access and format | Resolution | History / latency | Auth, limits, license | Status |
|---|---|---|---|---|---|
| FIRMS API | `/api/area/csv/[MAP_KEY]/[SOURCE]/[AREA]/[DAY_RANGE]/[DATE]`, DAY_RANGE 1-5 — [FIRMS API](https://firms.modaps.eosdis.nasa.gov/api/area/) | VIIRS 375 m; MODIS 1 km — [FIRMS download](https://firms.modaps.eosdis.nasa.gov/download/), [Horton 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC9286596/) | See archive row. RT within 60 min of overpass — [FIRMS API](https://firms.modaps.eosdis.nasa.gov/api/area/) | Free MAP_KEY; 5000 transactions/10 min; larger requests can count as several — [FIRMS API](https://firms.modaps.eosdis.nasa.gov/api/area/). License not captured | Key gate **[LIVE]**: bad key returns HTTP 400/401 "Invalid MAP_KEY". Valid-key pull untested |
| FIRMS keyless CSV | [MODIS](https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_SouthEast_Asia_24h.csv), [NOAA-20](https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-20-viirs-c2/csv/J1_VIIRS_C2_SouthEast_Asia_24h.csv), [NOAA-21](https://firms.modaps.eosdis.nasa.gov/data/active_fire/noaa-21-viirs-c2/csv/J2_VIIRS_C2_SouthEast_Asia_24h.csv), also `_7d` | Point detections | 24 h and 7 d rolling | No key needed | **[LIVE]** rows dated 8-9 Nov 2026 |
| FIRMS archive | Web request, emailed link; shp, csv, json — [FIRMS download](https://firms.modaps.eosdis.nasa.gov/download/) | As above | MODIS C6.1 from 1 Nov 2000; S-NPP 20 Jan 2012 to 2 Nov 2026; NOAA-20 from 1 Apr 2018; NOAA-21 from 1 Mar 2023 — [FIRMS download](https://firms.modaps.eosdis.nasa.gov/download/) | Earthdata or email login | **[DOCS]** Queue time unknown, submit on day 1 |
| ERA5-Land | CDS API, GRIB — [CDS](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land) | 0.1° (native 9 km), hourly — [CDS](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land) | From Jan 1950; daily with 5-day delay — [Open-Meteo docs](https://open-meteo.com/en/docs/historical-weather-api) | Account, token, per-dataset terms — [CDS API](https://cds.climate.copernicus.eu/how-to-api). CC-BY — [CDS](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land). Queue limits not stated | [Catalogue](https://cds.climate.copernicus.eu/api/catalogue/v1/collections/reanalysis-era5-land) **[LIVE-page]**; data pull untested |
| ERA5 | Same route | 0.25° (~25 km) — [Open-Meteo docs](https://open-meteo.com/en/docs/historical-weather-api) | From 1940; 5-day delay — [Open-Meteo docs](https://open-meteo.com/en/docs/historical-weather-api) | As ERA5-Land | **[DOCS]** |
| CHIRPS | [Directory](https://data.chc.ucsb.edu/products/CHIRPS/), v2.0 and v3.0 (v3 daily/final exists) | 0.05° — [AGU abstract](https://ui.adsabs.harvard.edu/abs/2020AGUFMH217...07F) | From 1981; v3 final ~2 weeks, preliminary every 5 days — [AGU abstract](https://ui.adsabs.harvard.edu/abs/2020AGUFMH217...07F) | No account seen; public-domain waiver — [Earth Engine](https://developers.google.com/earth-engine/datasets/catalog/UCSB-CHC_CHIRPS_V3_DAILY_RNL?hl=zh-cn) | **[LIVE-page]**. Old path `/products/CHIRPS-2.0/` now 404, so older scripts break |
| Open-Meteo | [Forecast](https://open-meteo.com/en/docs) and [Archive](https://open-meteo.com/en/docs/historical-weather-api), JSON | ERA5 25 km, ERA5-Land 11 km, IFS 9 km — [docs](https://open-meteo.com/en/docs/historical-weather-api) | ERA5-Land from 1950, IFS from 2017 — [docs](https://open-meteo.com/en/docs/historical-weather-api) | No key; 600/min, 5,000/h, 10,000/day, 300,000/month; non-commercial; CC-BY 4.0 — [terms](https://open-meteo.com/en/terms). >10 variables or >2 weeks count as multiple calls — [pricing](https://open-meteo.com/en/pricing) | **[LIVE]** forecast and 2015 archive at Palangka Raya with soil moisture (0-7 and 28-100 cm) |
| BMKG | [API docs](https://data.bmkg.go.id/prakiraan-cuaca/); `api.bmkg.go.id/publik/prakiraan-cuaca?adm4=` JSON | Desa/kelurahan (adm4) — [BMKG](https://data.bmkg.go.id/prakiraan-cuaca/) | 3-day, 3-hourly, updated twice daily; no history offered — [BMKG](https://data.bmkg.go.id/prakiraan-cuaca/) | 60 req/min/IP; BMKG credit mandatory — [BMKG](https://data.bmkg.go.id/prakiraan-cuaca/) | **[LIVE]** real JSON for Pahandut. Returned 403 with a short `Mozilla/5.0` user agent and 200 with a full browser UA |
| ONI | [CPC text](https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt), [PSL](https://psl.noaa.gov/data/correlation/oni.data) | Basin index, 3-month running | From 1950; latest row ASO 2026 = **+2.46** | Open | **[LIVE]** |
| DMI (IOD) | [PSL HadISST DMI](https://psl.noaa.gov/gcos_wgsp/Timeseries/Data/dmi.had.long.data) | Basin index, monthly | From 1870; file footer created 25 Jul 2026, so it can lag | Open | **[LIVE]** |
| BoM IOD | [BoM indices page](https://www.bom.gov.au/climate/enso/indices.shtml) | Index | Not confirmed | Not confirmed | **[LIVE-page]**; machine-readable file not located (one guessed path 404) |
| SMAP L3 enhanced | [NSIDC SPL3SMP_E v6](https://nsidc.org/data/spl3smp_e/versions/6), HDF5, earthaccess or HTTPS | 9 km, daily — [NSIDC](https://nsidc.org/data/spl3smp_e/versions/6) | From 31 Mar 2015 — [NSIDC](https://nsidc.org/data/spl3smp_e/versions/6); latency not stated | Free Earthdata login — [NSIDC](https://nsidc.org/data/spl3smp_e/versions/6) | **[DOCS]**; old direct host `n5eil01u.ecs.nsidc.org` failed to connect from here |

**S-NPP finding [LIVE].** The S-NPP 24 h CSV for SE Asia is header-only, and its 7 d file holds 1,013 rows all dated 2026-11-02. The archive page also ends S-NPP on 2 Nov 2026 — [FIRMS download](https://firms.modaps.eosdis.nasa.gov/download/). NOAA-20's 7 d file has 23,461 rows spanning 2-9 Nov (15,644 inside a 95-141E, 11S-6N box) and NOAA-21's 24 h file has 4,382 rows.

**Indonesian and thematic layers**

- **SiPongi: moved, UI-only [LIVE-page].** `sipongi.menlhk.go.id` and `sipongi.kehutanan.go.id` return NXDOMAIN on Google DNS. The current host is [sipongi.gakkum.kehutanan.go.id](https://sipongi.gakkum.kehutanan.go.id/) (URL from [afu.id, 15 Oct 2026](https://afu.id/nasional/ini-link-dan-cara-memantau-titik-panas-karhutla-dari-sipongi-hingga-google-maps)); it returns 200 and links `/indikasi-luas-kebakaran`. The old-style `/api/opsroom/indoHotspot` path 404s on the new host.
- SiPongi download: hotspot export as XLSX, TXT or KMZ after choosing date, province and satellite — [afu.id](https://afu.id/nasional/ini-link-dan-cara-memantau-titik-panas-karhutla-dari-sipongi-hingga-google-maps). The official guide lists a province/kabupaten burned-area download **[SNIPPET]** — [panduan](https://sipongi.menlhk.go.id/assets/file/panduan-sipongi.pdf), hosted on the now-dead domain. I did not exercise a download, and no API docs or license were found.
- SiPongi burned area is an estimate from Landsat 8 overlaid with hotspots plus field and Manggala Agni reports **[SNIPPET]** — [GoodStats](https://goodstats.id/article/provinsi-dengan-luas-kebakaran-hutan-terbesar-2024-jliXO).
- **Peat, best option:** WRI Global Peatlands, ~30 m, uses Miettinen 2016 for Indonesia and Malaysia, CC-BY-4.0, with shapefile, GeoJSON and CSV links — [Open Net Zero listing](https://opennetzero.org/world-resources-institute/global-peatlands), [GFW page](https://data.globalforestwatch.org/maps/gfw::global-peatlands). **[DOCS]**
- **Peat, official:** Ritung 2011 is 1:250,000, ~14.9 Mha on three islands; Kementan issued a 1:50,000 map in Dec 2019. I found no official public download for either **[SNIPPET]** — [CIFOR](https://www2.cifor.org/ipn-toolbox/wp-content/uploads/pdf/A1.pdf).
- **Land cover:** MapBiomas Indonesia (Auriga) has Collection 2.0 for 2000-2022 and FIRE 1.0 for 2013-2023 — [MapBiomas Indonesia](https://indonesia.mapbiomas.org/en/about). License not confirmed. [ESA WorldCover](https://esa-worldcover.org/en/data-access) page answers **[LIVE-page]**.
- **OSM:** [Geofabrik Indonesia](https://download.geofabrik.de/asia/indonesia.html) extracts **[LIVE-page]**. OSM roads and settlements are undated, so treat them as static with caution — [Horton 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC9286596/).
- **Desa boundaries, best option:** [HDX COD-AB Indonesia](https://data.humdata.org/dataset/cod-ab-idn), sourced from BPS, CC BY-IGO, modified 23 Jun 2026, GeoJSON zip 456 MB, SHP zip 498 MB, GDB zip 219 MB **[LIVE metadata]** via [CKAN API](https://data.humdata.org/api/3/action/package_show?id=cod-ab-idn). Its caveat: some level 3/4 names contain slashes marking alternates.
- **GADM level 4:** the 8.1 MB zip exists **[LIVE]** — [file](https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_IDN_4.json.zip). But "Redistribution or commercial use is not allowed without prior permission" — [GADM license](https://gadm.org/license.html).
- **geoBoundaries:** IDN ADM2 available, CC BY 3.0 IGO, built Dec 2023 — [API](https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM2/). ADM3 and ADM4 endpoints return 404 **[LIVE]**.
- **BIG:** not checked. [BPS SIG](https://sig.bps.go.id/) answers **[LIVE-page]**.
- **Concessions:** GFW oil palm layer is available, but GFW warns quality varies and some concessions may be missing or misplaced **[SNIPPET]** — [WRI catalogue](https://datasets-dev.wri.org/datasets/oil-palm-concessions-lm-v3-gfw). [Nusantara Atlas](https://nusantara-atlas.org/) is **[LIVE-page]** and offers concession checks in its map — [About](https://nusantara-atlas.org/about/). No bulk download or license found for Nusantara Atlas or Auriga.
- **SIPALAGA/TMAT, not open in practice:** `sipalaga.brg.go.id` returned a Cloudflare 403 challenge and `sipalaga.brgm.go.id` returned 502 **[LIVE]**. A 2019 report said data could be downloaded as PDF — [Mongabay](https://mongabay.co.id/2019/01/28/brg-kembangkan-sistem-pemantauan-muka-air-gambut/). Studies appear to get bulk station data from BRGM directly **[SNIPPET]** — [JPSL Jambi study](https://journal.ipb.ac.id/jpsl/article/view/42696). No API found.

### Inferences
- Treat S-NPP as history only and build live detection on NOAA-20 and NOAA-21. Mixing sensors creates a detection-count break, so normalise per overpass or use a binary "any detection" label. I do not know why S-NPP stopped or whether it will resume.
- Open-Meteo cannot supply a historical grid. Ten years with ≤10 variables is about 261 calls per location (3,650/14, assuming linear weighting), so 10,000/day covers about 38 locations a day and 425 cells need about 11 days. Use ERA5-Land for training and Open-Meteo for the live forecast only.
- Non-commercial Open-Meteo terms fit a student competition but would need re-checking if the project is commercialised.
- GADM's no-redistribution clause is a risk for a public web app. HDX has a clear license and is the safer choice.
- A BMKG sweep at 60 req/min is only practical for selected desa. It has no history, so it can serve the demo and briefing but not training.

### Gaps
- FIRMS data license and archive turnaround were not verified. FIRMS API history behaviour needs a real key.
- No bulk or licensed route confirmed for Ritung, Kementan 1:50k, Nusantara Atlas, Auriga concessions or MapBiomas Indonesia.
- OSM license (ODbL by prior knowledge) and canal completeness in peat areas were not checked.
- CDS queue times, SMAP latency and BoM's machine-readable IOD file are unconfirmed.

## Q2. State of the art: predictive skill and important features

### Takeaway
Honest skill for near-term hotspot occurrence is about ROC-AUC 0.80-0.83 against persistence at 0.71, and seasonal skill is real but strongly regional. Very high published AUCs generally come from random splits and should not be used as benchmarks.

### Cited Findings

| Study | Region, unit, target | Validation | Reported skill |
|---|---|---|---|
| [Jagawana AI](https://github.com/EunwooSec/jagawana-ai) (GitHub, not peer-reviewed) | Sumatra and Kalimantan; 0.5° cell-day, 425 fire-prone cells; hotspot within 7 days; 2019-2025 | Train 2019-22, validate 2023, test 2024-25, 7-day gaps; cross-island test | XGBoost PR-AUC 0.681, ROC-AUC 0.830, F1 0.627. Random Forest 0.673/0.825/0.624. Logistic 0.627/0.804/0.602. Persistence 0.523/0.712/0.561. Base rate 28.1%. Top 5% of cell-days: 88% hit |
| [ProbFire, Nikonovas 2022](https://nhess.copernicus.org/articles/22/303/2022/) | Indonesia; 0.25° monthly; MODIS count >10 (~5% of data); 18-input MLP with ERA5/SEAS5 | Leave-one-year-out 2002-2019 vs ERA5 climatology model | South Papua beats climatology to 4 months. South Kalimantan and south Sumatra: abstract says 2-4 months, results say up to 2. Central Sumatra only 0 lead. West Kalimantan none. Relative value >60% of perfect in south Kalimantan, Papua, Sumatra. AUC values only in Figure 7 |
| [Yang et al. 2021](https://arxiv.org/abs/2101.01975) (AAAI) | Indonesian tropical peat | Abstract only | AUC above 0.81; baseline never exceeds 0.70 |
| [Horton 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC9286596/) | Ex-Mega Rice area, Central Kalimantan; 250 m pixel fire/no-fire; 2002-2019; XGBoost | Yearly scoring and leave-one-year-out | Accuracy >75%, precision >67.5%, recall >25%. Mean precision 71%, 68% in leave-one-year-out. No AUC |
| [Dadap 2019](https://iopscience.iop.org/article/10.1088/1748-9326/ab3891) | SE Asian peat pixels; 0.25°, 10-day; GFED4.1s, Jun-Oct 2015-16 | Correlation | Spearman ρ in dry soils −0.97 at 0-20 d, −0.92 at 30 d. Threshold ~0.23 cm³/cm³. No AUC |
| [Shawki 2017](https://spiral.imperial.ac.uk/entities/publication/2aab1bbb-747e-4ae9-a223-d882ec4b53c2) **[SNIPPET]** | CFSv2 Drought Code, 2015 vs 2016 case | Two-season case | High DC forecast 180 days ahead in S Kalimantan and S New Guinea, up to 60 days in S Sumatra |
| [Bengkalis RF](https://pmc.ncbi.nlm.nih.gov/articles/PMC11741053/) | Bengkalis; MODIS burned area 2019 | Random stratified 80/20; no CV | RF AUC 0.972, accuracy 95.07%; logistic 0.831. Single year, random split: not a benchmark |
| [Riau RF](https://www.researchgate.net/publication/389806866_Application_of_Random_Forest_Algorithm_to_Analyze_the_Confidence_Level_of_Forest_Fire_Hotspots_in_Riau_Peatland) **[SNIPPET]** | Riau peat hotspot confidence | Not visible | RF AUC 0.845, XGBoost 0.828 |

**Deep learning**
- LSTM on Indonesian MODIS hotspots 2010-2022, forecast 2023 with ~7% average error — [Environments 2023](https://www.mdpi.com/2076-3298/10/7/124). **[SNIPPET]**
- LSTM Kalimantan hotspot count, test RMSE 522.12, EVS 0.834 — [Geographia Technica 2026](https://mail.technicalgeography.org/index.php/on-line-first/569-03_nurdiati). **[SNIPPET]**
- I found no ConvLSTM paper for Indonesian fire. The one ConvLSTM result was rainfall in South Sumatra — [Radenfatah](https://jurnal.radenfatah.ac.id/index.php/jifp/article/view/31112).

**Fire danger indices (FDRS)**
- Severe haze likely above Drought Code 388.2, calibrated on 1994-1998 data; four drought levels proposed as an early-warning tool — [Field 2004](https://adinet.ahacentre.org/repository/detail/a_drought_based_predictor_of_recent_haze_events_in_western_indonesia_20040401). **[SNIPPET]**
- 78% of hotspots occurred when FFMC >81, which covered only 20% of days. Same slides note validation is lacking, and method is not stated — [LAPAN 2011](https://gofcgold.umd.edu/sites/default/files/fireit_meetings/Wildfire_RN_SA_2011/South%20Africa_RN/Indonesia%20(Orbita%20Roswintiarti,%20LAPAN).pdf).
- Satellite-derived DC vs station DC r = 0.88, FFMC r = 0.68. This is index agreement, not fire skill — [Vetrita et al.](https://ejournal.brin.go.id/ijreses/article/view/13954).
- Fire sensitivity to drought in Kalimantan emerged around the 1980s with land-use change — [Field 2009](https://www.nature.com/articles/ngeo459). **[SNIPPET]**
- In non-drought years, warm anomalies steeply raise fire probability, so active seasons are not limited to drought years — [Fernandes 2017](https://academiccommons.columbia.edu/doi/10.7916/D8CC1620). **[SNIPPET]**

**Important features**
- Recent fire history first, then dry-streak length, neighbouring hotspots, season (SHAP) — [Jagawana](https://github.com/EunwooSec/jagawana-ai).
- Distance to settlements first and distance to canals close behind (XGBoost gain); peat depth weak — [Horton 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC9286596/).
- Soil moisture adds information beyond precipitation in the most-burned quartile, but not shown to beat it alone — [Dadap 2019](https://iopscience.iop.org/article/10.1088/1748-9326/ab3891).
- SMAP MT-DCA error in peat, ubRMSE 0.075 cm³/cm³ vs mission target 0.04 — [Dadap 2019](https://iopscience.iop.org/article/10.1088/1748-9326/ab3891).

### Inferences
- Target: beat persistence (ROC-AUC 0.71, PR-AUC 0.52 in Jagawana's setting). Metrics are not portable across base rates, so report PR-AUC against your own base rate.
- Persistence is strong because fire history dominates. A model that merely rediscovers active fires will look good but add little, so also score "new fire" cells (no detection in the last 30 days).
- ENSO is currently extreme (ONI +2.46), which makes 2026 a real stress test. Models trained on prior years may be out-of-regime.
- Seasonal outlook should be regional: credible for southern Kalimantan, south Sumatra and south Papua, not for west Kalimantan.

### Gaps
- Field 2016 (PNAS) was blocked (403), so its nonlinear rainfall threshold is not quoted here.
- Groot 2007 (FDRS design) was not read. I found no rigorous published FDRS skill score specifically on peat.
- Yang et al. details beyond the abstract could not be extracted. The study the brief calls "Sentinel-based models" produced no usable skill figure in my searches.
- A 2021 Peat Fire Vulnerability Index reportedly finds high danger below 40 cm groundwater and burns only below 60 cm, but I could only see this in a snippet and could not confirm its source URL.

## Q3. Known problems: hotspot error, imbalance, leakage, validation

### Takeaway
A hotspot is a noisy, biased proxy for fire, with omission especially bad under smoke and for peat burning. Any honest claim must therefore be "predicts satellite detections", validated out-of-time and with spatial separation.

### Cited Findings
- Kemenhut itself states hotspots are not fire-event counts or burned area, and need field verification **[SNIPPET]** — [Suara Pemerintah, Oct 2026](https://suarapemerintah.id/2026/10/hotspot-high-confidence-meningkat-kemenhut-perkuat-respons-lapangan-dan-perlindungan-satwa-liar/).
- VIIRS 375 m on Indonesian peat vs Landsat-8: omission ~15%; daytime commission ~35% single-pixel buffer, 16% cluster buffer, about 3-4% after removing gas flares and similar **[SNIPPET]** — [Int. J. Digital Earth 2020](https://www.tandfonline.com/doi/full/10.1080/17538947.2020.1791268).
- VIIRS accuracy peaked ~1.5 km from fire centre at 52-53%, up to 83% for fires >~14 ha **[SNIPPET]** — [Fire 2024](https://www.mdpi.com/2571-6255/7/1/9).
- MODIS in degraded Central Kalimantan peat: ~60% omission where burn scars exist, 8-9% commission **[SNIPPET]** — [Tansey 2008](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2008JD010717).
- MODIS vs SPOT-4 (Sumatra and Kalimantan, 2012): accuracy 64-66%, commission ~19%, omission 15-18%, with much omission attributed to smoke and cloud **[SNIPPET]** — [LAPAN validation](https://www.researchgate.net/publication/265907699_VALIDASI_HOTSPOT_MODIS_DI_WILAYAH_SUMATERA_DAN_KALIMANTAN_BERDASARKAN_DATA_PENGINDERAAN_JAUH_SPOT-4_TAHUN_2012).
- MODIS burned area vs Landsat 8: 40.2% commission, 72.6% omission **[SNIPPET]** — [Frontiers 2024](https://www.frontiersin.org/journals/forests-and-global-change/articles/10.3389/ffgc.2024.1221797/full).
- A cross-source mismatch exists in 2026: SiPongi's Riau figures vs much smaller Sentinel-2 measurements in specific cases **[SNIPPET]** — [Mongabay, Jun 2026](https://mongabay.co.id/2026/06/26/menelusuri-karhutla-riau-di-hutan-alam-dan-gambut-perusahaan/).
- Limits self-reported by a time-split project: cloud gaps, long fires count once per day, about 4 in 10 alerts false, untested on cells without recent fire — [Jagawana](https://github.com/EunwooSec/jagawana-ai).
- Cloud-day count vs hotspot count R² = 0.28; detection bias worsens in high-fire years; fire-season vegetation indices partly reflect fires already burned — [Horton 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC9286596/).
- Imbalance: ~5% positives at >10 fires per cell-month; model overconfident in low-fire years and overestimated 2019 — [ProbFire](https://nhess.copernicus.org/articles/22/303/2022/). Filtering to fire-prone cells raises positives to 28.1% — [Jagawana](https://github.com/EunwooSec/jagawana-ai).
- Random splits leak space and time — [arXiv 2501.10401](https://arxiv.org/pdf/2501.10401). K-fold is optimistic when neighbours are dependent — [arXiv 2110.09497](https://arxiv.org/pdf/2110.09497). Chronological splits can still leak within one incident, so group by incident — [arXiv 2607.07951](https://arxiv.org/pdf/2607.07951).
- Random-split AUC inflation of 5-15% is cited in a flood-susceptibility study, a different hazard — [arXiv 2603.15681](https://arxiv.org/pdf/2603.15681).
- Designs worth copying: leave-one-year-out ([ProbFire](https://nhess.copernicus.org/articles/22/303/2022/), [Horton](https://pmc.ncbi.nlm.nih.gov/articles/PMC9286596/)), and year holdout plus 7-day purge gap plus cross-island test ([Jagawana](https://github.com/EunwooSec/jagawana-ai)).

### Inferences
- Label: "≥1 nominal/high VIIRS detection in cell within horizon", described as a detection, never as a fire. A data-quality panel should show cloud-obscured days per cell, since a zero under cloud is not a true negative.
- Peat smoulder omission means models will under-rate exactly the most damaging fires. Adding a peat-fraction exposure weight in the decision layer is safer than trusting the probability alone.
- Do not train on all cells at the observed base rate and then quote metrics from a filtered set. State the cell-selection rule, and select cells using training years only.

### Gaps
- Most hotspot-error figures are snippets from different reference data and buffer sizes, so they are not directly comparable.
- I found no study jointly quantifying MODIS and VIIRS error on smouldering peat in one design.
- Literature on negative sampling for Indonesian fire was not found.

## Q4. Prescriptive precedent: patrols, pre-positioning, budgets, and costs

### Takeaway
Optimization of suppression and pre-positioning is well established abroad, and green-security patrol models exist. I found no published patrol-route or budget optimizer for Indonesian karhutla, so the prescriptive layer is novel here but has no local evidence of benefit.

### Cited Findings
- Predict then prescribe: crew assignment and fire dynamics as integer optimization with branch-and-price-and-cut, double ML for suppression effect; claims "significant reductions in area burned" with no number in the abstract — [Boussioux et al., 2026](https://arxiv.org/abs/2605.04510).
- LA County pre-positioning: two objectives, expected citizens evacuated vs augmentation cost for personnel and equipment — [Interfaces](https://pubsonline.informs.org/doi/pdf/10.1287/inte.2021.1084).
- USFS scenario-based maximal-covering model deploying up to 22 engines among 15 stations, under budget and fire uncertainty — [USFS](https://research.fs.usda.gov/download/treesearch/29619.pdf). **[SNIPPET]**
- Integer program for initial attack across budget levels, in a cost-effectiveness frame — [Rideout, Wei, Kirsch 2011](https://iieta.org/download/file/fid/47738). **[SNIPPET]**
- Set-covering for initial attack teams and response time targets — [Aliağa-İzmir study](https://dergipark.org.tr/tr/download/article-file/2986840). Stochastic, robust and distributionally robust pre-positioning minimizing expected burned area — [Minho thesis](https://repositorium.uminho.pt/bitstream/1822/91575/1/David%20Antonio%20Vieira%20dos%20Santos%20Moura%20Neto.pdf). **[SNIPPET]**
- Classic objective, C+NVC: minimize management cost plus net value change from fire — [Donovan and Rideout 2003](https://link.springer.com/article/10.1093/forestscience/49.2.318).
- Green-security games: PAWS is a repeated Stackelberg game with randomized patrols vs poachers — [PAWS](https://projects.iq.harvard.edu/files/teamcore/files/project_paws_publication_08_teamcore_fang_et_al_2016_aaai_paws.pdf). Forest-extraction patrol density maximizes pristine area — [Johnson, Fang, Tambe 2012](https://ojs.aaai.org/index.php/AAAI/article/view/8161).
- Closest to your cost-risk ranking: ProbFire reports cost-loss relative value — [ProbFire](https://nhess.copernicus.org/articles/22/303/2022/).
- Indonesia, closest found: fire brigade post number and location for response time on Bengkalis — [IJTech 2019](https://doaj.org/article/ec4a3b4491314c82ab6db6a632418b81); ML on patrol-system records from Aug 2023 — [Jurnal Infotel 2024](https://ejournal.ittelkom-pwt.ac.id/index.php/infotel/article/download/1180/517); PEATFR tool mentions resource allocation aims — [Jabarprov](https://jabarprov.go.id/en/berita/peatfr-perangkat-lunak-buatan-lima-akademisi-mampu-prediksi-kebakaran-lahan-gambut-25417). **[SNIPPET]**

**Indonesian cost anchors**
- 2015: US$16.1 billion, 2.6 Mha, June-October — [World Bank via BenarNews](https://www.benarnews.org/english/news/indonesian/indonesia-fires-12152015170230.html), [World Bank report](https://openknowledge.worldbank.org/entities/publication/391e19f4-18f7-56c2-8c28-bb89cc9e7d6f/full).
- 2019: US$5.2 billion ($157M direct damage, ~$5B losses), 0.5% of GDP; ~620,201 ha January-September; ~44% in peat — [Al Jazeera](https://www.aljazeera.com/economy/2019/12/11/forest-fires-cost-indonesia-5-2bn-and-counting-world-bank), [CNBC](https://www.cnbc.com/2019/12/11/world-bank-says-indonesia-fires-cost-5point2-billion-in-economic-losses.html).
- Court: PT Kallista Alam, Rp114.3 billion material damages plus Rp251.8 billion restoration for ~1,000 ha — [Mongabay](https://mongabay.co.id/2014/09/28/banding-ditolak-pengadilan-tinggi-banda-aceh-saatnya-pt-kallista-bayar-rp366-miliar-ke-negara/amp/).
- Claim, not verdict: PT WAJ Rp466 billion for 1,802 ha — [Antara](https://gorontalo.antaranews.com/berita/228459/klhk-gugat-22-perusahaan-penyebab-kebakaran-hutan-dan-lahan). PT NSP paid Rp160 billion with Rp319.2 billion still due at that date — [Gakkum, Jul 2024](https://gakkum.menlhk.go.id/assets/info-publik/REV_RR_Siaran_Pers_NSP_12_Juli_2024_tambah1.pdf).

### Inferences
- Derived per-hectare (my arithmetic, national averages): 2015 about US$6,190/ha; 2019 about US$8,390/ha, with cost and area windows that do not match. Court-based: about Rp366 juta/ha (Kallista), about Rp259 juta/ha (WAJ claim). Use these as a stated range and a sensitivity slider, not one number.
- Suggested objective: choose units to maximize Σ P(detection) × peat-weighted exposure × damage per ha × effectiveness, within patrol budget and travel limits; solvable as a knapsack on ranked list. Effectiveness has no Indonesian estimate, so state it as an assumption and show rank stability across its range.
- Do not report "hectares saved". That would be a simulated counterfactual and likely collides with the competition rule. Report only what backtest can show: "top-K kecamatan by rank captured X% of later detections", at K sized to a real patrol budget.
- Game-theoretic patrol randomization assumes an adaptive adversary and is unnecessary in five days.

### Gaps
- No RAVG material surfaced; from prior knowledge it is a post-fire severity assessment rather than a prevention optimizer, so its relevance looks low.
- Fire-prevention patrol-scheduling literature was not found directly.
- Cost per Manggala Agni patrol, per-regu capacity, and intervention effectiveness were not found.
- World Bank 2015 sector breakdown was not retrieved (document URL 404).
- The 2019 burned area in other reports may differ from 620,201 ha.

## Q5. Could an LLM add value without hallucination risk?

### Takeaway
Yes, but only as a constrained phrasing layer over already-computed facts. Direct evidence for Bahasa Indonesia fire briefings was not found, so its value should be framed as a usability feature, not a modeling result.

### Cited Findings
- WildfireGPT: RAG multi-agent on FWI projections, incidents and literature; evaluated on ten expert cases with GPT-4 as a judge; authors claim outperformance of other LLM tools **[SNIPPET]** — [arXiv 2504.17200](https://arxiv.org/html/2504.17200v1), [arXiv 2402.07877](https://arxiv.org/html/2402.07877).
- DRRGS generates disaster reports from weather alerts and statistics; states LLMs cannot yet replace expert judgment **[SNIPPET]** — [IJDRR](https://www.sciencedirect.com/science/article/pii/S2212420926004231).
- Relying on LLMs alone can cause hallucination and bias, particularly dangerous in disaster settings **[SNIPPET]** — [Flood warning framework](https://doi.org/10.3390/geohazards7010035).
- Mitigation in the survey: RAG on verified documents; generate warnings from rule-based alerts **[SNIPPET]** — [Survey](https://arxiv.org/html/2501.06932v1).
- Taxonomy for evaluation: minor, major hallucination, and omission with human annotators — [arXiv 2512.18360](https://arxiv.org/pdf/2512.18360). Dataset of warning messages — [CrisiText](https://arxiv.org/html/2510.09243).
- Indonesian-language needs its own evaluation — [IndoSafety](https://arxiv.org/pdf/2506.02573); LLM output quality drops for Sundanese vs Indonesian — [arXiv 2402.17302](https://arxiv.org/pdf/2402.17302).

### Inferences
- Lowest-risk design: the pipeline writes one JSON row per unit (location, rank, probability band, top drivers, data-age flags). The LLM only rewrites into Bahasa Indonesia and WhatsApp style, then a deterministic validator rejects output if any number, place name or date is not in the row. Fallback is a plain template. No retrieval, no free-form advice.
- A template alone may be enough. LLM adds tone, length adaptation and optional local-language variants. Judges may value it, but it does not improve prediction.
- Report triage (classifying field reports) has no input data in public sources, so it would need synthetic examples, which the competition rule makes unsafe.

### Gaps
- No evidence found on Bahasa Indonesia weather or fire briefing quality, or on WhatsApp-format warning uptake by Manggala Agni or MPA.

## Q6. Smallest honest modeling unit, method transfer, and 5-day scope

### Takeaway
Feasible if scoped to 2-3 provinces and framed as ranking detection risk. Model at about 0.1° cell-week (or 0.25° if time is short), report at kecamatan or kabupaten, and show desa only as a static exposure lookup, not as predicted risk.

### Cited Findings
- Published operational units: 0.5° cell-day ([Jagawana](https://github.com/EunwooSec/jagawana-ai)), 0.25° monthly ([ProbFire](https://nhess.copernicus.org/articles/22/303/2022/)), 0.25° 10-day ([Dadap](https://iopscience.iop.org/article/10.1088/1748-9326/ab3891)). 250 m exists only in a descriptive susceptibility model with low recall ([Horton](https://pmc.ncbi.nlm.nih.gov/articles/PMC9286596/)).
- Dynamic drivers are ≥9 km: ERA5-Land native 9 km ([CDS](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land)), SMAP 9 km ([NSIDC](https://nsidc.org/data/spl3smp_e/versions/6)). CHIRPS is finer at 0.05° ([AGU](https://ui.adsabs.harvard.edu/abs/2020AGUFMH217...07F)).
- VIIRS hotspot match accuracy peaked at ~1.5 km from fire centre **[SNIPPET]** — [Fire 2024](https://www.mdpi.com/2571-6255/7/1/9).
- A real, recent replay event exists: ONI ASO 2026 +2.46 — [CPC](https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt); SiPongi-based 202,004.30 ha January-July 2026, +69% on 2025, secondary and opinion source — [GNFI](https://www.goodnewsfromindonesia.id/indonesiana/opini/karhutla-2026-evaluasi-pencegahan-kebakaran-hutan).

### Inferences

**Method transfer**

| Your method | Transfer to karhutla | Caveat |
|---|---|---|
| (a) Forecast drivers | Partly. Drought state is predictable; use lagged rainfall, soil moisture, ONI | Observed ERA5 in a backtest is not a forecast. Use only values known at decision time, or it leaks |
| (b) Probabilistic output | Yes. Calibrated gradient boosting, reliability plot | Overconfidence in low-fire years is documented, so calibrate on out-of-time data |
| (c) Cost-risk ranked actions | Yes, as knapsack ranking with stated drivers | Effectiveness and cost are assumptions; no local precedent |
| (d) Out-of-time and replay | Strongest fit. Train ≤2022, validate 2023, test 2024-26, replay the 2026 season | Report vs persistence; add new-fire-only scores |
| (e) Data-quality panel | Very valuable: cloud days, sensor change, data age, source mismatches | The S-NPP stop is a real example to display |
| (f) Python to SQLite to web | Yes, unchanged | Rasters stay offline; SQLite holds unit-week tables only |

**Unit recommendation**
- Desa is not honest as a prediction unit, since weather and soil data are coarser than most desa and hotspots have kilometre-scale error. Fine as an output join for exposure and contacts.
- Kecamatan is the smallest defensible action unit. Kabupaten is the safest for quoted metrics, and is the level at which SiPongi burned-area checks appear possible.

**Realistic 5-day plan**
1. Day 1: request FIRMS archive, register CDS and Earthdata, fix region (2-3 provinces, one peat-heavy) and unit grid.
2. Day 2: ERA5-Land and CHIRPS aggregation, label building from VIIRS and MODIS, static layers (WRI peat, HDX boundaries, OSM distances).
3. Day 3: baselines (persistence, climatology) then gradient boosting, year holdout, calibration.
4. Day 4: decision layer, SQLite, replay for 2026, data-quality panel.
5. Day 5: web app, optional templated or validated LLM briefing, documentation of limits.

Drop for now: SMAP ingestion (optional if ahead of schedule), ConvLSTM, concession features without license clarity, TMAT, Stackelberg patrols, seasonal SEAS5 outlook.

**Verdict.** Feasible on real public data within five days, at province scope. The defensible claim is a calibrated, out-of-time-validated ranking of satellite-detected fire risk, with a transparent decision layer, not an estimate of damage avoided.

### Gaps
- Actual compute and download time for ERA5-Land over the chosen provinces is unmeasured.
- No historical archive of operational forecasts was verified, so a true forecast-driven backtest remains unconfirmed.
- The competition's exact wording on "simulated" results was not available to me; check whether assumption-driven cost ranking is acceptable.
