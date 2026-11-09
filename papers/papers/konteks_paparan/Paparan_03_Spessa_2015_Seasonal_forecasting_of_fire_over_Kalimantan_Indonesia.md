# Verbatim PDF Transcript

- Source PDF: `Paparan_03_Spessa_2015_Seasonal_forecasting_of_fire_over_Kalimantan_Indonesia.pdf`
- Original upload filename: `Paparan_03_Spessa_2015_Seasonal_forecasting_of_fire_over_Kalimantan_Indonesia.pdf`
- Source PDF SHA-256: `a9e49a294ce02526e8c6c9be3beda0697e08f1d5e6855bf45ffc80ae02d8a752`
- Extraction method: `pdftotext -layout`
- Pages: 14

This file preserves native PDF text with page boundaries. Tesseract OCR supplements pages where the native text layer is empty or corrupted.

## Page 1

```text
Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015
www.nat-hazards-earth-syst-sci.net/15/429/2015/
doi:10.5194/nhess-15-429-2015
© Author(s) 2015. CC Attribution 3.0 License.




Seasonal forecasting of fire over Kalimantan, Indonesia
A. C. Spessa1,10 , R. D. Field2,3 , F. Pappenberger4,5,6 , A. Langner7 , S. Englhart8 , U. Weber9 , T. Stockdale4 ,
F. Siegert8,13 , J. W. Kaiser4,10,11 , and J. Moore12
1 Department Environment, Earth & Ecosystems, Open University, Milton Keynes, UK
2 Department Applied Physics & Applied Mathematics, Columbia University, New York, USA
3 NASA Goddard Institute for Space Studies, New York, USA
4 European Centre for Medium-Range Weather Forecasts, Reading, UK
5 School of Geographical Sciences, University of Bristol, Bristol, UK
6 College of Hydrology and Water Resources, Hohai University, Nanjing, China
7 Forest Resources & Climate Unit, Institute for Environment & Sustainability, EC-Joint Research Centre, Ispra, Italy
8 Remote Sensing Solutions GmbH, Munich, Germany
9 Department Biogeochemical Integration, Max Planck Institute for Biogeochemistry, Jena, Germany
10 Department Atmospheric Chemistry, Max Planck Institute for Chemistry, Mainz, Germany
11 Department of Geography, King’s College London, London, UK
12 College of Engineering, Mathematics & Physical Sciences, Exeter University, Exeter, UK
13 GeoBio Center, Ludwigs-Maximilians-University, Munich, Germany


Correspondence to: A. C. Spessa (allan.spessa@open.ac.uk)

Received: 22 July 2014 – Published in Nat. Hazards Earth Syst. Sci. Discuss.: 6 August 2014
Revised: 10 January 2015 – Accepted: 24 January 2015 – Published: 6 March 2015


Abstract. Large-scale fires occur frequently across Indone-        by El Niño years which show a consistent positive bias.
sia, particularly in the southern region of Kalimantan and         Overall, our findings point to a high potential for using a
eastern Sumatra. They have considerable impacts on carbon          more physical-based method for predicting fires with sev-
emissions, haze production, biodiversity, health, and eco-         eral months lead time in the tropics rather than one based on
nomic activities.                                                  indexes only. We argue that seasonal precipitation forecasts
   In this study, we demonstrate that severe fire and haze         should be central to Indonesia’s evolving fire management
events in Indonesia can generally be predicted months in           policy.
advance using predictions of seasonal rainfall from the
ECMWF System 4 coupled ocean–atmosphere model. Based
on analyses of long, up-to-date series observations on burnt
area, rainfall, and tree cover, we demonstrate that fire activ-    1    Introduction
ity is negatively correlated with rainfall and is positively as-
sociated with deforestation in Indonesia. There is a contrast      The rainforests of equatorial Southeast (SE) Asia comprise
between the southern region of Kalimantan (high fire activ-        some of the largest, oldest, most biodiverse forests on the
ity, high tree cover loss, and strong non-linear correlation be-   planet (Page et al., 2011). Indonesian forests and peatlands
tween observed rainfall and fire) and the central region of        are globally one of the largest reservoirs of terrestrial organic
Kalimantan (low fire activity, low tree cover loss, and weak,      carbon, with an estimated 14 Gt of above-ground carbon in
non-linear correlation between observed rainfall and fire).        forests (Saatchi et al., 2011) and around 60 Gt of carbon in
   The ECMWF seasonal forecast provides skilled forecasts          the below-ground biomass of peatlands (Page et al., 2011).
of burnt and fire-affected area with several months lead time      While fires in Indonesia have occurred throughout palaeo-
explaining at least 70 % of the variance between rainfall and      history, their frequency before the 1960s was comparatively
burnt and fire-affected area. Results are strongly influenced      rare, coinciding with exceptional but relatively infrequent
                                                                   droughts mostly associated with strong El Niño events (Field


Published by Copernicus Publications on behalf of the European Geosciences Union.
```

## Page 2

