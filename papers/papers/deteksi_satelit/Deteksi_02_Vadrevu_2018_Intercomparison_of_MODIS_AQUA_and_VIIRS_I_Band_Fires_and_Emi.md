# Verbatim PDF Transcript

- Source PDF: `Deteksi_02_Vadrevu_2018_Intercomparison_of_MODIS_AQUA_and_VIIRS_I_Band_Fires_and_Emi.pdf`
- Original upload filename: `Deteksi_02_Vadrevu_2018_Intercomparison_of_MODIS_AQUA_and_VIIRS_I_Band_Fires_and_Emi.pdf`
- Source PDF SHA-256: `b3a28b65d08ae1c9e07871994b2648fadce91f6bbf7ea9c7226007f39cc8cb93`
- Extraction method: `pdftotext -layout`
- Pages: 17

This file preserves native PDF text with page boundaries. Tesseract OCR supplements pages where the native text layer is empty or corrupted.

## Page 1

```text
           remote sensing
Article
Intercomparison of MODIS AQUA and VIIRS I-Band
Fires and Emissions in an Agricultural
Landscape—Implications for Air Pollution Research
Krishna Vadrevu 1, * and Kristofer Lasko 2 ID
 1    NASA Marshall Space Flight Center, Huntsville, AL 35812, USA
 2    Department of Geographical Sciences, University of Maryland, College Park, MD 20740, USA;
      klasko@umd.edu
 *    Correspondence: krishna.p.vadrevu@nasa.gov
                                                                                                    
 Received: 16 May 2018; Accepted: 19 June 2018; Published: 21 June 2018                             


 Abstract: Quantifying emissions from crop residue burning is crucial as it is a significant source of
 air pollution. In this study, we first compared the fire products from two different sensors, the Visible
 Infrared Imaging Radiometer Suite (VIIRS) 375 m active fire product (VNP14IMG) and Moderate
 Resolution Imaging Spectroradiometer (MODIS) 1 km fire product (MCD14ML) in an agricultural
 landscape, Punjab, India. We then performed an intercomparison of three different approaches for
 estimating total particulate matter (TPM) emissions which includes the fire radiative power (FRP)
 based approach using VIIRS and MODIS data, the Global Fire Emissions Database (GFED) burnt area
 emissions and a bottom-up emissions approach involving agricultural census data. Results revealed
 that VIIRS detected fires were higher by a factor of 4.8 compared to MODIS Aqua and Terra sensors.
 Further, VIIRS detected fires were higher by a factor of 6.5 than Aqua. The mean monthly MODIS
 Aqua FRP was found to be higher than the VIIRS FRP; however, the sum of FRP from VIIRS was
 higher than MODIS data due to the large number of fires detected by the VIIRS. Besides, the VIIRS
 sum of FRP was 2.5 times more than the MODIS sum of FRP. MODIS and VIIRS monthly FRP data
 were found to be strongly correlated (r2 = 0.98). The bottom-up approach suggested TPM emissions
 in the range of 88.19–91.19 Gg compared to 42.0–61.71 Gg, 42.59–58.75 Gg and 93.98–111.72 Gg using
 the GFED, MODIS FRP, and VIIRS FRP based approaches, respectively. Of the different approaches,
 VIIRS FRP TPM emissions were highest. Since VIIRS data are only available since 2012 compared to
 MODIS Aqua data which have been available since May 2002, a prediction model combining MODIS
 and VIIRS FRP was derived to obtain potential TPM emissions from 2003–2016. The results suggested
 a range of 2.56–63.66 (Gg) TPM emissions per month, with the highest crop residue emissions during
 November of each year. Our results on TPM emissions for seasonality matched the ground-based
 data from the literature. As a mitigation option, stringent policy measures are recommended to
 curtail agricultural residue burning in the study area.

 Keywords: remote sensing; emissions; crop residue burning; active fires; fire radiative power




1. Introduction
     In several regions of the world, biomass burning is one of the significant sources of atmospheric
aerosols and trace gas emissions, which have a significant impact on climate and human health [1–3].
In addition to forest biomass burning, crop residue burning is prevalent in several countries of
Asia [4–9]. In India, the key agricultural residues generated (in million metric tons, MMT) include rice
straw (112), rice husk (22.4), wheat straw (109.9), sugarcane tops (97.8) and bagasse (101.3), most of
which are burnt in open air [2]. Several studies have shown smoke particles from biomass burning


Remote Sens. 2018, 10, 978; doi:10.3390/rs10070978                        www.mdpi.com/journal/remotesensing
```

## Page 2

```text
Remote Sens. 2018, 10, 978                                                                          2 of 17



impacting radiative forcing by scattering and absorbing shortwave radiation and indirect radiative
forcing by serving as cloud-condensation nuclei (CCN) and changing the cloud microphysical and
optical properties [10–12]. The magnitude and signs of aerosol radiative forcing are mainly determined
by the scattering and absorption characteristics of aerosols released during biomass burning [13,14].
Specifically, crop residue burning has been reported to emit CO, non-methane hydrocarbons (NMHC),
NOx, SO2 , particulate matter and other greenhouse gases (CO2 , N2 O, and CH4 ) [15–17]. Also,
crop residue burning and biomass burning pollution, in general, is known to cause severe health effects
such as chronic obstructive pulmonary disease (COPD), pneumoconiosis, pulmonary tuberculosis,
bronchitis, cataract, corneal opacity and blindness [18,19]. Further, crop residue burning releases a
significant amount of smoke which can reduce visibility, thus causing road accidents [2,20].
      In South Asia, the Indo Gangetic Plains (IGP) straddling the northeastern parts of India near the
foothills of the Himalayas is one of the most densely populated regions in the world, with substantial
anthropogenic emissions. In addition to factories and vehicular traffic, agricultural crop residue
burning is one of the major contributors to pollution in the region [21–25]. Mostly, farmers burn
agricultural residues during the summer (April–May) and winter (October–November) each year
in the IGP, which has a significant impact on greenhouse gas emissions and aerosol loading [3,15].
The IGP in India covers 20% of the geographical area, contributes 42% to the total food grain production
and holds nearly 40% of the total population [21]. In India, the IGP includes Punjab, Haryana and
western Uttar Pradesh which are mostly dominated by agriculture [3,21]. Rice-wheat crop rotation is
commonly practiced in the IGP. Mostly, farmers use combines for harvesting wheat during summer
and rice during the winter season. Combines leave behind large quantities of residues in the field
which is difficult to remove; thus farmers burn the residues. Specifically, in Punjab, earlier studies on
estimating emissions from crop residue burning have used agricultural production data, a crop specific
residue-to-product ratio, an estimate of the proportion of residue subject to burning, emission factors,
and a combustion factor [23–25].
      Compared to agricultural production-based emission estimates, use of remote sensing technology
for quantifying fires and the resulting emissions has a huge potential [26–29]. Satellite remote
sensing technology with its multi-spectral, multi-temporal, synoptic and repetitive coverage can
provide useful information on the fire cycle, type of vegetation burnt, amount of vegetation burnt
including intensities [29–37]. Currently, three different fire products are derived from the polar and
geostationary satellite sensors: (a) active fires which can be detected through the elevated thermal
radiance signal typical of flaming and smoldering conditions [36–38]; (b) burned area product derived
mostly through measuring the changes in surface reflectance before and after the fire from red,
near infrared and short-wave infrared channels [39,40] and (c) fire radiative power (FRP) products
based on the measured rate of radiant energy output of the detected fires [28,33,35]. Using these fire
products, earlier researchers quantified the emissions from different landscapes, including forests,
savannas, grasslands and agricultural fires [38,41]. In addition to Moderate Resolution Imaging
Spectroradiometer (MODIS) (http://modis-fire.umd.edu/index.php), fire products from Visible
Infrared Imaging Radiometer Suite (VIIRS) data (http://VIIRSfire.geog.umd.edu/) are readily
available. While the potential of remote sensing data for fire detection and estimating the resulting
emissions is well recognized, recent research suggests significant under-detection of burnt areas in the
agricultural landscapes [37]. Also, sensor differences, including resolution, along-scan aggregation,
and swath width can result in differences in fire detection as in the case of MODIS and VIIRS
fire detection [37]. Some of the methods to mitigate fire emissions underestimation due to clouds,
view angles and swath gaps can be found in the literature [42,43].
      Thus, there is a strong need to evaluate different fire products, especially in agricultural regions
and landscapes to assess their potential and limitations for emissions estimation. The analysis needs
to be region-specific and source-specific to generate useful emission estimates to enable emissions
mitigation. In this study, we focus on the Punjab state in the IGP where agricultural residue burning is
```

## Page 3

