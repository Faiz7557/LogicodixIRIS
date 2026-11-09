# Verbatim PDF Transcript

- Source PDF: `Aksi_02_Perez_2016_Action_based_flood_forecasting_for_triggering_humanitarian_a.pdf`
- Original upload filename: `Aksi_02_Perez_2016_Action_based_flood_forecasting_for_triggering_humanitarian_a.pdf`
- Source PDF SHA-256: `58a433ce1b6d96bf80538b043adfe8d90ee0a77bf923ff492743c360bc2b18dc`
- Extraction method: `pdftotext -layout`
- Pages: 12

This file preserves native PDF text with page boundaries. Tesseract OCR supplements pages where the native text layer is empty or corrupted.

## Page 1

```text
Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016
www.hydrol-earth-syst-sci.net/20/3549/2016/
doi:10.5194/hess-20-3549-2016
© Author(s) 2016. CC Attribution 3.0 License.




Action-based flood forecasting for triggering humanitarian action
Erin Coughlan de Perez1,2,3 , Bart van den Hurk2,4 , Maarten K. van Aalst1,3,14 , Irene Amuron5 , Deus Bamanya6 ,
Tristan Hauser7 , Brenden Jongma2,8 , Ana Lopez9 , Simon Mason3 , Janot Mendler de Suarez1,10 ,
Florian Pappenberger11 , Alexandra Rueth12 , Elisabeth Stephens13 , Pablo Suarez1,14 , Jurjen Wagemaker15 , and
Ervin Zsoter11
1 Red Cross Red Crescent Climate Centre, The Hague, 2521 CV, the Netherlands
2 Institute for Environmental Studies, VU University Amsterdam, 1081 HV, Amsterdam, the Netherlands
3 International Research Institute for Climate and Society, Columbia University, Palisades, NY 10964, USA
4 Royal Netherlands Meteorological Institute (KNMI), De Bilt, 3731 GA, the Netherlands
5 Uganda Red Cross Society, Kampala, Uganda
6 Uganda National Meteorological Authority, Kampala, Uganda
7 Climate System Analysis Group, Department of Environmental and Geographical Science, University of Cape Town,

Cape Town, South Africa
8 Global Facility for Disaster Reduction and Recovery (GFDRR), World Bank, Washington DC, USA
9 Atmospheric Oceanic & Planetary Physics Department, Oxford University, Oxford, OX1 3PU, UK
10 Frederick S. Pardee Center for the Study of the Longer-Range Future, Boston University, Boston, Massachusetts, USA
11 European Centre for Medium-Range Weather Forecasts, Reading, RG2 9AX, UK
12 German Red Cross, 12205 Berlin, Germany
13 School of Archaeology, Geography and Environmental Science, University of Reading, Reading, RG6 6AH, UK
14 Department of Science, Technology, Engineering and Public Policy, University College London, London, UK
15 Floodtags, The Hague 2516 BE, the Netherlands


Correspondence to: Erin Coughlan de Perez (coughlan@climatecentre.org)

Received: 11 April 2016 – Published in Hydrol. Earth Syst. Sci. Discuss.: 14 April 2016
Revised: 27 July 2016 – Accepted: 31 July 2016 – Published: 5 September 2016


Abstract. Too often, credible scientific early warning infor-     the Uganda Red Cross Society forecast-based financing pi-
mation of increased disaster risk does not result in humani-      lot project, with forecasts from the Global Flood Awareness
tarian action. With financial resources tilted heavily towards    System (GloFAS). Using this method, we define the “dan-
response after a disaster, disaster managers have limited in-     ger level” of flooding, and we select the probabilistic forecast
centive and ability to process complex scientific data, includ-   triggers that are appropriate for specific actions. Results from
ing uncertainties. These incentives are beginning to change,      this methodology can be applied globally across hazards and
with the advent of several new forecast-based financing sys-      fed into a financing system that ensures that automatic, pre-
tems that provide funding based on a forecast of an extreme       funded early action will be triggered by forecasts.
event. Given the changing landscape, here we demonstrate
a method to select and use appropriate forecasts for spe-
cific humanitarian disaster prevention actions, even in a data-
scarce location. This action-based forecasting methodology        1   Introduction
takes into account the parameters of each action, such as ac-
tion lifetime, when verifying a forecast. Forecasts are linked    Taking preparedness actions in advance of a disaster can
with action based on an understanding of (1) the magnitude        be both effective in saving lives and assets as well as ef-
of previous flooding events and (2) the willingness to act “in    ficient in reducing emergency response costs. Practitioners
vain” for specific actions. This is applied in the context of     and forecasters have mobilized around the concept of “Early
                                                                  Warning Early Action” based on weather information (Al-


Published by Copernicus Publications on behalf of the European Geosciences Union.
```

## Page 2

```text
3550                       E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action

fieri et al., 2012; IFRC, 2009; Krzysztofowicz, 2001; Web-         identify the critical flood magnitude that needs to be forecast
ster, 2013), also in light of rising risks in a changing climate   to inform humanitarian action.
(e.g. IPCC, 2012). In this context, there is considerable de-         Secondly, flood forecasts, especially in data-scarce ar-
mand for decision-relevant climate and weather information.        eas, have high uncertainties. While there may be demon-
The humanitarian and development sectors collaborate with          strable probabilistic skill in flood forecasts (Alfieri et al.,
forecasters on early warning for disaster risk reduction, for      2013), probabilities themselves open the possibility of action
instance in the context of the Global Framework for Climate        “in vain”. Here, we consider action “in vain” to be action
Services (Hewitt et al., 2012) and the regional Famine Early       that is taken after a forecast but is not followed by the ex-
Warning System Network (Ross et al., 2009). Indeed, the            treme event. In many cases, pre-agreed actions that are “in
critical moments in between a forecast and a disaster rep-         vain” because the extreme event did not materialize can have
resent an opportunity to bridge the traditional humanitarian       a longer-term positive impact, strengthening resilience and
and development spaces.                                            supporting ongoing development efforts in the area. How-
   Disaster managers have indeed been highly successful            ever, in such a case of action “in vain”, the humanitarian actor
in using forecasts in cyclone-prone areas of the world: ac-        would have chosen an alternative use of resources if he/she
tions based on early warning systems have saved millions of        had known that the extreme event would not materialize.
lives and prevented significant damage (Galindo and Batta,            Therefore, humanitarian actors are often unsure of when
2012; Harriman, 2013; Lodree, 2011; Rogers and Tsirkunov,          it would be worthwhile to take action and spend resources
2013). This is partly because people can take action when          based on a probabilistic forecast. Analyses of preposition-
they know that a cyclone is nearly certain to strike, and cy-      ing of stocks rarely consider how forecast probabilities could
clones can have enormous impact on society. In addition to         be used to trigger such action – or “action-based forecast-
cyclones, heatwave early warning systems also trigger action       ing” (Bozkurt and Duran, 2012; Bozorgi-Amiri et al., 2011).
to reduce mortality; these are most commonly established in        Without a confident answer that links specific actions to spe-
developed countries (Ebi et al., 2004; Fouillet et al., 2008;      cific forecast probabilities, disaster managers find themselves
Knowlton et al., 2014a).                                           immobilized in discussions at the moment of receiving a
   These advances contrast sharply with the systematic lack        forecast of likely extreme conditions, with few criteria or lit-
of humanitarian action before other predictable natural haz-       tle clarity on how to make a decision and take action.
ards, including flooding. The barriers to early action are            Hence, the aim of this paper is to develop a methodology
particularly apparent in data-scarce areas of the developing       to link together forecasts and appropriate humanitarian ac-
world (Brown et al., 2007; Houghton-Carr and Fry, 2006).           tions; in doing so, we acknowledge the challenge of using
   One major barrier is the lack of funding available when a       forecasts in data-scarce areas. Specifically, we address two
disaster is likely but not certain. This incentive structure is    questions.
beginning to change with the advent of new forecast-based
financing systems (Coughlan de Perez et al., 2015). These            1. Given limited observational data and historical fore-
systems allocate resources prior to a hazard occurring based            casts, how should the hydrometeorological danger level
on a preselected forecast. This accounts for the possibility            threshold that represents an impactful flood be chosen?
of acting “in vain” if the hazard does not occur, ensuring           2. Given the limitations of assessing forecast skill us-
that the long-term gains of preventative action will outweigh           ing limited observational data, how should the forecast
the costs of false alarms. Here, we explore two specific chal-          probability of triggering early action be identified?
lenges for the development of such a system in the context of
a probabilistic flood forecast, and offer a forecast evaluation       In this paper, we illustrate the practical application of this
methodology tailored to specific actions. This builds on ex-       methodology for a pilot forecast-based financing project in
isting methodologies to match forecasts with actions in light      rural Uganda. We evaluate river discharge forecasts from
of the costs and benefits of these actions (Coughlan de Perez      the Global Flood Awareness System (GloFAS), a global hy-
et al., 2015; Lopez et al., unpublished).                          drological model run daily using rainfall forecasts from the
   First, translating flood magnitudes into damages is a non-      European Centre for Medium Range Weather Forecasting
trivial task in a data-scarce location. Dale et al. (2012)         (ECMWF). After introducing the context of the project re-
proposed a method to convert forecast probabilities from           gion, we elaborate a method for selecting the danger level
an ensemble system into likelihoods of damages using a             and trigger, including constraints that need to be included
magnitude–damage curve, aggregated proportionally by each          to ensure the method is applicable to a humanitarian situ-
ensemble member. However, the data requirements of creat-          ation. We then share results from two locations in north-
ing such stage–damage curves (Merz et al., 2010; Michel-           eastern Uganda, and estimate the probability that a system
Kerjan et al., 2013; Ward et al., 2013) are often prohibitive,     predicated on such limited data will be “intolerable” or cause
as the precise amount of flooding that will cause impact is of-    disaster managers to act “in vain” more often than was ex-
ten unknown. Here, we offer an alternative methodology to          pected. Based on this, we discuss implications for north-
                                                                   eastern Uganda and other regions. We conclude with pro-


Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016                                    www.hydrol-earth-syst-sci.net/20/3549/2016/
```