```text
430                                             A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia

et al., 2009). The El Niño Southern Oscillation (ENSO) is         the southern region of Kalimantan and subsequent peat recla-
the major driver of rainfall variability in the equatorial Pa-    mation projects in that region (Langner et al., 2007; Langner
cific region, and occurs irregularly on a 2–7 year intervals      and Siegert, 2009; Hoscilo et al., 2011; Miettinen et al., 2011;
lasting about one year but with varying strengths (Aldrian        Page et al., 2011; Hooijer et al., 2012).
and Dwi Susanto, 2003; Dobles-Reyes et al., 2013). Dur-              A clear negative correlation between fire activity and an-
ing the warm ENSO phase (El Niño) sea surface tempera-            tecedent rainfall in Indonesia has been established based on
tures (SSTs) in the western Pacific tend to be cooler than        earth observation (EO) fire activity data (Field and Shen,
normal, leading to below-normal dry-season rainfall and ex-       2008; van der Werf et al., 2008) or proxies of fire activ-
tended dry-season length, which increase the risk of mainly       ity such as aerosols (Sudiana et al., 2003), haze (Field et
degraded forest areas becoming dry enough to burn (Siegert        al., 2004; Wang et al., 2004; Field et al., 2009), and mid-
et al., 2001). Large-scale rainfall patterns in the region are    tropospheric CO (Nasser et al., 2009). Several studies have
also affected by other major weather systems such as the In-      demonstrated a clear positive correlation between the fire ac-
dian Ocean Dipole (IOD) and the Madden Julian Oscillation         tivity and various indexes of El Niño strength (Fuller and
(MJO), but their interactions with ENSO are highly complex        Murphy, 2006; Reid et al., 2012; Wooster et al., 2012). Reid
(Field et al., 2009; Reid et al., 2012; Dobles-Reyes et al.,      et al. (2012) also discussed the various possible contribu-
2013). Furthermore, land rainfall in the maritime continent       tions of the ENSO, IOD, and MJO to fire occurrence over
is also affected by a complex of biophysical effects including    western Indonesia during 2000–2010, concluding that, while
land–sea distribution, orography, land cover, and local SSTs      ENSO is the largest factor influencing fire occurrence, the
(Aldrian and Dwi Susanto, 2003).                                  ENSO Modoki (modified ENSO) and the IOD are also im-
   Since the early 1960s, however, large-scale fires and re-      portant. Due to the strong influence of ENSO on rainfall pat-
lated widespread emissions episodes have occurred more fre-       terns across Indonesia, Wooster et al. (2012) demonstrated
quently across Indonesia, particularly in the southern region     that statistical forecasting of the extent and magnitude of fire
of Kalimantan and eastern Sumatra (Field and Shen, 2008;          activity a few months in advance based on ENSO indexes is
Field et al., 2009; Schultz et al., 2008). These episodes are     possible. Chen et al. (2011) developed an empirical model to
nearly always associated with El Niño events; for exam-           forecast regional fire-season severity with lead times of 3 to
ple, emissions from biomass burning in Kalimantan were            5 months in Amazonia based on a composite index derived
as much as 30 times greater during 2006, an El Niño year,         from the Oceanic Niño Index and the Atlantic Multi-decadal
than during 2000, a wet La Niña year (van der Werf et al.,        Oscillation index.
2008). Furthermore, the destructive fires in Indonesia during        Recent advances in seasonal climate forecasting based on
the exceptionally strong El Niño in late 1997 and early 1998      the use of state-of-the-art dynamical models that couple at-
rank as some of the largest peak emissions events in recorded     mosphere, ocean, and land processes and assimilate a vast
history. Past studies estimate about 1 Gt of carbon was re-       range of climate-related EO measurements (e.g. sea surface
leased to the atmosphere from the Indonesian fires in 1997,       temperatures) (Doblas-Reyes et al., 2013) opens up the pos-
which were mostly concentrated in carbon-rich forested peat-      sibility of forming a more physical-based method for predict-
lands of the southern region of Kalimantan. This amount was       ing fires with several months lead time in the tropics, rather
equivalent to over 10 % of the average global annual fossil       than one based on indexes only. The purpose of this study is
fuel emissions released during the 1990s (Page et al., 2002;      to determine whether severe fire and haze events in Indonesia
Schultz et al., 2008; van der Werf et al., 2010).                 can be predicted in advance using one such system, the Eu-
   Over the past couple of decades, Indonesia has experi-         ropean Centre for Medium Weather Forecasting (ECMWF)
enced some of the world’s highest rates of deforestation and      seasonal forecast system (System 4) (Molteni et al., 2011).
forest degradation, principally due to fire (Langner et al.,         Ensemble seasonal climate forecasts issued with several
2007; Langner and Siegert, 2009; Hoscilo et al., 2011; Mi-        months lead time is a well-established field, and these fore-
ettinen et al., 2011; Page et al., 2011; Hooijer et al., 2012).   casts have been applied broadly, including to manage and as-
The general consensus is that the relatively low fire frequency   sess risks in agricultural production (Hansen et al., 2011),
prior to the 1960s in Indonesia and the relatively higher fire    malaria outbreaks (Jones and Morse, 2010), heatwaves (Lass
frequency post-1960s are due not to any significant step-up in    et al., 2013), flooding, and droughts (Pappenberger et al.,
drought frequency per se but rather to an increase in human-      2011, 2013). Comparatively less work has been done on sea-
caused ignitions associated with expansion of agriculture,        sonal forecasting of fires, however. The USA has a long-
palm and pulp paper plantations, industrial deforestation, and    standing seasonal fire-danger prediction system (Roads et al.,
peat forest reclamation. Land use activities such as these        2005, 2010), which is based on the National Center for En-
make extensive use of fire to clear forest, especially during     vironmental Prediction’s Coupled Forecast System (NCEP-
droughts where the impact of fire is maximised. The activi-       CFS) (Saha et al., 2006, 2014). The latest version of the
ties generally started in Indonesia during the 1960s and inten-   NCEP-CFS generates global and regional spectral model en-
sified greatly in the early 1990s, as exemplified by the trans-   semble forecasts over a 3–7-month period, which in turn pro-
migrasi projects including the ill-fated Mega Rice project in     vides required input meteorological variables for calculating


Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015                           www.nat-hazards-earth-syst-sci.net/15/429/2015/
```

## Page 3

```text
A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia                                                  431

fire-danger indexes based on the National Fire Danger Rating       and Dwi Susanto (2003) as having, on the average, a June to
System (Cohen and Deeming, 1985; Burgan, 1988). Roads et           November dry season. Preliminary analyses of available data
al. (2010) demonstrated the seasonal forecasts of fire-danger      on burnt area data and fire-affected area (see below) revealed
indexes driven by NCEP-CFS outputs had skill in predicting         that over 95 % of fires occurred during this period.
fire activity across western USA. The European Forest Fire            During our study period, 1997–2010, El Niño events
Information System (McInerney et al., 2013) currently pro-         were registered in 1997–1998, 2002, 2004, 2006, and 2009
vides temperature and rainfall anomalies that are expected to      (http://www.cpc.noaa.gov/products/analysis_monitoring/
exist over European and Mediterranean areas during the next        ensostuff/ensoyears.shtml). However, drought and associ-
2 months based on the multi-member ECMWF System 4 sea-             ated fires during the 1998 phase of the 1997–1998 El Niño
sonal forecast system. Areas that are drier and hotter than        event were concentrated in east Kalimantan (Siegert et al.,
normal indicate higher forest-fire danger (http://forest.jrc.ec.   2001; Field et al., 2004), which does not display as clearly
europa.eu/effis/applications/long-term-forecast/).                 defined wet and dry seasons (Aldrian and Dwi Susanto,
   Since no equivalent seasonal fire forecasting system ex-        2003). Analyses of the Global Precipitation Climatology
ists for Indonesia, we were motivated to develop and test          Project (GPCP) rainfall data (see below) confirmed 1998
one for the severely fire-affected region of southern Kaliman-     as a non-drought year for the southern-central region of
tan as a case study, based on 7-month forecasts of monthly         Kalimantan. For the purposes of this paper, therefore, we
rainfall from the ECMWF System 4 for the period 1997–              regard 1997, 2002, 2004, 2006, and 2009 as El Niño years,
2010. The case study was identified from a comparison of           but not 1998.
observed burnt area and tree cover patterns across a broader
region of southern-central Kalimantan, which generally ex-         2.2   Fire data
hibits a June–November dry season (Aldrian and Dwi Su-
santo, 2003). We evaluated the skill of the seasonal rainfall      To increase the robustness of our analyses of burnt area
forecasts against observed rainfall and in predicting observed     and fire-affected area in relation to rainfall and forest cover
burnt area and fire-affected area. We further assessed forecast    change, we used two independent monthly satellite-based fire
skill by analysing observed burnt area and fire-affected area      data sets spanning 1997–2010, aggregated to 0.5◦ grid cells.
in relation to observed rainfall. Several previous studies have    Some fires may miss being counted by remote sensing be-
focused on the highly non-linear nature of precipitation and       cause they may be too small or start and finish outside the
fire occurrence in the region; severe fire happens only be-        satellite overpass. We used satellite data because they re-
low a threshold of seasonal precipitation (Field et al., 2004,     main the best source of fire data in regions such as Kaliman-
2009; van der Werf et al., 2008; Field and Shen, 2008). It         tan, where consistent, verifiable ground-based fire data are
is only during years with a sufficiently strong precipitation      not available. The first data set is from the Global Fire and
deficit that disturbed peatlands can dry to the point of ig-       Emissions Database version 4 (GFED4) (Giglio et al., 2013),
nition and burn. In a practical sense, therefore, seasonal fire    and the second is from the Remote Sensing Solutions (RSS)
forecasting entails determining whether this threshold will be     GmbH (after Langner and Siegert, 2009, with unpublished
crossed during the upcoming dry season.                            updates from RSS GmbH).
                                                                      The GFED4 burnt area is available at a monthly time
                                                                   step at 0.25◦ resolution and is based on active fire detec-
2     Methods                                                      tion from European Remote Sensing Satellite Along-Track
                                                                   Scanning Radiometer (ATSR) World Fire Atlas, Tropical
In order to understand and assess seasonal forecast skill, our     Rainfall Measuring Mission Visible and Infrared Scanner
analyses proceeded in two stages. We first determined the          (VIRS), and the Moderate Resolution Imaging Spectrora-
strength of precipitation–fire relationships over the region       diometer (MODIS) burnt area product (MCD64A1) (Giglio
of southern-central Kalimantan for our 1997–2010 analysis          et al., 2013). For the MODIS era (2000 to present), the
period, knowing a priori that these relationships have been        GFED4 monthly burnt area data set was derived exclusively
identified in other and earlier versions of the data used. We      from the 500 m MCD64A1 burnt area product (Giglio et
then evaluated the forecast skill of System 4, focusing on the     al., 2013). For the pre-MODIS era, burnt area was derived
degree to which the model could separate the precipitation         from calibrating monthly active fire counts from the VIRS
associated with normal and severe fire years.                      and ATSR sensors to monthly burnt area supplied by the
                                                                   MCD64A1 product which was modified according to Giglio
2.1    Study area and study periods                                et al. (2010).
                                                                      RSS fire-affected area data are only available for Borneo
Borneo is divided among three countries: Indonesia,                and are based on active fire detections derived from National
Malaysia, and Brunei (Fig. 1). The broader region of               Oceanic and Atmospheric Administration (NOAA) Ad-
southern-central Kalimantan (Indonesia) (Fig. 1) matches ap-       vanced Very High Resolution Radiometer (AVHRR), ATSR,
proximately the only region of Borneo identified by Aldrian        and MODIS imagery (Langner and Siegert, 2009). Fires be-


www.nat-hazards-earth-syst-sci.net/15/429/2015/                             Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015
```