```text
Remote Sens. 2018, 10, 978                                                                                                       3 of 17



prevalent, for quantifying emissions using both the MODIS and VIIRS satellite-derived fire datasets.
We address the following questions.
     How does the MODIS (MCD14ML) fire product compare with the VIIRS (VNP14IMG) fire product
in the agricultural landscape of Punjab, India? What are the seasonal differences? How does FRP
vary between MODIS Aqua and VIIRS (VNP14IMG) satellite data? What are the implications of using
MODIS versus VIIRS FRP data for emissions estimation? How do bottom-up emission estimates
integrating   crop
           Remote     production
                  Sens. 2018, 10,        data
                                  x FOR PEER    compare with satellite-derived Global Fire Emissions
                                             REVIEW                                                             3 of 17 Database

(GFED) emissions,         as well as MODIS and VIIRS FRP based emission estimates? We answered the
                How does the MODIS (MCD14ML)) fire product compare with the VIIRS (VNP14IMG) fire
           productby
above questions          integrating
                     in the               ground-based
                              agricultural landscape       cropIndia?
                                                     of Punjab,  production     data,seasonal
                                                                       What are the    both regional    and
                                                                                              differences?       does emission
                                                                                                             general
                                                                                                           How
             satellite
factors andFRP            data MODIS
                vary between       (MODIS     andand
                                            Aqua   VIIRS).
                                                     VIIRS The    resultssatellite
                                                            (VNP14IMG)    provide     valuable
                                                                                   data?         insights
                                                                                         What are the             crop burning
                                                                                                            into of
                                                                                                      implications
           using   MODIS       versus
related emissions in Punjab, India.     VIIRS  FRP  data for  emissions estimation?   How  do   bottom-up   emission
           estimates integrating crop production data compare with satellite-derived Global Fire Emissions
           Database (GFED) emissions, as well as MODIS and VIIRS FRP based emission estimates? We
2. Materials and Methods
           answered the above questions by integrating ground-based crop production data, both regional and
           general emission factors and satellite data (MODIS and VIIRS). The results provide valuable insights
2.1. Study into
           Areacrop burning related emissions in Punjab, India.
     Punjab   is a state in northern India (Figure 1) with border states of Jammu and Kashmir to the north,
          2. .Materials and Methods
Himachal Pradesh to the east, Haryana to the south and southeast, Rajasthan to the southwest, and the
          2.1. Study Area
Pakistan province       of Punjab to the west (https://en.wikipedia.org/wiki/Punjab,India). The total
geographical areaPunjabofis a
                          thestate
                                state
                                    in is  5.036 India
                                        northern   million     hectares
                                                          (Figure   1) with(ha)
                                                                             border   which
                                                                                  of states of the  cultivable
                                                                                                Jammu and                  4.20 million
                                                                                                                  areatoisthe
                                                                                                              Kashmir
          north,  Himachal    Pradesh    to the east, Haryana    to the south  and  southeast,   Rajasthan
ha and the net area sown during 2015–2016 was 4.138 million ha (http://agripb.gov.in). Ninety-nine         to the southwest,
          and the Pakistan province of Punjab to the west (https://en.wikipedia.org/wiki/Punjab,India). The
percent of the net sown area is under irrigated agriculture through canals, tube wells and other water
          total geographical area of the state is 5.036 million hectares (ha) of which the cultivable area is 4.20
sources (http://agripb.gov.in).
          million ha and the net areaOn       sownaverage,      rice (37.15%)
                                                      during 2015–2016              andmillion
                                                                            was 4.138     wheatha(48.76%)        together constitute
                                                                                                      (http://agripb.gov.in).
85.91% of grown
          Ninety-ninecrops.   Crops
                          percent       such
                                   of the   net as maize,
                                                sown   area isjowar,
                                                                under cotton,
                                                                        irrigated and
                                                                                   agriculture    constitute
                                                                                         othersthrough                  wellsof the total
                                                                                                                  tube14%
                                                                                                                only
                                                                                                          canals,
          and other water sources
cropped area                           (http://agripb.gov.in). On average, riceIn
                (http://agripb.gov.in/home.php?page=astat).                          (37.15%)
                                                                                       this and
                                                                                            region, wheat  (48.76%)
                                                                                                       rice is       together
                                                                                                                usually   grown in the
          constitute 85.91% of grown crops. Crops such as maize, jowar, cotton, and others constitute only 14%
wet summer season (sown in July–August and harvested in October–November) and wheat in the
          of the total cropped area (http://agripb.gov.in/home.php?page=astat). In this region, rice is usually
dry wintergrown
            season     (sown
                   in the        in November–December
                           wet summer      season (sown in July–August and harvested
                                                                              and harvestedin April–May).        The summer
                                                                                               in October–November)      and      wheat
residue burning     season
          wheat in the     dry is during
                                winter  seasonApril
                                                 (sown and
                                                         in May, and        winter rice
                                                            November–December          and residue
                                                                                            harvested inburning          The October
                                                                                                                    is during
                                                                                                            April–May).
          summerThe
and November.        wheat   residue burning
                           agricultural          season
                                             fires       is during
                                                    captured       byApril
                                                                       the and   May,NPP
                                                                             Suomi           VIIRSrice
                                                                                        and winter        residue
                                                                                                       data   on 25burning  is
                                                                                                                       October   2017 in
          during October and November. The agricultural fires captured by the Suomi NPP VIIRS data on 25
Punjab, northwest India is shown in Figure 2. More details about the seasonal characteristics of crop
          October 2017 in Punjab, northwest India is shown in Figure 2. More details about the seasonal
residue burning     and causative
          characteristics                 factors
                            of crop residue         areand
                                              burning    given     in [32].
                                                             causative    factors are given in [32].




                        Study1. area
              Figure 1.Figure   Study area location
                                     location   map map depicting Punjab
                                                      depicting   Punjabstate in in
                                                                          state India with with
                                                                                    India  different districts. districts.
                                                                                                  different
```

## Page 4

```text
Remote Sens. 2018, 10, 978                                                                                                4 of 17
 Remote Sens. 2018, 10, x FOR PEER REVIEW                                                                                4 of 17




       Figure 2. Agricultural fires (in red) occurring in Punjab, India retrieved from the Visible Infrared
      Figure 2. Agricultural fires (in red) occurring in Punjab, India retrieved from the Visible Infrared
       Imaging Radiometer Suite (VIIRS) on 25 October 2017 during crop residue burning (Source: NASA
      Imaging Radiometer Suite (VIIRS) on 25 October 2017 during crop residue burning (Source:
       WorldView).
      NASA WorldView).

       In addition to local pollution, the residue burning in Punjab and Haryana has been causing an
      In
 immense addition   to local
             pollution        pollution,
                        problem     in the the  residue
                                            capital       burning
                                                    city of        in Punjab
                                                            India, New   DelhiandwhichHaryana     hastobeen
                                                                                          lies close         causing
                                                                                                        the above     an
                                                                                                                    two
immense     pollution   problem    in the  capital  city of India, New    Delhi   which    lies
 states [44]. Although, both the Haryana and Punjab governments have imposed a ban on burning ofclose to the above   two
states
 paddy  [44]. Although,
          residues,        both
                     farmers     thepractice
                               still   Haryana     and Punjab
                                                residue           overnments
                                                         burning as the    time gap      imposed
                                                                                  havebetween        a ban on
                                                                                                   Rabi         burning
                                                                                                         planting,  and
    paddy
ofKharif    residues,is two
          harvesting    farmersto still  practicethus,
                                  three weeks;      residue   burning
                                                         burning   of as
                                                                      residue      the gap
                                                                            theistime         between
                                                                                       fastest way    to Rabi  planting,
                                                                                                         clear the land
 for Kharif
and           harvesting
      the winter          is two
                   crop. The      to threeofweeks;
                               removal        paddythus,    burning
                                                       stalks        of residue is the
                                                              after harvesting           fastest way tothus,
                                                                                     labor-intensive;           the land
                                                                                                          clearfarmers
for the winter
 prefer  burning crop.
                   the The   removal
                       residues         of paddy
                                  [3,15].  However,    theafter
                                                   stalks  residue             labor-intensive;
                                                                    burningisreleases
                                                                harvesting              smoke and  thus, farmers
                                                                                                      aerosol      prefer
                                                                                                               particles
burning
 leadingthe    residuesair
           to adverse    [3,15]. However,
                            quality           the risks
                                     and health   residue   burning releases smoke and aerosol particles leading
                                                         [18–21].
to adverse air quality and health risks [18–21].
 2.2. Emissions Estimation Using Agricultural Census Data
2.2. Emissions Estimation Using Agricultural Census Data
       We calculated the maximum potential emissions from crop residue burning based on the
      We
 followingcalculated
              equationthe  maximum potential emissions from crop residue burning based on the following
                        [21,24,25,45]:
equation [21,24,25,45]:
                                                  n
                                      ECBR
                                    ECBR == ∑ AA× BB × C
                                                       C × DD ×EE ×F F                                                     (1)(1)
                                                Crops

where     ECBR is
  whereECBR       is the
                     the emissions
                          emissions fromfromcrop cropresidue
                                                        residueburning
                                                                  burning(in(inGg),
                                                                                  Gg),A is
                                                                                         A the          cropcrop
                                                                                                 totaltotal
                                                                                             is the           production
                                                                                                                    production(in
  million
(in        tonnes),
     million  tonnes),B isBthe  residue
                            is the  residue    product
                                           to to          ratio, C
                                                    product    ratio, theisdry
                                                                   is C         mattermatter
                                                                            the dry      fraction, D    is the
                                                                                                 fraction,     fraction
                                                                                                             D is         burnt
                                                                                                                   the fraction
  and Eand
burnt     is E
             theis the
                  fraction  oxidized
                        fraction         and Fand
                                   oxidized       is F
                                                     theis the
                                                           emission   factor for
                                                                 emission    factortotal  particulate
                                                                                     for total                    (TPM).
                                                                                                          mattermatter
                                                                                                 particulate                The
                                                                                                                         (TPM).
  following   crops   were  considered      for  ECBR:    upland   rice, paddy   rice, wheat,
The following crops were considered for ECBR: upland rice, paddy rice, wheat, sugarcane, cotton, sugarcane,    cotton,   Kharif
  (monsoon)
Kharif         growngrown
         (monsoon)       pulses,pulses,
                                  Rabi (winter)       oil seeds
                                           Rabi (winter)          and Kharif
                                                             oil seeds          (monsoon)
                                                                         and Kharif   (monsoon) oilseeds.   We gathered
                                                                                                       oilseeds. We gathered the
  crop
the     production
     crop  production values   fromfrom
                          values     the office    of the
                                            the office   ofDirectorate   of Agriculture,
                                                            the Directorate                 Government
                                                                               of Agriculture,               of Punjab,
                                                                                                    Government            India
                                                                                                                      of Punjab,
India statistical division. Of the total production, rice accounts for 31.92%, paddy for 21.39%, wheatfor
  statistical division.   Of  the  total   production,     rice  accounts   for 31.92%,    paddy     for  21.39%,    wheat     for
30.37%,     sugarcaneforfor
  30.37%,sugarcane            10.98%,
                           10.98%,    rabirabi   oilseeds
                                             oilseeds       for 0.10%,
                                                       for 0.10%,   KharifKharif  oilseeds
                                                                            oilseeds           for 0.006%,
                                                                                       for 0.006%,            sunflowers
                                                                                                       sunflowers             for
                                                                                                                     for 0.178%,
and   totaland
  0.178%,        totalpulses
             Kharif    Khariffor pulses   for 0.017%.
                                    0.017%.               The residue
                                                 The residue             to product
                                                                 to product    ratios ratios
                                                                                       used wereused were    as follows,
                                                                                                       as follows,    rice: rice:
                                                                                                                             1.50;
  1.50; wheat   1.70;  maize    1.50;  sugarcane:      0.40;  cotton:  3.0; oilseeds:   2.2;  pulses:
wheat 1.70; maize 1.50; sugarcane: 0.40; cotton: 3.0; oilseeds: 2.2; pulses: 1.50 [23–25,45]. Dry matter1.50 [23–25,45].    Dry
  matter fraction has been estimated as eighty percent of the total production and the fraction oxidized
```

