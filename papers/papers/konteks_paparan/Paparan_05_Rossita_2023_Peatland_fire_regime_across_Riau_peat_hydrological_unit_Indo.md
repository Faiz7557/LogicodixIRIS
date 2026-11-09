# Verbatim PDF Transcript

- Source PDF: `Paparan_05_Rossita_2023_Peatland_fire_regime_across_Riau_peat_hydrological_unit_Indo.pdf`
- Original upload filename: `Paparan_05_Rossita_2023_Peatland_fire_regime_across_Riau_peat_hydrological_unit_Indo.pdf`
- Source PDF SHA-256: `1422ef8e164c5da357a956717ab638810dbc33dcbc175970e0664e243a837399`
- Extraction method: `pdftotext -layout`
- Pages: 19

This file preserves native PDF text with page boundaries. Tesseract OCR supplements pages where the native text layer is empty or corrupted.

## Page 1

```text
                                                                                  Forest and Society
                                                                                    Vol. 7(1): 76-94, April 2023
                                                                                     doi: 10.24259/fs.v7i1.21996


  REGULAR RESEARCH ARTICLE



Peatland fire regime across Riau peat hydrological unit,
Indonesia

Annuri Rossita 1 , Rizaldi Boer 1, * , Lars Hein 2 , Dodik Ridho Nurrochmat 3 , and Akhmad
Riqqi 4

 AFFILIATIONS                         ABSTRACT
  1.
     Applied Climatology, Bogor       Peatland stretches across approximately 8% of Indonesia’s land area.
     Agricultural University (IPB),   Peat fire disturbance, which affects the carbon dynamics of the
     Bogor, Indonesia                 ecosystem, will determine the country's vision for a long-term strategy
  2.
     Environmental System             for low carbon development. While the impact of excessive draining on
     Analysis, Wageningen             peatland fire is well-known to the scientific community, much less is
     University and Research,         known about peatland fire regimes in distinctive land management
     Wageningen, Netherlands          systems. We examined the effect of land use, land management, and
  3.
     Forest Management, Bogor         climatic factors in peatland fires. The examination was performed at the
     Agricultural University (IPB),   Peat Hydrological Unit at Gaung–Batang Tuaka, Riau, Indonesia. We
     Bogor, Indonesia                 used a semi-automatic approach to determine the area of burned
  4.
     Geodecy, Institute of            peatland and used a spatial analysis tool to analyze the spatio-temporal
     Technology Bandung (ITB),        pattern of peatland fire in the region. Our results demonstrate an
     Bandung, Indonesia               increasing trend of peatland fires between 2001 and 2020, with 33% of
  *Corresponding author:              the burned peatland undergoing multiple fires. The bulk of the burned
  rizaldiboer@gmail.com               land was covered by either wet shrubs or estate crops, with the area of
                                      burned wet shrub-land cover was two times higher than the burned
                                      estate crop-land cover. Concerning peatland draining, this study found
                                      a positive correlation between draining intensity, as represented by
                                      canal density, and burned area in peatland forests. In managed and
                                      unmanaged land, canal density had no apparent correlation with the
                                      area of peatland burned; however, we found that the weighted area of
                                      burned peatland was, on average, seven times higher in the unmanaged
                                      area compared to the managed area. These findings urgently demand
                                      an increase in community participation in the utilization of unmanaged
                                      land and prompt execution of peatland rewetting in drained peat
                                      forests. While the government of Indonesia has developed a social
 RECEIVED 2022-08-02                  forestry and agrarian reform scheme to enable the legal utilization of
 ACCEPTED 2023-01-11                  unproductive land in forest areas, we argue that greater impacts can
                                      only be achieved if environmental services incentive schemes escalate
 COPYRIGHT © 2023 by Forest           non-party actors' participation.
 and Society. This work is
 licensed    under     a Creative     KEYWORDS
 Commons       Attribution    4.0     Fire regime; KHG-based; Peatland fire; Peatland management; Spatio-
 International License.               temporal pattern.


1. INTRODUCTION
Peatland is one of the most valuable ecosystems, providing multiple ecosystem services
which enhance human welfare. The most fundamental of these services is carbon
regulation. By storing 88.6 Gt of soil carbon (S. E. Page et al., 2011), tropical peatland
plays a very significant role in the global climate (Leifeld et al., 2019). The statement in
the IPCC 6th Assessment Report that human activities unequivocally cause the “increase
in GHG emissions” (IPCC, 2021), is relevant to the case of peatland. Nearly 80% of
Southeast Asian peatland has been artificially modified to support dryland cultivation
(Mishra et al., 2021), which transforming peatland from a carbon sink to a carbon source
(Gunawan et al., 2016; Hirano et al., 2016; Hooijer et al., 2010).
```

## Page 2

```text
Forest and Society Vol. 7(1): 76-94                                                    77


     To date, the objective of mitigating global temperature increase has led to more
than 50 countries, including Indonesia, declaring their net-zero emission (NZE)
ambitions. Many studies have noted that achieving the targets defined in the Paris
Agreement of 2015 will require massive land-based carbon dioxide removal (Roe et al.,
2019; Rogelj et al., 2018). In this context, the conservation of peatland ecosystems can
be considered part of nature-based solutions to the climate crisis (Mishra et al., 2021).
In Indonesia, where peatland stretches across approximately 8% of the country’s land
area, any disturbance affecting the ecosystem’s carbon dynamics will determine the
success of NZE strategies (Republic of Indonesia, 2016, 2021).
     Peat fires are among the most concerning forms of peatland disturbance, as they
vary temporally and are complicated by their connection to biophysics and
socioeconomic conditions. Before 2000, peatland fires triggered by rapid development
were considered the major cause of deforestation in Indonesian peatlands. In recent
years, fire occurrence has shifted to areas of non-forest land cover (Field et al., 2009;
Hosciło et al., 2008). Furthermore, there is much evidence indicating the role of
peatland drainage in generating a vicious cycle of continuous ecosystem degradation,
producing an ecosystem less resistant to hydrological change and more vulnerable to
fire (Taufik et al., 2019; Wösten et al., 2006).
     While excessive drainage’s role in peatland fires have now been accepted as
scientific consensus, much less is known about peatland fire regimes, which are
characteristic of fire occurrence in landscapes where anthropogenic forces play a
distinctive role. Indonesia’s peatland is currently dominated by unmanaged and
degraded areas (Miettinen et al., 2011); hence, a scientific basis for managing peatland
fires according to land management types is necessary. This study seeks to fill this gap
by making the best use of currently available spatial information to properly analyze the
peatland fire regime in a peatland ecosystem boundary and its association with land
management. We conducted three separate assessments: an examination of the
distribution of peatland fires across different land cover types, an identification of
peatland fire patterns across varying densities of drainage canals, and the generation
of a statistical model that captures the dynamics of annual peatland burning driven by
climatic factors (e.g., anomalous rainfall events) and land use.
2. METHODOLOGY
The research objective will be addressed at the Peat Hydrological Unit (KHG)
assessment level at Gaung–Batang Tuaka KHG (Figure 1), one of the prioritized KHGs
in Riau, the province with the largest peatland area in Indonesia and one of the most
fire-prone provinces (Albar et al., 2018). Our interest in conducting the study at the KHG
level was prompted by the release of Government Regulation No.57/2016, which states
that the KHG level and the boundaries of peat ecosystems are the main scales for
peatland management. The study area extends for 315,326 ha, and 87.2% of this area
is peatland (275,099 ha). The peatland area is dominated by very deep peat (>3 m), with
half of the peatland at the fibric maturity level (i.e., mainly containing fibre).
    The study was conducted from January to December 2022. We examined the
peatland fire regime by initially determining the annual area of peatland burned,
followed by a spatio-temporal analysis of peatland fires. The data used in this study
comprise point and spatial data covering the study area (Table 1). We refer to 2001-
2020 as our analysis timeframe for peatland fire detection and 2003, 2006, 2009, and
2011-2019 as our timeframe for spatial analysis of the area of burned peatland. Data
processing and visualization were performed using Microsoft Office and ArcMap 10.3.



Rossita et al. (2023)
```