## Page 3

```text
E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action                                 3551

                                                                       Whenever a flood is reported, the Uganda Red Cross So-
                                                                    ciety has a mandate to assess the situation and respond. In
                                                                    past events such as the 2007 floods, they have provided post-
                                                                    disaster shelter and relief items to the affected population
                                                                    (Jongman et al., 2015). Both the flood losses and the disas-
                                                                    ter response expenses could be reduced if anticipatory mea-
                                                                    sures were deployed before the flood, after unusual condi-
                                                                    tions are forecast. Based on the methodology articulated in
                                                                    this paper, forecast-based financing thresholds were opera-
                                                                    tionalized in mid-2015, consisting of standard operating pro-
                                                                    cedures for forecast-based action. In November 2015, a “trig-
                                                                    gering” forecast successfully initiated action (Red Cross Red
                                                                    Crescent Climate Centre, 2015). This was the first time the
                                                                    local branch had used a preparedness fund to take action be-
                                                                    fore flood disaster reports were issued, and while the impacts
                                                                    are still being analysed, the region reported flooding after the
Figure 1. Map of Uganda; Kapelebyong and the gauge are marked       trigger had been reached in one of the project areas.
by the top red square, and Magoro and Ngariam are located at the
bottom red square.
                                                                    2.2   Actions

posed next steps for forecast-based financing systems and           To set up the forecast-based financing system to initiate early
application of global flood models elsewhere.                       action, the Uganda Red Cross Society project team identi-
                                                                    fied preparedness actions that could be taken prior to a flood
                                                                    event, through consultations with people living in the af-
2     Context                                                       fected areas as well as internal discussions and two facili-
                                                                    tated workshops. Participants in the workshops included dis-
2.1    Region                                                       aster managers, volunteers, the Uganda Meteorological Au-
                                                                    thority and district officials (Jongman et al., 2015). In each of
The Uganda Red Cross Society, with support from the Ger-            the workshops, the disaster managers from the Uganda Red
man Red Cross and the Red Cross Red Crescent Climate                Cross Society discussed the quantitative and qualitative costs
Centre, is implementing a forecast-based financing pilot in         and losses associated with three scenarios: (1) taking suc-
the north-eastern part of the country. As part of this pilot, the   cessful action, (2) failing to act before a flood, and (3) acting
German Red Cross established a novel Preparedness Fund              “in vain”. For each action, they first answered questions indi-
that can be disbursed to take predefined preparedness actions       vidually before discussing collectively. Lastly, disaster man-
when a triggering forecast is issued in this region. At the time    agers estimated their willingness to “act in vain”, expressed
of writing, there are more than a dozen such forecast-based         as a number of times out of 10.
financing projects operational globally.                               Ultimately, the team selected a set of actions that were
   The Teso region of north-eastern Uganda is a swampy re-          seen as both impactful and implementable by the Uganda
gion, prone to river flooding and waterlogging during the           Red Cross Society. One action (evacuation) was eliminated
two rainy seasons centred in May and October. The Uganda            because about one-quarter of the respondents indicated that
Red Cross Society project areas are in the sub-districts of         they would not be willing to act in vain at all. The political
Magoro and Ngariam in Katakwi district on the Apapi River,          and reputational costs of evacuating in vain are considerable.
and Kapelebyong in Amuria district on the Akokoro River             The remaining selected actions are specified in Table 1. For
(see Fig. 1). Unfortunately, there is no calibrated hydrolog-       these three actions, the disaster managers came to a consen-
ical model available for these rivers. Both rivers drain into       sus that they would be willing to act in vain approximately
Lake Bisina and eventually into the Nile.                           50 % of the time. Here, we use this as the “tolerable” amount
   The Uganda Red Cross Society selected this pilot region          of acting in vain to establish the forecast-based financing sys-
based on vulnerability to floods. As regional conflict sub-         tem for this set of actions. Later in the paper, we estimate the
sided in the 1990s and 2000s, this region was gradually re-         probability that the GloFAS forecast triggers are an “intoler-
settled, and nowadays many of the current residents practice        able” system, or one that causes disaster managers to act “in
farming and raise livestock. Since that time, several flood         vain” more than 50 % of the time.
events have impacted the area. The floods typically cause              For each action, the Uganda Red Cross Society specified
impassable roads, loss of crops, outbreaks of waterborne dis-       how many days would be needed to carry out the action,
eases, and collapse of houses and latrines (OSSO and LA             which should correspond to the forecast lead time (Jongman,
RED, 2009).                                                         2015). The specified lead times are contingent on the as-


www.hydrol-earth-syst-sci.net/20/3549/2016/                                      Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016
```

## Page 4