## Page 5

```text
Remote Sens. 2018, 10, 978                                                                         5 of 17



fraction has been estimated as eighty percent of the total production and the fraction oxidized as eighty
percent following the IPCC 1996 guidelines [46]. The emission factor for total particulate matter (TPM)
emission rates for agricultural residues in Asia vary from 4.53–8.75 g/kg for different types of residues
burnt [8]. In this study, we used a mean of 6.64 g/kg while estimating the TPM emissions using the
ground-based dry matter burnt approach as well as GFED emissions.

2.3. VIIRS I-Band Fire Product
     The first VIIRS was launched in October 2011 aboard the Suomi-National Polar-orbiting
Partnership (S-NPP) satellite. The VIIRS instrument carries two separate sets of multi-spectral
channels providing full global coverage at both 375 m and 750 m nominal resolutions every
12 h or less depending on the latitude. The VIIRS satellite incorporates fire-sensitive channels,
including a dual-gain, high-saturation temperature 4 µm channel, enabling active fire detection and
characterization. The active fire product, based on the 375 m (I-bands) and 750 m moderate resolution
“M” bands of VIIRS, are currently generated [37]. In this study, we specifically used the VIIRS 375 m
active fire product (VNP14IMG). The algorithm for this product builds on the well-established MODIS
Fire and Thermal Anomalies product using a contextual approach to detect thermal anomalies [37].
Due to its higher spatial resolution, the VNP14IMG active fire product captures more fire pixels than
the MODIS MCDML product [37,47]. Specific to the FRP, the VNP14IMG FRP is calculated through
a combination of both VIIRS 375 m and 750 m data. The former is used to identify fire-affected,
cloud (solid blue), water (dashed blue), and valid background pixels. Then, co-located M13 channel
radiance data (750 m) coinciding with fire pixels and valid background pixels are used in the FRP
calculation. More details about the product can be found in [37].

2.4. MODIS Active Fire Products
      We used the latest collection of 6.1 MODIS active fire products (MCD14ML) from the University
of Maryland College Park (http://modis-fire.umd.edu/index.php). The active fire dataset is at a 1 km
nominal spatial resolution; however, it can detect flaming fires up to 50 m2 under ideal observation
conditions [34,47]. The MODIS fire product provides the latitude and longitude of the fire pixels,
the date and time of the fire detection, and its fire radiative power (FRP). The FRP is a quantitative
measure of radiant heat output commonly used to approximate fire intensity, which is proportional to
its combustion rate and smoke emissions [29,30,33,35,48,49].

2.5. Fire Radiative Power Products and Emissions
     Fire Radiative Power (FRP) is the rate of fire energy released per unit time, measured in
megawatts [33,35]. Fire radiative energy (FRE) is therefore, FRP integrated over time and space with
units in mega joules. The MODIS FRP (MW) is calculated using the Wooster et al. 2003 approach [33]
in which FRP is approximated as
                                              A pix σ         
                                       FRP ≈          L4 − L4                                    (2)
                                               a τ4
where L4 is the 4 µm radiance of the fire pixel, L4 is the 4 µm background radiance, Apix is the area
of the MODIS pixel (which varies as a function of scan angle), σ is the Stefan-Boltzmann constant
(5.6704 × 10−8 W m−2 K−4 ), τ4 is the atmospheric transmittance of the 4 µm channel, and a is a
sensor-specific empirical constant. For MODIS, a = 3.0 × 10−9 W m−2 sr−1 µm−1 K−4 when radiance
is expressed in units of W m−2 sr−1 µm−1 [47].
     For the VIIRS 375 m (VNP14IMG) product, 375 m mid-IR (I4) radiance data for FRP retrieval is not
used due to frequent data saturation/folding. Quality flags (QF1) assigned during L1B onboard data
aggregation will not indicate partial saturation. Instead, FRP is retrieved using co-located dual-gain
mid-IR M13 channel (750 m) for all fire pixels detected using 375 m data and then divided by two to
get 375 m FRP [37].
```

## Page 6

```text
Remote Sens. 2018, 10, 978                                                                          6 of 17



      FRP measurements have been previously related to the amount of biomass burnt [33,35],
the strength of fires [28] and aerosol emissions [50–53]. The FRE based emission coefficients for
quantifying the gas and aerosol emissions from biomass burning have been developed by [33] from
field experiments and by [48] from laboratory measurements. Further, References [51–53] demonstrated
the utility of a an FRE based approach to quantifying biomass burning emissions of organic and black
carbon aerosols.
      References [33,53] inferred that mass of smoke aerosol released from biomass burning can be
linearly related to FRE. Reference [53] related the rate of aerosol emission (Rosa in kg/s) to FRP as:

                                             Rosa = Ce * FRP                                           (3)

where Ce is the coefficient that directly relates radiative power from fire to its smoke aerosol emission
rate (coefficients of emission in kg/MJ for particulate matter) and mass of smoke aerosol emission
(Mesa ) as:
                                              Mesa = Ce * FRE                                          (4)

     Using the above approach, Reference [53] developed a global emissions inventory product entitled
“Fire Energetics and Emissions Research (FEER)” based on collocated satellite FRP and aerosol optical
thickness (AOT) observations. Inferred total particulate matter emission rates are linked to observe
FRP. The estimated TPM emission coefficients allow direct conversion from time-integrated FRP to
emitted particulate matter without invoking the emission factors [53].
     In this study, using the above approach from [53], we derived the TPM emissions from agricultural
residue burning in Punjab using MODIS (2003–2016) and VIIRS (2012–2016) datasets. Specifically,
we used only the FEER coefficient (kg/MJ) of TPM emission and not the total FEER inventory as we
focused on a small study area dominated by agricultural fires in India. The FEER TPM coefficients fall
within 0.01 and 0.1 kg/MJ for different land cover type related fires, and specifically for agricultural
landscapes, we used a value of 0.04 kg/MJ [53]. Since geostationary data was lacking to capture
diurnal fire cycles in the study region, we used the sum of FRP to arrive at the mass of smoke aerosol
emissions. We used MODIS as well as VIIRS FRP to characterize the differences in TPM emissions for
different years, for comparative purpose. Besides, we also compared the emissions derived from the
dry matter burnt approach and GFED emissions for TPM emissions.

2.6. GFED Emissions Product
     The Global Fire Emission Database (GFED) [54] comprises emissions from grassland, savanna,
and forest fires, including deforestation fires. In the GFED, emissions are calculated as the product
of MODIS burned area, estimated dry fuel loads derived from satellite net primary productivity,
combustion completeness, and generalized land cover emission factors [54,55]. Satellite-derived
burned areas drive the fire module of a CASA biogeochemical model that calculates fuel loads for each
month and grid cell. Combustion completeness is also calculated in the model based on fuel types and
moisture conditions. The latest version of GFED (Version 4s) has a spatial resolution of 0.25 degrees and
is available from 1997–present. In this version, the burned area from “small” fires based on active fire
detection outside the burned area maps are also included [http://www.globalfiredata.org/data.html].
In this study, we used the GFED data from 2003 onwards and used the particulate matter emission
factor from [16] to estimate the emissions for Punjab from 2012–2016.

2.7. Temporal Emissions Integrating MODIS and VIIRS
     VIIRS data is available only from 2012, whereas MODIS Aqua data is from May 2002–present;
thus, to account for the VIIRS temporal FRP-based emissions prior to 2012, a prediction model with the
```

## Page 7

```text
Remote Sens. 2018, 10, 978                                                                       7 of 17



peak Gaussian fit has been derived with MODIS Sum of FRP as the regressor (x) variable and VIIRS
Sum of FRP as the response (y) variable. The resulting model is given as:
                                                                    2 !!
                                             ( MODISFRPSU M − b)
                                         
                                    1
                             aExp −                                                                 (5)
                                    2                 c

where a is the peak value; b is the critical point and c is the growth rate. For developing the model,
we partitioned seventy percent of the original data into training data and used the remaining thirty
percent for validating the model. Using the model parameters and MODIS sum of FRP from the testing
dataset, we derived the VIIRS sum of FRP values. We then compared the latter values with the true
VIIRS sum of FRP from the testing dataset. Also, we used a mean absolute percentage error (MAE)
statistic as a measure of model performance as

                                                    N
                                                1
                                      MAE =       ∗ ∑ |tk − yk |                                    (6)
                                                N k =1

where, yk and tk denote the model output and measured value from the kth element; y and z denote
their average respectively, and N represents the number of observations. The peak FRP value was
found to be 352,075.2, with a critical point of 1,696,447.6 and growth rate of 67,796.4 and the overall
model fit had the highest r2 of 0.93. Using these parameters, we derived the TPM emissions from
2003–2016.

3. Results

3.1. MODIS versus VIIRS Fire Counts
      Averaged across fourteen years (2003–2016), the combined MODIS Aqua and Terra fire counts
for Punjab were found to be 18,270 (σ = 2521). In contrast, fire counts from VIIRS data averaged
across five years (2012–2016) suggested 87,702 fire counts (σ = 10,352), almost 4.8 times higher than
the MODIS data (Figure 3a,b). Further, mean MODIS Aqua fire counts (2003–2016) were found to be
13,489 compared to mean VIIRS fire counts (2012–2016) of 87,702, the latter being higher by a factor of
6.5 than Aqua. Further, the mean monthly MODIS Aqua FRP was found to be 16.10 (MW) compared
to the mean VIIRS FRP of 5.25 (MW). The sum of fire radiative power (FRP) from MODIS and VIIRS
for the 2016 peak months of summer (April) and winter (November) are shown in Figure 4a,b and
Figure 4c,d, respectively. The annual sum of VIIRS FRP was found to be 2.25 times more than the
annual sum of MODIS FRP. For example, averaged across five years (2012–2016), the annual sum of
FRP for VIIRS was 622,420 MW compared to the MODIS annual sum of FRP 276,000 MW.
      FRP data has been gridded at five arc minute grid intervals (10 km cells). Higher FRP during
November captured by VIIRS data can be seen in the Figure 4d. Seasonal variations in the monthly sum
of FRP and mean FRP are shown in Figure 5a,b. The mean monthly MODIS Aqua FRP was found to
be 16.10 (MW) compared to mean VIIRS FRP of 5.25 (MW) (Figure 5b). However, the sum of FRP from
VIIRS data was found to be higher than the MODIS sum of FRP (Figure 4b), mainly due to the large
number of fires detected by VIIRS. Since the VIIRS FRP and the MODIS AQUA FRP are retrieved using
the 4.0 µm channel and both cross the equator at approximately the same time (1:30 a.m. descending
and 1:30 p.m. ascending) local time, a strong correlation between FRP data retrieved from these two
datasets is expected. In our study area, which is dominated by agricultural fires, we observed a strong
correlation coefficient (r2 = 0.98) (Figure 6).
```