## Page 3

```text
Forest and Society Vol. 7(1): 76-94                                                                                        78


In addition to primary data, we used supplementary indicative maps of social forestry 1,
agrarian reform objectives and TORA2 participation to garner supporting information on
existing land policies.




Figure 1. Map of the study area showing the spatial distribution of peat depth and canal
networks
     Visual analysis of burned areas was conducted using on- and off-screen manual
digitization of a composite of the red, green, and blue (RGB) bands of satellite data from
LANDSAT TM 8 and LANDSAT TM 5 (LAPAN, 2015) at 30 m resolution. The analysis was
initiated by determining the annual burned area. Then, information on burned areas
was estimated using semi-automatic classification conducted via a visual identification
process that considered spatial hotspot information. Each path/row of the LANDSAT
data was derived from two periods of the acquisition dates, which were determined
based on the periods preceding and following hotspot peaks. This approach provided a
more accurate depiction of the burned area than the intuitive approach using only
hotpots (Rossita et al., 2019).
Table 1. Data sources and description of the variables.
                              Date (spatial                                                            The variance of
  No      Variable                                            Source
                              resolution or scale)                                                     data collected
  1       Historical          2001-2020 (N.A.)                MODIS                                    3 to 398
          hotspot
  2       Remote              2001-2020 (30 m)                LANDSAT Thematic Mapper                  N.A.
          sensing                                             8 and 5
          imagery
  3       Historical          2001-2020 (5 km)                https://chc.ucsb.edu/data/               1,834 mm to


1 The government of Indonesia grants communities’ access to utilize forest areas under the social forestry scheme, regulated by
the Ministerial Law of Environment and Forestry No. 83/2016.
2 The TORA scheme aims to evaluate the structure of land ownership in the country by retroactively legalizing the community
cultivation of state land that the community has long occupied. This scheme is regulated under Presidential Decree No. 86/2018.

Rossita et al. (2023)
```

## Page 4

```text
Forest and Society Vol. 7(1): 76-94                                                          79


                        Date (spatial                                      The variance of
 No    Variable                                Source
                        resolution or scale)                               data collected
       rainfall                                chirps                      3,279 mm
       reanalysis
       data
 4     Land cover       2003, 2006, 2009,      Ministry of Environment     14 land cover
                        2011-2019 (30 m)       and Forestry                classes
 5     Canal            2017                   Processed from canal        0.82 to > 2.45
       density map                             network data published by
                                               Rupa Bumi Indonesia
 6     Peat depth       2010 (1:50,000)                                    50-100 m to
                                               Ministry of Agriculture
                                                                           >300 m

     To overcome the limited temporal availability of LANDSAT data, it was assumed that
peatland fires only occur during peak hotspot periods (Albar et al., 2018; Hayasaka et
al., 2016). Hence, this study does not capture peatland fires recurring in the same year.
Furthermore, as remote sensing could only detect surface burning, our results do not
reflect subsurface peatland fires (Ballhorn et al., 2009). Therefore, the metric obtained
by this approach is the total area of peatland burned in a year. For more technical details
on the semi-automatic approach used in this study, readers are advised to refer to our
previous study (Rossita et al., 2019).
     We used supplementary maps to clip relevant areas for the first part of the land
management analysis. These included land cover maps and canal density maps. These
maps are official data released by the Indonesian Ministry of Agriculture (MoA) and the
Ministry of Environment and Forestry (MoEF). Historical land cover maps from MoEF
were only available for the years 2003, 2006, 2009, and 2011-2019; hence, for the
spatial analysis, we only assessed the area of peatland burned during the specific period
for which land cover maps were available. The land cover classification employed in the
study uses the definitions in the national land use monitoring system (Agus et al., 2013;
Direktorat IPSDH, 2015). Overlaying the land cover and annual area of peatland burned
generated the distribution of each land cover type’s annual area of peatland burned.
     In the second assessment, we endeavored to generate information on the total
burned area detected in managed land, unmanaged land, and forest land and compare
this to different classes of canal density. Initially, we developed three main land
classifications (forest, managed, and unmanaged areas) by classifying primary and
secondary peat forests as forest areas; timber plantations, estate crops, dryland
agriculture, and paddy fields as managed areas; and bare ground, wet shrubs, and
mixed dryland agriculture as unmanaged areas. We separated forest area from the
unmanaged classification due to a distinctive pattern we found when interpreting the
peatland fire data for unproductive land and peat forest areas.
     We obtained information on canal density via line density analysis of the map of the
canal network. As we are unable to obtain the width information of the canal, canal
density was only defined as the ratio of the total length of the canals in an area to the
total area observed (km/km 2). In this case, we perceive further studies are needed to
capture different draining impacts under various canal types (e.g., primary, secondary,
and tertiary). We reclassified the contour map of canal density into five main classes:
<0.82, 0.82 – 1.64, 1.64 – 2.45, and >2.45 km/km2. The higher the canal density, the
more drainage occurs in the area. To enable a direct comparison of the three land
classifications, we applied the ratio of the burned area to the total land area in a given
year, then aggregated the burned area for each canal density class and the three land
classifications. This process generated information on the total burned area detected
in managed, unmanaged, and forest areas that could be cross-referenced to the

Rossita et al. (2023)
```

## Page 5

```text
Forest and Society Vol. 7(1): 76-94                                                   80


different classes of canal density.
    In addition to land management analysis, we also assessed the contributions of fire
drivers, namely rainfall anomalies and the extent of unmanaged land, to peatland fire
occurrence by conducting a statistical analysis of the relationship between these
drivers and the area of peatland burned. The multilinear regression process used in this
process is described in Eq. 1. The decision to include unmanaged land in the equation
was taken based on studies that have found that peatland fires mostly occur in
unproductive and degraded peatland (E. I. Putra et al., 2016; Thoha et al., 2017). We
used the annual Standardized Precipitation Anomaly Index (SPAI), a normalized
measurement of rainfall anomalies, to reflect rainfall factor. The SPAI is commonly
employed to capture extreme rainfall events (Chanda & Maity, 2015) in which rainfall
far exceeds or falls far below its average value for a climatological time window of 30
years. The SPAI is estimated using as described in Eq. 2.
                   𝑷𝒆𝒂𝒕𝒍𝒂𝒏𝒅𝒃𝒖𝒓𝒏𝒆𝒅𝒂𝒓𝒆𝒂(𝒉𝒂) = 𝒂 + 𝒃𝑨𝑺𝑷𝑨𝑰 + 𝒄𝑼𝑳 (1)
    where peatland burned area (ha) refers to the total burned area per year, a is the
intercept of the equation, ASPAI is the standardized annual rainfall anomaly index, UL is
the area of unproductive land, consisting of bare ground and shrub (ha), and b and c are
the coefficients for annual SPAI and unproductive land, respectively.
                                                𝑹(𝒕)−𝑹𝒂𝒗𝒆
                                      𝑨𝑺𝑷𝑨𝑰 =               (2)
                                                   𝑹𝒔𝒕𝒅

    where R(t) is annual rainfall (mm), t refers to the year, Rave is the 30-year average
value of annual rainfall from 1987 to 2017 (mm), and Rstd is the standard deviation of
30 years of annual rainfall from 1987 to 2017 (mm).
    For the multi-regression analysis, we used annual information on the extent of
unproductive land by disaggregating the land cover maps for the periods 2000–2003,
2003–2006, 2006–2009, and 2009–2011 into annual land cover information using the
deforestation rate. The disaggregation was performed using an approach similar to that
employed for national greenhouse gas (GHG) monitoring (Ministry of Environment and
Forestry, 2017). In this case, we obtained annual information for all variables in Eq. 1
from 2001 to 2019.
    To maintain data variability in the multi-regression process, we excluded outliers in
the data on the area of peatland burned by setting agreeable residuals at a 95%
confidence level. We repeatedly generated the multi-regression model while assessing
the residual value for each annual datapoint and completed this process when all
residual values fell under the 95% confidence level. The final equation obtained by this
process was then used in the study. The outlier analysis for the multi-regression
excluded the data for the years 2001, 2010, 2016, 2017, and 2019.
3. RESULTS
Between 2001 and 2020, the total burned area varied from 1 ha to 10,034 ha with an
annual average of 1,666.7 ha (see Figure 2). The severe El Niño events in 2015 and 2019
resulted in the two largest annual areas of burned peatland (Figure 2). The results
shown in Figure 2 reveal that large areas of peatland also burned during La Niña years
(2008, 2011, and 2012) and normal years (2013 and 2014). Except for declines in 2010,
2016-2017, and 2020 due to the combined effect of an extremely strong La Niña
(measured as low NIÑO 3.4 SST anomaly) and the negative phase of the Indian Ocean
Dipole (IOD), the results indicate an increase in the area of burned peatland from 2001
to 2020. However, if the study period was extended back to 1980, it would include a
noticeable 10–15 year recurrence pattern: there were massive fires in 1982/83 and

Rossita et al. (2023)
```