## Page 4

```text
432                                                 A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia


                          a)                                                   b)




       c)                                         d)                                          e)




Figure 1. The island of Borneo showing burnt and fire-affected area (top) and tree cover patterns (bottom) across the southern-central region
of Kalimantan: (a) total GFED4 burnt area, (b) total RSS fire-affected area, (c) mean 1993 tree cover, (d) mean 1997 tree cover, and (e) mean
2010 tree cover. Data are plotted at 0.5◦ grid-cell resolution. Number of 0.5◦ grid cells in southern Kalimantan is 53. Number of 0.5◦ grid
cells in southern Kalimantan is 40.


fore 2002 were derived from hotspots recorded by NOAA 14                 Langner and Siegert (2009) concluded that the consistency
and ATSR by adding their data sets. ATSR was used in ad-                 over the whole data set is sufficiently high when working
dition to NOAA because, especially in 1997 and 1998, sev-                with fire-affected areas instead of active fire numbers.
eral large fires were not recorded by NOAA due to opera-
tion errors at the receiving station. Fires from 2002 onwards            2.3   Forest cover data
were derived from MODIS hotspots (MOD14/MYD14). One
single hotspot pixel (sensor element) represents the area of
                                                                         Our analyses are based on three tree cover products: the
the corresponding sensor resolution of 1 km. This pixel can
                                                                         global AVHRR 1993 continuous percentage tree cover prod-
be affected by a single fire or more than one fire (Langner
                                                                         uct available at 1 km (DeFries et al., 2000) and two MODIS
and Siegert, 2009). Following the convention of Langner and
                                                                         tree cover products available for SE Asia at 500 m for the
Siegert (2009), we define the RSS data as fire-affected area
                                                                         years 2000 and 2010 (Miettinen et al., 2011).
rather than burnt area because the actual size of the burnt
area is unknown and strongly relates to the underlying land
cover type. However, taking into account the possible com-               2.4   Rainfall data
bination of very hot sub-pixel fires and larger and/or reoc-
curring fires that result in overlapping hotspot areas, which            Version 1.2 of the GPCP one-degree daily (1DD) rainfall data
are considered only once within each year, we assume that                formed the basis for comparing burnt and fire-affected areas
every hotspot pixel detected by the satellite is regarded as             in relation to observed rainfall and evaluating seasonal rain-
completely affected by fire. Even though different satellite             fall forecasts from System 4. The data set is a global product
systems with various temporal resolutions (number of over-               available at a 1◦ resolution and combines precipitation es-
passes per 24 h) have been used to derive the RSS data set,              timates from several sources, including infrared and passive


Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015                                    www.nat-hazards-earth-syst-sci.net/15/429/2015/
```

## Page 5

```text
A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia                                                     433

microwave rain estimates and rain gauge observations (Adler         range of each seasonal mean burnt area per grid cell or fire-
et al., 2003; Huffman et al., 2009).                                affected area per grid cell was calculated as ±1.96 × SEmean .
                                                                    This is similar to previous studies using seasonal (van der
2.5   ECMWF seasonal forecast system (System 4)                     Werf et al., 2008; Wooster et al., 2012) or monthly mean
                                                                    (Wang et al., 2004; Field and Shen, 2008; Field et al., 2009)
Seasonal predictions of rainfall were derived from the              estimates of fire activity or haze at an island scale.
ECMWF Seasonal forecast System (System 4), which pro-                  For the central and southern regions of Kalimantan and
vides operational seasonal predictions (Molteni et al., 2011).      each year, seasonal mean GPCP rainfall per grid cell was cal-
System 4 is the most recent ECMWF seasonal forecast                 culated by taking the average of the daily mean rainfall per
system and includes 51 member ensembles and consists                month values between June and November for each 0.5◦ grid
of 7-month forecasts initialised on the first day of every          cell, then summing these values over all grid cells, and fi-
month. The seasonal forecast has a resolution of ∼ 79 km            nally dividing by the number of grid cells. The range of each
(T255L91). It is coupled with an ocean model with a hor-            seasonal mean GPCP rainfall per grid cell was calculated as
izontal resolution of 1◦ . Singular vectors and an ensemble         ±1.96 × SEmean .
of ocean analysis, including SSTs, provide the initial per-            For the southern region of Kalimantan only and each year,
turbations. Atmospheric model uncertainties are included            seasonal mean System 4 rainfall per grid cell was calculated
through a three-time-level stochastically perturbed param-          by restricting the System 4 outputs to the middle-ranked 17
eterized tendency scheme and the stochastic back-scatter            members of the 51 member ensemble (middle tercile), then
scheme, which is similar to the ECMWF medium-range fore-            averaging over the mean daily rainfall per month values be-
casting system. The operational seasonal forecasts are ac-          tween June and November for each System 4 grid cell, then
companied by a hindcast system which covers a 30-year pe-           summing these values over all grid cells, and finally dividing
riod (from 1981 to today) where the land surface is initialised     by the number of grid cells. The mean of the highest-ranked
using an offline simulation driven by ERAInterim data (Dee          17 members of the 51 member System 4 ensemble (upper
et al., 2011). The hindcast usually has 15 ensemble members.        tercile) and the mean of the lowest-ranked 17 members of
Molteni et al. (2011) presented an overview of S4 model bi-         the 51 member System 4 ensemble (lower tercile) were cal-
ases and forecast performance.                                      culated similarly. The upper range for each year was defined
   We restricted our use of the ECMWF System 4 rainfall             as meanupper tercile –meanmiddle tercile , and the lower range for
forecasts to 1 May initialisations, i.e. seasonal forecasts span-   each year was defined as meanmiddle tercile –meanlower tercile .
ning 1 May to 30 November, each year from 1997 to 2010.                The following statistical analyses were undertaken:
Mean daily rainfall for each month and each ensemble mem-
ber was calculated.                                                   – correlation between seasonal mean GFED4 burnt area
                                                                        per grid cell and seasonal mean RSS fire-affected area
2.6   Data preparation and statistical analyses                         per grid cell;
                                                                      – regression of seasonal mean GFED4 burnt area per grid
We aggregated the burnt area data (GFED4), the fire-affected
                                                                        cell on seasonal mean GPCP rainfall per grid cell for the
area data (RSS), and the tree cover data (1993, 2002, and
                                                                        central and southern regions of Kalimantan;
2010) to 0.5◦ grid cells and down-scaled the GPCP data to
0.5◦ grid cells by linear interpolation.                              – regression of seasonal mean RSS fire-affected area per
   Total area burnt (GFED4) and total fire-affected area                grid cell on seasonal mean GPCP rainfall per grid cell
(RSS) were calculated for each 0.5◦ grid cell in the southern-          for the central and southern regions of Kalimantan;
central region of Kalimantan by summing the respective
monthly burnt areas between June and November, 1997–                  – regression of seasonal mean GFED4 burnt area per grid
2010. Since a 1997 tree cover product does not exist for the            cell on seasonal mean System 4 rainfall per grid cell for
study area, we derived a 1997 tree cover data set based on              the southern region of Kalimantan;
simple linear interpolation between 1993 and 2000 tree cov-
                                                                      – regression of seasonal mean RSS fire-affected area per
ers. Spatial plots of total fire-affected area (RSS) and total
                                                                        grid cell on seasonal mean System 4 rainfall per grid
area burnt (GFED4) were then visually compared to spatial
                                                                        cell for the southern region of Kalimantan; and
plots of tree cover in 1993, 1997, and 2010 at 0.5◦ resolution.
   For the central and southern regions of Kalimantan and             – correlation between seasonal mean GPCP rainfall per
each year, seasonal mean GFED4 burnt area per grid cell and             grid cell and seasonal mean System 4 rainfall per grid
seasonal mean RSS fire-affected area per grid cell were cal-            cell for the southern region of Kalimantan.
culated by firstly summing the respective monthly burnt areas
or fire-affected areas between June and November for each           Each regression analysis comprised two parts: linear regres-
0.5◦ grid cell, secondly summing these values over all grid         sion of the form Y = a + b × X and non-linear regression of
cells, and finally dividing by the number of grid cells. The        the form Y = a + b × ln(X), where Y is seasonal mean burnt


www.nat-hazards-earth-syst-sci.net/15/429/2015/                               Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015
```