## Page 8

```text
Remote
 RemoteSens.  2018,10,
        Sens.2018,  10,978
                        x FOR PEER REVIEW                                                                             88ofof17
                                                                                                                             17
 Remote Sens. 2018, 10, x FOR PEER REVIEW                                                                            8 of 17




      Figure 3. (a) Monthly fire counts for Punjab, India derived from VIIRS versus MODIS (AQUA and
      Figure3.3.(a)
                 (a)Monthly
                    Monthlyfirefirecounts
                                    counts forfor Punjab,
                                                  Punjab, India
                                                           India derived from
                                                                          from VIIRS    versus MODIS (AQUA
                                                                                                        (AQUAand
     Figure
      TERRA    combined)    data and     for different  years; (b)derived       VIIRS
                                                                   Averaged across      versus
                                                                                      five years,MODIS
                                                                                                  VIIRS detected  and
                                                                                                                  fires
      TERRA
     TERRA     combined)
             combined)     data
                           data   and
                                 and    for
                                       for  different
                                            different  years;
                                                      years;  (b)
                                                              (b) Averaged
                                                                  Averaged   across
                                                                             across five
                                                                                    five years,
                                                                                          years, VIIRS
                                                                                                 VIIRS detected
                                                                                                       detected fires
                                                                                                                 fires
      were higher by a factor of 4.8 than MODIS data.
      werehigher
     were  higherby byaafactor
                         factorofof4.8
                                    4.8than
                                         thanMODIS
                                               MODISdata.
                                                        data.




        aa
                                                                    bb




        c                                                           dd



      Figure4.4.Sum
     Figure      Sumof   fireradiative
                      offire  radiativepower
                              radiative power(FRP)
                                        power   (FRP)from
                                               (FRP)    fromMODIS
                                                       from   MODISandandVIIRS  for
                                                                           VIIRSfor  the
                                                                                 forthe  peak
                                                                                      thepeak  months
                                                                                          peakmonths
                                                                                                 monthsof      summer
                                                                                                          ofofsummer
                                                                                                                summer
      (April)(a,b)
     (April)   (a,b)and
                     andwinter
                          winter(November)
                          winter  (November)(c,d),
                                  (November)     (c,d),2016.
                                                (c,d), 2016.  FRP
                                                        2016. FRP  data  hasbeen
                                                                    datahas
                                                               FRPdata   has been gridded
                                                                              beengridded
                                                                                    griddedat       arc
                                                                                              at555arc
                                                                                             at          minute
                                                                                                     arcminute    grid
                                                                                                          minutegridgrid
      intervals(10
     intervals   (10km
                     kmcells).
                        cells). High FRP during November captured by VIIRS data can be seen in Figure4d.
                        cells).High
                                High FRP
                                      FRP during
                                          during   November
                                                   November     captured by VIIRS data
                                                                                  data   can
                                                                                         can be
                                                                                             be   seen
                                                                                                 seen   in
                                                                                                       in  Figure
                                                                                                          Figure   4d.
                                                                                                                     4d.
```

## Page 9

```text
Remote Sens. 2018, 10, 978                                                                                                   9 of 17
Remote
 RemoteSens.
         Sens.2018,
               2018,10,
                     10,x xFOR
                            FORPEER
                                PEERREVIEW
                                     REVIEW                                                                                 99of
                                                                                                                               of17
                                                                                                                                  17




  aa                                                                 bb


         Figure5.
       Figure
       Figure      Seasonal    variations
                     Seasonalvariations
                5.5.Seasonal    variationsin in monthly
                                              inmonthly
                                                monthlysumsum
                                                           sumofof fire
                                                                offire   radiative
                                                                    fire radiative   power (FRP)
                                                                          radiative power           (a) and
                                                                                             (FRP) (a)      mean FRP
                                                                                                        and mean
                                                                                                            mean           for
                                                                                                                      (b) for
                                                                                                                 FRP (b)
                                                                                                                 FRP  (b)  for
       Punjab,
         Punjab, India
                   India  derived
                           derived from
                                    from   MODIS
                                            MODIS   (Aqua)    and
                                                              and  VIIRS
                                                                   VIIRS    data.
                                                                            data.    Note
                                                                                   Note   that
                                                                                        that    the mean
       Punjab, India derived from MODIS (Aqua) and VIIRS data. Note that the mean MODIS Aqua FRP isis
                                                                                               he mean    MODIS
                                                                                                         MODIS    Aqua
                                                                                                               Aqua   FRPFRP
          higher
       ishigher
       higher   thanthan
                  than    the
                         the
                        the    VIIRS
                             VIIRS
                            VIIRS      FRP,whereas
                                      FRP,
                                    FRP,      whereasthe
                                              whereas  the   sumof
                                                        thesum
                                                            sum    ofFRP
                                                                  of   FRPis
                                                                      FRP        higher for  VIIRS        MODIS due
                                                                                                     than MODIS
                                                                                             VIIRS than
                                                                                         for VIIRS
                                                                                  higherfor
                                                                             isishigher             than  MODIS   due  to the
                                                                                                                  due to
                                                                                                                       to  the
                                                                                                                           the
       relatively   large
         relativelylarge
       relatively          number
                      largenumber    of fires
                            numberofoffires    detected
                                          firesdetected  by
                                                detectedby  VIIRS.
                                                          byVIIRS.
                                                              VIIRS.




              Figure 6. Correlation between MODIS Sum of FRP and VIIRS Sum of FRP, Punjab, India.
             Figure 6. Correlation between MODIS Sum of FRP and VIIRS Sum of FRP, Punjab, India.
             Figure 6. Correlation between MODIS Sum of FRP and VIIRS Sum of FRP, Punjab, India.
  3.2. Agricultural Census Data Based Emissions
3.2. Agricultural Census Data Based Emissions
3.2. Agricultural Census Data Based Emissions
        Using the agricultural census data from 2005–2016, the total carbon burnt for the study area has
      Using the agricultural census data from 2005–2016, the total carbon burnt for the study area has
  been   estimated
      Using    the to be       in thecensus
                     agricultural       range of   10.45–11.04
                                                data from          Tg per the
                                                             2005–2016,    year.   Most
                                                                                total    of theburnt
                                                                                      carbon    residues   were
                                                                                                      for the     found
                                                                                                               study       to be
                                                                                                                        area  has
been estimated to be in the range of 10.45–11.04 Tg per year. Most of the residues were found to be
  fromestimated
been     upland to   rice,be in
                           paddy therice,
                                      range wheat
                                               of and      sugarcane
                                                  10.45–11.04      Tg perwhich
                                                                           year. Most    of the 94.66%
                                                                                  contributed   residues of the
                                                                                                           weretotal     carbon
                                                                                                                   found to    be
from upland rice, paddy rice, wheat and sugarcane which contributed 94.66% of the total carbon
  burnt.   From     these   data,   the   total  TPM   emissions      were   estimated    to be  88.19–91.19
from upland rice, paddy rice, wheat and sugarcane which contributed 94.66% of the total carbon burnt.           Gg   using    the
burnt.   Fromapproach
  bottom-up
                  these data,      thethe
                              fromTPM
                                         total  TPM emissions
                                           agriculturalwere
                                                          census
                                                                      were estimated to be 88.19–91.19 Gg using the
                                                                    data. to be 88.19–91.19 Gg using the bottom-up
From    these data,     the total           emissions            estimated
bottom-up approach from the agricultural census data.
approach from the agricultural census data.
  3.3. GFED Emissions
3.3.
3.3. GFED
     GFED Emissions
              Emissions
        Results from the GFED data suggested an average of 6.09–7.31 Tg dry carbon of residues burnt
  per Results
       year
      Resultsforfrom
                  the    the
                 fromstudy    GFED
                                region.
                         the GFED      data
                                       data   suggested
                                          These   values are
                                              suggested     an   average ofof 6.09–7.31
                                                                considerably
                                                            an average          lower
                                                                              6.09–7.31   Tg
                                                                                       than   dry
                                                                                          Tg the   carbon of
                                                                                                 bottom-up
                                                                                              dry carbon    of estimate    burnt
                                                                                                               residues using
                                                                                                               residues    burnt
per
per  year  for  the
      agricultural
  theyear for         study
                        census
                the study     region.
                              region.    These
                                 data, These     values
                                         similar to
                                                 values  are
                                                     an are
                                                        earlierconsiderably    lower
                                                                  comparisonlower
                                                               considerably            than
                                                                                 study in    the bottom-up
                                                                                           Vietnam [56].
                                                                                       than the   bottom-up    estimate
                                                                                                           Analysis
                                                                                                               estimate    using
                                                                                                                       of GFED
                                                                                                                           using
the
the  agricultural
  data                census
        suggestedcensus
     agricultural       October,data,
                                data,  similar
                                       similar toand
                                    November,    to an earlier
                                                        December
                                                    an earlier   comparison     study
                                                                       with thestudy
                                                                 comparison             in
                                                                                  highest  Vietnam   [56].
                                                                                           contribution
                                                                                        in Vietnam         Analysis
                                                                                                     [56].to the
                                                                                                           Analysis    of GFED
                                                                                                                  totalofcarbon
                                                                                                                          GFED
data  suggested
  emissions.
data  suggested       October,
                Further,          November,
                            the TPM
                      October,                    andwere
                                          emissions
                                  November,       and         found with
                                                       December
                                                       December       to bethe
                                                                      with  the   highest
                                                                             in the
                                                                                 highest    of 42.0–61.71to
                                                                                     rangecontribution
                                                                                           contribution      thefor
                                                                                                          toGg
                                                                                                             the  total  carbon
                                                                                                                          study
                                                                                                                     thecarbon
                                                                                                                  total
emissions.
  region which
emissions.    Further,     the   TPMthe
                           the than
                     is lower
              Further,           TPM    emissions
                                            bottom-up
                                        emissions     were
                                                      were   found
                                                             found to
                                                          estimate.                  range of
                                                                                the range
                                                                            in the
                                                                         be in
                                                                      to be                    42.0–61.71 Gg
                                                                                            of 42.0–61.71             the study
                                                                                                                 for the
                                                                                                             Gg for        study
region   which is
region which       is lower
                      lower than
                              than the
                                     the bottom-up
                                           bottom-up estimate.
                                                         estimate.
  3.4. FRP-Based Emissions
3.4. FRP-Based Emissions
        MODIS based FRP emissions for TPM suggested a range of 42.59–58.75 Gg in contrast to VIIRS
      MODIS
  based   TPM based
                 emissions FRPofemissions
                                   93.98–111.72 for Gg.
                                                    TPMOf the
                                                           suggested     a range
                                                                  different data of   42.59–58.75
                                                                                   used,  VIIRS FRP Gg  in contrast
                                                                                                      based   emissions   VIIRS
                                                                                                                       to were
based   TPM    emissions      of  93.98–111.72     Gg. Of   the  different  data   used,  VIIRS  FRP
  found to be significantly higher than the other datasets. Specifically, the TPM emissions (Gg) from based   emissions     were
  VIIRStowere
found       be higher
                 significantly     higher
                           by a factor       than the
                                           of 2.25      other to
                                                   compared      datasets.  Specifically,
                                                                    MODIS, a 1.96     factorthe TPMthan
                                                                                             higher    emissions
                                                                                                           GFED, and        from
                                                                                                                     (Gg)a 1.23
VIIRS were higher by a factor of 2.25 compared to MODIS, a 1.96 factor higher than GFED, and a 1.23
```