## Page 6

```text
Forest and Society Vol. 7(1): 76-94                                                     81


again in 1997/98 (Sloan et al., 2017).
    In terms of frequency, our study has detected multiple fires in as much as 33% of
the area of burned peatland, with a maximum frequency of seven. Spatially, recurrent
peatland fires occurred more frequently in the southwestern region of the study area
(Figure 3). According to the results, most of the fires in the study area (67%) did not
recur, and these one-time fires were detected in each year of the period from 2001 to
2020. The total burned area was 21,690 ha and the total unburned area was 253,409
ha by 2020.




Figure 2. The total area of peatland burned in Gaung–Batang Tuaka KHG and the
maximum and minimum NIÑO 3.4 sea surface temperature (SST) anomaly values
according to the El Niño Southern Oscillation (ENSO) index.
    An intersection of the map of burned peatland with the land cover map of the
respective year demonstrates that before 2010 most peatland fires occurred in
secondary peat swamp forests and wet shrub areas (Table 2). However, since 2010
peatland fires have shifted mainly to unproductive land (wet shrub and bare ground
areas). This finding aligns with recent studies which have underscored that shrubland
dominated by fern species (e.g., Pteridium sp.), is the most fire-prone land cover type in
Indonesia, particularly during dry periods (Prayoto et al., 2017; Shiodera et al., 2016;
Thoha et al., 2017).
    Most burned land was covered by wet shrubs and estate crops. For a better
understanding of the influence of anthropogenic factors on peatland fire regimes in
managed and unmanaged areas, we disaggregated the burned peatland information
into four main classes of canal density. We also classified forest plantations, estate
crops, dryland agriculture, and paddy fields as managed areas, primary and secondary
forests as forest areas, and the remaining land as unmanaged. As shown in Figure 4,
the impact of drainage on the area of burned peatland is most apparent in forest areas.
The drainage intensity on managed and unmanaged land does not have a significant
impact on the area of burned peatland. Unmanaged land has the highest ratio of burned
area relative to the land area. In this case, anthropogenic factors such as land
supervision and management might reduce the occurrence of peatland fires. However,
this would be highly dependent on the effectiveness of land management.
    As Table 2 shows, the three largest areas of burned peatland all burned during
periods of reduced rainfall, as illustrated by their negative SPAI indices. The effect of
land use patterns and rainfall anomalies on the temporal variation of burned peatland
area was measured by fitting the actual area of burned peatland to the annual SPAI and
the extent of unproductive land. The inclusion of unproductive land originated from


Rossita et al. (2023)
```

## Page 7

```text
Forest and Society Vol. 7(1): 76-94                                                   82


results provided in Table 2, which revealed that peatland fires occur in these areas most
often.




Figure 3. Spatial distribution of the frequency of fire occurrence from 2001 to 2020 in
the study area.



Rossita et al. (2023)
```

## Page 8

```text
Forest and Society Vol. 7(1): 76-94                                                                                                                    83




Table 2. Area of burned peatland (2003–2019) by land cover type, annual rainfall, and SPAI index per year.
                                                                              Burned area (ha)                                            Total burned
            Land use type
                                      2003    2006    2009    2011    2012    2013     2014      2015    2016    2017    2018    2019       area (ha)
    Forest area                         453     699     391     63      12      126      334       201                     59       975           3,313
    Primary swamp forest                                                                            25                               11               35
    Secondary swamp forest             453     699     391      63      12      126      334       176                     59       965           3,277
    Managed area                                36             860     163      546      419       834     29       1     874     3,674           7,435
    Forest plantation                                          812     163       38       17        55                      2       285           1,373
    Estate crop                                                                 508      401       779     29       1     871     3,319           5,907
    Dryland agriculture                          20                                        1                                         45               65
    Paddy field                                  17              47                        1                                         25               90
    Unmanaged area                      10    1,021   2,048   1,163   1,549     912    2,077     3,649              49     881    5,384          18,744
    Bare ground                                 457     162      34      30      53      965     2,147               4       1      476           4,330
    Wet shrub                           10      504   1,886   1,128   1,520     859    1,100     1,471              40     863    4,018          13,401
    Mixed dryland agriculture                    60                                       13        30               5      17      889           1,013
    Total burned area (ha)              463   1,756   2,440   2,086   1,725   1,583    2,830     4,683      29      50   1,814   10,033          29,492
    Annual rainfall (mm)              2,637   2,696   2,605   2,886   2,702   2,595    2,416     2,094   2,675   2,734   2,599    2,245
    SPAI1                              0.49    0.79    0.33    1.76    0.82    0.27    -0.64     -2.27    0.68    0.98    0.30    -1.50
SPAI = standardized annual precipitation anomaly index
1




Rossita et al. (2023)
```

## Page 9