## Page 6

```text
434                                                            A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia

Table 1. Summary statistics for burnt and fire-affected area and                  central region, the mean tree cover in 2010 was 8.2 % lower
tree cover in the southern and central regions of Kalimantan. Val-                than that in 1993 and 4.4 % lower than that in 1997 (Table 1).
ues shown are mean ±1.96 × SEmean . Number of grid cells in the
southern region is 53. Number of grid cells in the central region is              3.2   RSS fire-affected area vs. GFED4 burnt area
40. Grid cell resolution is 0.5◦ .
                                                                                  Seasonal mean RSS fire-affected area and seasonal mean
                                         Southern region of   Central region of
                                         Kalimantan           Kalimantan
                                                                                  GFED4 burnt area was highly correlated in the south-
                                                                                  ern region (R 2 = 0.96) and the central region (R 2 = 0.88).
    Seasonal mean GFED4 burnt            81.3 ± 15.0          3 ± 1.3
    area per grid cell (averaged
                                                                                  Through the years in which El Niño affected the central-
    over 1997–2010) (km2 )                                                        southern region (1997, 2002, 2003, 2004, 2006, and 2009),
                                                                                  seasonal mean RSS fire-affected area was consistently much
    Seasonal mean RSS fire-              146.9 ± 15.0         35.1 ± 5.7
    affected area per grid cell                                                   higher than seasonal mean GFED4 burnt area. In 1997 (pre-
    (averaged over 1997–2010)                                                     MODIS), seasonal mean RSS fire-affected area was 1.9 times
    (km2 )                                                                        higher than seasonal mean GFED4 burnt area in the south
    Mean tree cover per grid             76.0 ± 1.5           92.4 ± 0.9          and 10.2 times higher than the equivalent for GFED4 in the
    cell 1993 (%)                                                                 central region (Table 1). Averaged across the other El Niño-
    Mean tree cover per grid             68.3 ± 2.0           87.6 ± 1.4          affected years (all post-MODIS), RSS fire-affected area was
    cell 1997 (%)                                                                 1.4 times higher than seasonal mean GFED4 burnt area in the
    Mean tree cover per grid             58.1 ± 2.5           84.2 ± 1.8          south and 9.6 times higher than the equivalent for GFED4 in
    cell 2010 (%)                                                                 the central region (Table 1).
    Seasonal mean GFED4 burnt            363.1 ± 54.5         9.5 ± 4.4
    area per grid cell (1997) (km2 )                                              3.3   Burnt and fire-affected area vs. observed rainfall
    Seasonal mean RSS fire-              514.5 ± 52.8         96.5 ± 13.9
    affected area per grid cell (1997)                                            Seasonal mean burnt and fire-affected area was non-linearly
    (km2 )                                                                        and highly correlated with seasonal mean GPCP rainfall for
    Seasonal mean GFED4 burnt            155.6 ± 34.7         5.7 ± 2.8           the GFED4 data set (southern region: R 2 = 0.86; central re-
    area per grid cell (averaged                                                  gion: R 2 = 0.80; Fig. 2a, b) and for the RSS data set (south-
    over El Niño years 2002,
                                                                                  ern region: R 2 = 0.90; central region: R 2 = 0.70; Fig. 3a, b).
    2004, 2006, 2009) (km2 )
                                                                                  For the GFED4 data set, the magnitude of the slopes and the
    Seasonal mean RSS fire-              291.5 ± 31.7         54.5 ± 9.2          intercepts determining the non-linear relationships were re-
    affected area per grid cell
    (averaged over El Niño years                                                  spectively 29.8 and 27.2 times greater for the southern region
    2002, 2004, 2006, 2009) (km2 )                                                than the central region (Fig. 2a, b). For the RSS data set, the
                                                                                  magnitude of the slopes and the intercepts determining the
                                                                                  non-linear relationships were respectively 5.2 and 4.6 times
                                                                                  greater for the southern than in the central region (Fig. 3a, b).
area per grid cell (GFED4) or seasonal mean fire-affected
                                                                                  For the southern region, we diagnosed a clear rainfall thresh-
area per grid cell (RSS), X is seasonal mean daily rainfall
                                                                                  old approximately equal to 6 mm, above which fire activity
per grid cell (GPCP or System 4), and ln is the natural log
                                                                                  was almost negligible and below which it increased expo-
transformation.
                                                                                  nentially (Figs. 2b, 3b).

                                                                                  3.4   Burnt and fire-affected area vs. System 4 rainfall
3      Results
                                                                                  Focusing on the southern region, seasonal mean burnt and
3.1      Fire activity vs. tree cover change                                      fire-affected area was non-linearly and significantly corre-
                                                                                  lated with seasonal mean daily System 4 rainfall for the
Fire activity and tree cover loss were clearly both much                          RSS data set (R 2 = 0.70) (Fig. 4a) and the GFED4 data set
higher across a distinct southern region of Kalimantan (N =                       (R 2 = 0.76) (Fig. 4b). For each System 4-based relationship,
53 grid cells at 0.5◦ resolution) compared with a central re-                     the year 2006 was an obvious outlier. Both System 4-based
gion of Kalimantan immediately above it (N = 40 grid cells                        analyses revealed a similar rainfall threshold approximately
at 0.5◦ resolution) (Fig. 1). Seasonal mean GFED4 area burnt                      equal to 7 mm, but this is less clear-cut compared to the
in the south was, on the average, 27.1 times higher than in                       GPCP-based analyses (Fig. 4a, b).
the central region (Table 1); seasonal mean RSS fire-affected
area in southern region was, on the average, 4.2 times higher                     3.5   System 4 rainfall vs. observed rainfall
than in the central region (Table 1). In the southern region,
the mean tree cover in 2010 was 17.9 % lower than that in                         Seasonal mean System 4 rainfall and seasonal mean GPCP
1993 and 10.2 % lower than that in 1997 (Table 1). In the                         rainfall were highly correlated (R 2 = 0.91), and for each year


Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015                                           www.nat-hazards-earth-syst-sci.net/15/429/2015/
```

## Page 7