```text
3552                        E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action

sumption that several of the procurement and volunteer train-         run once a day to produce probabilistic discharge estimates
ing steps would be carried out at the beginning of the flood          over the entire globe at a resolution of 0.1◦ (approximately
season, to enable quick action based on a short-term forecast.        11 km at the Equator). Here, we use daily historical GloFAS
   Secondly, they identified the “action lifetime”: the period        forecasts from 2009 to 2014, as well as gauge data from the
of time after the action is completed during which it offers          (only) local Akokoro gauge from 2009 to 2013, which over-
preparedness or protection from the extreme event. Tradi-             lap for 2014 days. The gauge is located at approximately
tional flood forecast evaluations are specific to the time pe-        1.86◦ N, 33.85◦ E.
riod forecasted, evaluating whether a single forecasted day              GloFAS is driven by the ECMWF ensemble forecast-
did indeed flood. Humanitarians would count this as a “hit”           ing system, with 51 ensemble members at lead times of
and, unlike forecasters, they would also consider it to be a          0 to 45 days. The first 15 days include rainfall forecasts,
“hit” if the flood instead occurred 5 days after the forecasted       and the following days are river routing only. The prob-
date and the action lifetime was 30 days. In such a case,             abilistic flood forecasts are available free of charge on
the action would still be effective in reducing impacts, even         a password-protected website (http://www.globalfloods.eu/).
though the flood occurred slightly later than the forecasted          GloFAS takes a “model climatology” approach, aiming to
date.                                                                 forecast extremes or anomalies in river flow relative to his-
   Therefore, the methodology detailed in this paper avoids           torical “climatology” runs of the model (Hirpa et al., 2016).
re-triggering an action if the “action lifetime” of a previous        This approach addresses the problems of the lack of repre-
action is still ongoing. For example, after digging drainage,         sentation of local-scale channel geometry and bias in the pre-
the team would not re-trigger digging of trenches until the           cipitation forcing. However, one of the major challenges is to
first set of trenches could be assumed to have degraded, likely       link the model climatology to the real world, focusing on the
about 90 days after digging. While the end of the “lifetime”          percentiles rather than absolute values of the forecast.
is not a strict transition from useful to non-useful, it is an es-
timation of the date at which the Uganda Red Cross Society
would find it acceptable to re-trigger the action in the region.      3     Methods
We posit this constraint throughout the paper; an action can-
not be re-triggered until the action lifetime of the preceding        To define a forecast probability that could be used to trigger
action is over.                                                       early action in the Uganda forecast-based financing system,
   The selected actions are listed in Table 1 (note that this is      we (1) estimate the quantity of discharge that represents a
a subset of all actions that were originally considered).             flood and (2) identify the forecast probability that will make
                                                                      it worthwhile to take preparedness actions (less than 50 %
2.3    Forecasts                                                      chance of acting in vain).

                                                                      3.1    What hydrometeorological “danger level”
This paper proposes a method for identifying a forecast that
                                                                             represents a flood?
could trigger one or more of these actions before a potential
flood, given the constraint of acting in vain less than 50 % of       While the relationship between water levels and flood risk
the time. As mentioned earlier, there is no locally available         will vary over time due to trends in vulnerability and expo-
flood forecasting system, and there is only one river gauge           sure, here we define a percentile of discharge that is qual-
with recorded discharge in the pilot area. Unfortunately, the         itatively associated with reported flood events of the past
large upstream catchment area dictates that rainfall in a spe-        few years, when avoidable losses were observed. For flood
cific village is not a useful proxy for flood risk in that village.   reports, we use two sources of information: humanitarian
Given these constraints, we choose to examine whether river           records and media reports.
discharge forecasts from the Global Flood Awareness Sys-                 With regards to the humanitarian records, we combine
tem (GloFAS) can be used to trigger action in this data-scarce        records from the Desinventar database (UNISDR, 2011) with
location in ways that are compatible with stakeholder prior-          an internal record system of disasters that are reported to the
ities. Probabilistic hydrometeorological forecasts have been          Uganda Red Cross Society. Between the two humanitarian
evaluated globally, and have been shown to have limited skill         data sets, they contain eight distinct records of floods in the
(e.g. Alfieri et al., 2012; Li et al., 2008; Wu et al., 2014).        Magoro area from 2009 to mid-2014; these floods occurred
   GloFAS is an operational global ensemble flood forecast-           in 2010, 2011, and 2012.
ing system developed in partnership between ECMWF, the                   For the media analysis, we analysed two national Ugan-
European Commission Joint Research Centre, and the Uni-               dan newspaper repositories: Daily Monitor and New Vision.
versity of Reading (Alfieri et al., 2013). Currently in a pre-        We filtered each repository with 40 flood-related keywords1 .
operational development phase, calibration of the model with
river flow observations, where available, is being carried out            1 The keywords are flood, floods, flooding, inundation, inunda-
in a research mode. The model version used here is not cal-           tions, landslide, dam break, dam burst, dam bursting, dam breached,
ibrated for the north-eastern Uganda catchments. GloFAS is            dam fail, dam failed, dam failing, dam failure, dam broken, dam


Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016                                         www.hydrol-earth-syst-sci.net/20/3549/2016/
```

## Page 5

```text
E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action                                        3553

Table 1. Actions selected for a forecast-based financing system. See Jongman et al. (2015) for more information on the actions and their
associated costs. Note that the implementation time of an action should equal the lead time of the forecast selected to trigger that action.

   Action                                                               Time required to complete the   How long the action will benefit
                                                                        action (implementation time)    the community after it is
                                                                                                        completed (action lifetime)
   Water storage and purification: distribute jerry cans, soap, and a   4 days to complete              30 days after completion
   30-day supply of chlorine tablets to vulnerable households.
   Water drainage: dig trenches around homes to divert water.           4 days to complete              90 days after completion
   Food storage: bag vulnerable items and move to storage               7 days to complete              30 days after completion
   facilities on high ground.



From Daily Monitor we downloaded a total of 2974 news ar-                 flood overview with dates of flood occurrences in Katakwi
ticles between 2004 and 2015. From New Vision we down-                    district (it can be accessed here: https://www.floodtags.com/
loaded 752 news articles between 2001 and 2015. Unfortu-                  historic-floodmap-uganda). There are 13 newspaper reports
nately the database for New Vision could not be fully ac-                 of flooding within our time series.
cessed, since the news repository allows access to only the                  While this accounts for many events, not all disasters are
top 200 newspapers per query, without the possibility for an              included in these databases, and some of those included may
advanced search.                                                          have had less impact than others. The effect of this under-
   Within the database total of 3726 news articles, we clus-              representation is an overestimation of acting in vain, which
tered the sentences in the articles using a K-means clus-                 renders our trigger selection conservative. In addition, im-
tering algorithm (Hürriyetoglu, unpublished; Kaufman and                  pact is not perfectly correlated with flood magnitude, given
Rousseeuw, 1990). Next we annotated the clusters using four               that vulnerability can change over time. Therefore, we only
classes: 1. Current flood event; 2. Past event or flood warning;          attempt a qualitative comparison of discharge and reported
3. Mixed; and 4. Unrelated. After annotation we found that                flood events, which adds additional (unquantified) uncer-
a total of 1721 news articles held relevant flood information             tainty to the calculation of false alarms in the following sec-
(annotated as class 1 or 2). To obtain geographical informa-              tion.
tion, we filtered the sentences for any “marker” terms that are              As we do not have a gauge for the Apapai River, where
often used when the writer specifies a location2 , and within             Magoro and Ngariam sub-counties are located, we use the
this subset we looked for mentions of district and sub-county             daily ensemble median of GloFAS forecasts at a lead time
names. As a result, for the district of interest (Katakwi) we             of 0 as a proxy for actual discharge and compare this with
found a total of 27 news articles with flood sentences AND                the above data sets of reported disasters in those two loca-
geographical reference. Applying the same approach to all                 tions. We qualitatively select a threshold percentile of dis-
districts in Uganda we found a total of 1173 of such articles             charge to be considered the “danger level” or “flood” for
(except in this case we did not only use the sentences con-               this region, rather than an absolute value. The exact per-
taining geographically related keywords).                                 centile is a subjective selection to approximate the base rate
   With these results from the algorithm, we validated the re-            of reported floods, ideally including the maximum number of
sult manually for the districts of our interest by reading the            exceedances that were indeed followed by a reported flood
articles. For 85 % of the events we had found an actual flood             event.
event described in the text, meaning that the flood event was
automatically detected for the correct month/year in the cor-             3.2   What forecast probability should trigger action?
rect location(s). Conversely, 15 % were false positives, mean-
ing the text was describing a non-flood event. The result                 Using this selected “danger level” percentile as a proxy for
of this data mining of the news repositories is a historical              the amount of discharge that causes a flood, we calculate
                                                                          what probability of exceeding the danger level should trig-
collapse, dyke break, dyke burst, dyke bursting, dyke breached,           ger action. Here, we calculate probabilities using the forecast
dyke fail, dyke failed, dyke failing, dyke failure, dyke broken,
                                                                          ensemble, evaluating them against the gauge discharge.
dyke collapse, embankment break, embankment burst, embank-
                                                                             The forecast verification score of interest to humanitar-
ment bursting, embankment breached, embankment fail, embank-
ment failed, embankment failing, embankment failure, embankment           ian actors is the false alarm ratio (FAR) (Hogan and Mason,
broken, embankment collapse, submerged, overflowed, breach, and           2012; Lopez et al., unpublished), defined as the number of
water-logging.                                                            forecast-based actions that were not followed by a flood, di-
    2 They are affected NOT not, hit NOT not, situation AND bad,          vided by the total number of actions that were triggered by
situation AND worse, situation AND worst, cut off, displaced, de-         the system. It thus represents the proportion of actions that
stroyed, submerged, and collapsed                                         are taken “in vain”. Here, we take into account the action


www.hydrol-earth-syst-sci.net/20/3549/2016/                                            Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016
```