```text
Forest and Society Vol. 7(1): 76-94                                                    84




Figure 4. Burned area and canal density in managed and unmanaged land. The
managed land category comprises timber plantations, estate crops, dryland agriculture,
and paddy fields; the unmanaged land category comprises bare ground, wet shrubs, and
mixed dryland agriculture; and the forest area comprises primary and secondary swamp
forests.
    After excluding outliers, a multi-regression analysis was performed (Table 3). The
coefficient of the parameters indicates that the logarithmic form of the area of burned
peatland increases by 1% as annual SPAI decreases by 0.1134 units (or when a rainfall
deficit occurs), and the logarithmic form of the area of the unproductive land increases
by 2.88%. The effect is significant (p-value < 0.1) with an R2 of 72.8%. The extent of the
unproductive area significantly affects the area of burned peatland (p-value < 0.1). The
multi-regression results support the conclusion that the expansion of unmanaged lands
will increase the fire risk in the area.
Table 3. Multi-regression of logarithmic natural form of area of burned peatland as
response with SPAI and logarithmic natural form of area of unproductive land (bare
ground and wet shrub) as predictors. Significance level at alpha (α) of 5% (R2=72.8%,
ρ=0.001)
        Parameter          Coefficient             S.E.                     p
    -          β0           -23.768               5.712                   0.002
    SPAI       β1           -0.1134              0.1432                   0.445
    Ln UA1     β2            2.8827              0.5330                   0.000
logarithmic natural form of unproductive area (bare ground and shrubs)
1


4. DISCUSSION
Many studies of tropical countries have recognized an increasing trend of fires, despite
the humid nature of the climate in the regions (Turetsky et al., 2015; Vadrevu et al.,
2019; Van Der Werf et al., 2008). The increasing trend has also led to concerns about
the status of peatland ecosystems in the coming decades, along with the
incompatibility of current ecosystem restoration pace with global targets and
commitments to the Paris agreement. In the national context of Indonesia, historical
peatland fire patterns indicate that reaching NZE will require transformative policy
action and a massive paradigm change in the utilization of peatland to prevent as much
disturbance as possible.
    As presented in Table 2, peatland fires in unmanaged land occurred nearly every
year in the study area. Most peatland fires took place in the non-forest area, including


Rossita et al. (2023)
```

## Page 10

```text
Forest and Society Vol. 7(1): 76-94                                                       85


areas of wet shrubs, which aligns with a study performed in Kalimantan (Cattau et al.,
2016). Furthermore, in South Sumatra, although hotspot density is highest in industrial
plantations, hotspot emergence consistently appears in unmanaged land (R. Putra et
al., 2019). This evidence strongly indicates that unmanaged land should be prioritized
as the main target for peatland fire prevention measures.
     Many studies have emphasized the primary role of extensive drainage in increasing
the vulnerability of peatland to fire (Taufik et al., 2019; Wösten et al., 2006). As peatland
is generally perceived as marginal land, draining these areas was necessary to allow
the cultivation of dryland commodities. This study found a strong correlation between
intensive peatland drainage, measured as canal density, with increased burning in
peatland forests (Figure 4). This finding confirms the urgent need to rewet drained peat
forests, as the combination of drainage and fire is the main cause of total ecosystem
destruction in these areas (S. Page et al., 2009).
     In the non-forest area (cultivated and unmanaged land), increased canal density
was less correlated with peatland burning (Figure 4). Another notable finding of this
study is that unmanaged land was the most vulnerable fire at all canal density classes.
This finding also suggests that draining would trigger ecosystem degradation and
vulnerability to burning in areas without water management at any level of draining
intensity or canal density.
     The area of burned peatland was considerably lower in managed areas, but its
socioeconomic impact was still significant. For instance, a previous study has found
that the monetary value of ecosystem capacity-generating provisioning services
declined after the massive peatland fire in 2015 (Rossita et al., 2021). In addition, the
environmental impact of peatland fires has been addressed by many studies,
highlighting reduced air quality and increased GHG emissions in a densely populated
peatland area (Jayarathne et al., 2018; Marlier et al., 2015).
     A study by Miettineen et al. (2017) highlighted the influence of poor water
management on peatland fires in managed areas, which indicates that non-government
actors could play a significant role in improving peatland water management and
conducting peatland restoration. On a national scale, plantation companies have
installed 17,292 canal blocks and restored 4,438 ha of peatland, contributing to a 190
MtCO2e reduction in emissions (Ministry of Environment and Forestry, 2018). Canal
blocks with spillways are installed in planting areas, helping to avoid overflooding
during the wet season and overflowing during the dry season. Canals are also backfilled
purposively to promote permanent rewetting in non-planting areas. While spatial data
on canal blocking in concession areas is not currently accessible, in future work these
should be taken into account in the quantitative analysis, as they could eliminate the
draining effect of dense canal systems, particularly during the dry season (Hirano et al.,
2012; Hooijer et al., 2010; Wösten et al., 2006).
     Additional data on canals consisting of canal width (for primary, secondary and
tertiary canals) and canal structure types are required to improve the analysis of the
relationship between peatland drainage and fire occurrence. The analysis should also
consider intervention measures from peatland rewetting through canal blocking. Canal
blocking does not always permanently eliminate canals, although backfilling or
composite dams always close canals through soil filling and vegetation planting
(Suryadiputra et al., 2005). Hence, canal networks might still be detectable using
remote sensing data and therefore could result in bias when interpreting canal density.
Therefore, we strongly suggest that the number of canal blocks installed in an area
should be included as a new variable in future work to better explain the relationship
between peatland fires and canal networks. Further study is necessary to explore this
new variable, as the effectiveness of canal blocking in reducing the capacity of a canal

Rossita et al. (2023)
```

## Page 11

```text
Forest and Society Vol. 7(1): 76-94                                                     86


for peat drainage varies by region due to socioeconomic conditions, including
community acceptance (Ward et al., 2021).
     When examining temporal variability, studies have identified the role of
climatological conditions in peatland fires (Putra & Hayasaka, 2011; Van Der Werf et al.,
2008). By comparing the annual area of peatland burned with annual SPAI values in the
study area, we found greater fires in years with relatively low annual rainfall and SPAI
values (Table 2). Nevertheless, large peatland fires have occurred during years with
normal or good climatological conditions. The non-significant effect of SPAI on the area
of burned peatland (Table 3) indicates the artificially modified peatland ecosystems’
inability to store water, particularly during the dry season.
     As shown in Figure 2, El Niño Southern Oscillation (ENSO) variance has a weaker
influence on the area of burned peatland in our study area than in Kalimantan
(Miettinen et al., 2017; Taufik et al., 2017). Many studies have noted that the
combination of ENSO and IOD in the same period increases the impact of rainfall deficit
(Nur’utami & Hidayat, 2016; Nurdiati et al., 2022). As IOD mode also drove the climate
dynamic on Sumatra Island (Gaveau et al., 2014; Nurdiati et al., 2021); Sumatran
peatland is therefore at greater risk of fire during drought periods.
     This study shows that more fires take place in unproductive area due to a lack of
land management. The multi-regression analysis performed in our study suggests that
an increase in unproductive land of 2.88% leads to a 1% increase in the area of burned
peatland. Although other studies have suggested that cultivated land (especially land
used for smallholder “slash-and-burn” agriculture and oil palm plantations) generally
has more primary ignition sources (Cattau et al., 2016; Sloan et al., 2017), it is also
possible for human activity (e.g., hunting) to lead to fires being ignited in unproductive
land. Many studies have shown that anthropogenic activities like land clearance or
accidental fires are often identified as the main drivers of wide-scale fires (Goldstein et
al., 2020; Harrison et al., 2009).
     Beyond this study, it is noteworthy that land cover does not necessarily reflect the
nature of fires. Studies have revealed the influence of relative distance from
anthropogenic disturbance, vegetation condition, topography, population density, and
livelihood options on fire regimes (Medrilzam et al., 2014; Sloan et al., 2017), and also
the likelihood of peat fires spreading horizontally across different land covers and
vertically from underground to overground (Goldstein et al., 2020; Widyastuti et al.,
2021). The evidence indicates a potentially more complex relationship between land
cover and peatland fires at the local level.
     As a preventive measure, unmanaged land could be supervised according to a
sustainable land management strategy under the social forestry and agrarian reform
(TORA) program to reduce the possibility of repeated peatland fires in the future.
Initially, the MoEF instituted the social forestry scheme to resolve tenurial issues
between local communities and the private sector. The instrument grants communities’
access to forest land (except for conservation forests) to combine agricultural activity
and the extraction of non-timber forest products and environmental services. The total
area targeted for the social forestry program was 12.7 million ha at country level,
spatially distributed according to the indicative map of social forestry (Ministerial
Decree of MoEF No. 2111/2020), which was determined according to the potential for
land conflict in different areas and different communities’ dependence on forest
resources.
     In contrast to social forestry, TORA aims to reform the current structure of land
ownership in the country by granting legally binding land permits to communities that
have long utilized government lands. The scheme aims to maximize the benefit gained
from the land by communities located near forests. The indicative area for TORA falls

Rossita et al. (2023)
```