## Page 10

```text
Remote Sens. 2018, 10, 978                                                                                                        10 of 17



3.4. FRP-Based Emissions
Remote Sens. 2018, 10, x FOR PEER REVIEW                                                                                         10 of 17
      MODIS based FRP emissions for TPM suggested a range of 42.59–58.75 Gg in contrast to VIIRS
based
factor TPM
        higher  emissions
                  than theof       93.98–111.72
                                 agricultural       Gg. Of
                                                 census      the different
                                                            data-based         data used,
                                                                          approach            VIIRS
                                                                                         (Figure       FRP
                                                                                                     11).    based
                                                                                                           TPM        emissions
                                                                                                                  emissions      (inwere
                                                                                                                                      Gg)
found       be MODIS
derivedtofrom    significantly       higherFRP
                               and VIIRS      thanforthe   other datasets.
                                                       different   months are  Specifically,
                                                                                    shown in the       TPM
                                                                                                  Figure           spatial (Gg)
                                                                                                              emissions
                                                                                                           7 and                    from
                                                                                                                             variations
VIIRS
for  thewere
          peakhigher
                  month   byof a factor   of 2.252016
                                   November        compared      to MODIS,
                                                          are shown     in Figure        factor
                                                                                 a 1.968a,b.       higher
                                                                                                 TPM        than GFED,
                                                                                                        emissions                     1.23
                                                                                                                              has abeen
                                                                                                                       data and
factor  higher
        Remote     than
               Sens. 2018, the
                           10, x agricultural
                                 FOR  PEER REVIEWcensus     data-based    approach       (Figure
gridded at 5 arc minute grid intervals (10 km cells). Higher TPM emissions during November           11).  TPM    emissions10 of  (in
                                                                                                                                 17   Gg)
derived from
captured          MODIS
            by VIIRS       dataandcanVIIRS   FRPinfor
                                       be seen         different
                                                     Figure   8b. The   peakare
                                                                   months           shown in
                                                                                 Gaussian      fit Figure    and
                                                                                                   results7are      spatialinvariations
                                                                                                                 shown         Figure 9.
        factor higher than the agricultural census data-based approach (Figure 11). TPM emissions (in Gg)
for the
      Thepeak    month     of  November      2016    are  shown   in Figure     8a,b.  TPM     emissions     data  has  been    gridded
            model     was    robust    with   low   values   of  MAE
        derived from MODIS and VIIRS FRP for different months are shown in Figure 7 and spatial variations used
                                                                        (3000.    The   results    from   the  model    fit were
at 5  arc
to derive  minute     grid   intervals    (10  km    cells).  Higher   TPM       emissions      during    November        captured
                                                                                                                               range by
        for the
            the potential
                  peak month     VIIRS   TPM emissions
                                    of November      2016 arefrom
                                                               shown 2003–2016
                                                                        in Figure(Figure
                                                                                     8a,b. TPM   10)emissions
                                                                                                      which suggested
                                                                                                                 data has a  been       of
VIIRS   data
2.56–63.66     can
              Gg at
        gridded      be
                    TPM  seen    in
                       5 arcemissionsFigure
                                minute grid  8b.   The
                                            perintervalspeak
                                                 month, (10    Gaussian
                                                            withkmthe        fit
                                                                       highest
                                                                    cells).      results
                                                                             Higher valuesare
                                                                                       TPM duringshown
                                                                                               emissions  in  Figure
                                                                                                         November
                                                                                                            during     9.
                                                                                                                        of  each year.
                                                                                                                      November
      The   model
        captured
Intercomparisons    bywas
                        VIIRS
                         of    robust
                             TPM data canwith   low
                                           be seen
                                     emissions      invalues
                                                  (Gg)          of The
                                                         from 8b.
                                                       Figure       MAE
                                                               differentpeak(3000.
                                                                               Gaussian
                                                                            approaches Thefitis
                                                                                              results
                                                                                                results from
                                                                                                 givenare       the in
                                                                                                            shown
                                                                                                        in Figure     model
                                                                                                                     11.  The fit
                                                                                                                        Figure   9. were
                                                                                                                                bottom-
used to
up         derive
    approach         the
             The model
                  suggested        robustVIIRS
                            potential
                             was   TPM     with   TPMin
                                                 low
                                          emissions       emissions
                                                      values  of
                                                            the  MAE   from
                                                                       (3000. The
                                                                 range of        2003–2016
                                                                                      results Gg
                                                                              88.19–91.19        (Figure
                                                                                                from  the  10)
                                                                                                           model fit
                                                                                                     compared   which
                                                                                                                   to weresuggested
                                                                                                                             used
                                                                                                                      42.0–61.71      Gg,a
range   to
         ofderive   the potential
            2.56–63.66       Gg      VIIRS TPM
                                   TPM    emissionsemissions
                                                         per   from
                                                              month, 2003–2016
                                                                         with      (Figure
                                                                                  the       10) which
                                                                                       highest      valuessuggested
                                                                                                             during   a range
                                                                                                                        November of     of
42.59–58.75 Gg and 93.98–111.72 Gg per year using the GFED, MODIS FRP, and VIIRS FRP based
each    2.56–63.66 Gg
       year.               TPM emissions
              Intercomparisons           of TPMper month,
                                                    emissionswith(Gg)  highest values
                                                                   the from      different during     November
                                                                                             approaches       is  of
                                                                                                                 giveneachin year.
                                                                                                                              Figure    11.
approaches, respectively (Figure 11).
        Intercomparisons of TPM emissions (Gg) from different approaches is given in Figure 11. The bottom-
The bottom-up         approach suggested TPM emissions in the range of 88.19–91.19 Gg compared to
        up approach suggested TPM emissions in the range of 88.19–91.19 Gg compared to 42.0–61.71 Gg,
42.0–61.71 Gg, 42.59–58.75 Gg and 93.98–111.72 Gg per year using the GFED, MODIS FRP, and VIIRS
        42.59–58.75 Gg and 93.98–111.72 Gg per year using the GFED, MODIS FRP, and VIIRS FRP based
FRP based      approaches,
        approaches,               respectively
                        respectively              (Figure 11).
                                        (Figure 11).




         Figure 7. Total Particulate Matter (TPM) emissions in Gg derived from MODIS and VIIRS data.
               Figure 7. Total Particulate Matter (TPM) emissions in Gg derived from MODIS and VIIRS data.
          Figure 7. Total Particulate Matter (TPM) emissions in Gg derived from MODIS and VIIRS data.




                    a                                                           b
             a                                                                   b


              Figure 8. TPM emissions (in Gg) from MODIS (a) and VIIRS for the peak month of November (b),
             2016.
      Figure 8. TPMTPMemissions
                 TPM    emissions(in
                       emissions  dataGg)
                                  (inGg)    been
                                       hasfrom    gridded
                                            fromMODIS
                                                   MODIS  (a)    arc
                                                              5and
                                                           at(a)  andminute
                                                                        VIIRS
                                                                     VIIRS     grid
                                                                             for forintervals
                                                                                 the the
                                                                                      peakpeak(10
                                                                                           month  kmofcells).
                                                                                                month         High FRP
                                                                                                          of November
                                                                                                       November           (b),
                                                                                                                    (b), 2016.
      TPM    during
      2016. TPM     November
            emissions
                   emissions   captured
                        data has been
                              data      by
                                    has beenVIIRS
                                       gridded at  data can  be
                                                            minute
                                                     5 arcat 5
                                                gridded         seen  in
                                                                 arc gridthe  Figure 8b.
                                                                             intervals (10
                                                                      minute grid                          cells).FRP
                                                                                                      kmHigh
                                                                                                  cells).
                                                                                             km (10
                                                                                      intervals                       during
                                                                                                                   High  FRP
      November
      during       captured by
              November          VIIRS
                          captured   bydata
                                        VIIRS candata
                                                  be seen
                                                      can bein the   Figure
                                                                seen in   the8b.
                                                                               Figure 8b.
```