```text
A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia                                                       435




Figure 2. (a) Southern region of Kalimantan: seasonal mean GFED4 burnt area per grid cell as a function of seasonal mean GPCP rainfall
per grid cell; and (b) central region of Kalimantan: seasonal mean monthly GFED4 burnt area per grid cell as a function of seasonal mean
GPCP rainfall per grid cell. The edges of the whiskers refer to the 5th and 95th percentiles (±1.96 × SEmean ).


their respective values overlapped (Fig. 5). Seasonal mean            4     Discussion
System 4 rainfall was higher than seasonal mean GPCP rain-
fall during each El Niño-affected year: 1997 (+0.19 mm),              4.1    Observed fire, rainfall, tree cover patterns
2002 (+1.46 mm), 2004 (+0.52 mm), 2006 (+2.2 mm), and
2009 (+0.88 mm) (Fig. 5).                                             Based on analyses of a comparatively up-to-date and long
                                                                      series observations on burnt and fire-affected area and rain-
3.6   System 4 predicted vs. observed SSTs                            fall (14 years from 1997 to 2010) and tree cover (1993, 1997,
                                                                      2000, and 2010), our work supports a large body of work that
Further analyses of the 15 member ensemble System 4 hind-             demonstrates that, for different tropical regions, fire activity
casts from 1997 to 2010 demonstrated that while most mem-             is negatively correlated with rainfall and positively associ-
bers correctly predicted observed SSTs, 2006 was particu-             ated with deforestation in Indonesia (Langner et al., 2007;
larly anomalous (Fig. 6). Only 2 out of 15 members predicted          van der Werf et al., 2008; Langner and Siegert, 2009; Field
the SST cooling in this year. By contrast, in 1997, when the          et al., 2009), Amazonia (Aragao et al., 2008), and Columbia
strongest cooling was observed, 13 out of 15 members pre-             (Armenteras-Pascual et al., 2011). Our results highlight the
dicted a strong cooling (Fig. 6).                                     stark contrast between the southern region of Kalimantan
                                                                      (high fire activity, high tree cover loss, and strong non-linear
                                                                      correlation between rainfall and fire) and the central region
                                                                      of Kalimantan (low fire activity, low tree cover loss, and
                                                                      weak non-linear correlation between rainfall and fire). The
                                                                      amount of forest cover loss between 1997 and 2010 that we


www.nat-hazards-earth-syst-sci.net/15/429/2015/                                 Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015
```

## Page 8

```text
436                                                A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia




Figure 3. (a) Southern Kalimantan: seasonal mean RSS fire-affected area (FAA) per grid cell as a function of seasonal mean GPCP rainfall
per grid cell; (b) central Kalimantan: seasonal mean RSS FAA per grid cell as a function of seasonal mean GPCP rainfall per grid cell. The
edges of the whiskers refer to the 5th and 95th percentiles (±1.96 × SEmean ).


estimated is likely to be conservative. Forest cover immedi-           merous studies have reported the widespread deliberate use
ately prior to the major El Niño-induced fires of 1997 prob-           of fire in the southern region of Kalimantan to clear forests
ably matches more closely forest cover in 1993 than that               to establish plantations (mainly rice, oil palm, and acacia),
based on a simple linear interpolation between forest cover            as well as the widespread incidence of escaped fires associ-
in 1993 and 2002. Although fire data covering the 1993 to              ated with these activities and with logging (Langner et al.,
1997 period are not available, no major El Niño events oc-             2007; van der Werf et al., 2008; Langner and Siegert, 2009).
curred during this period, except for a relatively minor event         Furthermore, extensive areas of peatland have been drained
in 1994–1995 (http://www.cpc.noaa.gov/products/analysis_               for plantation establishment, which has led to an increase in
monitoring/ensostuff/ensoyears.shtml). Our finding of strong           fire activity in these areas because drained peats lower the
non-linear relationships between fire and rainfall for south-          water table, exposing a greater depth of dry peat to burning
ern Kalimantan confirms similar relationships reported for             (Page et al., 2011; Hooijer et al., 2012). By contrast, the cen-
the region (van der Werf et al., 2008; Field et al., 2009). The        tral region of Kalimantan has undergone comparatively lit-
exponential increase in fire activity in southern Kalimantan           tle development to date (Langner et al., 2007; Langner and
below a moisture threshold of around 6 mm per day supports             Siegert, 2009; Margono et al., 2014). The central region has
the finding of a similar fire moisture threshold for the region        steep slope sections which reduce the ease of forest exploita-
(Field et al., 2009).                                                  tion and clearing compared to the relatively flatter terrain of
   Our results support the general consensus that while fire           the southern region (Langner and Siegert, 2009). Due to its
activity is strongly linked to drought in Kalimantan, the              highly uneven topography, the central region also contains
strength of this relationship is mediated by land use and land         relatively less peat (Page et al., 2011; Hooijer et al., 2012).
cover change and the presence of disturbed peatlands. Nu-


Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015                                 www.nat-hazards-earth-syst-sci.net/15/429/2015/
```

## Page 9

```text
A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia                                                           437




Figure 4. Southern Kalimantan: (a) seasonal mean GFED4 burnt area per grid cell as a function of seasonal mean System 4 rainfall per
grid cell; (b) seasonal mean RSS fire-affected area (FAA) per grid cell as a function of seasonal mean System 4 mean rainfall per grid cell.
Number of System 4 grid cells in southern Kalimantan is 23. The edges of the burnt and fire-affected area whiskers refer to the 5th and 95th
percentiles respectively (±1.96 × SEmean ). The upper edge of the System 4 whiskers is meanupper tercile –meanmiddle tercile , and the lower
edge of the System 4 whiskers is meanmiddle tercile –meanlower tercile (refer to data preparation in Methods).


4.2   Seasonal forecasting of fire                                      tant factors potentially affecting the robustness of predicting
                                                                        burnt area as a simple function of modelled rainfall. These
Based on two independent burnt and fire-affected area data              factors are (i) a positive rainfall bias in the System 4 model,
sets, we demonstrated that seasonal forecasts of rainfall from          (ii) biases in the burnt area and fire-affected area data sets
the ECMWF System 4 can predict fire activity during the                 used to construct these relationships, and (iii) the influence
June–November dry season in the southern region of Kali-                of land use and land cover change, as well as peat drainage,
mantan. The empirical fits between System 4 rainfall and                on rainfall vs. fire relationships for the southern region of
fire activity were highly non-linear, similar to those based on         Kalimantan.
observed rainfall. The correlations between System 4 rain-
fall and fire activity, while not as good as those between ob-          4.3    Rainfall bias in seasonal forecast
served rainfall and fire activity, were nonetheless significant
(RSS fire-affected area data set: R 2 = 0.70; GFED4 burnt               Although ECMWF and observed rainfall were well corre-
area data set: R 2 = 0.76). These significant relationships be-         lated (R 2 = 0.91), ECMWF rainfall was consistently higher
tween System 4 rainfall and burnt area and between System 4             during the El Niño-affected years of 1997, 2002, 2004, 2006,
rainfall and fire-affected area demonstrate a prospective use           and 2009, i.e. years with high fire activity. Furthermore,
of System 4 rainfall to predict seasonal fire activity as part          this bias was not consistent across these drought years. The
of a region-wide fire management programme for the south-               smallest positive bias occurred during the strong 1997 El
ern region of Kalimantan. Further development of any such               Niño year of 1997 (+0.19 mm), and the greatest positive
programme would need to consider, however, three impor-                 bias occurred during the moderate El Niño year of 2006


www.nat-hazards-earth-syst-sci.net/15/429/2015/                                    Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015
```

## Page 10