## Page 12

```text
Forest and Society Vol. 7(1): 76-94                                                       87


mostly in ex-concession areas for oil palm plantations (HGU), which are already largely
occupied by the community. The total area targeted by the TORA program at country
level was 4.1 million ha (Ministerial Decree of MoEF No. 7434/2019).
    According to overlaid maps of fire frequency from 2001 to 2020, 2,391 ha and 896
ha of peatland burned within the indicative areas of social forestry and TORA,
respectively. Social forestry in the peat ecosystem remains in the initial regulation
development phase. In contrast, the TORA program for the peat ecosystem has been
well-implemented in the Siak Regency (approximately 4,000 ha). It has been
intertwined with sustainable management strategies that consider the peat
characteristics in the region (e.g., class of peat depth, drainage conditions, soil acidity,
and soil fertility) when utilizing the land (Priyono et al., 2019).
    As the vulnerability of degraded peatlands to fire has been scientifically proven,
many studies have suggested that converting unmanaged land to managed land is
necessary (Gunawan, 2018; Mishra et al., 2021). However, this idea has been debated
in the literature, as converting these areas into agricultural lands will not necessarily
hinder the occurrence of fire hotspots (Miettinen et al., 2017). The results presented in
this study highlight that leaving land to be unmanaged results in higher fire risk,
irrespective of the drainage level. As scientific evidence has revealed a high subsidence
rate during the initial years of drainage in commercial plantations (Anshari et al., 2021;
Khasanah & van Noordwijk, 2019), we suggest that existing policies on the utilization
and management of peatland according to its ecological functions (e.g., its production
and protection functions), should be referred to when utilizing unmanaged peatland
(Ministerial Law of MoEF No.10/2019).
    Peatland rewetting is an alternative to the conversion of peatland to cultivated land.
Many studies have confirmed rewetting’s positive impact on water levels and that it
positively affects microbial peat oxidation (Jauhiainen et al., 2013; Könönen et al.,
2018; Lestari et al., 2022). Peatland rewetting can eliminate drainage in an area and
increase the ecosystem’s capacity to maintain the water level during the dry season;
hence, reducing the area's vulnerability to fire (Lestari et al., 2022; Ritzema et al., 2014;
Taufik et al., 2019). Our results show that reduced drainage in the forest areas may
result in less peatland being burned yearly. Nonetheless, the efficiency of dams will
eventually regulate changes in the water level regime of the rewetted area (Jauhiainen
et al., 2008).
    Government Regulation No. 57/2016 defines permissible water-table depth for
peatland use. However, to maintain the peat’s ecological function, the commodity
chosen from the list of alternatives in the Ministerial Law of the MoEF No.16/2017
should be adapted to the actual land conditions (e.g., post-fire, sparsely vegetated, or
ex-selective logging). Several studies have identified peat-adapted commodities
derived from paludiculture, including timber, edible food plants and medicinal plants
(Giesen, 2013; Lisnawati et al., 2019). However, low economic value, limited market
scalability, and farmers’ unwillingness to accept the new system have posed obstacles
to expanding paludiculture planting (Tata, 2019; Uda et al., 2020).
    Until 2020, the extent of the land covered by the national social forestry and TORA
programs was only 4.2 million ha and 2.7 million ha, respectively. An adjustment in the
administration of these programs is required to increase local communities’ interest in
implementing the social forestry and TORA agendas. For example, the village
cooperation system, known as Koperasi Unit Desa (KUD), could facilitate a financing
scheme to support the community in implementing TORA. Another alternative would be
to combine TORA with the Peat Restoration Agency (BRGM)’s Peat Care Village (DPG)
program to provide farmers with training and resources on sustainable peatland
management.

Rossita et al. (2023)
```

## Page 13

```text
Forest and Society Vol. 7(1): 76-94                                                      88


     In light of the impact of drainage on peatland fires, specifically in intact ecosystems
and unproductive land, biophysical intervention with rewetting is necessary. Rewetting
is likely more efficient in an intact ecosystem than in cultivated land. In cultivated land,
and especially where commercial trees like oil palm have already been planted, the
increased water level will affect the production of the commodity, which is better suited
to drained conditions and low water levels. In cultivated land, a rewetting program will
be most effective if a concomitant shift toward paludiculture accompanies it. However,
this option may be less attractive to farmers who must wait a few years to see any
returns from this change, even as they increase their investment in the first two years
of planting. To address this issue, a study in Jambi Province evaluated a mixed cropping
pattern involving native species and plantation crops (Yuniati et al., 2018). Under this
cultivation system, existing commercial trees can be harvested while waiting for the
native species to reach their productive age.
     While drainage levels seem to have less impact on burning in managed areas, we do
not suggest that land be converted from peat forests to plantations. The conversion of
intact peatland to commercial plantations has been found to affect the fire regime in
many regions of Indonesian peatland. In South Sumatra, the industrial plantation has
the highest hotspot density, with consistent appearance of hotspots (R. Putra et al.,
2019). Conservation and protected forests appear to undergo fewer active fires (Albar
et al., 2018), which indicates that the ideal intervention in these areas is to merely
conserve peatland rather than converting it.
     As the extent of the indicative area for social forestry and TORA is just a small part
of the KHG area and is mainly located in areas with shallow-to-moderate peat depth,
we argue that these programs could act as the main vehicle for peatland restoration.
Currently, Indonesia’s land-based mitigation policies still lack an implementation
scheme. To encourage further peatland restoration and revegetation, increased
participation of NPAs (e.g., local government, communities, and the private sector) is
needed, as approximately 40% of the study area is dominated by the concession area.
One way to achieve this would be to develop an innovative financing and incentive
scheme to support sustainable business mechanisms. Currently, Indonesia is still
developing the domestic carbon trade after the release of a presidential regulation on
carbon’s economic value. Furthermore, during the full implementation of domestic
carbon trade, NPAs need to be equipped with knowledge about the Monitoring,
Reporting, and Verifying (MRV) system in order to acquire domestic certification for
emission reductions.
5. CONCLUSION
There was an increasing trend in the area of burned peatland from 2001 to 2020, with
a temporary decrease in 2010. Around 33% of the study area experienced more than
one peatland fire occurrence between 2001 and 2020, with a maximum frequency of
seven fires. This study found that the drainage level determined the frequency of
peatland fires in forest areas. However, the impact of draining intensity was
insignificant in non-forest areas (i.e., managed and unmanaged areas). The significant
impact of extensive peat drainage in the forest area underscores the need for peatland
rewetting to reduce the possibility of repeated fires in areas with dense canal networks.
Despite the low ratio of the burned area to the total area for all canal density classes,
peatland fires in the managed area highlight the need to increase the effectiveness of
land supervision and water management systems.
    While the impact of drainage level on the area of burned peatland was not
significant for the non-forest land category, unmanaged land had a higher ratio of the
burned area to total area extent compared to the forest and managed land. In this case,

Rossita et al. (2023)
```

## Page 14