## Page 11

```text
Remote Sens. 2018, 10, x FOR PEER REVIEW                                                                            11 of 17
Remote Sens. 2018, 10, 978                                                                                           11 of 17
Remote Sens. 2018, 10, x FOR PEER REVIEW                                                                              11 of 17



       Remote Sens. 2018, 10, x FOR PEER REVIEW                                                               11 of 17




     Figure 9. Gaussian fit of MODIS sum of FRP data and VIIRS data. The results from the fit were used
     to estimate TPM emissions from 2003–2016.
      Figure9.9.Gaussian
      Figure     Gaussianfit       MODISsum
                            fitofofMODIS    sumofofFRP
                                                    FRPdata  and
                                                        dataand   VIIRS
                                                                VIIRS   data.
                                                                      data.    The
                                                                             The    results
                                                                                  results     from
                                                                                           from  thethe
                                                                                                      fit fit
                                                                                                          werewere used
                                                                                                                used to
             Figure 9. Gaussian fit of MODIS sum of FRP data and VIIRS data. The results from the fit were used
      to estimate  TPM   emissions     from
      estimate TPM emissions from 2003–2016.2003–2016.
            to estimate TPM emissions from 2003–2016.




                                                                                                  .    .

         FigureFigure 10. TPM emissions (2003–2016) derivedfrom
                                                            from model fitting of VIIRS and MODIS data.data.
                                                                                                   .
         Figure10.
                 10.TPM
                     TPMemissions
                           emissions(2003–2016)
                                     (2003–2016)derived
                                                  derived frommodel
                                                                 model fitting
                                                                         fitting of
                                                                                  of VIIRS
                                                                                     VIIRS and
                                                                                           and MODIS
                                                                                               MODIS   data.
          Figure 10. TPM emissions (2003–2016) derived from model fitting of VIIRS and MODIS data.




            Figure 11. Comparison of TPM emissions from different datasets. VIIRS based emissions were found
            to be significantly higher than all other datasets.
      Figure 11.
     Figure       Comparisonof
              11. Comparison   ofTPM
                                  TPMemissions
                                       emissionsfrom
                                                   fromdifferent
                                                        different datasets.
                                                                  datasets. VIIRS
                                                                            VIIRSbased
                                                                                  basedemissions
                                                                                       emissionswere
                                                                                                 were found
                                                                                                       found
      to be significantly higher than all other datasets.
     to be significantly higher than all other datasets.
       Figure 11. Comparison of TPM emissions from different datasets. VIIRS based emissions were found
       to be significantly higher than all other datasets.
```

## Page 12

```text
Remote Sens. 2018, 10, 978                                                                           12 of 17



4. Discussion
       The relatively large number of fires detected by VIIRS data compared to MODIS in the agricultural
 landscape is consistent with the results from [37] who demonstrated an improved ability to detect ‘small
 fires’ using the VIIRS I-Band. They inferred that fires as small as an order of magnitude lower than the
 minimum detection limit of MODIS, in theory, be detected, due to the I-bands 7X smaller (nadir) pixel
 area. Thus, the VIIRS active fire product (VNP14IMGTDL_NRT) clearly showed much more sensitive
‘small fire’ active fire detection performance compared to the MODIS MOD14/MYD14 product in the
 agricultural landscape of Punjab. Possible false signals might be caused due to different illuminating
 conditions depending on weather and time of day. Specifically, most of the agricultural residues are
 thin (rice/wheat stalks) and close to the ground, sometimes exposing the bare ground which might be
 impacted due to specular kind of reflection impacting MIR channels, creating the possibility of false
 signals. Thus, strong validation is necessary to eliminate any false signals. In comparing the VIIRS and
 MODIS FRP, caution should be exercised while assessing the fire intensities as using the mean FRP
value can produce a different solution compared to the sum of FRP. For example, a higher mean FRP
 from MODIS compared to VIIRS data was observed for agricultural fires in Punjab, whereas the sum
 of FRP was highest using VIIRS data. These results suggest a large number of smaller fires detected by
VIIRS resulting in a higher sum of FRP than MODIS.
       Using the IPCC based approach, [24] estimated that 620 million tons of total crop residues were
 burnt in India during 2008–2009, of which ~15.9% of residues were burnt in the field. Further, [24]
 estimated that of the different crops residues, rice straw contributed 40% of the total residue burning
 followed by wheat straw (22%), and sugarcane (20%). They also estimated that the crop residue burning
 contributed 1.21 million tons of particulate matter in 2008–2009. In the Punjab state, 56.74 million tons
 of residue were generated from cereal, fiber, oilseed and sugarcane crops [24]. Using these amounts,
 a total of 277.16 Gg TPM and 83.15 Gg PM2.5 emissions were estimated for Punjab. Compared to these
 estimates, our estimates suggest a range of 24–42 million tons of residue generated and a range of
 49.73–112.08 Gg TPM emissions for Punjab. The discrepancies are attributed to the agricultural census
 data differences for different years, and conversion factors used while calculating the residue amounts
 as well as TPM emission factors. The low GFED based TPM emissions compared to the ground-based
 inventory might be due to the low biomass values for agriculture inherent in the GFED inventory [55].
 Of the different datasets used, VIIRS FRP based TPM emissions were found to be higher than the
 MODIS, GFED and agricultural census-based estimates (Figure 10). However, we note that some
 satellite-based estimates currently underestimate the agricultural residue burning emissions due to
 small, ephemeral fires and active field management [56]. Thus, VIIRS due to its higher resolution can
 capture smaller fires than MODIS and in combination with the FRP based approach can yield better
 emission estimates.
       In this study, we also compared TPM emission seasonality with other ground-based studies.
 For example, Reference [57] using an eight-stage size segregated mass distribution of respirable
 suspended particulate matter (RSPM) analysis for two wheat (summer) and three rice (winter)
 burning seasons, showed that fine particulate matter (PM2.5) contributing to almost 55–64% of the
 total RSPM, and in general smaller particles dominated during the rice crop burning during winter
 compared to wheat crop burning during summer. The study showed that concentration levels of
 PM10 and PM2.5 were higher during the winter months as compared to the summer months. Also,
 background concentration levels of PM10, PM2.5, and PM10–2.5 were reported to be around 97 ± 21,
 57 ± 15 and 40 ± 6 µg m−3, respectively. In a separate study [58], using ground-based ambient air
 monitoring instruments at five different locations in and around Patiala city (29◦ 490 –30◦ 470 N Latitude,
 75◦ 580 –76◦ 540 E Longitude), Punjab, monthly variations in suspended particulate matter (SPM),
 sulphur dioxide (SO2 ) and nitrogen dioxide (NO2 ) were studied. It reported that monthly average
 concentrations (24 h) of SPM, SO2 and NO2 varied from 100 ± 11 µg m−3 to 547 ± 152 µg m−3,
 5 ± 4 µg m−3 to 55 ± 34 µg m−3 and 9 ± 5 µg m−3 to 91 ± 39 µg m−3, respectively, with the
 highest levels during the winter burning months (October–November) compared to the other months.
```

## Page 13

```text
Remote Sens. 2018, 10, 978                                                                          13 of 17



Although our study does not provide specific pollutant concentration values in volume units,
the seasonality of TPM emissions with higher values during winter than summer coincides with
the abovementioned studies (Figures 7 and 8a,b). In particular, the sum of FRP during the winter rice
residue burning months (October–December) was found to be considerably higher than the summer
wheat residue burning months (Figures 4a–d and 5a). Since FRP is a significant input to emissions
calculation, the results on TPM emissions are also driven by the FRP variations (Figures 7 and 8a,b)
and show similar trends as the ground-based studies discussed above. In summary, compared to other
approaches, the VIIRS FRP based approach was helpful for effectively addressing both the intensity,
as well as the seasonal component of TPM emissions.

5. Conclusions
      Agricultural residue burning is most prevalent in the Punjab state, northwest India. Farmers
burn agricultural residues as it takes less time before planting the next crop. The summer wheat
residue burning season is during April and May, and winter rice residue burning is during October
and November. In this study, both, satellite as well as ground-based approaches, were used to quantify
the total particulate matter (TPM) emissions and a range of emission estimates were provided. Of the
different approaches, the VIIRS FRP based approach captured more emissions and the results were
closer to the agricultural census-based emissions inventory. Results revealed that VIIRS detected fires
were higher by a factor of 4.8 compared to MODIS Aqua and Terra sensors. Further, VIIRS detected
fires were higher by a factor of 6.5 than Aqua. Thus, the VIIRS FRP based approach captured more
TPM emissions than the MODIS and was closer to the emissions estimated using the agricultural
census data. Specific to seasonality, the VIIRS sum of FRP was found to be higher during the winter
months (rice residue burning season) than the summer (wheat residue burning season) and the values
were consistently higher compared to the MODIS sum of FRP. Thus, TPM emissions were considerably
higher during winter than the summer. Further, the seasonality of emissions from the VIIRS approach
matched the ground-based emissions data reported in the literature. Since VIIRS data is only available
from 2012 whereas MODIS Aqua is available from May 2002, we used a model fitting approach to
arrive at the potential TPM emissions from VIIRS since 2002. The results suggested potential emissions
of 93.98–111.72 Gg per year using the VIIRS FRP based approach. These new TPM emission outputs
from Punjab can be integrated with atmospheric transport models to infer pollution in the neighboring
areas, such as New Delhi where air pollution is rampant.
      The current study is critical concerning air pollution research as the satellite-based FRP approach
can be used to characterize TPM emissions directly. The bottom-up approach involving agricultural
census data on different crops, quantifying the residue amounts and thereby emissions from the
agricultural residue burning can be tedious and such data may not be available for different regions
of the world. The minor discrepancies in the emissions from the satellite approach and agricultural
census-based approach can be improved through improving the coefficients that directly relate FRP
from fires to the mass of smoke aerosol emissions. Efforts towards strengthening research on calibrating
and validating satellite FRP based smoke emissions might be the more straightforward solution
for emissions quantification and more useful for pollution mapping/monitoring studies than the
bottom-up agricultural census-based approach. Further, using VIIRS data compared to MODIS has
significant potential as the VIIRS can capture more fires; thus it results in higher FRP and more accurate
quantification of TPM emissions, as noted in this study.
      We conclude that crop residue burning in Punjab, India is a management issue that needs
immediate attention. Although the local government in Punjab declared the burning of crop residues
in the field as illegal, and that any farmer resorting to it is liable to legal repercussions, crop residue
burning continues, as evidenced by the remote sensing data. Farmers practice crop residue burning
as they lack the resources to clear the residues or incorporate them into the soil through tillage
machinery. In addition to implementing stringent measures on banning crop residue burning, financial
```