## Page 6

```text
3554                       E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action

lifetime, so any action that was followed by a flood during its
lifetime is considered a “hit”, and only actions that have no
flooding at any point during their lifetime are “in vain”. Sim-
ilarly, a second action is never triggered during the lifetime
of another action.
   To estimate the FAR, we compare the nearest grid box of
the GloFAS forecast with the river gauge on the Akokoro
River, for which we have an overlapping time period of daily
data from 10 January 2009 to 31 December 2014. The cor-
relation of these two data sets is 0.52. In the context of a
forecast-based financing system, the Red Cross or other hu-
manitarian actors will take action when the forecast meets
or exceeds a triggering probability of flooding. The FAR
is therefore calculated as follows: (1) any forecast meeting        Figure 2. Forecasted discharge (circles) at Magoro sub-county,
or exceeding the trigger probability is considered an action;       Uganda, represented by a GloFAS forecasts ensemble median at
(2) any action followed by a flood within the action lifetime       lead time 0. Dates of disasters in the regions along the Apapai River
of 30 days is counted as a “hit”, otherwise an action “in vain”.    are indicated by dark blue vertical lines, as per the databases of the
   Our first goal is to estimate whether a forecast indicat-        Uganda Red Cross Society and Desinventar. Newspaper reports of
ing a 50 % chance of flooding would indeed correspond to            flooding in the district of Katakwi are indicated by light blue vertical
a 50 % chance of flooding in the real world. We plot relia-         lines. Small tick marks on the x axis correspond to months within a
bility diagrams (Broecker, 2012) for the forecast at 4- and         year. The horizontal dashed red line indicates the 95th percentile of
7-day lead times at the gauge location, as well as the Glo-         estimated discharge; dates with discharge above this threshold are
                                                                    coloured in red.
FAS forecasts in the two non-gauge project locations, com-
paring 4-day lead-time forecasts with the 0-day forecasts to
approximate actual discharge. However, in such a small sam-         4     Results
ple, the incidence of forecasts of rare events is low, and there-
fore the confidence intervals in these reliability diagrams are     4.1    What hydrometeorological danger level represents
very wide.                                                                 a flood?
   Given such a small number of years to calculate the perfor-
mance of forecasts with regards to extreme events, however,         To estimate the percentile of discharge that is associated with
we cannot be sure that the estimate of FAR in the sample is         flooding in the project region, we plot the historical median
representative of the true value. For example, if the estimate      water levels forecasted at a lead time of 0 by the GloFAS
from our sample yields a FAR of 30 %, it is still possible          model. Here, we focus on the Apapi River, where two project
that the real value is actually greater than 50 %. This means       districts are located and several disaster records exist. Be-
that, in reality, the selected trigger level for our forecast-      cause Ngariam sub-county is directly upstream of Magoro
based financing system would cause the Uganda Red Cross             sub-county, we plot simulated discharge at Magoro and re-
Society to act “in vain” more than 50 % of the time, which          ported flood events in both sub-counties (Fig. 2). Comparing
is not considered “tolerable”. To estimate the risk of setting      this with historical floods (dark blue lines), and media reports
up an “intolerable” system, we calculate confidence intervals       from the district (light blue lines), we qualitatively select the
around the FAR by using bootstrap resampling. To account            95th percentile (horizontal red line) as a proxy for disaster.
for the autocorrelation of the discharge time series, we use           In the 6 years of 2009–2014, this danger level would have
a 60-day fixed block bootstrap to generate 10 000 samples           been exceeded in 2010, 2011, and 2012 (see Fig. 2). In April
by resampling with replacement the time series (n = 2014)           2010, reports indicate that 12 secondary schools and 7000
of forecast–observation pairs. Given a trigger forecast prob-       people were affected by flooding in the area, followed by
ability, for each sample we calculate the FAR and generate          crop losses due to waterlogging in May 2010. Flooding con-
a distribution of all the sample FARs. This is repeated for         tinued to be reported through to September and October of
each trigger probability, and we demonstrate results for three      that year, affecting several regional roads. This corresponds
triggers: forecast probabilities of 30, 50, and 70 %. Based         well to the simulated discharge for those years.
on these results, we estimate the likelihood that taking ac-           In 2011, simulated discharge again accords well with re-
tion when one of these forecast probabilities is exceeded will      ported flooding that affected both people and infrastructure
lead to a FAR above 50 %, which would fail to satisfy the           in the area. In 2012, waterlogging reports to the Uganda Red
decision-maker requirements for action “in vain”.                   Cross Society arrived in August, which is substantially after
                                                                    the peak modelled discharge, and the newspaper reports are
                                                                    concentrated in October and November. It is possible that the
                                                                    peak discharge did correspond to the model data and was not


Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016                                       www.hydrol-earth-syst-sci.net/20/3549/2016/
```

## Page 7