```text
Forest and Society Vol. 7(1): 76-94                                                                 89


the utilization of this land for productive purposes or land management—particularly
when combined with rewetting and paludiculture—could considerably reduce its
vulnerability to fire. The government’s social forestry and TORA programs present one
possibility for increasing the utilization of unmanaged land; however, the programs
must be conducted carefully to prevent more drainage in the area. Due to the limited
indicative area for social forestry and TORA, it is necessary to involve NPAs in peatland
rewetting and revegetation. The presence of an incentive scheme that makes the
environmental benefits economically apparent, primarily for the private sector, is key
to increasing NPAs’ participation in peat restoration and peat fire prevention.

Author Contributions: R.B., L.H., D.N., and A.RQ. conceived and designed the experiments.; A.R.
and R.B. performed the experiments; A.R., R.B., and L.H. analyzed the data; R.B. and D.N.
contributed reagents/materials/analysis tools; A.R. wrote the paper.

Competing Interests: The authors declare no conflict of interest. The founding sponsors had no
role in the design of the study; in the collection, analyses, or interpretation of data; in the writing
of the manuscript, and in the decision to publish the results.

Acknowledgements: The authors thank the Ministry of Research and Technology/National Agency
for Research and Innovation of the Republic of Indonesia for the research funding provided
through the PMDSU scholarship program, and the Ministry of Environment and Forestry for the
supporting data in this research.

REFERENCES
Agus, F., Santosa, I., Dewi, S., Setyanto, P., Thamrin, S., Wulan, Y. C., & Suryaningrum,
      F. (2013). Pedoman teknis penghitungan baseline emisi dan serapan gas rumah
      kaca sektor berbasis lahan. Badan Perencanaan Pembangunan Nasional.
Albar, I., Jaya, I. N. S., Saharjo, B. H., Kuncahyo, B., & Vadrevu, K. P. (2018). Spatio-
      temporal analysis of land and forest fires in Indonesia using MODIS active fire
      dataset. In K. P. Vadrevu, T. Ohara, & C. Justice (Eds.), Land-atmospheric research
      applications in South and Southeast Asia (pp. 105–127). Springer International
      Publishing. https://doi.org/10.1007/978-3-319-67474-2_6
Anshari, G. Z., Gusmayanti, E., & Novita, N. (2021). The use of subsidence to estimate
      carbon loss from deforested and drained tropical peatlands in Indonesia. Forests,
      12(6). https://doi.org/10.3390/f12060732
Ballhorn, U., Siegert, F., Mason, M., & Limin, S. (2009). Derivation of burn scar depths
      and estimation of carbon emissions with LIDAR in Indonesian peatlands. PNAS,
      106(50), 21213–21218. https://doi.org/doi.org/10.1073/pnas
Cattau, M. E., Harrison, M. E., Shinyo, I., Tungau, S., Uriarte, M., & DeFries, R. (2016).
      Sources of anthropogenic fire ignitions on the peat-swamp landscape in
      Kalimantan, Indonesia. Global Environmental Change, 39, 205–219.
      https://doi.org/10.1016/j.gloenvcha.2016.05.005
Chanda, K., & Maity, R. (2015). Meteorological drought quantification with standardized
      precipitation anomaly index for the regions with strongly seasonal and periodic
      precipitation. Journal of Hydrologic Engineering , 20(12), 06015007.
      https://doi.org/10.1061/(asce)he.1943-5584.0001236
Direktorat IPSDH. (2015). Pemantauan sumber daya hutan Indonesia . Kementrian
      Lingkungan Hidup dan Kehutanan.
Field, R. D., Van Der Werf, G. R., & Shen, S. S. P. (2009). Human amplification of drought-
      induced biomass burning in Indonesia since 1960. Nature Geoscience, 2(3), 185–
      188. https://doi.org/10.1038/ngeo443
Gaveau, D. L., Salim, M. A., Hergoualc'h, K., Locatelli, B., Sloan, S., Wooster, M., ... &

Rossita et al. (2023)
```

## Page 15

```text
Forest and Society Vol. 7(1): 76-94                                                       90


      Sheil, D. (2014). Major atmospheric emissions from peat fires in Southeast Asia
      during non-drought years: evidence from the 2013 Sumatran fires. Scientific
      reports, 4(1), 1-7. https://doi.org/10.1038/srep06112
Giesen, W. (2013). Paludiculture: sustainable alternatives on degraded peat land in
      Indonesia. https://doi.org/10.13140/RG.2.2.15539.73760
Goldstein, J. E., Graham, L., Ansori, S., Vetrita, Y., Thomas, A., Applegate, G., ... &
      Cochrane, M. A. (2020). Beyond slash‐and‐burn: The roles of human activities,
      altered hydrology and fuels in peat fires in Central Kalimantan, Indonesia.
      Singapore Journal of Tropical Geography, 41 (2), 190-208. https://doi.org/
      10.1111/sjtg.12319
Gunawan, H. (2018). Indonesian Peatland Functions: Initiated Peatland Restoration and
      Responsible Management of Peatland for the Benefit of Local Community, Case
      Study in Riau and West Kalimantan Provinces. In Lopez, M., & Suryomenggolo, J.
      (Eds.), Environmental Resources Use and Challenges in Contemporary Southeast
      Asia: Tropical Ecosystems in Transition (pp. 117–138). Springer. https://doi.org/
      10.1007/978-981-10-8881-0_6
Gunawan, H., Kobayashi, S., Mizuno, K., Kono, Y., & Kozan, O. (2016). Sustainable
      Management Model for Peatland Ecosystems in the Riau, Sumatra. In M. Osaki &
      N. Tsuji (Eds.), Tropical Peatland Ecosystems (pp. 113–123). Springer Japan.
      https://doi.org/10.1007/978-4-431-55681-7_7
Harrison, M. E., Page, S. E., & Limin, S. H. (2009). The global impact of Indonesian forest
      fires. Biologist, 56(3), 156–163.
Hayasaka, H., Takahashi, H., Limin, S. H., Yulianti, N., & Usup, A. (2016). Peat fire
      occurrence. In M. Osaki & N. Tsuji (Eds.), Tropical peatland ecosystems (pp. 377–
      395). Springer Japan. https://doi.org/10.1007/978-4-431-55681-7_25
Hirano, T., Segah, H., Kusin, K., Limin, S., Takahashi, H., & Osaki, M. (2012). Effects of
      disturbances on the carbon balance of tropical peat swamp forests. Global
      Change Biology, 18(11), 3410–3422. https://doi.org/10.1111/j.13652486.2012.
      02793.x
Hirano, T., Sundari, S., & Yamada, H. (2016). CO2 Balance of Tropical Peat Ecosystems.
      In M. Osaki & N. Tsuji (Eds.), Tropical Peatland Ecosystems (pp. 329–337).
      Springer. https://doi.org/10.1007/978-4-431-55681-7_21
Hooijer, A., Page, S., Canadell, J. G., Silvius, M., & Kwadijk, J. (2010). Current and future
      CO 2 emissions from drained peatlands in Southeast Asia . 1505–1514.
      https://doi.org/10.5194/bg-7-1505-2010
Hosciło, A., Page, S., & Tansey, K. (2008). The role of fire in the degradation of tropical
      peatlands: a case study from Central Kalimantan. In Wösten, J.H.M., Rieley, J.O. &
      Page, S.E. (Eds.), Restoration of tropical peatlands (pp. 139-142). ALTERRA.
IPCC. (2021). Summary for Policymakers. In Climate Change 2021: The Physical Science
      Basis. Cambridge University Press.
Jauhiainen, J., Limin, S., Silvennoinen, H., & Vasander, H. (2008). Carbon Dioxide and
      Methane Fluxes in Drained Tropical Peat before and after Hudrological
      Restoration. Ecology, 89(12), 3503–3514. https://doi.org/10.1890/07-2038.1
Jayarathne, T., Stockwell, C. E., Gilbert, A. A., Daugherty, K., Cochrane, M. A., Ryan, K.
      C., ... & Stone, E. A. (2018). Chemical characterization of fine particulate matter
      emitted by peat fires in Central Kalimantan, Indonesia, during the 2015 El Niño.
      Atmospheric Chemistry and Physics, 18(4), 2585-2600.. https://doi.org/10.5194/
      acp-18-2585-2018
Khasanah, N., & van Noordwijk, M. (2019). Subsidence and carbon dioxide emissions in
      a smallholder peatland mosaic in Sumatra, Indonesia. Mitigation and Adaptation
      Strategies for Global Change, 24(1), 147–163. https://doi.org/10.1007/s11027-

Rossita et al. (2023)
```