```text
438                                                   A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia




Figure 5. Southern Kalimantan: seasonal mean GPCP rainfall per grid cell vs. seasonal mean System 4 rainfall per grid cell. The edges
of the GPCP whiskers refer to the 5th and 95th percentiles (±1.96 × SEmean ). The upper edge of the System 4 data point whiskers is
meanupper tercile –meanmiddle tercile , and the lower edge of the System 4 whiskers is meanmiddle tercile –meanlower tercile (refer to data prepa-
ration in Methods).




                                                                         year

Figure 6. System 4 SST anomalies vs. observed SST anomalies over the Indian ocean (0◦ –10◦ S, 90◦ –110◦ E), 1997–2010. In this figure
the variance has been corrected to match the variance of the observations. The observed anomalies are derived from ERA Interim and the
forecasts shown are based on the S4 hindcast system with 15 ensemble members.


(+2.2 mm). The latter was clearly an outlier that reduced                     Seasonal predictability in the maritime continent is to a
the goodness-of-fit of the empirical relationships between                 large extent due to the ENSO and the changes in SSTs asso-
ECMWF rainfall and fire activity. Although the estimated                   ciated with these oscillations (van Oldenborgh et al., 2005;
moisture threshold diagnosed from the ECMWF rainfall vs.                   Lavers et al., 2009; Dobles-Reyes et al., 2013). In general,
fire relationships (7 mm) was similar to that estimated from               cooler SSTs indicate below-average rainfall, and warmer
the GPCP rainfall vs. fire relationships (6 mm), it not as clear           SSTs indicate above-average rainfall. Our analyses of SSTs
cut because of the 2006 outlier.                                           from multi-member System 4 hindcasts covering our study
                                                                           region clearly showed that while most members correctly


Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015                                      www.nat-hazards-earth-syst-sci.net/15/429/2015/
```

## Page 11

```text
A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia                                                  439

predicted observed SSTs, the worst result was in 2006, for        AVHRR generally detects a much higher number of active
which only 13 % of members predicted the SST cooling. The         fire events than ATSR (Langner and Siegert, 2009), which
best was in 1997, for which close to 90 % predicted the SST       most likely explains the higher burnt area recorded by the
cooling, corresponding with our observation that the smallest     RSS data set compared to the GFED4 data set in 1997. The
difference in System 4 and GPCP rainfall during any drought       AVHRR sensor records data in Borneo twice a day but is sat-
year was in 1997. Whether the relatively poor prediction in       urated at low temperatures and sun glint, leading frequently
2006 is a consequence of model error, or is simply due to         to false alarms. While the spatial accuracy of the ATSR sen-
the event having low predictability, is not known. Some vari-     sor is high and there are few false alarms due to night-time
ations in SST and rainfall will always be unpredictable, but      acquisition, it displays a high rate of omission because fire
we do know that model error has the potential to play a role.     activity often peaks in the afternoon and the revisit cycle is
   Molteni et al. (2011) reported a positive rainfall bias in     only every 3 days.
Indonesia for System 4. They suggested this was consistent
with too-strong easterly trade winds simulated by the Sys-        4.5    Influence of land use and land cover change and
tem 4 atmospheric model in the central and western Pacific,              peat drainage
which act to reduce the movement of the western warm pool
towards the east Pacific during El Niño onset, hence main-        The southern region of Kalimantan has undergone extensive
taining warmer-than-expected SSTs in the model for Indone-        drainage of peatlands and widespread fire-induced loss of
sia. The impact of this bias on the specific 2006 forecast is     pristine forests due to logging activities and plantation es-
not known, but it suggests that more work is needed to im-        tablishment, as discussed above. This has created large tracts
prove the feedback between SSTs and climate in System 4,          of forest that are highly degraded and fragmented (Siegert
with direct benefits for seasonal forecasting of fires in the     et al., 2001; Langer et al., 2007; Langner and Siegert, 2009;
region.                                                           Hoscilo et al., 2011). Future increases in the extent of de-
                                                                  graded forests and drained peats will likely modify seasonal
4.4   Biases in the burnt area and fire-affected area             rainfall–burnt area relationships. Degraded forests respond
      products                                                    more rapidly to rainfall deficits than undisturbed forests due
                                                                  to increased solar radiation reaching the surface and hence
Although the RSS fire-affected area and GFED4 burnt area          higher evaporation rates; they provide a relatively greater
data yielded similar patterns (southern region of Kalimantan      source of flammable fuels for burning, such as invasive
burning much more than the central region, non-linear rela-       grasses and ferns as well as debris from logging and land
tionships between observed rainfall and fire activity and be-     clearing operations (Siegert et al., 2001; Langer et al., 2007;
tween System 4 rainfall and fire activity), RSS fire-affected     Langner and Siegert, 2009; Hoscilo et al., 2011). The mois-
area was consistently higher than GFED4 burnt area. Dur-          ture content of peats is controlled by the water table, and as
ing the MODIS era (2000 onwards), GFED4 is based on               previously discussed, the lower water table of drained peats
500 m MODIS burnt area product (MDC64A1) (Giglio et al.,          means more dry peat available for burning than undisturbed
2013), and RSS is based on 1 km2 MODIS active fire prod-          peats (Field and Shen, 2008; Page et al., 2011; Hooijer et
uct (MOD14/MYD14; 2002 onwards) (Langner and Siegert,             al., 2012). An increase in the availability of drier fuels from
2009). Previous work has shown that the MODIS burnt area          degraded forests and drained peats would therefore poten-
product tends to underestimate fire activity in the tropics be-   tially increase the amount of burning beyond that forecasted
cause a 16-day cloud-free mosaic is necessary to map the          by seasonal rainfall alone. This could be manifested as an
burnt areas (Roy et al., 2008). By contrast, the RSS data,        increase in the rate of change in burnt area with respect to
which are based on active fire detections (hotspots), can lead    a unit decrease in rainfall and/or a higher rainfall threshold
to an overestimation of the actual burnt area, as a single        controlling fire activity.
sensor element can even be saturated by a small-scale (sub-
pixel) fire of high temperature. On the other hand, areas of
overlapping hotspots are only counted once per year, leading      5     Conclusions
to an underestimation of the burnt area. In general, the ac-
tual burnt area is difficult to predict and much depends on       While operational seasonal fire prediction over Indonesia
year, season, and vegetation type (Miettinen et al., 2007).       will have to incorporate the above factors, we have demon-
Due to these reasons, Langner and Siegert (2009) refer to         strated, for the first time, that severe fire events (and poten-
“fire-affected” instead of “burnt” area and a comparison with     tially associated haze) are fundamentally predictable months
other burnt area products requires caution. Pre-MODIS RSS         in advance using state-of-the art seasonal rainfall forecasts.
burnt-area data are based on AVHRR 14 and ATSR hotspot            Predictions are not perfect and occasionally a year may turn
data (Langner and Siegert, 2009) and pre-MODIS GFED4              out differently to what was expected, fundamentally because
data are based on ATSR and VIRS hotspots with a further           ENSO and other factors are not perfectly predictable but also
correction (Giglio et al., 2010, 2013). For several reasons,      because of remaining model imperfections. Any operational


www.nat-hazards-earth-syst-sci.net/15/429/2015/                             Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015
```

## Page 12