```text
E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action                                            3555




Figure 3. Reliability diagram for the gauge location (left) and the two project locations (right). This shows how many times a flood occurred
for each forecast probability category. For the gauge location, GloFAS forecasts at two lead times on the Akokoro River are compared
with gauge discharge (left). At the two project locations, GloFAS 4-day lead-time forecasts are compared with 0-day forecasts. Seven-day
forecasts are not shown in the right panel, as results are very similar to the 4-day plots. The frequencies of forecast probabilities of 0 % are
1688, 1655, 1702, and 1658, for Gauge 4-day, Gauge 7-day, Kapelebyong, and Magoro, respectively. These are not plotted in the frequency
bar graph as they would extend past the scale. Lastly, due to sampling uncertainty, 95 % confidence intervals extend nearly from 0 to 1, and
are therefore not plotted.


reported, or was reported at a later time. Our threshold was                 In Fig. 3, we plot the reliability of the forecast at both lead
not crossed in 2013 and 2014, which accords well with the                 times when compared to gauge discharge on the Akokoro
lack of reported floods in those years.                                   River. In the project locations with no gauge, we also exam-
   We begin to see other years (with no disasters) counted as             ined the ability of GloFAS to forecast itself 4 days in advance
“floods” if we lower the danger level below 93 %, and if we               (Fig. 3, right-hand reliability diagram). In both cases, we are
raise it above the 99th percentile very few years exceed the              unable to establish the reliability with confidence given the
threshold. Therefore, we assume from the limited data avail-              small sample size.
able that discharge above the 95th percentile is likely indica-              If we set the trigger given these limited data, how likely
tive of flood conditions in this location, and in the following           is it that we developed a system that is “intolerable” to the
analysis, anything above the 95th percentile is defined as a              Uganda Red Cross Society, actually leading disaster man-
“flood”. In Kapelebyong sub-county, the other project loca-               agers to act “in vain” more than 50 % of the time? Figure 4
tion in this region, the only recorded disasters are from the             shows the FAR from 10 000 resamples as a probability distri-
devastating floods of 2007, which are not available in Glo-               bution function. This assumes that action is triggered when
FAS reforecasts. Therefore, we also assume this percentile                the forecast probability of flooding reaches or exceeds 30,
applies to Kapelebyong, as the infrastructure and vulnerabil-             50, or 70 %, and that there is a 30-day action lifetime.
ity are similar in the two areas.                                            The bootstrapped results indicate a high chance of a “tol-
                                                                          erable” system, especially at higher forecast triggers. Only
4.2   What forecast probability should trigger action?                    24, 19, and 18 % of all the bootstrapped samples returned
                                                                          an “intolerable” system (grey bars) for a threshold of 30, 50,
We consider forecasts of 4-day and 7-day lead times, aiming               and 70 %, respectively. This is true for a sample size of 2014
to identify a trigger that corresponds to a FAR of 0.5 or less.           days. This represents the chance that the system does not
If the forecast probability of exceeding the flood danger level           pass the required specifications, and would cause humanitar-
is 50 %, then the observed frequency of exceeding the flood               ian actors to act “in vain” more than 50 % of the time in the
threshold should be 50 % for a reliable forecast.                         long run. While increasing the forecast trigger does reduce


www.hydrol-earth-syst-sci.net/20/3549/2016/                                              Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016
```

## Page 8

```text
3556                          E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action

                                                                             As illustrated here, there are two major components of
                                                                          action-based forecasting. Forecasters and disaster managers
                                                                          (1) select the appropriate danger level of a hazard that causes
                                                                          avoidable losses and (2) calculate the FAR for specific trigger
                                                                          probabilities based on willingness to act in vain.
                                                                             These two components can be readily applied to most
                                                                          other forecastable natural hazards. First, there are many pos-
                                                                          sibilities for defining the “danger level” of river floods both
                                                                          spatially and temporally; Stephens et al. (2015) have sug-
                                                                          gested several different definitions of “floodiness” that could
                                                                          correspond to danger levels in varying river situations. Out-
                                                                          side of riverine flood hazards, “danger levels” of rainfall are
                                                                          available for flash flood events (Bacchini and Zannoni, 2003;
                                                                          Yang et al., 2015). Beyond floods altogether, heatwaves are
                                                                          an example of hazard where there are many epidemiological
                                                                          studies to identify temperatures that are linked to increased
                                                                          morbidity and mortality (Hajat et al., 2010; Knowlton et al.,
                                                                          2014b; WMO and WHO, 2015). The same applies to storm
                                                                          surge heights, drought indices, wind speeds, etc. (Muir Wood
                                                                          et al., 2005; Ross et al., 2009).
                                                                             Although the methods for defining the “danger level” for
                                                                          each type of hazard can and do differ, many do rely on reports
                                                                          of historical disaster events (Bacchini and Zannoni, 2003;
                                                                          Loughnan et al., 2010). The method of news repository data
                                                                          mining used here is a scalable method to identify approxi-
                                                                          mate dates of impacts. This can be enhanced by improving
                                                                          the geocoding database (e.g. correcting errors in the Open-
                                                                          StreetMap database for Uganda), improving the clustering
                                                                          methods (e.g. isolating different flood incidences including
                                                                          blocked roads and improving geocoding) and negotiating ac-
                                                                          cess to more newspapers (e.g. better access to the New Vision
                                                                          repository). Further qualitative research on the news articles
Figure 4. Histogram of false alarm ratio calculations from a block
bootstrapped resample of a time series of 2014 days of forecast–
                                                                          related to flooding in the region of interest can also help guide
observation pairs. The vertical axis depicts probability density. Each    the selection of what types of forecast-based action would be
sample is calculated for 4-day lead times at different forecast trigger   most appropriate for the region.
values. The black bin contains the value of FAR from the original            The second component of action-based forecasting is cal-
time series, and bins exceeding a FAR of 0.5 are grey. All FAR            culation of the FAR at the specified danger level. Instead
calculations assume a 30-day action lifetime.                             of static forecast verification metrics, the FAR for any haz-
                                                                          ard forecast should be calculated according to these context-
                                                                          specific parameters, including the action lifetime. The World
this risk, the effect is not substantial given the small data set         Meteorological Organization has issued guidance on impact-
available.                                                                based forecasting, which includes information on selecting
                                                                          threshold danger levels that then can be forecasted for tar-
                                                                          get recipients (WMO, 2015). This guidance does not address
5   Discussion
                                                                          probabilities using deterministic terminology such as “winds
The calculations and estimations used here build on estab-                are expected”. It does not include information on how to se-
lished forecast verification methods, combining information               lect trigger probabilities for a specific action, and could there-
on both actions and forecast skill to enable the use of fore-             fore be complemented by the techniques described here.
casts by the humanitarian community. Without incorporating                   Critical to selection of triggers based on the FAR results is
information about the action, it is unlikely that the humani-             the estimation of willingness to act “in vain”. When it comes
tarian community would be willing or able to plan for pre-                to the risk of an “intolerable” system that has too many false
paredness actions using existing seemingly arbitrary forecast             alarms, donors will also need to consider the implications of
verification measures.                                                    such a risk for their portfolio. In the Uganda example, dis-
                                                                          aster managers estimated that they would be willing to act
                                                                          “in vain” 50 % of the time. It should be noted that there is


Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016                                           www.hydrol-earth-syst-sci.net/20/3549/2016/
```

## Page 9