## Page 14

```text
Remote Sens. 2018, 10, 978                                                                                   14 of 17



aid to farmers is necessary to manage the crop residues efficiently in the field. Effective recycling of
agricultural residues should be promoted by starting bioenergy plants in the region.

Author Contributions: K.V. conceived, analyzed data and wrote the manuscript.                 K.L. helped in data
cross-checking, manuscript formatting and editing.
Funding: This work is supported by the NASA grant NNX10AU77G to the first author.
Acknowledgments: We are grateful to the MODIS and VIIRS fire product developers for freely sharing the data.
The work contributes to the South/Southeast Asia Research Initiative (www.sari.umd.edu) and NASA Land
Cover/Land Use Change Program research (www.lcluc.umd.edu).
Conflicts of Interest: The authors declare no conflict of interest. The founding sponsors had no role in the design
of the study; in the collection, analyses, or interpretation of data; in the writing of the manuscript, and in the
decision to publish the results.

References
1.    Andreae, M.O.; Merlet, P. Emission of trace gases and aerosols from biomass burning.
      Glob. Biogeochem. Cycles 2001, 15, 955–966. [CrossRef]
2.    Singh, Y.; Sidhu, H.S. Management of cereal crop residues for sustainable rice-wheat production system in
      the Indo-Gangetic plains of India. Proc. Indian Natl. Sci. Acad. 2014, 80, 95–114. [CrossRef]
3.    Badarinath, K.V.S.; Kharol, S.K.; Sharma, A.R.; Prasad, V.K. Analysis of aerosol and carbon monoxide
      characteristics over Arabian Sea during crop residue burning period in the Indo-Gangetic Plains using
      multi-satellite remote sensing datasets. J. Atmos. Sol. Terr. Phys. 2009, 71, 1267–1276. [CrossRef]
4.    Prasad, V.K.; Badarinath, K.V.S.; Anuradha, E.A. Biophysical and anthropogenic controls of forest fires in the
      Deccan Plateau. Indian J. Environ. Manag. 2008, 86, 1–13. [CrossRef] [PubMed]
5.    Chan, K.L. Biomass burning sources and their contributions to the local air quality in Hong Kong.
      Sci. Total Environ. 2017, 596, 212–221. [CrossRef] [PubMed]
6.    Itahashi, S.; Uno, I.; Irie, H.; Kurokawa, J.I.; Ohara, T. Impacts of biomass burning emissions on over
      tropospheric continental NO southeast 2 vertical Asia column density. In Land-Atmospheric Research
      Applications in South and Southeast Asia; Springer: Berlin, Germany, 2018.
7.    Pochanart, P.; Akimoto, H.; Kajii, Y.; Sukasem, P. Carbon monoxide, regional-scale transport, and biomass
      burning in tropical continental Southeast Asia: Observations in rural Thailand. J. Geophys. Res. Atmos.
      2003, 108. [CrossRef]
8.    Tahir, S.N.A.; Rafique, M.; Alaamer, A.S. Biomass fuel burning and its implications: Deforestation and
      greenhouse gases emissions in Pakistan. Environ. Pollut. 2010, 158, 2490–2495. [CrossRef] [PubMed]
9.    Lin, N.H.; Tsay, S.C.; Maring, H.B.; Yen, M.C.; Sheu, G.R.; Wang, S.H.; Chi, K.H.; Chuang, M.T.; Ou-Yang, C.F.;
      Fu, J.S.; et al. An overview of regional experiments on biomass burning aerosols and related pollutants in
      Southeast Asia: From BASE-ASIA and the Dongsha Experiment to 7-SEAS. Atmos. Environ. 2013, 78, 1–19.
      [CrossRef]
10.   Hobbs, P.V.; Reid, J.S.; Kotchenruther, R.A.; Ferek, R.J.; Weiss, R. Direct radiative forcing by smoke from
      biomass burning. Science 1997, 275, 1777–1778. [CrossRef]
11.   Hsu, N.C.; Herman, J.R.; Tsay, S.C. Radiative impacts from biomass burning in the presence of clouds during
      boreal spring in southeast Asia. Geophys. Res. Lett. 2003, 30. [CrossRef]
12.   Gustafsson, Ö.; Kruså, M.; Zencak, Z.; Sheesley, R.J.; Granat, L.; Engström, E.; Praveen, P.S.; Rao, P.S.P.;
      Leck, C.; Rodhe, H. Brown clouds over South Asia: Biomass or fossil fuel combustion? Science 2009, 323,
      495–498. [CrossRef] [PubMed]
13.   Wang, S.H.; Lin, N.H.; Chou, M.D.; Woo, J.H. Estimate of radiative forcing of Asian biomass-burning aerosols
      during the period of TRACE-P. J. Geophys. Res. Atmos. 2007, 112. [CrossRef]
14.   Kumar, P.S.; Lin, N.-H.; Chantara, S.; Wang, S.-H.; Khamkaew, C.; Prapamontol, T.; Janjai, S. Radiative
      response of biomass-burning aerosols over an urban atmosphere in northern peninsular Southeast Asia.
      Sci. Total Environ. 2018, 633, 892–911.
15.   Kharol, S.K.; Badarinath, K.V.S.; Sharma, A.R.; Mahalakshmi, D.V.; Singh, D.; Prasad, V.K. Black carbon
      aerosol variations over Patiala city, Punjab, India—A study during agriculture crop residue burning period
      using ground measurements and satellite data. J. Atmos. Sol. Terr. Phys. 2012, 84, 45–51. [CrossRef]
```

## Page 15

```text
Remote Sens. 2018, 10, 978                                                                                       15 of 17



16.   Cao, G.; Zhang, X.; Gong, S.; Zheng, F. Investigation on emission factors of particulate matter and gaseous
      pollutants from crop residue burning. J. Environ. Sci. 2008, 20, 50–55. [CrossRef]
17.   Thumaty, K.C.; Rodda, S.R.; Singhal, J.; Gopalakrishnan, R.; Jha, C.S.; Parsi, G.D.; Dadhwal, V.K.
      Spatio-temporal characterization of agriculture residue burning in Punjab and Haryana, India, using MODIS
      and Suomi NPP VIIRS data. Curr. Sci. 2015, 109. [CrossRef]
18.   Sundeep, S.; Barnes, P.J. Is exposure to biomass smoke the biggest risk factor for COPD globally? Chest 2010,
      138, 3–6.
19.   Kim, K.-H.; Jahan, S.A.; Kabir, E. A review of diseases associated with household air pollution due to the use
      of biomass fuels. J. Hazard. Mater. 2011, 192, 425–431. [CrossRef] [PubMed]
20.   Badarinath, K.V.S.; Chand, T.K.; Prasad, V.K. Agriculture crop residue burning in the Indo-Gangetic Plains–a
      study using IRS-P6 AWiFS satellite data. Curr. Sci. 2006, 91, 1085–1089.
21.   Vadrevu, K.P.; Ellicott, E.; Badarinath, K.V.S.; Vermote, E. MODIS derived fire characteristics and aerosol
      optical depth variations during the agricultural residue burning season, north India. Environ. Pollut. 2011,
      159, 1560–1569. [CrossRef] [PubMed]
22.   Tripathi, S.N.; Pattnaik, A.; Dey, S. Aerosol indirect effect over Indo-Gangetic plain. Atmos. Environ. 2007, 41,
      7037–7047. [CrossRef]
23.   Sahai, S.; Sharma, C.; Singh, D.P.; Dixit, C.K.; Singh, N.; Sharma, P.; Singh, K.; Bhatt, S.; Ghude, S.; Gupta, V.;
      et al. A study for development of emission factors for trace gases and carbonaceous particulate species from
      in situ burning of wheat straw in agricultural fields in India. Atmos. Environ. 2007, 41, 9173–9186. [CrossRef]
24.   Jain, N.; Bhatia, A.; Pathak, H. Emission of air pollutants from crop residue burning in India. Aerosol Air
      Qual. Res. 2014, 14, 422–430. [CrossRef]
25.   Satyendra, T.; Singh, R.N.; Shaishav, S. Emissions from crop/biomass residue burning risk to atmospheric
      quality. Int. Res. J. Earth Sci. 2013, 1, 24–30.
26.   Granier, C.; Bessagnet, B.; Bond, T.; D’Angiola, A.; van Der Gon, H.D.; Frost, G.J.; Heil, A.; Kaiser, J.W.;
      Kinne, S.; Klimont, Z.; et al. Evolution of anthropogenic and biomass burning emissions of air pollutants at
      global and regional scales during the 1980–2010 period. Clim. Chang. 2011, 109. [CrossRef]
27.   Kaiser, J.W.; Heil, A.; Andreae, M.O.; Benedetti, A.; Chubarova, N.; Jones, L.; Morcrette, J.J.; Razinger, M.;
      Schultz, M.G.; Suttie, M.; et al. Biomass burning emissions estimated with a global fire assimilation system
      based on observed fire radiative power. Biogeosciences 2012, 9, 527–554. [CrossRef]
28.   Wooster, M.J.; Zhang, Y.H. Boreal forest fires burn less intensely in Russia than in North America.
      Geophys. Res. Lett. 2004, 31. [CrossRef]
29.   Ichoku, C.; Giglio, L.; Wooster, M.J.; Remer, L.A. Global characterization of biomass-burning patterns using
      satellite measurements of fire radiative energy. Remote Sens. Environ. 2008, 112, 2950–2962. [CrossRef]
30.   Ichoku, C.; Kaufman, Y.J. A method to derive smoke emission rates from MODIS fire radiative energy
      measurements. IEEE Trans. Geosci. Remote Sens. 2005, 43, 2636–2649. [CrossRef]
31.   Mota, B.; Wooster, M.J. A new top-down approach for directly estimating biomass burning emissions and fuel
      consumption rates and totals from geostationary satellite fire radiative power (FRP). Remote Sens. Environ.
      2018, 206, 45–62. [CrossRef]
32.   Vadrevu, K.P.; Csiszar, I.; Ellicott, E.; Giglio, L.; Badarinath, K.V.S.; Vermote, E.; Justice, C. Hotspot analysis
      of vegetation fires and intensity in the Indian region. IEEE J. Sel. Top. Appl. Earth Obs. Remote Sens. 2013, 6,
      224–238. [CrossRef]
33.   Wooster, M.J.; Zhukov, B.; Oertel, D. Fire radiative energy for quantitative study of biomass
      burning: Derivation from the BIRD experimental satellite and comparison to MODIS fire products.
      Remote Sens. Environ. 2003, 86, 83–107. [CrossRef]
34.   Giglio, L.; Descloitres, J.; Justice, C.O.; Kaufman, Y. An enhanced contextual fire detection algorithm for
      MODIS. Remote Sens. Environ. 2003, 87, 273–282. [CrossRef]
35.   Wooster, M.J.; Roberts, G.; Perry, G.L.W.; Kaufman, Y.J. Retrieval of biomass combustion rates and totals
      from fire radiative power observations: FRP derivation and calibration relationships between biomass
      consumption and fire radiative energy release. J. Geophys. Res. Atmos. 2005, 110. [CrossRef]
36.   Giglio, L.; Van der Werf, G.R.; Randerson, J.T.; Collatz, G.J.; Kasibhatla, P. Global estimation of burned area
      using MODIS active fire observations. Atmos. Chem. Phys. 2006, 6, 957–974. [CrossRef]
37.   Schroeder, W.; Oliva, P.; Giglio, L.; Csiszar, I.A. The new VIIRS 375 m active fire detection data product:
      Algorithm description and initial assessment. Remote Sens. Environ. 2014, 143, 85–96. [CrossRef]
```