## Page 16

```text
Forest and Society Vol. 7(1): 76-94                                                            91


      018-9803-2
Könönen, M., Jauhiainen, J., Straková, P., Heinonsalo, J., Laiho, R., Kusin, K., ... &
      Vasander, H. (2018). Deforested and drained tropical peatland sites show poorer
      peat substrate quality and lower microbial biomass and activity than unmanaged
      swamp forest. Soil Biology and Biochemistry, 123, 229-241. https://doi.org/
      10.1016/j.soilbio.2018.04.028
LAPAN. (2015). Pedoman pemanfaatan data LANDSAT-8 untuk deteksi daerah terbakar
      (burned area) (Issue September 2014). LAPAN.
Leifeld, J., Wüst-Galley, C., & Page, S. (2019). Intact and managed peatland soils as a
      source and sink of GHGs from 1850 to 2100. Nature Climate Change, 9(12), 945–
      947. https://doi.org/10.1038/s41558-019-0615-5
Lestari, I., Murdiyarso, D., & Taufik, M. (2022). Rewetting Tropical Peatlands Reduced
      Net Greenhouse Gas Emissions in Riau Province , Indonesia .
Lisnawati, Y., Yuwati, T. W., Sovy, N. V., Tryanto, D. Hendry, Utomo, N. A., … & Ansori, T.
      R. (2019). Inisiasi paludikultur di indonesia : pilihan komoditi restorasi kesatuan
      hidrologis gambut. Badan Restorasi Gambut Nasional.
Marlier, M. E., DeFries, R. S., Kim, P. S., Koplitz, S. N., Jacob, D. J., Mickley, L. J., & Myers,
      S. S. (2015). Fire emissions and regional air quality impacts from fires in oil palm,
      timber, and logging concessions in Indonesia. Environmental Research Letters,
      10(8), 085005. https://doi.org/10.1088/1748-9326/10/8/085005
Medrilzam, M., Dargusch, P., Herbohn, J., & Smith, C. (2014). The socio-ecological
      drivers of forest degradation in part of the tropical peatlands of Central
      Kalimantan, Indonesia. Forestry, 87(2), 335–345. https://doi.org/10.1093/
      forestry/cpt033
Miettinen, J., Shi, C., & Liew, S. C. (2011). Influence of peatland and land cover
      distribution on fire regimes in insular Southeast Asia. Regional Environmental
      Change, 11(1), 191–201. https://doi.org/10.1007/s10113-010-0131-7
Miettinen, J., Shi, C., & Liew, S. C. (2017). Fire Distribution in Peninsular Malaysia,
      Sumatra and Borneo in 2015 with Special Emphasis on Peatland Fires.
      Environmental Management, 60(4), 747–757. https://doi.org/10.1007/s00267-
      017-0911-7
Ministry of Environment and Forestry. (2017). Laporan inventarisasi GRK dan
      monitoring, pelaporan, dan verifikasi. Ministry of Environment and Forestry.
Ministry of Environment and Forestry. (2018). Corrective action tata kelola gambut di
      Indonesia menuju ekosistem gambut berkelanjutan . Ministry of Environment and
      Forestry.
Mishra, S., Page, S. E., Cobb, A. R., Lee, J. S. H., Jovani‐Sancho, A. J., Sjögersten, S., ... &
      Wardle, D. A. (2021). Degradation of Southeast Asian tropical peatlands and
      integrated strategies for their better management and restoration. Journal of
      Applied Ecology, 58(7), 1370–1387. https://doi.org/10.1111/1365-2664.13905
Nur’utami, M. N., & Hidayat, R. (2016). Influences of IOD and ENSO to Indonesian
      Rainfall Variability: Role of Atmosphere-ocean Interaction in the Indo-pacific
      Sector. Procedia Environmental Sciences, 33, 196–203. https://doi.org/10.1016/
      j.proenv.2016.03.070
Nurdiati, S., Sopaheluwakan, A., & Septiawan, P. (2021). Spatial and temporal analysis
      of El Niño impact on land and forest fire in Kalimantan and Sumatra. Agromet
      Indonesia, 35(1), 1–10. https://doi.org/10.29244/j.agromet.35.1.1-10
Nurdiati, S., Sopaheluwakan, A., & Septiawan, P. (2022). Joint Distribution Analysis of
      Forest Fires and Precipitation in Response to ENSO, IOD, and MJO (Study Case:
      Sumatra, Indonesia). Atmosphere, 13(4). https://doi.org/10.3390/atmos
      13040537

Rossita et al. (2023)
```

## Page 17

```text
Forest and Society Vol. 7(1): 76-94                                                         92


Page, S. E., Rieley, J. O., & Banks, C. J. (2011). Global and regional importance of the
     tropical peatland carbon pool. Global Change Biology, 17(2), 798–818.
     https://doi.org/10.1111/j.1365-2486.2010.02279.x
Page, S., Hosciło, A., Wösten, H., Jauhiainen, J., Silvius, M., Rieley, J., ... & Limin, S.
     (2009). Restoration ecology of lowland tropical peatlands in Southeast Asia:
     current knowledge and future research directions. Ecosystems, 12(6), 888–905.
     https://doi.org/10.1007/ s10021-008-9216-2
Prayoto, Ishihara, M. I., Firdaus, R., & Nakagoshi, N. (2017). Peatland Fires in Riau,
     Indonesia, in Relation to Land Cover Type, Land Management, Landholder, and
     Spatial Management. Journal of Environmental Protection , 08(11), 1312–1332.
     https://doi.org/10.4236/jep.2017.811081
Priyono, C., Utomo, N., Tryanto, D., Widasmara, M., Sutikno, S., Widayatsari, A., Qomar,
     N., Muhammad, A., Istina, I. N., Batoni, Kurniawan, S., Rifai, A., Taryono, Wibisono,
     M., Savitri, R., Nusirhan, T., Saputra, E., & Hidayati, N. (2019). TORA Lahan Gambut
     (H. Gunawan (ed.)). Peat Restoration Agency.
Putra, E. I., Cochrane, M. A., Vetrita, Y., Graham, L., & Saharjo, B. H. (2016). Degraded
     peatlands, ground water level and severe peat fire occurrences. 15th
     International Peat Congress, January 2010, 327–331. International Peatland
     Society.
Putra, E. I., & Hayasaka, H. (2011). The effect of the precipitation pattern of the dry
     season on peat fire occurrence in the Mega Rice Project area, Central Kalimantan,
     Indonesia. Tropics, 19(4), 145–156. https://doi.org/10.3759/tropics.19.145
Putra, R., Sutriyono, E., Kadir, S., & Iskandar, I. (2019). Understanding of fire distribution
     in the South Sumatra peat area during the last two decades. International Journal
     of GEOMATE, 16(54), 2186–2990. https://doi.org/10.21660/2019.54.8243
Republic of Indonesia. (2016). First Nationally Determined Contribution (Issue
     November 2016).
Republic of Indonesia. (2021). Long-term Strategy on Low Carbon and Climate
     Resilience 2050 (LTS-LCCR 2050).
Ritzema, H., Limin, S., Kusin, K., Jauhiainen, J., & Wösten, H. (2014). Canal blocking
     strategies for hydrological restoration of degraded tropical peatlands in Central
     Kalimantan, Indonesia. Catena, 114, 11–20. https://doi.org/10.1016/j.catena.
     2013.10.009
Roe, S., Streck, C., Obersteiner, M., Frank, S., Griscom, B., Drouet, L., ... & Lawrence, D.
     (2019). Contribution of the land sector to a 1.5 C world. Nature Climate Change,
     9(11), 817–828. https://doi.org/10.1038/s41558-019-0591-9
Rogelj, J., Shindell, D., Jiang, K., Fifita, S., Forster, P., Ginzburg, V., Handa, C., Kheshgi,
     H., Kobayashi, S., Kriegler, E., Mundaca, L., Séférian, R., & Vilariño, M. V. (2018).
     Mitigation Pathways Compatible with 1.5°C in the Context of Sustainable
     Development. In Global Warming of 1.5°C. An IPCC Special Report on the impacts
      of global warming of 1.5°C above pre-industrial levels and related global
      greenhouse gas emission pathways, in the context of strengthening the global
      response to the threat of climate change .
Rossita, A., Boer, R., Hein, L., & Nurrochmat, D. R. (2019). Comparative Study of Methods
     to Estimate Historical Peat Burnt Area in Gaung – Batang Tuaka River of Peat
     Hydrological Unit (KHG). IOP Conference Series: Earth and Environmental
     Science.
Rossita, A., Boer, R., Hein, L., & Nurrochmat, D. R. (2019, November). Comparative study
     of methods to estimate historical peat burnt area in Gaung–Batang Tuaka river of
     peat hydrological unit (KHG). IOP Conference Series: Earth and Environmental
     Science 363(1), 012026. http://dx.doi.org/10.1088/1755-1315/363/1/012026

Rossita et al. (2023)
```