```text
E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action                               3557

evidence that when people are asked to express probabili-          in the model is that the actions taken by humanitarians have
ties, their choice of 50 % is often an expression of not be-       long “lifetimes”, and therefore are forgiving if the forecast is
ing sure as to the answer (Fischhoff and Bruine de Bruin,          early and the flood comes late.
1999; Tetlock and Gardner, 2015). While the 50 % constraint           It is encouraging that a global flood forecasting system has
from local stakeholders was respected in this study, fur-          the potential to support decisions, although this is not a re-
ther research into decision science could improve how this         placement for better observational data or the development
answer is elicited. Such research, in collaboration between        of calibrated catchment-scale models. While this method can
forecasters, users, and behavioural scientists, could identify     successfully forecast many instances of extreme river flow,
any biases that humanitarian decision makers should actively       it is only able to trigger actions that can in practice with-
avoid.                                                             stand a large number of false alarms. Indeed, better obser-
    Almost all of the steps in this analysis contained unquan-     vational data sets and catchment-scale models could enable
tifiable uncertainties. On the side of the forecasts, uncertain-   us to estimate the hazard–damage curve in a specific local-
ties can be reduced with longer reforecast time series for         ity, modelling the precise level of discharge that causes in-
each model update, as well as the implementation of local          undation and associated impact in specific areas. This type
record-taking devices for calibration. On the side of the ac-      of modelling could allow for the selection of more specific
tions, uncertainties are likely larger and much more difficult     and targeted preparedness actions, including actions specific
to quantify. The lives and vulnerabilities of the people living    to “small” floods that would no longer be useful in a ma-
in the target villages are constantly evolving, as are the capa-   jor flood (e.g. storage of water, which would not be useful if
bilities and priorities of the humanitarian sector. While these    one needed to later evacuate). Similarly, forecast-based ac-
are difficult to reduce, continual updates to danger levels and    tions could be crafted for different “types” of flooding, such
triggers as well as simulations with all relevant actors can       as long-duration or single high flows (Stephens et al., 2015).
confirm that the critical values and assumptions still hold.       Data constraints are often cited as the barrier to forecast-
                                                                   based action in rural areas of the world, and longer data sets
                                                                   over time will indeed allow for more precise calculation of
6    Conclusion                                                    flood thresholds and the inclusion of additional triggers for
                                                                   action.
Forecast-based financing aims to link forecasts to actions in         Model changes are continually implemented in real-time
advance of disasters. In this applied research, we have il-        forecasting systems, and the experimental GloFAS model
lustrated the development of such a system in a vulnera-           version used for this study has already been updated sev-
ble context, where calibrated local forecasts do not exist to      eral times. These dynamic changes to the forecasting sys-
support such decision-making. Examining the application of         tem add additional uncertainty to the implementation. In each
forecast-based financing in a data-scarce region of Uganda,        model update, the danger level and triggers need to be recal-
we have proposed an action-based forecasting methodology           ibrated with additional reforecasts, to assess how the danger
to answer two critical questions to enable early action based      level and FAR might have increased or decreased in a given
on flood warnings.                                                 forecast-based financing project location. To partly avoid this
                                                                   cumbersome requirement of constant reforecasts, forecasters
    1. Given limited observational data and forecast availabil-
                                                                   developing an operational product can consider forecast cor-
       ity, how should the danger level threshold be chosen that
                                                                   rections to ensure that the climatology of the model does not
       represents an impactful flood?
                                                                   change with model updates. This will ensure that the danger
    2. Given the limitations of assessing forecast skill us-       level stays constant even if the FAR does change.
       ing limited observational data, how should the forecast        However, “the perfect should not be the enemy of the
       probability of triggering early action be optimized to      good”. With relatively limited local and global data avail-
       avoid intolerable levels of false alarms?                   able, effective humanitarian action can be triggered in ad-
                                                                   vance of potential flooding. Humanitarian actors have a man-
Using this action-based forecasting methodology, we demon-         date to serve vulnerable people, and cannot wait to engage
strate that global flood products can already trigger worth-       in flood preparedness measures until sufficient local data are
while actions, even in data-scarce locations. Assuming that        collected over the years to establish “conventional” predic-
a specific extreme value of forecasted discharge is a valid        tive models, especially when global models may give sig-
proxy for a “danger level” in an area with limited data            nals of likely extreme conditions in the foreseeable future.
records, the GloFAS model can be used to trigger timely hu-        Moreover, the forecast-based financing system based on this
manitarian action in advance of an extreme event. Not only         method of analysis did indeed trigger action for the first
is there early action that can be justified based on the false     time in Uganda in November 2015, when water purification
alarm ratio of the GloFAS forecast in this area, the proba-        tablets, soap, shovels, and storage bags were distributed to
bility of triggering an unacceptable level of false alarms is      the at-risk population. Evaluation of the entire system, in-
less than 25 % in this region. Part of the reason for such skill


www.hydrol-earth-syst-sci.net/20/3549/2016/                                     Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016
```

## Page 10

```text
3558                      E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action

cluding the effectiveness and timeliness of these actions, is     Acknowledgements. The authors of this paper would like to extend
ongoing.                                                          their gratitude to the donors who have made the forecast-based fi-
   This simple methodology can easily allow for improve-          nancing pilots possible. The pilot project in north-eastern Uganda is
ment over time, adjusting parameters such as danger lev-          funded by the German Federal Ministry for Economic Cooperation
els or probability thresholds as experience reveals to stake-     and Development (BMZ). In addition, the German Federal Foreign
                                                                  Office has developed an action plan for humanitarian adaptation to
holders’ the desirability of redefining parameters based on
                                                                  climate change (Rüth, 2015), and has invested in forecast-based fi-
objective calculations or valid subjective preferences. Ad-       nancing in several other countries in Africa and around the world.
ditionally, this approach can be extended to other locations         We would also like to thank many who have contributed to this
and potentially scaled up to regional or national mechanisms      approach, including Leo Mwebembezi of the Uganda Hydrological
that systematically trigger early action to address flood risks   Department, the entire Uganda Red Cross Society implementing
among vulnerable people around the world. In particular,          team, the GloFAS team, and participants in the Forecast-based
the innovation of forecast-based financing can encourage the      Financing Dialogue Platform hosted biannually by IFRC in
collaboration between development and humanitarian actors         Geneva. E. Stephens’ time was funded by Leverhulme Early Career
to deliberate relevant forecast-based actions; these can both     fellowship ECF-2013-492.
promote and protect long-term development efforts.
   In the long term, there are opportunities to reduce the        Edited by: Giuliano Di Baldassarre
                                                                  Reviewed by: M. Begovic and one anonymous referee
lead time needed for preparedness measures, to offer more
choices of actions that can be taken in the window of time
between a forecast and the potential disaster. Such innova-
tions include everything from unmanned aerial vehicles to
rapidly delivering health materials to rural locations (Bam-      References
burry, 2015) to blockchain and smart contract technologies
allowing instant transfers of programmable money (Currion,        Alfieri, L., Salamon, P., Pappenberger, F., Wetterhall, F., and
2015; Forte et al., 2015).                                          Thielen, J.: Operational early warning systems for water-
   Operationalizing forecast-based financing systems is             related hazards in Europe, Environ. Sci. Policy, 21, 35–49,
within reach. First, more flexible humanitarian financing is        doi:10.1016/j.envsci.2012.01.008, 2012.
                                                                  Alfieri, L., Burek, P., Dutra, E., Krzeminski, B., Muraro, D., Thie-
needed that allows and incentivizes early action despite the
                                                                    len, J., and Pappenberger, F.: GloFAS – global ensemble stream-
risk of acting in vain; this is currently being considered by
                                                                    flow forecasting and flood early warning, Hydrol. Earth Syst.
various humanitarian and development donors. Successful             Sci., 17, 1161–1175, doi:10.5194/hess-17-1161-2013, 2013.
implementation of such funding requires improved incen-           Bacchini, M. and Zannoni, A.: Relations between rainfall and
tives towards early action and enabling an iterative learn-         triggering of debris-flow: case study of Cancia (Dolomites,
ing process toward more effective links between early warn-         Northeastern Italy), Nat. Hazards Earth Syst. Sci., 3, 71–79,
ing and early action. To achieve this, further investments are      doi:10.5194/nhess-3-71-2003, 2003.
needed at the practitioner interface between scientific and hu-   Bamburry, D.: Drones: Designed for Product Delivery, Des. Manag.
manitarian organizations. Humanitarian actors need to iden-         Rev., 26, 40–48, doi:10.1111/drev.10313, 2015.
tify risk reduction and preparedness actions that can be taken    Bozkurt, M. and Duran, S.: Effects of natural disaster trends:
before a potential flood, and agree on their level of will-         a case study for expanding the pre-positioning network of
                                                                    CARE International., Int. J. Environ. Res. Health, 9, 2863–2874,
ingness to act “in vain” for each action. By the same to-
                                                                    doi:10.3390/ijerph9082863, 2012.
ken, natural scientists (e.g. forecasters and flood modellers)
                                                                  Bozorgi-Amiri, A., Jabalameli, M. S., and Mirzapour Al-e-Hashem,
need to continue deepening their engagement with human-             S. M. J.: A multi-objective robust stochastic programming model
itarians and other stakeholders who can help turn scientific        for disaster relief logistics under uncertainty, O. R. Spectr., 35,
knowledge and skills into societal benefits. A closer collabo-      905–933, doi:10.1007/s00291-011-0268-x, 2011.
ration between these groups and the international develop-        Broecker, J.: Probability forecasts, edited by: Jolliffe, I. T. and
ment community should ensure the relevance and success              Stephenson, D. B., John Wiley & Sons, Ltd, Chichester, UK,
of forecast-based actions. There is also a need for decision        doi:10.1002/9781119960003.ch7, 119–139, 2012.
science expertise to advance the design of processes that         Brown, M. E., Funk, C. C., Galu, G., and Choularton, R.: Earlier
can help to better engage stakeholders in understanding and         Famine Warning Possible Using Remote Sensing and Models,
defining thresholds. Further collaboration among researchers        Eos, Trans. Am. Geophys. Union, 88, 381–396, 2007.
                                                                  Coughlan de Perez, E., van den Hurk, B., van Aalst, M. K., Jong-
and practitioners on the development of such systems can
                                                                    man, B., Klose, T., and Suarez, P.: Forecast-based financing: an
unlock the potential to greatly reduce the consequences of
                                                                    approach for catalyzing humanitarian action based on extreme
recurrent disasters around the world.                               weather and climate forecasts, Nat. Hazards Earth Syst. Sci., 15,
                                                                    895–904, doi:10.5194/nhess-15-895-2015, 2015.
                                                                  Currion, P.: Leveraging blockchain tech to improve financial
                                                                    mechanisms in the aid sector, available at: http://www.start-
                                                                    network.org/news/, 2015.


Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016                                    www.hydrol-earth-syst-sci.net/20/3549/2016/
```