```text
440                                                   A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia

forecasting system needs to take account of such uncertain-               Burgan, R. E.: Revisions to the 1978 National Fire-Danger Rating
ties, for example by use of ensemble methods. Nonetheless,                   System. USDA Forest Service, Southeastern Forest Experiment
seasonal forecasts are expected to continue to improve in                    Station, Research Paper SE-273, 1988.
the future and additional post-processing may increase the                Chen, Y., Randerson, J. T., Morton, D. C., DeFries, R. S., Collatz, G.
skill of the fire forecast (Peng et al., 2014). Given the con-               J., Kasibhatla, P. S., Giglio, L., Jin, Y., and Malier, M. E.: Fore-
                                                                             casting fire season severity in South America using sea surface
siderable effort required in mobilising prevention and pre-
                                                                             temperature anomalies, Science, 334, 787–791, 2011.
paredness measures in Indonesia, we therefore argue that                  Cohen, J. D. and Deeming, J. E.: The National Fire Danger Rating
seasonal precipitation forecasts should be central to Indone-                System: Basic Equations. USDA Forest Service Pacific South-
sia’s evolving fire-management policies. Other potential ap-                 west Forest and Range Experimental Station, General Techincal
plications of seasonal fire forecasting include improved risk                Report PSW-82, 16 pp., 1985.
assessments of biodiversity and carbon losses through fire;               Cottle, P.: Insuring Southeast Asian commercial forests: Fire risk
both are important considerations for tropical forest protec-                analysis and the potential for use of data in risk pricing and re-
tion programmes (e.g. REDD+; Barlow et al., 2012) and for-                   duction of forest fire risk, Mitigation and Adaptation Strategies
est (re)insurance enterprises (Cottle, 2007).                                for Global Change, 12, 181–201, 2007.
                                                                          Dee, D. P., Uppala, S. M., Simmons, A. J., Berrisford, P., Poli, P.,
                                                                             Kobayashi, S., and Vitart, F.: The ERA-Interim reanalysis: Con-
                                                                             figuration and performance of the data assimilation system, Q. J.
Acknowledgements. A. Spessa appreciates funding support pro-
                                                                             Roy. Meteor. Soc., 137, 553–597, 2011.
vided by the Open University Research Investment Fellowship
                                                                          DeFries, R. S., Hansen, M. C., and Townshend, J. R. G.: Global
scheme. The original impetus for this study was enabled through
                                                                             continuous fields of vegetation characteristics: a linear mixture
funding from the NERC QUEST programme (FireMAFS: Fire
                                                                             model applied to multi-year 8 km AVHRR data, Int. J. Remote
Modelling and Forecasting System project; NE/F001681/1). The
                                                                             Sens., 21, 1389–1414, 2000.
work by ECMWF was partially funded by the Copernicus program
                                                                          Doblas-Reyes, F. J., García-Serrano, J., Lienert, F., Biescas, A. P.,
(http://www.copernicus.eu/). J. Kaiser was supported by the EU
                                                                             and Rodrigues, L. R.: Seasonal climate predictability and fore-
FP7 project MACC-II (grant agreement 283576).
                                                                             casting: status and prospects, Wiley Interdisciplinary Reviews:
                                                                             Climate Change, 4, 245–268, 2013.
Edited by: R. Lasaponara
                                                                          Field, R. D. and Shen, S. S. P.: Predictability of carbon emissions
Reviewed by: two anonymous referees
                                                                             from biomass burning in Indonesia from 1997 to 2006, J. Geo-
                                                                             phys. Res.-Biogeo., 113, G04024, doi:10.1029/2008JG000694,
                                                                             2008.
                                                                          Field, R. D., Wang, Y., and Roswintiarti, O.: A drought-based pre-
References                                                                   dictor of recent haze events in western Indonesia, Atmos. Envi-
                                                                             ron., 38, 1869–1878, 2004.
Adler, R. F., Huffman, G. J., Bolvin, D. T., Curtis, S., and Nelkin, E.   Field, R. D., van der Werf, G. R., and Shen, S. S. P.: Human ampli-
  J.: Tropical rainfall distributions determined using TRMM com-             fication of drought-induced biomass burning in Indonesia since
  bined withother satellite and rain gauge information, J. Appl.             1960, Nat. Geosci., 2, 185–188, 2009.
  Meteorol., 39, 2007–2023, 2000.                                         Fuller, D. O. and Murphy, K.: The ENSO-fire dynamic in insular
Adler, R. F., Huffman, G. J., Chang, A., Ferraro, R., Xie, P. P.,            Southeast Asia, Climatic Change, 74, 435–455, 2006.
  Janowiak, J., Rudolf, B., Schneider, U., Curtis, S., Bolvin, D.,        Giglio, L., Randerson, J. T., van der Werf, G. R., Kasibhatla, P.
  Gruber, A., Susskind, J., Arkin, P., and Nelkin, E.: The version-          S., Collatz, G. J., Morton, D. C., and DeFries, R. S.: Assess-
  2 global precipitation climatology project (GPCP) monthly pre-             ing variability and long-term trends in burned area by merging
  cipitation analysis (1979–present), J. Hydrometeorol., 4, 1147–            multiple satellite fire products, Biogeosciences, 7, 1171–1186,
  1167, 2003.                                                                doi:10.5194/bg-7-1171-2010, 2010.
Aldrian, E. and Dwi Susanto, R.: Identification of three dominant         Giglio, L., Randerson, J. T., and Werf, G. R.: Analysis of daily,
  rainfall regions within Indonesia and their relationship to sea sur-       monthly, and annual burned area using the fourth-generation
  face temperature, Int. J. Climatol., 23, 1435–1452, 2003.                  global fire emissions database (GFED4), J. Geophys. Res.-
Aragao, L. E. O., Malhi, Y., Barbier, N., Lima, A., Shimabukuro,             Biogeo., 118, 317–328, 2013.
  Y., Anderson, L., and Saatchi, S.: Interactions between rainfall,       Hansen, J. W., Mason, S. J., Sun, L., and Tall, A.: Review of sea-
  deforestation and fires during recent years in the Brazilian Ama-          sonal climate forecasting for agriculture in sub-Saharan Africa,
  zonia, Philos. T. R. Soc. B, 363, 1779–1785, 2008.                         Exp. Agr., 47, 205–240, 2011.
Armenteras-Pascual, D., Retana-Alumbreros, J., Molowny-Horas,             Hooijer, A., Page, S., Jauhiainen, J., Lee, W. A., Lu, X. X., Idris,
  R., Roman-Cuesta, R. M., Gonzalez-Alonso, F., and Morales-                 A., and Anshari, G.: Subsidence and carbon loss in drained trop-
  Rivas, M.: Characterising fire spatial pattern interactions with           ical peatlands, Biogeosciences, 9, 1053–1071, doi:10.5194/bg-9-
  climate and vegetation in Colombia, Agr. Forest Meteorol., 151,            1053-2012, 2012.
  279–289, 2011.                                                          Hoscilo, A., Page, S. E., Tansey, K. J., and Rieley, J. O.:Effect of
Barlow, J., Parry, L., Gardner, T. A., Ferreira, J., Aragão, L. E.,          repeated fires on land-cover change on peatland in southern Cen-
  Carmenta, R., and Cochrane, M. A.: The critical importance of              tral Kalimantan, Indonesia, from 1973 to 2005, Int. J. Wildland
  considering fire in REDD+ programs, Biol. Conserv., 154, 1–8,              Fire, 20, 578–588, 2011.
  2012.


Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015                                    www.nat-hazards-earth-syst-sci.net/15/429/2015/
```

## Page 13