## Page 16

```text
Remote Sens. 2018, 10, 978                                                                                        16 of 17



38.   Van der Werf, G.R.; Randerson, J.T.; Giglio, L.; Collatz, G.J.; Mu, M.; Kasibhatla, P.S.; Morton, D.C.;
      DeFries, R.S.; Jin, Y.V.; van Leeuwen, T.T. Global fire emissions and the contribution of deforestation, savanna,
      forest, agricultural, and peat fires (1997–2009). Atmos. Chem. Phys. 2010, 10, 11707–11735. [CrossRef]
39.   Roy, D.P.; Boschetti, L.; Justice, C.O.; Ju, J. The collection 5 MODIS burned area product—Global evaluation
      by comparison with the MODIS active fire product. Remote Sens. Environ. 2008, 112, 3690–3707. [CrossRef]
40.   Giglio, L.; Loboda, T.; Roy, D.P.; Quayle, B.; Justice, C.O. An active-fire based burned area mapping algorithm
      for the MODIS sensor. Remote Sens. Environ. 2009, 113, 408–420. [CrossRef]
41.   Shi, Y.; Matsunaga, T.; Yamaguchi, Y.; Li, Z.; Gu, X.; Chen, X. Long-term trends and spatial patterns of
      satellite-retrieved PM 2.5 concentrations in South and Southeast Asia from 1999 to 2014. Sci. Total Environ.
      2018, 615, 177–186. [CrossRef] [PubMed]
42.   Polivka, T.; Wang, J.; Ellison, L.; Hyer, E.; Ichoku, C. Improving nocturnal fire detection with the VIIRS
      day-night band. IEEE Trans. Geosci. Remote Sens. 2016, 9, 5503–5519. [CrossRef]
43.   Wang, J.; Yue, Y.; Wang, Y.; Ichoku, C.; Ellison, L.; Zeng, J. Mitigating satellite-based fire sampling
      limitations in deriving biomass burning emission rates: Application to WRF-Chem model over the Northern
      Sub-saharan African Region. J. Geophys. Res. Atmos. 2018, 123, 507–528. [CrossRef]
44.   Tiwari, S.; Srivastava, A.K.; Bisht, D.S.; Parmita, P.; Srivastava, M.K.; Attri, S.D. Diurnal and seasonal
      variations of black carbon and PM2. 5 over New Delhi, India: Influence of meteorology. Atmos. Res. 2013,
      125, 50–62. [CrossRef]
45.   Sarkar, A. Potential of crop residue in India as a source of energy. Int. J. Glob. Energy Issues 2007, 28, 181–194.
      [CrossRef]
46.   IPCC. Revised 1996 Guidelines for National Greenhouse Gas Inventories, National Greenhouse Gas Inventory
      Program (NGGIP). 1997. Available online: www.ipcc-nggip.iges.or.jp/public/gl/invs1.html (accessed on
      10 June 2018).
47.   Giglio, L.; Schroeder, W.; Justice, C.O. The collection 6 MODIS active fire detection algorithm and fire
      products. Remote Sens. Environ. 2016, 178, 31–41. [CrossRef]
48.   Freeborn, P.H.; Wooster, M.J.; Hao, W.M.; Ryan, C.A.; Nordgren, B.L.; Baker, S.P.; Ichoku, C. Relationships
      between energy release, fuel mass loss, and trace gas and aerosol emissions during laboratory biomass fires.
      J. Geophys. Res. Atmos. 2008, 113. [CrossRef]
49.   Wooster, M.J.; Roberts, G.; Freeborn, P.H.; Govaerts, Y.; Beeby, R.; He, J.; Lattanzia, A.; Mullen, R. Meteosat
      SEVIRI Fire Radiative Power (FRP) products from the Land Surface Analysis Satellite Applications Facility
      (LSA SAF): Part 1-algorithms, product contents & analysis. Atmos. Chem. Phys. 2015, 15, 13217–13239.
50.   Vadrevu, K.P.; Ellicott, E.; Giglio, L.; Badarinath, K.V.S.; Vermote, E.; Justice, C.; Lau, W.K. Vegetation fires in
      the himalayan region–Aerosol load, black carbon emissions and smoke plume heights. Atmos. Environ. 2012,
      47, 241–251. [CrossRef]
51.   Pereira, G.; Freitas, S.R.; Moraes, E.C.; Ferreira, N.J.; Shimabukuro, Y.E.; Rao, V.B.; Longo, K.M. Estimating
      trace gas and aerosol emissions over South America: Relationship between fire radiative energy released
      and aerosol optical depth observations. Atmos. Environ. 2009, 43, 6388–6397. [CrossRef]
52.   Vermote, E.; Ellicott, E.; Dubovik, O.; Lapyonok, T.; Chin, M.; Giglio, L.; Roberts, G.J. An approach to
      estimate global biomass burning emissions of organic and black carbon from MODIS fire radiative power.
      J. Geophys. Res. 2009, 114. [CrossRef]
53.   Ichoku, C.; Ellison, L. Global top-down smoke-aerosol emissions estimation using satellite fire radiative
      power measurements. Atmos. Chem. Phys. 2014, 14, 6643–6667. [CrossRef]
54.   Giglio, L.; Randerson, J.T.; Werf, G.R. Analysis of daily, monthly, and annual burned area using the
      fourth-generation global fire emissions database (GFED4). J. Geophys. Res. Biogeosci. 2013, 118, 317–328.
      [CrossRef]
55.   Akagi, S.K.; Yokelson, R.J.; Wiedinmyer, C.; Alvarado, M.J.; Reid, J.S.; Karl, T.; Crounse, J.D.; Wennberg, P.O.
      Emission factors for open and domestic biomass burning for use in atmospheric models. Atmos. Chem. Phys.
      2011, 11, 4039–4072. [CrossRef]
56.   Lasko, K.; Vadrevu, K.P.; Tran, V.T.; Ellicott, E.; Nguyen, T.T.N.; Bui, H.Q.; Justice, C. Satellites may
      underestimate rice residue and associated burning emissions in Vietnam. Environ. Res. Lett. 2017, 12.
      [CrossRef]
```

## Page 17

```text
Remote Sens. 2018, 10, 978                                                                                    17 of 17



57.   Awasthi, A.; Agarwal, R.; Mittal, S.K.; Singh, N.; Singh, K.; Gupta, P.K. Study of size and mass distribution
      of particulate matter due to crop residue burning with seasonal variation in rural area of Punjab, India.
      J. Environ. Monit. 2011, 13, 1073–1081. [CrossRef] [PubMed]
58.   Mittal, S.K.; Singh, N.; Agarwal, R.; Awasthi, A.; Gupta, P.K. Ambient air quality during wheat and rice crop
      stubble burning episodes in Patiala. Atmos. Environ. 2009, 43, 238–244. [CrossRef]

                             © 2018 by the authors. Licensee MDPI, Basel, Switzerland. This article is an open access
                             article distributed under the terms and conditions of the Creative Commons Attribution
                             (CC BY) license (http://creativecommons.org/licenses/by/4.0/).
```