## Page 11

```text
E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action                                          3559

Dale, M., Wicks, J., Mylne, K., Pappenberger, F., Laeger, S., and           ros, V., Stocker, T. F., and Dahe, Q., Cambridge University Press,
   Taylor, S.: Probabilistic flood forecasting and decision-making:         Cambridge, 2012.
   an innovative risk-based approach, Nat. Hazards, 70, 159–172,         Jongman, B., Coughlan de Perez, E., Nguyen, T.-B., and Mawanda,
   doi:10.1007/s11069-012-0483-z, 2012.                                     S.: Towards forecast-based humanitarian action for floods in
Ebi, K. L., Teisberg, T. J., Kalkstein, L. S., Robinson, L., and Wei-       Uganda, VU University Amsterdam, 137–158, 2015.
   her, R. F.: Heat Watch/Warning Systems Save Lives: Estimated          Kaufman, L. and Rousseeuw, P. J.: Finding Groups in Data; An In-
   Costs and Benefits for Philadelphia 1995–98, B. Am. Meteor.              troduction to Cluster Analysis, John Wiley & Sons, Ltd., Hobo-
   Soc., 85, 1067–1073, doi:10.1175/BAMS-85-8-1067, 2004.                   ken, NJ, 1990.
Fischhoff, B. and Bruine de Bruin, W.: Fifty-Fifty = 50 %?, J. Be-       Knowlton, K., Kulkarni, S. P., Azhar, G. S., Mavalankar, D.,
   hav. Decis. Mak., 12, 149–163, 1999.                                     Jaiswal, A., Connolly, M., Nori-Sarma, A., Rajiva, A., Dutta,
Forte, P., Romano, D., and Schmid, G.: Beyond Bitcoin – Part I?:            P., Deol, B., Sanchez, L., Khosla, R., Webster, P. J., Toma, V.
   A critical look at blockchain-based systems, 1–34, https://eprint.       E., Sheffield, P., and Hess, J. J.: Development and implementa-
   iacr.org/2015/1164.pdf (last access: 31 August 2016), 2015.              tion of South Asia’s first heat-health action plan in Ahmedabad
Fouillet, A., Rey, G., Wagner, V., Laaidi, K., Empereur-Bissonnet,          (Gujarat, India), Int. J. Environ. Res. Health, 11, 3473–3492,
   P., Le Tertre, A., Frayssinet, P., Bessemoulin, P., Laurent, F., De      doi:10.3390/ijerph110403473, 2014a.
   Crouy-Chanel, P., Jougla, E., and Hémon, D.: Has the impact of        Knowlton, K., Kulkarni, S. P., Azhar, G. S., Mavalankar, D.,
   heat waves on mortality changed in France since the European             Jaiswal, A., Connolly, M., Nori-Sarma, A., Rajiva, A., Dutta, P.,
   heat wave of summer 2003? A study of the 2006 heat wave., Int.           Deol, B., Sanchez, L., Khosla, R., Webster, P. J., Toma, V. E.,
   J. Epidemiol., 37, 309–317, doi:10.1093/ije/dym253, 2008.                Sheffield, P., and Hess, J. J.: Development and implementation
Galindo, G. and Batta, R.: Socio-Economic Planning Sciences                 of South Asia’s first heat-health action plan in Ahmedabad (Gu-
   Prepositioning of supplies in preparation for a hurricane under          jarat, India), Int. J. Environ. Res. Public Health, 11, 3473–3492,
   potential destruction of prepositioned supplies, Socioecon. Plan.        doi:10.3390/ijerph110403473, 2014b.
   Sci., 1–18, 2012.                                                     Krzysztofowicz, R.: The case for probabilistic forecasting
Alfieri, L., Burek, P., Dutra, E., Krzeminski, B., Muraro, D., Thie-        in hydrology, J. Hydrol., 249, 2–9, doi:10.1016/S0022-
   len, J., and Pappenberger, F.: Global Flood Awareness System             1694(01)00420-6, 2001.
   River Discharge, http://www.globalfloods.eu/, 2016.                   Li, L., Hong, Y., Wang, J., Adler, R. F., Policelli, F. S., Habib,
Hajat, S., Sheridan, S. C., Allen, M. J., Pascal, M., Laaidi, K.,           S., Irwn, D., Korme, T., and Okello, L.: Evaluation of the real-
   Yagouti, A., Bickis, U., Tobias, A., Bourque, D., Armstrong, B.          time TRMM-based multi-satellite precipitation analysis for an
   G., and Kosatsky, T.: Heat-health warning systems: a comparison          operational flood prediction system in Nzoia Basin, Lake Victo-
   of the predictive capacity of different approaches to identifying        ria, Africa, Nat. Hazards, 50, 109–123, doi:10.1007/s11069-008-
   dangerously hot days., Am. J. Public Health, 100, 1137–1144,             9324-5, 2008.
   doi:10.2105/AJPH.2009.169748, 2010.                                   Lodree, E. J.: Pre-storm emergency supplies inventory plan-
Harriman, L.: Cyclone Phailin in India: Early warning and                   ning, J. Humanit. Logist. Supply Chain Manag., 1, 50–77,
   timely actions saved lives, Environ. Dev., 9, 93–100,                    doi:10.1108/20426741111122411, 2011.
   doi:10.1016/j.envdev.2013.12.001, 2014.                               Lopez, A., Coughlan de Perez, E., Suarez, P., van den Hurk, B.,
Hewitt, C., Mason, S., and Walland, D.: The Global Frame-                   and van Aalst, M.: Bridging forecast verification and humanitar-
   work for Climate Services, Nat. Clim. Chang., 2, 831–832,                ian decisions: a valuation approach for setting up action-oriented
   doi:10.1038/nclimate1745, 2012.                                          early warning systems, Weather Clim. Extrem., unpublished.
Hirpa, F. A., Salamon, P., Alfieri, L., Thielen-del Pozo, J., Zsoter,    Loughnan, M. E., Nicholls, N., and Tapper, N. J.: When the
   E., and Pappenberger, F.: The Effect of Reference Climatology            heat is on: Threshold temperatures for AMI admissions to
   on Global Flood Forecasting, J. Hydrometeorol., 1131–1145,               hospital in Melbourne Australia, Appl. Geogr., 30, 63–69,
   doi:10.1175/JHM-D-15-0044.1, 2016.                                       doi:10.1016/j.apgeog.2009.08.003, 2010.
Historic Flood Events Uganda Floodtags: https://www.floodtags.           Merz, B., Kreibich, H., Schwarze, R., and Thieken, A.: Review
   com/historic-floodmap-uganda/, 2016.                                     article “Assessment of economic flood damage”, Nat. Hazards
Hogan, R. J. and Mason, I. B.: 3 Deterministic forecasts of binary          Earth Syst. Sci., 10, 1697–1724, doi:10.5194/nhess-10-1697-
   events, edited by: Jolliffe, I. T. and Stephenson, D. B., available      2010, 2010.
   at: https://eprint.iacr.org/2015/1164.pdf (last access: 31 August     Michel-Kerjan, E., Hochrainer-Stigler, S., Kunreuther, H.,
   2016), 2012.                                                             Linnerooth-Bayer, J., Mechler, R., Muir-Wood, R., Ranger, N.,
Houghton-Carr, H. and Fry, M.: The decline of hydrological data             Vaziri, P., and Young, M.: Catastrophe risk models for evaluating
   collection for development of integrated water resource manage-          disaster risk reduction investments in developing countries, Risk
   ment tools in Southern Africa, Clim. Var. Chang., 308 p. 51,             Anal., 33, 984–999, doi:10.1111/j.1539-6924.2012.01928.x,
   2006.                                                                    2013.
Hürriyetoglu, A.: [A Tool]: Finding and Labeling Relevant Infor-         Muir Wood, R., Drayton, M., Berger, A., Burgess, P., and Wright,
   mation in Tweet Collections, unpublished.                                T.: Catastrophe loss modelling of storm-surge flood risk in east-
IFRC: World Disasters Report 2009: Focus on early warning, early            ern England, Philos. Trans. A. Math. Phys. Eng. Sci., 363, 1407–
   action, available at: http://www.ifrc.org/Global/WDR2009-full.           1422, doi:10.1098/rsta.2005.1575, 2005.
   pdf (last access: 31 August 2016) 2009.                               OSSO and LA RED: Disaster Inventory System: Methodological
IPCC: Managing the Risks of Extreme Events and Disasters to Ad-             Guide, Version 8.1.9., available at: http://www.desinventar.net/
   vance Climate Change Adaptation, edited by: Field, C. B., Bar-           methodology.html (last access: 31 August 2016), 2009.



www.hydrol-earth-syst-sci.net/20/3549/2016/                                            Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016
```

