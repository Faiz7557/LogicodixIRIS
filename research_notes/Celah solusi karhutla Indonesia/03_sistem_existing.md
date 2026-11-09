# Sistem existing karhutla Indonesia: inventory fitur dan celah (per 9 Nov 2026)

## 1. What does each named system do, who uses it, how often does it update, and does it push alerts?

### Takeaway
Hotspot display is heavily saturated: at least 8 live public layers show the same NASA/BMKG detections. Push alerts exist but only through global tools (NASA FIRMS, FireAlert, GFW) and none of them say who should act; the national systems I could check are display-only or undocumented on push.

### Cited Findings
Evidence labels: default = page or listing opened by me on 9 Nov 2026. "(snippet)" = seen only through a search-result summary, page not opened. "unverified" = I could not confirm it. "Not mentioned" = the page I read is silent, which is not proof of absence.

**Inventory**

| System | What it does (verified) | Users | Update | Push? | Status 2026 and how I know |
|---|---|---|---|---|---|
| **SiPongi+** (Kemenhut) | Hotspot map with confidence colours: green 0-29%, yellow 30-79%, red 80-100% — [Selular](https://selular.id/2026/08/tiga-aplikasi-yang-bisa-pantau-kebakaran-hutan-dan-lahan-di-kalimantan/). Burned-area stats (107,465 ha H1 2026) — [Ekuatorial](https://www.ekuatorial.com/en/?p=106584) | Public, Kemenhut, press | "Daily" per [IPB thesis 2023](https://repository.ipb.ac.id/handle/123456789/133490?show=full); exact interval unverified | Unverified. No source mentions it. Play description is only "Sistem Monitoring Karhutla" — [Play](https://play.google.com/store/apps/details?id=id.go.menlhk.sipongi&hl=en&gl=ID) | **Active.** App updated 23 Sep 2026; Kemenhut still cites it in [late 2026 releases](https://infopublik.id/kategori/bencana/996103/hotspot-karhutla-nasional-naik-menjadi-215-titik-kemenhut-tingkatkan-kewaspadaan) (snippet). Portal itself failed DNS from my environment on menlhk/kehutanan/kemenhut hostnames, so I never saw it directly |
| **BMKG SPARTAN / FDRS** | Fire danger and spread potential, not fire location. FWI-based: FFMC, DMC, DC, ISI, BUI, FWI — [BMKG](https://www.bmkg.go.id/berita/bmkg-spartan-dukung-pemantauan-dan-pencegahan-potensi-karhutla). Site has data download, interactive and static maps, login — [SPARTAN](https://spartan.bmkg.go.id/) | BMKG, ministries, pemda, media — [BMKG](https://www.bmkg.go.id/berita/bmkg-spartan-dukung-pemantauan-dan-pencegahan-potensi-karhutla) | Unverified. Forecast horizon unverified | Not mentioned. Called "early warning" but no push channel described | **Active.** BMKG briefing 23 Jun 2026; site loads (footer still 2021) |
| **BMKG Citra Polar Hotspot** | Satellite imagery plus VIIRS/MODIS hotspots, day and night — [Selular](https://selular.id/2026/08/tiga-aplikasi-yang-bisa-pantau-kebakaran-hutan-dan-lahan-di-kalimantan/) | Public | "Periodic", no interval | Not mentioned | **Active** (Aug 2026 article) |
| **BRIN/LAPAN Fire Hotspot** | Page title "BRIN Fire Hotspot" only; content is client-rendered and I could not read features — [BRIN](https://hotspot.brin.go.id/). No separate LAPAN portal or "Modis Catalog" verified | Unverified | Unverified | Unverified | **Reachable** (HTTP 200, 9 Nov 2026); data currency unverified |
| **SIPALAGA** (BRGM) | Logs peat water level, humidity, rain; about 142 units in 7 provinces in 2019, at least 5 stolen — [Jakarta Post 2019](https://www.thejakartapost.com/news/2019/03/03/bnpb-spokesperson-laments-theft-of-wildfire-warning-tools.html). Danger status below 40 cm — [Mongabay 2019](https://mongabay.co.id/2019/01/28/brg-kembangkan-sistem-pemantauan-muka-air-gambut/) (snippet) | Public via app, BRGM | Hourly (2019) — [Mongabay](https://mongabay.co.id/2019/01/28/brg-kembangkan-sistem-pemantauan-muka-air-gambut/) (snippet) | Unverified | **Possibly degraded.** [sipalaga.brgm.go.id](https://sipalaga.brgm.go.id/) returned HTTP 502 on two checks 9 Nov 2026. Latest data citation I found is [July 2023](https://www.jawapos.com/berita-daerah/2307110022/hadapi-musim-kemarau-brin-gandeng-brgm-lakukan-operasi-tmc-di-kalimantan-selatan) (snippet). Cannot call it dead |
| **SiMATAG-0,4m** (KLHK) | TMAT and rainfall database for assessing company compliance with the 0.4 m rule; licensed land only in 2019, non-concession trial planned — [KLHK press release](https://mail.ppkl.menlhk.go.id/website/filebox/600/190618152629Press%20Release%20SiMATAG%2018%20Juni%202019%20REV.docx) (snippet) | Regulator, concession holders | Unverified | Unverified | **Stale evidence.** Nothing after 2019 under this name. KLH uses about [10,000 TMAT points in Jul 2026](https://mongabay.co.id/2026/07/24/antisipasi-karhutla-saat-kemarau-panjang-jaga-gambut-tetap-basah/) but the article does not name the system |
| **Sistem Patroli Terpadu / SIPP Karhutla** | Web, mobile, spatial DB to record patrols; web for managers, mobile for field — [IPB](https://repository.ipb.ac.id/handle/123456789/160736?show=full) (snippet). Director General regulation, in use since 2021 in Sumatra — [JIPI](https://journal.ipb.ac.id/agro-maritim/article/view/53687) | Manggala Agni, TNI, Polri | Event-based | Records data; alerting unverified | **Active.** [Patroli Karhutla app](https://play.google.com/store/apps/details?id=com.karhutla_ipb.myapp&hl=en&gl=ID) updated 18 Jun 2026 |
| **Patroli mandiri apps** | No app of this name found. Closest: village patrol in Ketapang using Smart Patrol, tracking water level, fire-prone spots, burn scars, trained by Tropenbos — [Kompas Oct 2025](https://lestari.kompas.com/read/2025/10/30/190300386/di-balik-sunyi-rawa-gambut-ketapang--perjuangan-warga-menantang-api-karhutla) (snippet) | LPHD, MPA | Per patrol | Unverified | **Active at project level**, scale unverified |
| **Lapor! / SP4N** | General one-door government complaint channel — [iOS listing](https://apps.apple.com/id/app/sp4n-lapor/id1486554343) (snippet). No karhutla route found | Citizens, agencies | Case-based | Status replies; not fire alerts | **Active** ([lapor.go.id](https://www.lapor.go.id/) HTTP 200) |
| **Dashboard Lancang Kuning** (Polda Riau) | Android app for Satgas Karhutla Riau to monitor and report — [UIN Suska](https://ejournal.uin-suska.ac.id/index.php/jrmdk/article/download/14682/9011) (snippet) | Police, Satgas | Unverified | Unverified | **Active.** Used in Feb 2026 Pelalawan arrest — [Metro TV](https://www.metrotvnews.com/read/Ky6C52Ow-terdeteksi-dashboard-lancang-kuning-tersangka-karhutla-di-pelalawan-diringkus). Training also held in [Kaltim 2021](https://tribratanews.kaltim.polri.go.id/2021/03/buka-pelatihan-aplikasi-dashboard-lancang-kuning-ini-arahan-kapolda-kaltim) |
| **Dashboard Green Policing** (Polda Riau) | Risk mapping, incidents, 7,349 points, 110 access bridges, tree/carbon records — [article](https://achmadnurhidayat.id/polda-riau-luncurkan-dashboard-green-policing). Relation to Lancang Kuning unverified | Police | Unverified | Not mentioned | **Active**, launched 22 Aug 2026 (snippet date) |
| **Polri GAC** | Early warning integrated with SiPongi, Himawari, TMAT — [Industry.co.id](https://www.industry.co.id/read/145624/kapolri-dan-menteri-kehutanan-perkuat-sinergi-tangani-karhutla-di-indonesia) (snippet) | Police | Unverified | Unverified | Cited Oct 2025; internal |
| **Karhutla Monitoring System (KMS)** | Originated 2014 with GFW-Fires — [Mongabay 2014](https://mongabay.co.id/2014/07/24/indonesia-luncurkan-sistem-canggih-atasi-kebakaran-hutan-dan-kabut-asap-seperti-apakah/amp/) (snippet) | Government | Unverified | Unverified | **Unclear.** DPR still referred to it in [Jul 2025](https://news.detik.com/berita/d-8021105/waka-komisi-iv-dpr-minta-pemerintah-optimalkan-karhutla-monitoring-system) |
| **Pantau Gambut** | Peat explainers, peat map, commitment tracker, fact sheets, hotspot counter sourced from LAPAN — [site](https://pantaugambut.id/) | Public, NGOs, press | News current to 9 Nov 2026 | No alerts mentioned | **Active.** Hotspot widget showed 0 with blank update time on 9 Nov 2026, so it may not have loaded |
| **GFW (VIIRS, GLAD, Pro)** | Fire alerts daily, GLAD weekly, RADD near real time — [Atlas](https://atlas.co/data-sources/global-forest-watch/) (snippet, third party). GFW Pro is used by HCSA to monitor deforestation and fire — [HCSA](https://highcarbonstock.org/id/mapping-portal/alert-and-monitoring-platform) (snippet) | NGOs, companies, journalists | Daily / weekly | **Email** subscriptions for custom areas — [Atlas](https://atlas.co/data-sources/global-forest-watch/) (snippet). SMS was announced in [2016](https://blog.globalforestwatch.org/uncategorized/coming-soon-viirs-active-fires-subscriptions); current availability unverified | **Active, branding changing.** GFW help URL now 301-redirects to [globalnaturewatch.org](https://globalnaturewatch.org/help/map/guides/subscribing-to-alerts/). Page body was empty, so options unverified |
| **Nusantara Atlas** (TheTreeMap) | FIRMS MODIS+VIIRS merged, alerts split by land type including peat-swamp; manual Sentinel-2 check advised, "false alerts may still occur" — [blog](https://nusantara-atlas.org/decoding-fire-alerts-in-nusantara-atlas/). FireWatch, Alerts Tracker ranking concessions, 20 m monthly burn scars — [blog 20 Jul 2026](https://nusantara-atlas.org/?p=2119). Layers down to village boundary — [blog 2023](https://nusantara-atlas.org/deforestation-monitoring-goes-mobile-empowering-everyone-to-take-action-against-deforestation) | Public, NGOs | Hotspots daily, burn scars monthly | Not mentioned | **Active** (Jul 2026 launch) |
| **GWIS** (JRC/Copernicus) | Fire danger forecast up to 10 days, NRT active fires, country profiles 2002-2019, seasonal outlook — [GWIS](https://gwis.jrc.ec.europa.eu/) | Global, agencies | Unverified | Not mentioned | **Reachable.** Latest dated item May 2025. Indonesia-specific tuning unverified beyond [2018 slides](https://gofcgold.umd.edu/sites/default/files/fireit_meetings/GOFC_Fire_IT_2018/GWIS-GOFC_presentations/Monday_Afternoon/20181001.Field.pdf) |
| **EFFIS** | GWIS is modelled on it — [ECMWF](https://www.ecmwf.int/node/16538) (snippet). Indonesia use not verified: transferable idea only | Europe | n/a | Unverified | Not assessed |
| **FireCast** (CI) | Satellite email alerts; a 2007 Indonesian park case | Park managers | n/a | Was email | **Dead.** "The Firecast initiative has ended", no regular updates since Dec 2023 — [CI](https://www.conservation.org/projects/firecast) |
| **MapBiomas Fire Indonesia** (Auriga) | Monthly 2026 burned area (637,011 ha Jan-Aug), annual 2000-2024 — [site](https://fire.mapbiomas.id/). Sentinel-2 plus deep learning — [Ekuatorial](https://www.ekuatorial.com/en/?p=106584) | Public, NGOs | Monthly (observed) | Not mentioned | **Active.** Collection 2 launched 23 Aug 2026 |
| **NASA FIRMS** (added) | Email alerts near real time, daily or weekly — [FIRMS](https://firms.modaps.eosdis.nasa.gov/alerts/) (snippet). Latency typically 3-4 h after overpass — [Atlas](https://atlas.co/data-sources/firms) (snippet, secondary) | Global | NRT | **Yes, email** | Active |
| **Google Maps Wildfires layer** (added) | Estimated fire-affected zones where available — [Selular](https://selular.id/2026/08/tiga-aplikasi-yang-bisa-pantau-kebakaran-hutan-dan-lahan-di-kalimantan/) | Public | Unverified | Unverified | Active (Aug 2026) |

### Inferences
- Another hotspot viewer adds nothing. Even village-boundary and concession overlays already exist in Nusantara Atlas.
- The national stack answers "where is heat?" and "how dry is it?" None of the verified feature lists answers "who goes, and what happened when they got there?"
- SPARTAN is the one national tool that is predictive, but it is weather-driven and BMKG itself says it does not locate fire. Nothing in its documentation ties it to peat water table.

### Gaps
- SiPongi portal features and push behaviour: could not open the portal.
- SIPALAGA 2026 station count and data health: no source after 2023. The 502 error could be transient.
- BRIN portal features, GFW Pro current terms, GFW SMS: unverified.
- Update intervals for SPARTAN, Lancang Kuning, GAC: not published in anything I read.

## 2. Which apps exist at village, farmer or MPA level, and are they maintained?

### Takeaway
No maintained, widely used app built for MPA or village brigades was found. The most used field app (Patroli Karhutla, 5K+ downloads) serves integrated state patrols; the MPA-specific one is a 2026 undergraduate thesis.

### Cited Findings
Play Store data retrieved directly on 9 Nov 2026:

| App | Developer | Rating | Downloads | Last update | What it is | Verdict |
|---|---|---|---|---|---|---|
| [SiPongi](https://play.google.com/store/apps/details?id=id.go.menlhk.sipongi&hl=en&gl=ID) | SiPongi KLHK | 4.6 (429 reviews) | 100K+ | 23 Sep 2026 | Monitoring | Maintained, not field tool |
| [Patroli Karhutla](https://play.google.com/store/apps/details?id=com.karhutla_ipb.myapp&hl=en&gl=ID) | SSMI IPB | 4.1 (71 reviews) | 5K+ | 18 Jun 2026 | Patrol data recording, Sumatra | Maintained, state patrols |
| [Bekantan Karhutla Kalsel](https://play.google.com/store/apps/details?id=id.web.bekantan&hl=en&gl=ID) | Al Baik Infinite Technology | 3.2 | 1K+ | 4 Sep 2024 | Officer and citizen fire reports, Kalsel | **Stale (26 months)** |
| [Respon Karhutla](https://play.google.com/store/apps/details?id=com.responkarhutla.app&hl=en&gl=ID) | thegreatmonolith | none | 10+ | 4 Sep 2026 | Sintang hotspot monitoring and fire reporting | New, negligible use |
| [Siaga Karhutla](https://play.google.com/store/apps/details?id=com.siagakarhutla.app&hl=en&gl=ID) | Candy Dream | none | 1+ | 18 Sep 2026 | Education and evacuation guide | Negligible use |
| [Fire Alert](https://play.google.com/store/apps/details?id=eco.pp.firealert&hl=en&gl=ID) | Plant-for-the-Planet | 4.2 | 10K+ | 19 Oct 2026 | Global FIRMS alerts | Maintained, see below |
| [Firecek](https://play.google.com/store/apps/details?id=com.firecek.firecek&hl=en&gl=ID) | FireCode | 4.2 (219 reviews) | 10K+ | 7 Aug 2026 | Extinguisher and hydrant management | **False friend, not karhutla** |

- FireAlert sends phone, SMS, WhatsApp and email alerts for user-defined sites from FIRMS; a testimonial stresses SMS for low-connectivity areas — [Plant-for-the-Planet](https://www.plant-for-the-planet.org/?p=36879).
- IPB's 2026 thesis app for MPA has login, priority hotspots (high-risk, cluster, sequence), incident reports, early warning notifications; black-box and PSSUQ tested; the repository links a Play listing — [IPB](https://repository.ipb.ac.id/handle/123456789/174049).
- Lembuswana (Polda Kaltim, launched Dec 2021) targets police — [Tribrata](https://tribratanews.kaltim.polri.go.id/2021/12/upaya-penanggulangan-karhutla-polda-kaltim-luncurkan-aplikasi-lembuswana) (snippet). Not found in my Play search, so maintenance unverified.
- Songket (Sumsel, May 2021): hotspot, weather and wind; distance to posts and water sources; routing and travel time; public fire reports with coordinates to the command centre; smoke cameras on Telkom BTS towers — [Medcom Dec 2023](https://www.medcom.id/nasional/daerah/GNG1B4Ak-aplikasi-songket-mudahkan-penanganan-karhutla-di-sumsel). Current status unverified.
- In Bengkalis, the village fire group got hotspot information from the district fire station and coordinated sightings in WhatsApp with company staff and firefighters. It had two pumps and 500 m of hose — [Ecology & Society 2023](https://ecologyandsociety.org/vol28/iss3/art12/). One village, so not generalisable.
- Integrated patrol findings were usually sent as text in WhatsApp groups, which the app paper calls ineffective for querying — [JPSL 2022](https://journal.ipb.ac.id/jpsl/article/view/37419).

### Inferences
- WhatsApp is the real incumbent at village level. A new app competes with it, so a WhatsApp or SMS flow is likelier to be adopted than a standalone install.
- Bekantan (no update in 26 months) is the one verifiable case of a regional police app going stale. Lembuswana and Songket need checking before calling this a pattern.

### Gaps
- Search was on the keyword "karhutla" only, in one country/language setting. Apps named otherwise may be missed.
- Could not confirm the IPB MPA app's listing name, downloads or real MPA use.
- Sipalaga app listing not checked directly.

## 3. Private and corporate systems

### Takeaway
Big concessions run the most complete loops (cameras, situation rooms, own TMAT networks, village incentives), but they are closed, limited to their own landscapes, and recent public evidence is thin. Pano AI and Dryad have no verified Indonesian deployment.

### Cited Findings
- **APP/Sinar Mas:** Situation Room in Jakarta monitors supplier-concession hotspots and takes FDRS data from BMKG — [PPI](https://www.naylornetwork.com/ppi-otw/articles/print.asp?aid=371984) (snippet). Thermal tower — [Tempo](https://en.tempo.co/amp/788784/sinar-mas-installs-thermal-tower-to-detect-forest-fire) (snippet). Integrated fire management across concessions in five provinces — [Jakarta Post 2019](https://www.thejakartapost.com/news/2019/07/29/pulp-and-paper-firm-targets-zero-forest-fires-in-2020.html) (snippet). DMPA villages: target of 500 by 2020 — [Antara](https://jambi.antaranews.com/berita/312833/sinar-mas-targetkan-bentuk-500-desa-binaan) (snippet). **Status: unverified for 2025-26.**
- **APRIL FFVP:** started 2015, reports a 90% fall in fire incidence in participating villages in 2015 vs 2014 (self-reported) — [APRIL](https://aprilasia.com/en/our-media/articles/april-s-fire-free-village-program-ffvp) (snippet).
- **Fire Free Alliance:** members engaged 200+ villages in 2016 — [IDH](https://idh.org/news/idh-fire-free-alliance-address-forest-fire-haze-200-indonesian-villages) (snippet). 2025 current count not found.
- **Asian Agri:** 2024-25 FFVP awards and 2025-26 MoU, with a Rp50 million village incentive — [Asian Agri](https://www.asianagri.com/en/?p=8861) (snippet). **Active as of Jun 2025.**
- **Wilmar:** nothing found. Unverified.
- **Company TMAT networks (self-reported, Jul 2026):** Arara Abadi 203 instruments, 268 canal blocks, 10 rain stations; THIP 1,246 piezometers, 66 IoT sensors — [Mongabay](https://mongabay.co.id/2026/07/24/antisipasi-karhutla-saat-kemarau-panjang-jaga-gambut-tetap-basah/).
- **RSPO:** 9,841 raw hotspots across 53 members in Aug 2026; verification relies on members' own ground checks; no formal investigations opened — [The Star](https://www.thestar.com.my/news/nation/2026/09/09/satellite-hotspots-flagged).
- **OroraTech:** Katingan Mentaya carbon project monitored by its satellites, announced Jul 2024 — [OroraTech](https://ororatech.com/tropical-forest-firefighters-trained-with-space-based-wildfire-detection-system-to-combat-deforestation/) (snippet).
- **Dryad:** Indonesian distribution "under negotiation" in Jan 2025, not a deployment — [Business Wire](https://www.businesswire.com/news/home/20250115881322/en/Dryad-Networks-Leads-the-Charge-in-Global-Wildfire-Mitigation-With-Record-Growth-in-2024) (snippet).
- **Pano AI:** no Indonesian deployment found; expansion focus reported as North America and Australia — [Unite.AI](https://www.unite.ai/id/pano-ai-secures-44m-to-battle-a-growing-wildfire-crisis/) (snippet).
- **Drones:** Halo Robotics (DJI distributor) markets satellite-to-drone verification, autonomous plantation patrols, and audit-ready reports. Vendor claims only — [Halo](https://halorobotics.com/?p=64040) (snippet). Polri uses drones for hotspot verification and modified water-dropping — [Investortrust](https://investortrust.id/national/113884/karhutla-landa-64341-hektare-polri-siagakan-71676-personel).

### Inferences
- The corporate loop stops at the concession boundary. Fires in the gaps between concessions and villages have no equivalent, and that is also where the state TMAT blank spots are.
- Corporate tech is not a hackathon target, but its operating pattern (camera/sensor, situation room, village incentive) is a template.

### Gaps
- Internal corporate workflows, false-alarm rates, and response times are unpublished.
- No independent evaluation of FFVP or DMPA was found.

## 4. Previous hackathon, student and startup attempts

### Takeaway
I found no karhutla winner from Gemastik or Hackathon Merdeka. The recurring output is student IoT prototypes with no deployment evidence, and the most famous civic tool, Haze Gazer, has lost its domain.

### Cited Findings
- **Gemastik:** no fire entry surfaced. The closest UGM win was UAV radiation detection — [UGM TF 2024](https://tf.ugm.ac.id/2024/10/05/mahasiswa-dtntf-raih-medali-perak-gemastik-xvii-2024) (snippet). This is absence in my search, not proof.
- **Hackathon Merdeka 2.0** winners named were Kentongan, Mobile Posyandu, Ayo Jaga, Lapori; none on fire — [Suara Surabaya](https://www.suarasurabaya.net/?p=275467) (snippet).
- **Haze Gazer (Pulse Lab Jakarta, about 2016):** crisis dashboard using GFW hotspots and citizen behaviour data — [Medium](https://medium.com/pulse-lab-jakarta/haze-gazer-a-crisis-analysis-tool-23d7333c657a) (snippet). Sources disagree: [adopted into government early warning](https://uninnovation.network/projects/haze-gazer-1) vs [piloted](https://govinsider.asia/intl-en/article/new-tool-tracks-citizens-behaviour-during-haze) (both snippet). **Status: effectively dead.** hazegazer.org 301-redirected to an unrelated law-firm domain on 9 Nov 2026 (my own fetch).
- **UGM crowdsourced hotspot validation (2019):** Android app tested with Padang Island, Riau residents, feeding a dashboard; concluded it could support government validation — [UGM](https://prisma.simaster.ugm.ac.id/karya_files/crowdsourced-hotspot-validation-and-data-visualisation-for-location-based-haze-mitigation-eb864e9070c17c56177a607957f9c58b). No operational follow-up found.
- **UGM We-Remotes (2019):** sensors, LoRaWAN, drones; won Rekinnovation — [UGM](https://ugm.ac.id/?p=32018) (snippet). No deployment found.
- **Telkom University prototypes:** Arduino/GSM, LoRa + Android, fibre EWS — [1](https://openlibrary.telkomuniversity.ac.id/pustaka/files/209355/jurnal_eproc/sistem-pendeteksi-kebakaran-hutan-menggunakan-arduino-uno-dan-modul-gsm-berbasis-iot-dalam-bentuk-pengganti-sidang-rancangan-karya-akhir.pdf), [2](https://openlibrary.telkomuniversity.ac.id/pustaka/files/204664/abstraksi/sistem-pemantauan-kebakaran-hutan-berbasis-internet-of-things-dengan-menggunakan-lora-dan-aplikasi-android.pdf) (snippets).
- **"Karhutla Monitoring by Telkom":** no product of this name found. The only verified Telkom link is smoke cameras on BTS towers for Songket — [Medcom](https://www.medcom.id/nasional/daerah/GNG1B4Ak-aplikasi-songket-mudahkan-penanganan-karhutla-di-sumsel).
- **PetaBencana.id:** **Active.** Citizen fire and haze reports via WhatsApp or web, anonymous allowed; 108 cities reported 1-20 Oct 2026. The article describes no formal hand-off to agencies; data "can be used" by them — [GNFI 23 Oct 2026](https://www.goodnewsfromindonesia.id/indonesiana/alam-lingkungan/108-kota-terdampak-karhutla-laporan-warga-bantu-ungkap-kondisi-yang-tak-tertangkap-satelit).
- **Qlue:** only smart-city complaints in cities; nothing on karhutla — [Kontan](https://industri.kontan.co.id/news/qlue-mendukung-pemkot-kupang-dan-tarakan-sebagai-smart-city-dalam-ambil-kebijakan) (snippet).
- **Fincapes (Univ. Waterloo, Global Affairs Canada):** two DIY peat sensors with temperature and water level at Air Merah, Sumatra, installed late Aug 2026. A local siren sounds and data goes online; no results reported yet. The article notes messaging alerts could help but does not report them in place — [Mongabay Oct 2026](https://news.mongabay.com/2026/10/early-tech-warning-hopes-to-give-sumatras-peat-community-a-head-start-on-fires/amp/).

### Inferences
- The failure mode to avoid is a prototype with no owner after the demo. Haze Gazer's lost domain and the unadopted student work are the same story.
- A sensor-only pitch is weak: it repeats the Telkom University pattern and now competes with a funded field pilot.

### Gaps
- Gemastik and Hackathon Merdeka full entry lists were not available.
- Reasons for Haze Gazer's end are undocumented in what I found.

## 5. Documented complaints: fragmentation, last mile, delay, false alarms, groundcheck, closed loop

### Takeaway
Fragmentation and blank spots are documented. A real "false alarm rate" is not: the widely quotable Polri 16% figure measures something else. I found no measurement anywhere of hotspot-to-arrival time, and no BPK finding.

### Cited Findings
**Fragmented or conflicting data**
- H1 2026 burned area: MapBiomas 178,232 ha vs SiPongi 107,465 ha, attributed to method — [Ekuatorial](https://www.ekuatorial.com/en/?p=106584). Nusantara Atlas: about 103,000 ha — [blog](https://nusantara-atlas.org/?p=2119).
- DPR research brief (2017): non-integrated control contributes to recurring fires — [DPR](https://berkas.dpr.go.id/pusaka/files/info_singkat/Info%20Singkat-IX-15-I-P3DI-Agustus-2017-189.pdf) (snippet).
- A Papua Selatan study: geospatial data and imagery not fully integrated into decisions — [Unsub](https://ejournal.unsub.ac.id/index.php/publik/article/download/2438/1843/10035) (snippet; which study this is should be confirmed).
- DPR Komisi IV deputy (21 Jul 2025): government under-uses KMS data and lacks proactive steps — [Detik](https://news.detik.com/berita/d-8021105/waka-komisi-iv-dpr-minta-pemerintah-optimalkan-karhutla-monitoring-system).
- SiPongi could not summarise trends to village level or graph them (2023; may have changed) — [IPB](https://repository.ipb.ac.id/handle/123456789/133490?show=full).

**Water-table blank spots (KLH deputy Sigit Reliantoro, Jul 2026)** — [Mongabay](https://mongabay.co.id/2026/07/24/antisipasi-karhutla-saat-kemarau-panjang-jaga-gambut-tetap-basah/):
- Riau 512 of 670 peat villages unmonitored; South Sumatra 152 of 193 blank; West Kalimantan 295 of 366 undetected; Central Kalimantan only 50 of 304 monitored; Jambi 51 of 154 (reported as monitored).
- Pantau Gambut: 52% of intervention sites below safe groundwater; 52% of observed canal blocks with TMAT deeper than 40 cm.

**Delay**
- FIRMS typically 3-4 h after overpass — [Atlas](https://atlas.co/data-sources/firms) (snippet, secondary). Polar satellites pass about 4 times a day — [Nusantara](https://nusantara-atlas.org/decoding-fire-alerts-in-nusantara-atlas/).
- Polri targets handling each fire within 1-2 h of detection — [Investortrust](https://investortrust.id/national/113884/karhutla-landa-64341-hektare-polri-siagakan-71676-personel). This is a target; no achieved figure was published.
- Sungai Gelam, 2026: a small fire reached peat within hours, then took 10 days to extinguish; "We had no water" — [Mongabay](https://news.mongabay.com/2026/10/early-tech-warning-hopes-to-give-sumatras-peat-community-a-head-start-on-fires/amp/). Anecdote.

**False alarms and verification**
- Polri: 48,656 hotspots, 7,872 active fires confirmed on the ground as of 22 Aug 2026 (about 16%) — [Investortrust](https://investortrust.id/national/113884/karhutla-landa-64341-hektare-polri-siagakan-71676-personel).
- UGM thesis, Central Kalimantan Sep 2019: polar MODIS/VIIRS accuracy 66.2-75.4%, commission 28.2-46.9%, omission 24.6-33.8% — [UGM](https://etd.repository.ugm.ac.id/penelitian/detail/182851).
- Hotspots are only indicators and need groundcheck; Kemenhut urges concession holders to verify each one quickly — [Suara Pemerintah](https://suarapemerintah.id/?p=401465) (snippet). A documented false alarm: [Kaltim 2019](https://www.suara.com/news/2019/04/21/082230/manggala-agni-turun-ke-lapangan-titik-panas-di-kaltim-bukan-karhutla) (snippet).
- Industrial heat sources trigger alerts (Weda Bay) — [Nusantara](https://nusantara-atlas.org/decoding-fire-alerts-in-nusantara-atlas/).
- Smouldering peat may escape detection from above — [GNFI](https://www.goodnewsfromindonesia.id/indonesiana/alam-lingkungan/108-kota-terdampak-karhutla-laporan-warga-bantu-ungkap-kondisi-yang-tak-tertangkap-satelit).

**Closed loop**
- Hotspot ground-check module was added to the Manggala Agni patrol app — [IPB](https://repository.ipb.ac.id/jspui/handle/123456789/170880) (snippet). The mobile app has no automated severity assessment; a CNN module was tested in Dec 2024 at Daops Pekanbaru — [IPB](https://repository.ipb.ac.id/handle/123456789/160736?show=full) (snippet).

### Inferences
- **Do not cite "84% of hotspots are false".** One fire yields several hotspots, and the source does not say how many hotspots were actually checked. RSPO makes the same point about raw counts — [The Star](https://www.thestar.com.my/news/nation/2026/09/09/satellite-hotspots-flagged).
- Omission on peat may matter more than commission: missed smouldering fire is the harder failure.
- Groundcheck results appear to exist in aggregate press numbers and inside patrol apps, but I saw no public layer that marks a given hotspot as confirmed, false, or unvisited.

### Gaps
- **No BPK audit finding located.** Needs a direct search of bpk.go.id LHP documents.
- **No measured alert-to-field or arrival-time study found.** A strong gap for field interviews.
- No study directly measuring whether warnings reach MPAs. A search summary mentioned a 2026 literature review calling peat fire response emergency-oriented, but I could not identify its URL, so it is not cited as a finding.
- Other Indonesian validation papers surfaced (omission roughly 30-60%, commission 8-30%, per a search summary) but I could not open them to attribute figures. Worth checking: [Abstract 32643](https://modis.gsfc.nasa.gov/sci_team/pubs/abstract_new.php?id=32643), [Abstract 01368](https://modarch.gsfc.nasa.gov/sci_team/pubs/abstract_new.php?id=01368), [ACRS 2013](https://a-a-r-s.org/proceeding/ACRS2013/Abstracts/SC05/Abstract_ACRS2013_Yenni-Vetrita-02.pdf).
- SP4N-LAPOR response deadlines: a search summary reported 5 working days for agency coordination, but I could not confirm it in the PDF I opened.

## 6. Does anything go beyond detection into decisions?

### Takeaway
Fragments exist, none joined. Songket does routing, the IPB app ranks hotspots, KLH has TMAT-plus-hotspot logic, and Nusantara ranks concessions. I found no operational patrol optimiser, no per-site water-table action trigger issued to a named actor, and no standard evidence pack.

### Cited Findings
**Patrol prioritisation and resource allocation**
- Songket calculates distance to posts and water, and routes and travel time — [Medcom](https://www.medcom.id/nasional/daerah/GNG1B4Ak-aplikasi-songket-mudahkan-penanganan-karhutla-di-sumsel). Closest operational decision tool found.
- IPB's MPA app ranks priority hotspots by confidence, clustering, recurrence — [IPB](https://repository.ipb.ac.id/handle/123456789/174049). Thesis-level.
- Halo Robotics markets drone mission planning — [Halo](https://halorobotics.com/?p=64040) (snippet, vendor).
- Search for Indonesian patrol-allocation studies returned none; the nearest was Canadian aerial patrol routing, cited in a policy article.

**Water-table triggers**
- Legal threshold 0.4 m in PP 57/2016, used for compliance — [KLHK](https://mail.ppkl.menlhk.go.id/website/filebox/600/190618152629Press%20Release%20SiMATAG%2018%20Juni%202019%20REV.docx) (snippet).
- KLH logic: TMAT deeper than 80 cm is very vulnerable, and if hotspots co-occur the area becomes very-high-risk. This is described as risk analysis, not a dispatch rule — [Mongabay](https://mongabay.co.id/2026/07/24/antisipasi-karhutla-saat-kemarau-panjang-jaga-gambut-tetap-basah/).
- Modelled water table depth significantly improves two-weekly fire prediction — [Scientific Reports 2023](https://www.nature.com/articles/s41598-022-27075-0.pdf) (snippet). Research, not operational.
- ProbFire probabilistic early warning for Indonesia — [record](https://ouci.dntb.gov.ua/works/45qpWVq4) (snippet). A [water-dynamics peat risk model](https://www.gjesm.net/article_707314.html) is also published (snippet).
- Fincapes siren fires on sensor thresholds — [Mongabay](https://news.mongabay.com/2026/10/early-tech-warning-hopes-to-give-sumatras-peat-community-a-head-start-on-fires/amp/). Local alarm at two sites; no task assignment described.

**Liability evidence**
- Kalista Alam court accepted NASA hotspots to show fire on company-controlled land — [Jakarta Post 2015](https://www.thejakartapost.com/news/2015/09/23/kalista-alam-case-set-precedent-combating-forest-fires.html) (snippet).
- Expert view: hotspot-concession overlap is an initial lead only; a sound analysis needs a legal concession map, acquisition times, sequential imagery, and field matching — [RM.id](https://rm.id/baca-berita/ekonomi-bisnis/327355/pakar-kebakaran-di-konsesi-bukan-bukti-perusahaan-sengaja-membakar) (snippet; note this is an article defending companies).
- Study: spatial data in criminal cases usually reaches court only as a conclusion that fire occurred, with little in-depth analysis — [Jurnal Pusaka](https://jak.lan.go.id/index.php/jurnalpusaka/article/download/66/54) (snippet).
- Experts themselves get sued: PT JJP sought Rp 610 billion from a KLHK expert; timing of field evidence was attacked — [Merdeka](https://www.merdeka.com/peristiwa/sengketa-karhutla-jjp-nilai-kesaksian-bambang-hero-banyak-kejanggalan.html) (snippet; company's side).
- Singapore issued Preventive Measure Notices to seven companies on 16 Oct 2026; a judge writing notes foreign documents do not bind Indonesian courts — [Dandapala](https://dandapala.com/opini/detail/pengujian-tanggung-jawab-korporasi-dalam-fenomena-karhutla-lintas-batas-negara) (snippet).
- Nusantara's Alerts Tracker ranks concessions by fire — [blog](https://nusantara-atlas.org/?p=2119). That is attribution-ready input, not a court-ready pack.

### Inferences
- The missing piece is a join: TMAT + danger index + hotspot + responder location + capacity, turned into one ranked task list per district or village cluster.
- Evidence packs have demand from courts, but a student team faces legal and reputational exposure if it names companies. Framing it as chain-of-custody for field verification records is safer.

### Gaps
- Internal Polri GAC or Kemenhut logic could include prioritisation. Not publicly documented.
- No Mahkamah Agung decision was read directly.

## 7. What is NOT being done by anyone in Indonesia today?

### Takeaway
Based on public evidence, no one runs a shared hotspot-to-outcome loop, and no one converts water-table readings into assigned village-level tasks. These are claims of "not found in public evidence": internal Kemenhut, Polri and concession systems could not be inspected.

### Cited Findings
Each row is an absence claim, supported by what the nearest existing systems do.

| # | Not found anywhere public | Nearest existing thing | Evidence | Confidence |
|---|---|---|---|---|
| 1 | **Per-hotspot closed loop visible across agencies:** hotspot → assigned responder → groundcheck result (confirmed, false, unvisited) → back to a shared record | SIPP/Patroli app records patrols and has a ground-check module, but is for state patrols ([IPB](https://repository.ipb.ac.id/jspui/handle/123456789/170880), snippet). Polri publishes only totals ([Investortrust](https://investortrust.id/national/113884/karhutla-landa-64341-hektare-polri-siagakan-71676-personel)). RSPO relies on members ([The Star](https://www.thestar.com.my/news/nation/2026/09/09/satellite-hotspots-flagged)) | Strong on absence of public layer; internal linkage unknown | Medium-high |
| 2 | **Water-table-triggered action assigned to a named local actor** | KLH risk logic ([Mongabay](https://mongabay.co.id/2026/07/24/antisipasi-karhutla-saat-kemarau-panjang-jaga-gambut-tetap-basah/)), Fincapes siren at 2 sites ([Mongabay](https://news.mongabay.com/2026/10/early-tech-warning-hopes-to-give-sumatras-peat-community-a-head-start-on-fires/amp/)), SIPALAGA readings, Smart Patrol TMAT logging ([Kompas](https://lestari.kompas.com/read/2025/10/30/190300386/di-balik-sunyi-rawa-gambut-ketapang--perjuangan-warga-menantang-api-karhutla), snippet) | Corporate plantations may do this internally; unknown | Medium |
| 3 | **Estimating risk in TMAT blank-spot villages** (most peat villages in 4 provinces have no monitoring) | Research models ([Sci Rep](https://www.nature.com/articles/s41598-022-27075-0.pdf), snippet); blank-spot counts ([Mongabay](https://mongabay.co.id/2026/07/24/antisipasi-karhutla-saat-kemarau-panjang-jaga-gambut-tetap-basah/)) | No operational village product found | Medium |
| 4 | **Patrol and resource allocation under scarcity** (which village first, given few pumps and patrols) | Songket routing ([Medcom](https://www.medcom.id/nasional/daerah/GNG1B4Ak-aplikasi-songket-mudahkan-penanganan-karhutla-di-sumsel)); IPB ranking ([IPB](https://repository.ipb.ac.id/handle/123456789/174049)) | Ranking and routing exist; allocation does not appear | Medium |
| 5 | **Standardised evidence pack** with timestamps, sequential imagery, legal boundary and field verification | Requirements stated by experts ([RM.id](https://rm.id/baca-berita/ekonomi-bisnis/327355/pakar-kebakaran-di-konsesi-bukan-bukti-perusahaan-sengaja-membakar), snippet); Halo "audit-ready" drone reports ([Halo](https://halorobotics.com/?p=64040), snippet, vendor) | No public or NGO tool found | Medium |
| 6 | **Citizen fire report → formal agency hand-off with status back to the reporter, nationally** | PetaBencana has reports without a described hand-off ([GNFI](https://www.goodnewsfromindonesia.id/indonesiana/alam-lingkungan/108-kota-terdampak-karhutla-laporan-warga-bantu-ungkap-kondisi-yang-tak-tertangkap-satelit)); Songket and Bekantan do it regionally | PetaBencana's internal practice not read | Medium-low |
| 7 | **Published measurement of real response time** (detection to arrival) | Only a 1-2 h Polri target ([Investortrust](https://investortrust.id/national/113884/karhutla-landa-64341-hektare-polri-siagakan-71676-personel)) | Could be internal | Medium |

**Do not build (already covered):** hotspot maps (Section 1); burned-area mapping ([MapBiomas](https://fire.mapbiomas.id/), [Nusantara](https://nusantara-atlas.org/?p=2119)); fire-weather index ([SPARTAN](https://spartan.bmkg.go.id/), [GWIS](https://gwis.jrc.ec.europa.eu/)); bare hotspot-to-SMS/WhatsApp alerts ([FireAlert](https://www.plant-for-the-planet.org/?p=36879)); commodity sensor prototypes (Section 4); carbon or restoration commitment trackers ([Pantau Gambut](https://pantaugambut.id/)).

### Inferences
- The strongest hackathon shape is **gaps 1 + 2 + 4 combined, scoped small**: a WhatsApp-first groundcheck and task loop for one village cluster that ranks tomorrow's patrols from public data (hotspot, danger index, available TMAT) and records outcomes. It reuses every saturated layer as input rather than rebuilding it.
- Gap 3 is the most technically differentiated but needs validation data a student team may not have.
- Gap 5 should be a secondary output of gap 1: each verified visit becomes a timestamped record. A standalone legal product is risky.
- Adoption is the main risk, not the code. An institutional owner (one Daops, BPBD, or NGO) should be named before the demo, given the Haze Gazer outcome.

### Gaps
- All absence claims rest on public web evidence. Interview Manggala Agni, one BPBD, one MPA and one Polres to confirm that gaps 1, 2 and 4 are real and how the work is done today.
- Check whether SIPP Karhutla's web module already assigns tasks or feeds SiPongi; this could shrink gap 1.
- Check whether SIPALAGA or KLH sends any threshold notifications; this could shrink gap 2.
- Access terms for TMAT, SPARTAN grids and SIPP data are unverified, and they decide feasibility.