## Page 18

```text
Forest and Society Vol. 7(1): 76-94                                                        93


Rossita, A., Nurrochmat, D. R., Boer, R., Hein, L., & Riqqi, A. (2021). Assessing the
      monetary value of ecosystem services provided by Gaung – Batang Tuaka Peat
      Hydrological Unit (KHG), Riau Province. Heliyon, 7(10), e08208.
      https://doi.org/10.1016/j.heliyon.2021.e08208
Shiodera, S., Yabe, K., Itoh, M., Kozan, O., Atikah, T. D., & Rahajoe, J. S. (2016). Species
      composition and environmental factors of grasslands developing on the burnt
      peatlands in Sumatra, Indonesia. 15th International Peat Congress, 230–232.
Sloan, S., Locatelli, B., Wooster, M. J., & Gaveau, D. L. A. (2017). Fire activity in Borneo
      driven by industrial land conversion and drought during El Niño periods, 1982–
      2010. Global Environmental Change , 47, 95–109. https://doi.org/10.1016/
      j.gloenvcha.2017.10.001
Suryadiputra, I. N. N., Dohong, A., Roh, S. B. W., Muslihat, L., Lubis, I. R., Hasudungan,
      F., & Wibisono., I. T. C. (2005). Panduan penyekatan parit dan saluran di lahan
      gambut bersama masyarakat. Wetlands International Indonesia.
Tata, H. L. (2019). Paludiculture: Can it be a trade-off between ecology and economic
      benefit on peatland restoration? IOP Conference Series: Earth and Environmental
      Science, 394(1), 012061. https://doi.org/10.1088/1755-1315/394/1/012061
Taufik, M., Setiawan, B. I., & Van Lanen, H. A. J. (2019). Increased fire hazard in human-
      modified wetlands in Southeast Asia. Ambio, 48(4), 363–373. https://doi.org/
      10.1007/s13280-018-1082-3
Taufik, M., Torfs, P. J. J. F., Uijlenhoet, R., Jones, P. D., Murdiyarso, D., & Van Lanen, H.
      A. J. (2017). Amplification of wildfire area burnt by hydrological drought in the
      humid tropics. Nature Climate Change, 7(6), 428–431. https://doi.org/10.1038/
      nclimate3280
Thoha, A. S., Saharjo, B. H., Boer, R., & Ardiansyah, M. (2017). Forest and land fires
      hazard level modeling: case study of Kapuas, Central Kalimantan. In Disaster Risk
      Reduction in Indonesia (pp. 539–560). Springer International Publishing.
      https://doi.org/10.1007/978-3-319-54466-3_22
Turetsky, M. R., Benscoter, B., Page, S., Rein, G., Van Der Werf, G. R., & Watts, A. (2015).
      Global vulnerability of peatlands to fire and carbon loss. Nature Geoscience, 8(1),
      11–14. https://doi.org/10.1038/ngeo2325
Uda, S. K., Hein, L., & Adventa, A. (2020). Towards better use of Indonesian peatlands
      with paludiculture and low-drainage food crops. Wetlands Ecology and
      Management, 28(3), 509–526. https://doi.org/10.1007/s11273-020-09728-x
Vadrevu, K. P., Lasko, K., Giglio, L., Schroeder, W., Biswas, S., & Justice, C. (2019). Trends
      in Vegetation fires in South and Southeast Asian Countries. Scientific Reports,
      9(1), 1–13. https://doi.org/10.1038/s41598-019-43940-x
Van der Werf, G. R., Dempewolf, J., Trigg, S. N., Randerson, J. T., Kasibhatla, P. S., Giglio,
      L., ... & DeFries, R. S. (2008). Climate regulation of fire emissions and
      deforestation in equatorial Asia. Proceedings of the National Academy of Sciences
      of the United States of America, 105(51), 20350–20355. https://doi.org/10.1073/
      pnas.0803375105
Ward, C., Stringer, L. C., Warren-Thomas, E., Agus, F., Crowson, M., Hamer, K., ... & Hill,
      J. K. (2021). Smallholder perceptions of land restoration activities: rewetting
      tropical peatland oil palm areas in Sumatra, Indonesia. Regional Environmental
      Change, 21(1), 1–17. https://doi.org/10.1007/s10113-020-01737-z
Widyastuti, K., Imron, M. A., Pradopo, S. T., Suryatmojo, H., Sopha, B. M., Spessa, A., &
      Berger, U. (2021). PeatFire: an agent-based model to simulate fire ignition and
      spreading in a tropical peatland ecosystem. International Journal of Wildland
      Fire, 30(2), 71-89. https://doi.org/10.1071/WF19213
Wösten, J. H. M., Van Den Berg, J., Van Eijk, P., Gevers, G. J. M., Giesen, W. B. J. T.,

Rossita et al. (2023)
```

## Page 19

```text
Forest and Society Vol. 7(1): 76-94                                                  94


     Hooijer, A., ... & Wibisono, I. T. (2006). Interrelationships between hydrology and
     ecology in fire degraded tropical peat swamp forests. Water Resources
     Development, 22(1), 157–174. https://doi.org/10.1080/07900620500405973
Yuniati, D., Nurrochmat, D. R., Anwar, S., & Darwo, D. (2018). Penetapan pola
     rehabilitasi pemulihan fungsi ekosistem hutan lindung gambut Sungai Bram Itam
     di Kabupaten Tanjung Jabung Barat, Provinsi Jambi. Jurnal Penelitian Hutan
     Tanaman, 15(2), 67–85. https://doi.org/10.20886/jpht.2018.15.2.67-85




Rossita et al. (2023)
```