```text
A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia                                                                441

Huffman, G. J., Adler, R. F., Bolvin, D. T., and Gu, G.: Improving        Pappenberger, F., Wetterhall, F., Dutra, E., and Cloke, H. L.: Seam-
  the global precipitation record: GPCP version 2.1, Geophys. Res.           less forecasting of extreme events on a global scale. Climate and
  Lett., 36, L17808, doi:10.1029/2009GL040000, 2009.                         Land Surface Changes in Hydrology, edited by: Boegh, E., Blyth,
Jones, A. E. and Morse, A. P.: Application and validation of a               E., Hannah, DM, Hisdal, H., Kunstmann, H., Su, B., and Yilmaz,
  seasonal ensemble prediction system using a dynamic malaria                KK, IAHS Publication, Gothenburg, Sweden, 3–10, 2013.
  model, J. Climate, 23, 4202–4215, 2010.                                 Peng, Z., Wang, Q. J., Bennett, J. C., Schepen, A., Pappenberger,
Jones, A. E. and Morse, A. P.: Skill of ENSEMBLES seasonal re-               F., Pokhrel, P., and Wang, Z.: Statistical calibration and bridg-
  forecasts for malaria prediction in West Africa, Geophys. Res.             ing of ECMWF System4 outputs for forecasting seasonal precip-
  Lett., 39, 23707, doi:10.1029/2012GL054040, 2012.                          itation over China, J. Geophys. Res.-Atmos., 119, 7116–7135,
Langner, A. and Siegert, F.: Spatiotemporal fire occurrence in Bor-          doi:10.1002/2013JD021162, 2014.
  neo over a period of 10 years, Glob. Change Biol., 15, 48–62,           Reid, J. S., Xian, P., Hyer, E. J., Flatau, M. K., Ramirez, E. M.,
  2009.                                                                      Turk, F. J., Sampson, C. R., Zhang, C., Fukada, E. M., and Mal-
Langner, A., Miettinen, J., and Siegert, F.: Land cover change 2002–         oney, E. D.: Multi-scale meteorological conceptual analysis of
  2005 in Borneo and the role of fire derived from MODIS im-                 observed active fire hotspot activity and smoke optical depth in
  agery, Glob. Change Biol., 13, 2329–2340, 2007.                            the Maritime Continent, Atmos. Chem. Phys., 12, 2117–2147,
Lass, W., Haas, A., Hinkel, J., and Jaeger, C.: Avoiding the avoid-          doi:10.5194/acp-12-2117-2012, 2012.
  able: towards a European heat waves risk governance, Interna-           Roads, J., Fujioka, F., Chen, S., and Burgan, R.: Seasonal fire
  tional Journal of Disaster Risk Science, 2, 1–14, 2011.                    danger forecasts for the USA, Int. J. Wildland Fire, 14, 1–18,
Lass, W., Haas, A., Hinkel, J., and Jaeger, C.: Avoiding the avoid-          doi:10.1071/WF03052, 2005.
  able: Towards a European heat waves risk governance, in: Inte-          Roads, J., Tripp, P., Juang, H., Wang, J., Fujioka, F., and Chen, S.:
  grated Risk Governance, Springer, Berlin, Heidelberg, 119–144,             NCEP–ECPC monthly to seasonal US fire danger forecasts, Int.
  2013.                                                                      J. Wildland Fire, 19, 399–414, 2010.
Lavers, D., Luo, L., and Wood, E. F.: A multiple model assessment         Roy, D. P., Boschetti, L., Justice, C. O., and Ju, J.: The collection 5
  of seasonal climate forecast skill for applications, Geophys. Res.         MODIS burned area product – Global evaluation by comparison
  Lett., 36, L23711, doi:10.1029/2009GL041365, 2009.                         with the MODIS active fire product, Remote Sens. Environ., 112,
Margono, B. A., Potapov, P. V., Turubanova, S., Stolle, F., and              3690–3707, 2008.
  Hansen, M. C.: Primary forest cover loss in Indonesia over 2000–        Saatchi, S. S., Harris, N. L., Brown, S., Lefsky, M., Mitchard, E.
  2012, Nat. Clim. Change, 4, 730–735, 2014.                                 T., Salas, W., and Morel, A.: Benchmark map of forest carbon
McInerney, D., San-Miguel-Ayanz, J., Corti, P., Whitmore, C., Gio-           stocks in tropical regions across three continents, P. Natl. Acad.
  vando, C., and Camia, A.: Design and Function of the European              Sci., 108, 9899–9904, 2011.
  Forest Fire Information System, Photogramm. Eng. Rem. S., 79,           Saha, S., Nadiga, S., Thiaw, C., Wang, J., Wang, W., Zhang, Q.,
  965–973, 2013.                                                             and Xie, P.: The NCEP climate forecast system, J. Climate, 19,
Miettinen, J., Langner, A., and Siegert, F.: Burnt area estimation for       3483–3517, 2006.
  the year 2005 in Borneo using multi-resolution satellite imagery,       Saha, S., Moorthi, S., Wu, X., Wang, J., Nadiga, S., Tripp, P., and
  Int. J. Wildland Fire, 16, 45–53, 2007.                                    Becker, E.: The NCEP climate forecast system version 2, J. Cli-
Miettinen, J., Shi, C., and Liew, S. C.: Deforestation rates in insular      mate, 27, 2185–2208, 2014.
  Southeast Asia between 2000 and 2010, Glob. Change Biol., 17,           Siegert, F., Ruecker, G., Hinrichs, A., and Hoffmann, A. A.: In-
  2261–2270, 2011.                                                           creased damage from fires in logged forests during droughts
Molteni, F., Stockdale, T., Balmaseda, M., Balsamo, G., Buizza, R.,          caused by El Nino, Nature, 414, 437–440, 2001.
  Ferranti, L., and Vitart, F.: The new ECMWF seasonal forecast           Schultz, M. G., Heil, A., Hoelzemann, J. J., Spessa, A., Thonicke,
  system (System 4), p. 49, European Centre for Medium-Range                 K., Goldammer, J. G., and van Het Bolscher, M.: Global wildland
  Weather Forecasts, 2011.                                                   fire emissions from 1960 to 2000, Global Biogeochem. Cy., 22,
Nassar, R., Logan, J. A., Megretskaia, I. A., Murray, L. T., Zhang,          GB2002, doi:10.1029/2007GB003031, 2008.
  L., and Jones, D. B. A.: Analysis of tropical tropospheric ozone,       Sudiana, D., Kuze, H., Takeuchi, N., and Burgan, R. E.: Assessing
  carbon monoxide, and water vapor during the 2006 El Niño using             forest fire potential in Kalimantan Island, Indonesia, using satel-
  TES observations and the GEOS-Chem model, J. Geophys. Res.,                lite and surface weather data, Int. J. Wildland Fire, 12, 175–184,
  114, D17304, doi:10.1029/2009JD011760, 2009.                               2003.
Page, S. E., Siegert, F., Rieley, J. O., Boehm, H. D. V., Jaya, A., and   van der Werf, G. R., Dempewolf, J., Trigg, S. N., Randerson, J. T.,
  Limin, S.: The amount of carbon released from peat and forest              Kasibhatla, P. S., Giglio, L., and DeFries, R. S.: Climate regu-
  fires in Indonesia during 1997, Nature, 420, 61–65, 2002.                  lation of fire emissions and deforestation in equatorial Asia, P.
Page, S. E., Rieley, J. O., and Banks, C. J.: Global and regional            Natl. Acad. Sci., 105, 20350–20355, 2008.
  importance of the tropical peatland carbon pool, Glob. Change           van der Werf, G. R., Randerson, J. T., Giglio, L., Collatz, G. J., Mu,
  Biol., 17, 798–818, 2011.                                                  M., Kasibhatla, P. S., Morton, D. C., DeFries, R. S., Jin, Y., and
Pappenberger, F., Stephens, E., Thielen, J., Salamon, P., Demeritt,          van Leeuwen, T. T.: Global fire emissions and the contribution of
  D., Andel, S. J., and Alfieri, L.: Visualizing probabilistic flood         deforestation, savanna, forest, agricultural, and peat fires (1997–
  forecast information: expert preferences and perceptions of best           2009), Atmos. Chem. Phys., 10, 11707–11735, doi:10.5194/acp-
  practice in uncertainty communication, Hydrol. Process., 27,               10-11707-2010, 2010.
  132–146, 2013.                                                          van Oldenborgh, J. G., Balmaseda, M. A., Ferranti, L., Stockdale,
                                                                             T. N., and Anderson, D. L.: Did the ECMWF seasonal forecast



www.nat-hazards-earth-syst-sci.net/15/429/2015/                                     Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015
```

## Page 14

```text
442                                                A. C. Spessa et al.: Seasonal forecasting of fire over Kalimantan, Indonesia

  model outperform statistical ENSO forecast models over the last     Wooster, M. J., Perry, G. L. W., and Zoumas, A.: Fire, drought
  15 years?, J. Climate, 18, 3240–3249, 2005.                          and El Niño relationships on Borneo (Southeast Asia) in
Wang, Y., Field, R. D., and Roswintiarti, O.: Trends in atmospheric    the pre-MODIS era (1980–2000), Biogeosciences, 9, 317–340,
  haze induced by peat fires in Sumatra Island, Indonesia and El       doi:10.5194/bg-9-317-2012, 2012.
  Niño phenomenon from 1973 to 2003. Geophys. Res. Lett., 31,
  L04103, doi:10.1029/2003GL018853, 2004.




Nat. Hazards Earth Syst. Sci., 15, 429–442, 2015                               www.nat-hazards-earth-syst-sci.net/15/429/2015/
```