## Page 12

```text
3560                         E. Coughlan de Perez et al.: Action-based flood forecasting for triggering humanitarian action

Red Cross Red Crescent Climate Centre: “Humanitarian history”            Webster, P. J.: Improve weather forecasts for the developing world,
   made as Uganda Red Cross launches forecast-based financing for          Nature, 493, 17–19, doi:10.1038/493017a, 2013.
   real, available at: http://www.climatecentre.org/news/657/ (last      WMO: WMO Guidelines on Multi-hazard Impact-based Forecast
   access: 31 August 2016), 2015.                                          and Warning Services, 2015.
Rogers, D. P. and Tsirkunov, V. V.: Weather and Climate Resilience:      WMO and WHO: Heatwaves and Health: Guidance on Warning-
   Effective Preparedness through National Meteorological and Hy-          System Development, edited by: McGregor, G. R., Bessemoulin,
   rological Services, Washington, DC, 2013.                               P., Ebi, K., and Menne, B., WMO, Geneva, 2015.
Ross, K. W., Brown, M. E., Verdin, J. P., and Underwood, L. W.: Re-      Wu, H., Adler, R. F., Tian, Y., Huffman, G. J., Li, H., and Wang, J.-
   view of FEWS NET biophysical monitoring requirements, Env-              J.: Real-time Global Flood Estimation using Satellite-based Pre-
   iron. Res. Lett., 4, 024009, doi:10.1088/1748-9326/4/2/024009,          cipitation and a Coupled Land Surface and Routing Model, Wa-
   2009.                                                                   ter Resour. Res., 50, 2693–2717, doi:10.1002/2013WR014710,
Rüth, A.: Framework: Action Plan of the Federal Foreign Office             2014.
   for Humanitarian Adaptation to Climate Change, Berlin, Ger-           Yang, T.-H., Yang, S.-C., Ho, J.-Y., Lin, G.-F., Hwang, G.-D.,
   many, available at: http://www.dkkv.org/fileadmin/user_upload/          and Lee, C.-S.: Flash flood warnings using the ensemble pre-
   Veranstaltungen/WCDRR_2015/GRC__2015__FFO_Action_                       cipitation forecasting technique: A case study on forecasting
   Plan_CCA_engl.pdf, 2015.                                                floods in Taiwan caused by typhoons, J. Hydrol., 520, 367–378,
Stephens, E., Day, J. J., Pappenberger, F., and Cloke, H.: Precip-         doi:10.1016/j.jhydrol.2014.11.028, 2015.
   itation and Floodiness, Geophys. Res. Lett., 42, 10316–10323,         UNISDR, UNDP, LARED, OSSO, Robot Search, Apache Software
   doi:10.1002/2015GL066779, 2015.                                         Foundation: Desinventar Disaster Information System, available
Tetlock, P. and Gardner, D.: Superforecasting: The art and science         at: http://www.desinventar.net/ (last access: 31 August 2016),
   of prediction, Random House, New York, p. 144, 2015.                    2011.
Ward, P. J., Jongman, B., Weiland, F. S., Bouwman, A., Beek, R.
   Van, Bierkens, M. F. P., Ligtvoet, W., Winsemius, H. C., van
   Beek, R., Bierkens, M. F. P., Ligtvoet, W., and Winsemius, H.
   C.: Assessing flood risk at the global scale: model setup, results,
   and sensitivity, Environ. Res. Lett., 8, 044019, doi:10.1088/1748-
   9326/8/4/044019, 2013.




Hydrol. Earth Syst. Sci., 20, 3549–3560, 2016                                           www.hydrol-earth-syst-sci.net/20/3549/2016/
```
