# Verbatim PDF Transcript

- Source PDF: `Alokasi_02_Rodriguez_Espindola_2017_Disaster_preparedness_in_humanitarian_logistics_A_collaborat.pdf`
- Original upload filename: `Alokasi_02_Rodriguez_Espindola_2017_Disaster_preparedness_in_humanitarian_logistics_A_collaborat.pdf`
- Source PDF SHA-256: `53a2d54e44b4d003ca994d7d87e5a2ee522e20efc0d878ab0fb2f44551841182`
- Extraction method: `pdftotext -layout`
- Pages: 35

This file preserves native PDF text with page boundaries. Tesseract OCR supplements pages where the native text layer is empty or corrupted.

## Page 1

```text
       Disaster preparedness in humanitarian logistics: A collaborative approach for resource
                                        management in floods

Oscar Rodríguez-Espíndola1*, Pavel Albores1 and Christopher Brewster2
1
    Aston Business School, Aston University, Birmingham, UK.
2
    TNO, Netherlands.

*Corresponding author. Tel. +44 (0) 121204 3558. E-mail address: o.rodriguez-
espindola@aston.ac.uk

Abstract

The logistical deployment of resources to provide relief to disaster victims and the appropriate
planning of these activities are critical to reduce the suffering caused. Disaster management attracts
many organisations working alongside each other and sharing resources to cope with an emergency.
Consequently, successful operations rely heavily on the collaboration of different organisations.
Despite this, there is little research considering the appropriate management of resources from
multiple organisations, and none optimising the number of actors required to avoid shortages or
convergence.

This research introduces a disaster preparedness system based on a combination of multi-objective
optimisation and geographical information systems to aid multi-organisational decision-making. A
cartographic model is used to avoid the selection of floodable facilities, informing a bi-objective
optimisation model used to determine the location of emergency facilities, stock prepositioning,
resource allocation and relief distribution, along with the number of actors required to perform these
activities.

The real conditions of the flood of 2013 in Acapulco, Mexico, provided evidence of the inability of
any single organisation to cope with the situation independently. Moreover, data collected showed the
unavailability of enough resources to manage a disaster of that magnitude at the time. The results
highlighted that the number of government organisations deployed to handle the situation was
excessive, leading to high cost without achieving the best possible level of satisfaction. The system
proposed showed the potential to achieve better performance in terms of cost and level of service than
the approach currently employed by the authorities.

Keywords: Humanitarian logistics, multiple objective programming, OR in disaster relief, disaster
preparedness.




                                                    1
```

## Page 2

```text
1   INTRODUCTION

During September 2013, Mexico was struck simultaneously by hurricane Ingrid from the Atlantic and
hurricane Manuel from the Pacific. This situation affected nearly 77% of the territory causing
extraordinary rainfall and successive flooding in different areas (Pedrozo-Acuña, Breña-Naranjo, &
Domínguez-Mora, 2014). The resulting floods had a major impact in the State of Guerrero. Beyond
the estimated damage of 23,441 million pesos (US$ 1.243 billion), there was a need to shelter around
44,216 people, whilst 105 people were found dead (García, Méndez, Reyes, & Marin, 2015).

Acapulco represented one of the most affected areas in the State. On the evening of September 15th, a
press release listed the most vulnerable regions of the country to be affected by the forecasted rainfall,
among which Acapulco was classified as having high vulnerability and the highest population
amongst the endangered areas (CENAPRED, 2014). Authorities declared a state of emergency from
16th September until 26th November 2013, spending around 231.3 million pesos (US$ 12.26 million)
in relief aid (García et al., 2015).

Using freedom of information requests (FOI) to contact different government agencies, a total of
twelve participants acknowledged their involvement and made information available about the
emergency. From them, ten organisations were identified to have actively participated in logistics
activities. These organisations worked alongside each other to provide support for disaster victims
under the umbrella of the Civil Protection National system (SINAPROC). However, there was
evidence of an absence of appropriate planning, preparation and risk analysis in the region for
managing these situations (García et al., 2015).

The aim of this research is to develop a system for emergency preparedness considering the
management of resources from different organisations. The system uses a combination of
geographical information systems (GIS) and optimisation to determine the location of emergency
facilities, the stock prepositioning policy, initial relief distribution, and the allocation of material and
human resources. The system is able to identify which organisations are required under the
circumstances of the emergency to provide tailored operations and prevent material and human
convergence and shortages.

This paper is organised as follows. Section 2 introduces relevant concepts for the analysis, whereas
Section 3 describes the main contributions in the literature concerning integrated approaches for
disaster preparedness. The description and design of the system proposed is explained on Section 4.
Section 5 describes the application of the system to the situation experienced in Acapulco, México, in
2013. The assessment of the model is presented in Section 6, whilst Section 7 discusses the results
obtained, and Section 8 introduces the conclusions.




                                                      2
```

## Page 3

```text
2   THEORETICAL FRAMEWORK
    2.1 Flood preparedness
Disaster preparedness involves the activities undertaken to prepare a community to react when a
disaster takes place (Altay & Green, 2006). Adequate preparedness can significantly improve disaster
response activities. For instance, in India, a major cyclone in 1977 caused a death toll around 20,000
people. After an early warning system, meteorological radars and emergency plans were established,
similar cyclones caused considerably lower death tolls (UNISDR, 2009). Preparedness activities have
the potential to enhance response and improve operations as long as the context of the disaster is
properly considered, because different types of disasters require different types of response (De
Leeuw, Vis, & Jonkman, 2012) given the varying features of each type of hazard.

Hydrological disasters are some of the most frequent and harmful natural disasters (Chang, Tseng, &
Chen, 2007). Nevertheless, these disasters allow more time to react (Kunz & Reiner, 2012) because
these are more easily predicted and prevented than other disasters, making them suitable for the
development of preparedness tools (Chang et al., 2007).

Merz and Blöschl (2003) distinguished five types of floods; long-rain floods, short-rain floods, flash
floods, rain-on-snow floods and snowmelt floods. This research focuses on the first two types, given
that flash floods create local emergencies with small/moderate rainfall depths (Merz & Blöschl,
2003), whereas the other two types rely on snow conditions which are largely absent in Mexico.

Short-rain floods occur after rainfall of short duration and high intensity, usually saturating part of a
local or regional settlement, whereas long-rain floods are caused by several days of low-intensity
rainfall exceeding the capacity of the catchment thereby affecting large areas (Merz & Blöschl, 2003).

Geographic features are relevant for long-rain floods and short-rain floods. Hydrological analysis of
regions and basins makes it possible to predict floods using return periods (Ward, de Moel, Aerts, &
Glade, 2011), forecast floods based on rainfall patterns (Esteves, 2013), and generate mapping tools to
estimate water heights and damaged zones (Liebscher, Kirschstein, & Becker, 2012). A tool for flood
management can take advantage of these elements using GIS to provide tailored operations.

    2.2 Mexican disaster management framework
Decision-making in disaster situations in Mexico is centralised, with SINAPROC as the coordinating
body for disaster activities among different participants. It links to four main branches: executive
coordination, technical coordination, technical support and co-responsibility. The Ministry of Interior
manages the executive coordination at three government levels (viz. National, State and Municipal).
The technical coordination provides counsel for planning, operation and assessment of disaster
management activities, whereas technical support organisations provide aid and advice for specific
disasters. Co-responsibility organisations provide support along with human and material resources
for emergency activities on top of their normal duties (SEGOB, 2006). According to regulations, a

                                                     3
```

## Page 4

```text
total of up to 23 actors are classified as co-responsible for hydro-meteorological disaster events, and
they have to be coordinated by SINAPROC to use their resources optimally in order to provide
assistance. Evidently, the Mexican system relies on the collaboration of different organisations as a
key element for disaster operations.

After a disaster strikes a community the first agency at site should provide aid to the victims, and then
local authorities can take over to continue operations. If local authorities can cope with the impact of
the disaster they oversee the whole operation, otherwise they have to notify state authorities asking for
support. That procedure is repeated until the full resources of SINAPROC are deployed (SEGOB,
2006). The purpose of the process is to use only the resources necessary for each event. However,
activating one stratum means activating a large number of agencies, something that can be further
improved to make more efficient use of resources.

A clear group of regulations and well-placed financial instruments are evidence of the importance
disasters have in Mexican plans. However, Alexander (2015) identified poor performance in some
communities. Similarly, problems in logistic activities identified by Santos-Reyes and Beard (2011)
after a major flood in Tabasco emphasised the need to strengthen preparedness in the country.
Alexander (2015) summarised this, stating “the law lacks the instruments for its application”, hinting
that the framework for disaster management is there, but the tools required to support it are not.

3   LITERATURE REVIEW
    3.1 Logistical activities in disaster preparedness
Caunhye, Nie, and Pokharel (2012) created a framework for emergency logistics including pre-
disaster and post-disaster operations. Before the disaster strikes, evacuation, stock prepositioning and
facility location are of vital importance. Initial distribution has also been studied by several other
authors (e.g. Chang et al., 2007; Mete & Zabinsky, 2010; Naji-Azimi, Renaud, Ruiz, & Salari, 2012).

Evacuation has been studied independently and combined with facility location, creating a broad body
of contributions on the topic (e.g. Bish & Sherali, 2013; Bretschneider & Kimms, 2012; Lu, 2013;
Nagarajan, Shaw, & Albores, 2012; Pidd, De Silva, & Eglese, 1996; Saadatseresht, Mansourian, &
Taleai, 2009; Yi & Ozdamar, 2007) and it is outside of the scope of this work.

This section introduces articles tackling the synergy between facility location, stock prepositioning
and relief distribution. In that category, Campbell and Jones (2011) incorporated risk of facility
disruption for one supply point using mathematical equations to determine the optimal stock quantity
and the total expected cost associated with deliveries, with an alternative for multiple supply points.

Using chance constraint models, Renkli and Duran (2015) used a scenario-based formulation to
minimise the weighted probability of road blockage, whereas Bozorgi-Amiri, Jabalameli, Alinaghian,



                                                     4
```

## Page 5

```text
and Heydari (2012) combined uncertainty in supply, demand, transportation and procurement to
propose a nonlinear model to minimise the sum of the expected cost and its variance.

There are several papers considering two-stage stochastic models with scenario-based approaches.
Considering uncertainty in demand, road network and the conditions after the disaster, Salmeron and
Apte (2010) provided a formulation aiming to minimise the expected number of casualties and unmet
transfers of population. Incorporating the possibility of destruction of relief, Rawls and Turnquist
(2010) introduced unmet demand penalties and holding costs for unused material. That was
complemented later on with quality of service constraints (Rawls & Turnquist, 2011), the inclusion of
a dynamic variant of the model (Rawls & Turnquist, 2012) and the incorporation of a risk measure in
total cost (Noyan, 2012). Mete and Zabinsky (2010) designed a model in which the first stage
determines the location of warehouses and amount of prepositioned stock by minimising cost,
whereas in the second stage a combination between transportation time and unsatisfied demand is
minimised to prepare relief distribution. Rennemo, Rø, Hvattum, and Tirado (2014) considered
vehicles, the state of the infrastructure and demand as stochastic elements in a dynamic formulation to
maximise the combination of demand fulfilment and unused budget. Considering uncertainty in
supply, demand and the transportation network, Tofighi, Torabi, and Mansouri (2016) aimed to
minimise the cost of stock prepositioning and facility location in the first stage, whereas in the second
stage a multi-objective problem focused on relief distribution seeking to minimise total distribution
time, the maximum weighted distribution time for critical items, and total cost of unused inventories
and unmet demands.

Employing multi-objective optimisation, Abounacer, Rekik, and Renaud (2014) proposed a model
looking to minimise transportation time, personnel needed and uncovered demand. Accounting for
uncertainty in demand and supply, Bozorgi-Amiri, Jabalameli, and Mirzapour Al-e-Hashem (2011)
proposed a two-stage model considering potential destruction of relief. The model minimises the sum
of the expected value and variance of the total cost, along with the sum of the maximum shortages.
There are studies incorporating GIS in the analysis to manage the uncertainty of the impact of the
disaster. Barzinpour and Esmaeili (2014) used the Risk Assessment tool for Diagnosis of Urban Areas
against Seismic Disaster for different earthquake scenarios. The information supports a formulation
including three objective functions seeking to maximise coverage, minimise location cost and
minimise operational cost. Esmaeili and Barzinpour (2014) extended that by considering areas outside
of the region. Rodríguez-Espíndola and Gaytán (2015) incorporated a GIS analysis to discard
floodable facilities and identify road failures. The model minimises total cost and total distance
travelled considering priorities for the most affected areas.




                                                    5
```

## Page 6

```text
    3.2 Resource management among multiple actors
After the earthquake in Haiti in 2010, the government and several relief agencies struggled to get the
aid to many people. Even with different organisations and expertise on the field, there was an inability
to deliver aid because of the lack of trucks (Holguín-Veras, Jaller, & Wachtendorf, 2012).
Logistics decisions rely on having the required resources to perform activities efficiently. In large-
scale disasters, the resources needed are usually provided by the joint participation of different
stakeholders (Nolte, Martin, & Boenigk, 2012). Providing guidance for them is not a trivial issue.
Currently, however, emergency logistics articles are designed as if there is only one organisation
owning all the required resources.

Disaster preparedness plans ought to consider the participation of different organisations to resemble
the circumstances in reality and to become enablers for coordination. Coordination is understood as
“the cooperation of independent units for the purpose of eliminating fragmentation, gaps in service
delivery, and unnecessary (as opposed to strategic) duplication of services” (Gillespie, 1991).

Coordination is a widely known challenge in disaster management (Auf der Heide, 1989). For disaster
management, some of the reasons underpinning those challenges are;
• Involvement of several actors (Balcik, Beamon, Krejci, Muramatsu, & Ramirez, 2010).
• Absence of standardization among organisations (Drabek & McEntire, 2003).
• Donor independence (Kovács & Spens, 2009).
• Appearance of self-initiated participants (Drabek & McEntire, 2003).
• Human and material resources from multiple participants and jurisdictions (Auf der Heide, 1989).

As a result, Altay and Green (2006) proposed the development of studies to facilitate coordination
among agencies in disaster management. That was supported by Galindo and Batta (2013) calling for
researchers to incorporate coordination initiatives into their models.

Recently, Özdamar and Ertem (2015) provided a review of Information Systems solutions to aid
coordination such as GIS. Operational Research can also provide support to enable coordination.
Resource allocation models allow pooling resources from different participants, which can prove
effective for disaster operations (Balcik et al., 2010).

The focus of this research is to enhance coordination through of the use of resources. The variation of
labour and material resources makes resource management among different organisations an essential
element to satisfy the needs of disaster victims. Managing those resources is challenging because of
jurisdictional boundaries, shortages or excess of resources, complications sharing information, and
mixed allocation of tasks and resources among different organisations (Auf der Heide, 1989). A
system capable of providing a setting for guiding and directing participant organisations in order to
satisfy the needs of disaster victims could mitigate the impact of those problems.


                                                     6
```

## Page 7

```text
Relief items are only one kind of resource required for disaster management. It is important to study
the allocation of people, vehicles and equipment as well. There are papers concentrating on the
allocation of teams or units (Maya Duque, Dolinskaya, & Sörensen, 2016; Wex, Schryen, Feuerriegel,
& Neumann, 2014), volunteers (Falasca & Zobel, 2012), rescue activities (Barbarosoğlu, Özdamar, &
Çevik, 2002), and allocation and delivery of equipment (Chen, Peña-Mora, & Ouyang, 2011).

Related to the topics studied in this work, Arora, Raghu, and Vinze (2010) focused on the allocation
of medical aid for emergencies considering the coordination between regions, whereas Adıvar and
Mert (2010) aimed to coordinate international relief items using fuzzy logic to provide a collection-
distribution plan. Altay (2013) developed a model to allocate response personnel, facilities, supplies
and equipment with two alternative objective functions; to minimise deployment time or minimise
maximum response time. The model, in addition, minimises simultaneously total deployment time
and the total capability deficit for shortages. Edrissi, Poorzahedy, Nassiri, and Nourinejad (2013)
developed a system for strengthening structures, retrofitting transportation links and equipping
emergency response centres by coordinating different organisations nearby and maximising survival
rates. Chang et al. (2007) used vector GIS to determine demand through flooding potential maps.
They proposed a stochastic model to determine clusters of demand by minimising the expected
shipping distance, and a two-stage stochastic model minimising total cost to determine rescue bases in
the first stage, and amount of rescue equipment and transportation plans in the second stage.

Based on the literature analysis, it can be stated that emergency logistics articles often neglect to
consider multi-organisational settings. That creates a significant complication for the application of
these models in the Mexican disaster management framework. Even among resource allocation
models an important consideration is missing. The natural reaction of national governments is to send
as many agencies and resources as possible to affected communities. Having more participants
involved, however, is no guarantee to get better operations. Excess in material resources can create
congestion, bottlenecks and the need to classify useful from useless resources. Similarly, more
employees require more resources, increase safety issues (Abounacer et al., 2014), and there is the
potential for underused capacity, idle resources and congestion (Wenger, Quarantelli, & Dynes,
1986). A key challenge for the deployment of resources is to determine how many organisations to
involve, and perhaps more importantly, which ones are needed.

Currently there are no papers optimising the number of actors involved or disaggregating resources
from different agencies for cooperative facilities and operations, which in turn can derive a better use
of pooled resources. The system introduced in the next section aims to tackle the gaps identified using
the collaboration setting currently in place in Mexico to support operations in the field.




                                                     7
```

## Page 8

```text
4   SYSTEM DESIGN
The system proposed uses a combination of GIS and optimisation. The GIS is used to analyse
potential flood situations in order to provide information about the impact of the disaster in the region.
The model can handle several participants to identify the optimal combination of organisations and
resources necessary to perform logistics activities and satisfy the requirements of the victims.

    4.1 Geographical Information Systems
Most articles in the literature are using GIS for data pre-processing, network analysis and data display,
although there are several potential contributions of GIS to different disaster management phases
(Özdamar & Ertem, 2015). Unlike earthquakes, in which the damage depends on the epicenter, many
floods can be analysed considering the vulnerability of the area and the level of rainfall (Pedrozo-
Acuña et al., 2014). Based on that, flood maps can be developed, making GIS relevant for flood
management.

For this research, risk and potential damage are incorporated using GIS. Involving geographical
factors in the analysis allows to provide more accurate information for the model, increase the level of
reliability of the facilities selected, identify demand sources better, recognise the vulnerability per
area, and incorporate suitable roads.

Building upon Rodríguez-Espíndola and Gaytán (2015), the approach undertaken here includes vector
GIS to locate suitable facilities and perform network analysis; whereas raster GIS is used to consider
different scenarios and discard facilities prone to flooding. The three stages are shown on Figure 1.


              Digitization    •Vector GIS




                             Cartographic •Raster GIS
                                model


                                               Network     •Vector
                                               analysis     GIS


                                            Figure 1. Geographical procedure

Digitization can be performed using vector software to obtain the layers required. The user can obtain
the road network and demand areas from authorities, or draw them using satellite pictures. The level
of detail of the maps can affect the analysis, thus it is expected to be revised prior to their use to
ensure accuracy. Next, each one of the emergency facilities can be identified using coordinates or
addresses. Additionally, assuming one assembly point for evacuation, a central point in each area
should be identified so as to calculate distances.

Cartographic modelling uses map algebra to integrate maps of individual characteristics to treat them

                                                           8
```

## Page 9

```text
as variables that can be combined or transformed through specific functions (Tomlin, 1991).
Employing the steps provided by Martin (1993) and map algebra as suggested by Rodríguez-
Espíndola and Gaytán (2015), a cartographic model can be implemented in raster software. The
parameter used to vary scenarios relies on the expected water height, because of weather conditions or
a particular phenomenon. The water height used ought to be based on the peak of the event for the
solution to provide reliable facilities over the entire situation.

For this analysis, a digital elevation model (image that contains the elevation of each point of the
studied area) is needed and it should be carefully selected. The accuracy of the map can be supplied
by the provider and it should be tested beforehand to ensure the quality of the solution.

The macro model used to represent the cartographic model can be seen in Figure 2. The overall steps
are to introduce the altitude of the area to create a base situation and then add a value for the height of
the flood. Then, the “dry” and “flooded” areas are reclassified with a value of 1 and 0, respectively.
The overlay module is used to discard facilities prone to flooding and assess the damage to demand
areas. The results are layers with available shelters, distribution centres and the extent of damage of
each demand area for each scenario.

After the flood image is obtained, it can be overlapped with the road network to identify roads
affected. As the GIS procedure requires only the layers described and the expected conditions of the
flood, the analysis can be repeated under different instances. It can be employed far in advance for
planning purposes and to test the operational boundaries of the current policy, or close to the disaster
to prepare logistics decisions to cope with the situation. A significant advantage of the GIS is that it
considers the real features of the region. The information obtained from the assessment of the flood is
considering the possibility of links in a road being flooded and the existence of connecting roads,
taking full advantage of the road network. The user can define worse conditions than expected to
incorporate a degree of uncertainty in the situation. The purpose is to ensure the suitability of the
facilities selected and having a reliable supply of resources.




                                        Figure 2. Cartographic model



                                                      9
```

## Page 10

```text
Having that information, network analysis can be performed using vector GIS. Considering only
surviving roads and facilities, the shortest distance between every pair of nodes can be determined.
The shortest road path between facilities can be used for land transportation, whereas Euclidian
distances can be obtained for other transportation modes. The results from the geographical procedure
are a list of candidate facilities, a matrix of connectivity between facilities along with the distance
between them, and a percentage of damage caused by the flood to demand areas.

    4.2 Preparedness optimisation model
This paper introduces a quantitative model based research approach (Bertrand & Fransoo, 2002).
Based on the context of the problem, the mathematical model developed is presented in this section.

The use of one performance measure can be inadequate for disaster management (Beamon & Balcik,
2008), even with the development of ‘social cost’ functions (Huang, Jiang, Yuan, & Zhao, 2015;
Sheu, 2014). According to Savas (1978), there are three key performance indicators for public
services: efficiency, effectiveness and equity. Cost was selected as a resource-based measure to
achieve efficiency (See Beamon & Balcik, 2008). The decision was based on a meeting with Mexican
military authorities [National Defence Secretariat (SEDENA), personal communication, March 11,
2010] in which the relevance of cost for the potential selection of a disaster management policy was
specified. Also, cost is the most common resource-based performance measure used in the literature.

The second performance measure incorporated in the model, namely fulfillment rate, is adopting the
point of view of the victims and seeking effectiveness. Fulfilment rate is based on products and
services provided at shelters and it is measured in three dimensions: the fulfilment of relief items, the
presence of healthcare personnel for injuries and diseases, and the availability of shelter personnel for
security, cooking, social activities, among others.

Equity is included in the model using the performance measure related to fill rate. The formulation is
using a min – max objective function, which can be classified as an equality-based method (Huang et
al., 2015). The purpose is to minimise the maximum level of unfulfillment among all shelters, thereby
balancing the fill rate across them.

The core of the model is to decide the best policy in terms of the resources available. The need to
balance efficiency and effectiveness is shared by the organisations involved, complementing each
other to achieve the higher benefit for the system. Several experiences show that having too much
sometimes can be almost as harmful as not having enough (Auf der Heide, 1989). This model is the
first of its kind capable of deciding which organisations are required in the field to avoid shortages or
convergence. It is capable of providing tailored operations according to the circumstances to use
available resources in an efficient way whilst providing adequate support to disaster victims.




                                                      10
```

## Page 11

```text
Supported by the flood analysis performed using the GIS, the model is able to determine the location
of emergency facilities, establish the allocation of resources (material and human) to use for each
activity, decide which organisations should be involved according to the event, and perform the
allocation of distribution for the initial response phase right after disaster. These decisions are
represented on Figure 3.

                                                           Shelter location

                                                    Distribution centre location
                              Facility
                             location
                                                        Demand per shelter

                                                         People relocation

                                                  Amount of stock prepositioned

                               Stock
                                                    Type of stock prepositioned
                           prepositioning

                                                  Location of stock prepositioned
 Preparedness
    model                                        Number and type of organisations

                            Resource
                                                       Allocation of vehicles
                            allocation

                                                 Allocation of personnel per activity

                                                         Service allocation

                                                           Number of trips

                               Relief
                                                         Shipment quantity
                            distribution

                                                           Mode selection

                                                    Number and type of vehicles

                 Figure 3. Set of decisions determined by the preparedness optimisation model

         4.2.1   Model assumptions and context
A clear set of assumptions underpinning the model ought to be established in order to limit its scope
and have a manageable set of variables. The main assumptions are as follows:
    •   There is one centralised decision-maker authority with control over the preparedness plan and
        jurisdiction to coordinate the other organisations involved.
    •   The organisations considered are available for immediate deployment.
    •   Information about the available resources from eligible organisations is available and updated.
    •   Once an organisation is activated all of its resources become available, i.e. there is no partial
        activation of organisations.
    •   Transportation costs are only dependent on the fuel spent to perform the delivery. Vehicles
        are pre-owned by the organisations involved, leaving depreciation aside.
    •   People are informed prior to an evacuation their allocated shelter and pre-disaster evacuation
        procedures are in place.

                                                      11
```

## Page 12

```text
      •   The number of facilities to set-up is based on the resources available along with the features
          of the disaster, not a pre-defined number determined by authorities.
      •   Both objectives are relevant for the decision maker with no clear dominance among them.
The decision-making authority should work as a coordinator able to guide, instruct and oversee the
actions of the organisations during the emergency. This decision-maker can be a leading agency, a
council from other organisations, or a government. Despite not owning the resources, it would have
the information and capability to guide the operational activities. The reason for the use of a decision-
maker in such fashion is because it is the approach chosen by some organisations including the
Mexican government, with the purpose of having a participant looking at the whole situation. That
approach makes it possible to identify a way to coordinate the associated organisations in order to
satisfy the needs generated by the disaster.

          4.2.2   Notation and definitions
The parameters of this model were classified as generic, case-specific and disaster-specific. Case-
specific parameters depend on the area of study and disaster policies, disaster-specific parameters rely
on the particular situation and the magnitude of the event, and generic parameters are not linked to
either one. The variables were classified as intermediate variables and decision variables. The
intermediate variables include elements associated with the calculations performed to obtain the
values of the decision variables, which are the relevant factors affecting policy. The sets, parameters
and variables included in the model are presented as follows:

 Sets
 I                 Candidate distribution centres, I = {1, 2, 3, …, |I|)
 J                 Candidate shelters, J = {1, 2, 3, …, |J|)
 K                 Demand areas, K = {1, 2, 3, …, |K|)
 M                 Transportation modes, M = {1, 2, 3, …, |M|)
 N                 Products, N = {1, 2, 3, …, |N|)
 O                 Organisations, O = {1, 2, 3, …, |O|)
 Generic parameters
 VOLn              Volume per product n (            ),        ∈| |

 WEIn              Weight per product n (         ),           ∈| |

 Fm                Weight vehicle capacity of mode m (            ),   ∈| |

 Gn                Conversion factor for each product n (              ),   ∈| |

 Case-specific parameters
 RPC               Space covered per distribution centre employee (                )



                                                          12
```

## Page 13

```text
RPS             Number of sheltered people covered per shelter employee (                            )

RPH             Number of people covered per healthcare team (                        )

APDC            Percentage of personnel required for partial opening of DCs, 0 ≤                            ≤1
CAi             Opening cost per distribution centre i ($),        ∈| |
CCj             Opening cost of shelter j ($), ! ∈ |"|
                                                      $
CPn             Procurement cost per product n (          ),       ∈| |

Cj              Capacity of shelter j (people), ! ∈ |"|
                                                               $
Ai              Storage capacity of distribution centre i (        ),     ∈| |
                                                                              %
AVDm            Available number of trips per day per mode m (& '                 ),        ∈| |
                                                                                  %
RDPm            Distribution personnel required per mode m ( & '                      ),     ∈| |

WAGEo           Wages paid for the activation of organisation o ($), ( ∈ |)|
PACo            Usable personnel from organisation o for DC operation (employee), ( ∈ |)|
PASo            Usable personnel from organisation o for shelter care (employee), ( ∈ |)|
PAHo            Available teams from organisation o for healthcare (team), ( ∈ |)|
PADo            Available personnel from organisation o for distribution (employee), ( ∈ |)|
TPo             Total operative personnel available per organisation o (employee), ( ∈ |)|
IPno            Product inventory of type n from organisation o (products),                     ∈ | |, o ∈ |)|
TVmo            Vehicles available of type m per organisation o (vehicles),                    ∈ | |, o ∈ |)|
Disaster-specific parameters
TIERn           Priority of product n,   ∈| |
EPk             Population to be sheltered per demand area k (people), * ∈ |+|
                                                                                                                $
CSijm           Cost of delivering relief from distribution centre i to shelter j by mode m (                       ),   ∈

                | |, ! ∈ |"|,   ∈| |
CONijm          Connectivity between distribution centre i and shelter j by mode m, ,(                      -   ∈ [0,1],
                  ∈ | |, ! ∈ |"|,   ∈| |
SAijm           Service availability for relief distribution from distribution centre i to shelter j by
                mode m based on coverage, 1      -    ∈ [0,1],          ∈ | |, ! ∈ |"|,          ∈| |
SCkj            Coverage of demand area k by shelter j, 1        - ∈ [0,1], !              ∈ |"|, * ∈ |+|
Intermediate variables
TRAVijm         Number of trips deployed from DC i to shelter j by mode m (trips)
IPDjn           Number of products of type n required at shelter j (products)
DSATjn          Demand of product n not fulfilled on shelter j (products)
DISPkj          Number of people to be allocated from demand zone k to shelter j (people)



                                                 13
```

## Page 14

```text
 NVHj             Expected number of people without healthcare at shelter j (people)
 PVHj             Expected surplus of people covered for healthcare at shelter j (people)
 NVSj             Expected number of people without shelter attention at shelter j (people)
 PVSj             Expected surplus of people covered for shelter attention at shelter j (people)
 MADj             Maximum number of people with relief shortages at shelter j (people)
 Decision variables
 Xi               Whether to open distribution centre i or not
 Yj               Whether to open shelter j or not
 Wo               Whether to activate organisation o or not
 PREino           Quantity of stock of product n from agency o to preposition on DC i (products)
 SHIPijmn         Amount of relief of type n to send from DC i to shelter j by mode m (products)
 PCio             Number of personnel from organisation o to allocate to DC i (employee)
 PSjo             Number of personnel from organisation o to allocate to shelter j (employee)
 PHjo             Number of teams from organisation o to allocate to shelter j for healthcare (team)
 PDimo            Number of personnel from organisation o to allocate for distribution to DC i
                  (employee)
 AVimo            Number of type m vehicles from organisation o to allocate at DC i (vehicles)
 Dj               Number of people to be allocated to shelter j (people)
 UFR              Maximum unfulfilled demand (people)
 Cost             Total cost incurred by the policy ($)
This model can be used to analyse a set of different scenarios depending on the circumstances of the
flood. Disaster –specific parameters are relevant for sensitivity analysis, and these are affected by the
geographical procedure. Specifically, the priority of the product (TIERn) and the number of people to
be sheltered (EPk) can be used to explore different scenarios and develop managerial insights.

Discussing the personnel required per activity, these parameters can be provided by the organisations
based on current practice and guidelines. For the case of Mexico, authorities have values of the
number of staff needed per activity to provide support to a determined number of people. Similarly,
Mexican authorities have standard units for distribution which can support a number of people for a
number of days. For instance, food pantries are designed to provide support for 4 people for 4 days.
That information is used by the model to determine the requirements at each facility based on the
expected number of people to evacuate per area (EPk).

The expected number of people to evacuate represents a very important parameter for the system. The
GIS analysis of different scenarios can provide insights about the potential damage of the area, which
combined with demographic information can provide information about vulnerable population under
different instances. The advantage of the use of the GIS is because introducing geographical
conditions in the process supports the identification of potential sources of demand. After thorough

                                                     14
```

## Page 15

```text
analysis using the GIS, the results should be coupled with research in evacuation decisions, historical
information, and demand estimation algorithms to determine the number of expected people to serve
during the emergency.

        4.2.3    Model formulation
The model designed contains only deterministic variables. Liberatore, Pizarro, de Blas, Ortuño, and
Vitoriano (2013) and Alem, Clark, and Moreno (2016) identified the main sources of uncertainty on
emergency logistics: demand, demand location, affected areas, supply, and transportation network.
For the case of this research, uncertainty in supply is neglected because of the preparedness nature of
the model and the prepositioning strategy adopted, not to mention the ‘limitless’ availability
according to Mexican authorities [National Defence Secretariat (SEDENA), personal communication,
March 11, 2010]. Demand estimation is outside our scope and it is expected to be determined
employing forecasting methods (Sheu, 2014), applying GIS for mapping and assessment (e.g.
Kourgialas & Karatzas, 2011), historical data, and/or using research of evacuation decision-making
(Lim, Lim Jr, & Piantanakulchai, 2013; Lindell, Kang, & Prater, 2011). The transportation network,
demand location and affected areas are evaluated using GIS, and scenario analysis can also be
employed to use only safe roads even under the hardest conditions.

In the model, the allocation of people to safe places allows authorities to have an estimation of the
demand to be expected at each facility based on the sources of demand determined by the GIS. As
part of the preparedness plan, the estimation is expected to be informed to the population and used by
authorities to guide evacuation.

An important aspect of the design of the model is the multi-organisational perspective. By including
the agencies as a set, data from each individual organisation can be introduced to find the best
combination, deciding whether the activation of an organisation is justified or not, and deciding how
to use the resources available (people, vehicles, relief items). In this approach, although there is a
decision-maker overseeing operations, it only provides guidance and instructions to articulate
individual organisations carrying out their own activities. For instance, if there are governmental
agencies for food security, medicines, social security and family services, the model can instruct each
one of them where to allocate their individual efforts to build upon the larger task to satisfy demand.
Hence, resource allocation and the participation of individual organisations are incorporated in the
model, with clear directives and taking advantage of the resources from each participant. Other
models could not provide that guidance based on the overlapping resources of each agency.

The approach proposed here includes only necessary organisations (preventing overcrowding) and
enables collaboration through the allocation of tasks to each actor. Existing models considering one
participant encourage activating every agency available (because of the combination of resources),
leaving task and resource allocation to other decision mechanisms. The formulation presented here

                                                    15
```

## Page 16

```text
allows more flexibility for planning and preparedness as it activates organisations depending on the
circumstances. The model is structured as follows:

       )12 = ∑        ∗ 6 + ∑-          - ∗ 8- + ∑        9 :; ∗ 9 + ∑ ∑< ∑   <∗   =; < +          (1)
 ∑ ∑- ∑     1 - ∗ 2= > -
               AB D          -+       >E- + >1- F                                                  (2)
      ?@= =       (                              )
              !∈"                    3∗ -
s.t
                                                                                      ∀!
                                       - =I          1                                                 (3)
                                                          -



                             ;        =I         1                                    ∀*
                                                     -∗1
                                                                                                       (4)
                                                                 -
                                         -

                                         -< ∗ :< ≥        -                          ∀!,               (5)

                       1 2-< =                                                       ∀!,
                                         -< − I I 1E
                                                                                                       (6)
                                                                      - <


                                      ∑< 1 2-< ∗ :< ∗ 2 ;=<                           ∀!               (7)
                             - ≥
                                           ∑< 2 ;=<
                                       DN ≤      - ∗ 8-                               ∀!               (8)

                       I I =; < ∗ >)O< ≤                             ∗6               ∀                (9)
                        <


                             I =; < ≤                     ∗9                         ∀ ,(          (10)
                                                     <



                        I I 1E                                                       ∀,
                                             - < ≤I           =; <                                 (11)
                         -

                                 ∗     ∗ 6 ≤ I(               ∗=          )           ∀            (12)


                                                                                      ∀!
                     - = I(          E- ∗ = E) + >E- − >E-                                         (13)


                                                                                      ∀!
                      - = I(          1- ∗ = 1) + >1- − >1-                                        (14)


                              I              ≤            ∗ 9P                        ∀(           (15)


                              I 1- ≤                 1 ∗9                             ∀(           (16)
                                 -

                             I E- ≤                  E ∗9                             ∀(           (17)
                                 -

                            II                   ≤            ∗9                      ∀(           (18)



                                                              16
```

## Page 17

```text
          I        + I 1- + I E- + I I                             ≤2      ∗9                   ∀(         (19)
                       -            -

           I 1E                                                                              ∀ , !,
                      - < ∗ 9; < ≤ @       ∗ 2= > - ∗ )               ∗1                                   (20)
                                                                  -        -
            <

                        I 2= > - ≤ I >                 ∗ >                                    ∀,           (21)
                           -

                                                                                             ∀,       ,(   (22)
                                    >      ≤
                                               =

                               I >        ≤ 2>       ∗9                                       ∀ ,(         (23)


                                                   X R , YN , WU ∈ V0,1W
                PRER[U , TRAVRN_ , DN , DISPbN , IPDN[ , DSATN[ , SHIPRN_[ , PHNU , PCRU , NVHN , NVSN ,
                                 PVHN , PVSN , MADN , PSNU , PDR_U , AVR_U ∈ Z ≥ 0

Objective function (1) is used to minimise costs associated with the location of facilities, personnel,
procurement and transportation, whereas objective function (2) minimises the maximum unfulfillment
of products and services across all the shelters to serve as a measure of equity. Constraint (3)
determines demand of people at each shelter and expression (4) ensures that every evacuee reaches a
shelter. Equation (5) determines demand per product at each shelter, whereas expression (6)
establishes unfulfilled demand and constraint (7) determines the maximum demand unsatisfied across
the different products per shelter. Expressions (8) and (9) deal with people capacity of shelters and
storage capacity of distribution centres, respectively. Constraint (10) restricts the maximum amount of
relief items to preposition available across all agencies and equation (11) ensures that only relief items
available are shipped. Constraint (12) allows the partial opening of distribution centres and determines
the number of people required to operate these facilities, whereas expressions (13) and (14) determine
the number of personnel allocated and shortages of service for healthcare and shelter attention,
respectively. Equations (15), (16), (17) and (18) establish the maximum number of personnel
available across all agencies for distribution centres, shelters, healthcare and distribution respectively;
whereas constraint (19) ensures that the maximum number of operative people per organisation
activated is not bridged including the term for healthcare teams if and only if one member is available
for operative support such as the distribution of medicines. Expression (20) determines the number of
trips from each DC to each shelter for distribution, constraint (21) establishes the number of vehicles
required, equation (22) the number of employees needed, and expression (23) ensures the maximum
number of vehicles available is not exceeded. Finally, the declaration of binary and integer variables
is presented.




                                                        17
```

## Page 18

```text
         4.2.4   Model solution
The use of more than one performance measure delivers a set of efficient solutions. To obtain that set,
an a posteriori approach can be used. In this approach, the Pareto frontier is generated and afterwards
the decision-maker choses the preferred solution among the different possibilities (Miettinen, 2008).
Scalarization techniques are a traditional approach to solving these kind of problems by replacing a
vector problem into a family of scalar optimisation problems. Among them, the weighted-sum method
and the ε-constraint method were selected for this research. The former is selected because of
simplicity and accuracy, whereas the latter is used to tackle the limitation of the weighted-sum
method to obtain solutions for non-convex problems.

In the overall solution procedure, the Pareto frontier is generated using both methods. The models can
be programmed on commercial software selecting a MIP solver. Next, the Pareto frontier is taken to
the decision-maker, in order to explain to him/her the concept of trade-off and search for the solution
that is closer to his/her preferences. Once the decision-maker finds a suitable point, information about
the policy can be displayed for assessment, and the possibility to move to another solution on the
frontier can be offered until the decision-maker is satisfied.

5     APPLICATION OF THE SYSTEM TO THE FLOOD OF ACAPULCO, MÉXICO
      5.1 Region of study
Acapulco is a city located in the State of Guerrero, Mexico. It is in the Pacific coast of the country
next to the sea but surrounded on the other side by mountains, as shown in Figure 4. The city has a
strong focus on tourism, as shown by the 4,890,456 tourists that visited the region just in 2010
(INEGI, 2010a), to make it one of the most important touristic ports in Mexico (García et al., 2015).


    Acapulco




                                                                          Source: USGS (2010) and INEGI (2010b)

                                  Figure 4. Image of Acapulco, Guerrero



                                                    18
```

## Page 19

```text
Using the real situation experienced in Acapulco, empirical quantitative research (See Bertrand &
Fransoo, 2002) is used looking to show the performance of the model under real circumstances and
provide insights for the improvement of the current decision-making mechanisms.

A total of three scenarios were introduced. The reported height of water reached by the flood of 2013
(1.5 meters) was used as the main scenario. However, bearing in mind the importance of observing
the behaviour of the system under different conditions, scenarios of a water depth of 0.5 meters and
2.5 meters were also analysed as being considered relevant thresholds because of their impact on
people’s property and safety.

    5.2 Data gathering
From the government organisations involved in the management of operations in hydrological
disasters in the country, the ones identified to supply human and material resources in the field were
approached. The purpose was to gather information about their involvement in the flood of 2013, their
resources deployed and the outcome of their activities. Twelve organisations acknowledged their
participation in the event and declared to have information; four at the State level and eight at the
National level. A total of 205 FOI requests were filed to these organisations to obtain the information.
Among them, the National Centre for Disaster Prevention (CENAPRED) and the Ministry of Exterior
were enquired only about reports of the situation and international aid.

Information from ten government agencies involved in operational activities during the disaster was
successfully gathered. The replies included information across health services (Health Ministry
(SMEXICO), Health Secretariat of the State (SGUERRERO) and Mexican Institute of Social Security
(IMSS)), food services (DICONSA and SEDESOL), family services (DIF), military (SEDENA and
SEMAR) and civil protection (SSPPC). The information requested included activities related to
facility management, the number of people sheltered and cared for, the number of relief items
available before the emergency and subsequently deployed, the type and number of vehicles used, the
number of employees available and their allocation to different activities, and operational costs.

For the geographical analysis the information was obtained from the National Institute of Statistics
and Geography (INEGI) and the United States Geological Survey (USGS). The former provided the
road network, and urban design, whereas the latter provided a DEM of the area chosen based on
accuracy. The list of shelters included 103 facilities from the shelter catalogue of 2013 in the area
(SSPPC, 2013), whereas information from DIF, SSPPC, SEDENA and DICONSA was used to
identify 14 available DCs.

    5.3 Geographical analysis
TransCAD® was selected to perform the digitization of the emergency facilities. Each facility was
located and georeferenced in the software using information from the shelter list. The cartographic
model was implemented in a macro in IDRISI® to obtain flood maps under the scenarios proposed.

                                                   19
```

## Page 20

```text
Having the representation of the flood, map algebra was used to combine the flood map with the
layers of facilities, roads and demand areas. The result was the identification of damage on demand
areas, the availability of roads, and the suitability of potential shelters and distribution centres.

In terms of facilities, the analysis yielded 101 shelters available for the scenario of 0.5 meters, and 99
shelters remaining for the floods of 1.5 and 2.5 meters. On the other hand, a total of 12 candidate
distribution centres survived the conditions for the floods of 0.5 meters and 1.5 meters, whereas the
situation with a height of water of 2.5 meters delivered 10 candidate facilities. The location of the
surviving shelters (small) and distribution centres (medium) for the real conditions of the emergency
can be seen in Figure 5. The flood of 0.5 meters affected nearly 17.6% of the total area, whereas the
flood of 1.5 meters and 2.5 meters damaged around 19.9% and 22% of the region, respectively.




              Figure 5. Surviving facilities under the conditions of the flood in Acapulco in 2013

The flood map along with the road network was used to obtain the connectivity matrix using of the
Floyd-Warshall algorithm. For each combination of facilities a value of 1 was input as long as there
was at least one road available between the facilities and 0 otherwise. For the latter, boat
transportation was assumed to be possible. Afterwards, TransCAD® was used to perform network
analysis in the region in order to identify distances and coverage between facilities.

    5.4 Application of the preparedness optimisation model
The results from the GIS were combined with information gathered from the government agencies to
create databases included as parameters in the preparedness model. The model is able to support data
from different organisations without aggregating it, allowing to identify the best solutions by
balancing resources available and logistics requirements.

The data used in this research was obtained directly from the organisations sampled. Generic
parameters were obtained from Mexican regulations. Case-specific parameters were provided directly
form the organisations involved. That information is based on the inventory of resources from each
organisation, their internal operational guidelines and the details of facilities used by civil protection

                                                      20
```

## Page 21

```text
authorities. Most disaster-specific parameters were obtained from the result of the flood analysis using
the GIS, with the exception of the expected number of people to shelter. For the purposes of this
research and for comparability, that value was obtained from the records of the number of people
sheltered by SGUERRERO, SSPPC, SEDENA and IMSS.

The model was coded into GAMS 23.5.1® using Cplex® as solver for MIP. In order to obtain the
Pareto frontier of the set of efficient solutions, the weighted-sum method and the ɛ-constraint method
were applied. The weighted sum-method creates a weighted combination of both performance
measures. This method was coded for 200 combinations of weights among the objectives ranging
from 0 to 1, which were normalised using the ideal values of minimising each individual objective.

For the ɛ-constraint method the cost function was used as a constraint for 200 values, varying from
minimum to maximum cost, to minimise the level of unfulfillment. Each iteration had a time limit of
450 seconds. After collating the results from both methods and filtering efficient solutions, Figure 6
depicts 39, 62 and 86 non-dominated points for floods of 0.5, 1.5 and 2.5 meters, respectively.

                              120

                              100




          Unfulfillment (%)
                              80

                              60                                                                  Flood depth 0.5 m

                              40                                                                  Flood depth 1.5 m
                                                                                                  Flood depth 2.5 m
                              20

                               0
                                    0          5           10             15          20
                                                   Cost (Million MXN)


                                Figure 6. Pareto frontier of the three scenarios for preparedness in Acapulco


The reason the percentage of unfullfillment is beyond 100% on some low-cost solutions is because of
the use of standardised units for distribution. As the number of items unsatisfied is transformed to
number of people, if the demand was not fulfilled the requirements could be higher than the actual
requirements. For instance, with a shelter demanding food pantries for 50 people, the model would
identify the need of 13 food pantries (52 people). But if those food pantries were not shipped,
converting them back would represent 52 unsatisfied people, which would be higher than the actual
demand per shelter.

Each one of the solutions contains a policy that can be used for preparedness decisions. Table 1 shows
an overview of the results from which it can be concluded that only a flood of 0.5 meters could have
been managed with current resources to achieve 100% of demand satisfaction.

                                                                     21
```

## Page 22

```text
             Table 1. Overview of the results of the efficient points of the three scenarios in Acapulco

    Flood           Cost (MXN)              Maximum            Maximum Fill Rate (%)            Shelters    Max
             Minimum         Maximum          agencies     Food     Med     Health    S.C.    Min     Max   DCs
    0.5 m   1,609,918.68    5,676,227.86         6            100   100      100       100     10      29    8
    1.5 m    4,830,802       14,379,448          9         76.56    34.45    100       100     31      79   11
    2.5 m   8,057,277.04   15,634,537.56         8         45.93    20.29    96.4     99.98    63      92    7


None of the three scenarios required the activation of all of the organisations. Even for the couple of
solutions obtained under real circumstances activating 9 agencies, the organisation that was not
assigned (SEMAR) represents nearly 38% of the total operative personnel available. Hence, these
results show no apparent benefit in sending all of the organisations available to the field.

Available items prepositioned for relief distribution seem insufficient for moderate to catastrophic
conditions. In fact, this conclusion was supported by measures taken by Mexican authorities after the
flood in 2013, increasing the amount of prepositioned stock in the region from 2,500 to 10,000 food
pantries (DICONSA, 2014). Using an analytic tool to test the capabilities of the disaster management
system prior to the situation could have identified this shortcoming earlier, and it could be more
suitable for future analysis than just considering the number of people served in the most recent event.

6     MODEL EVALUATION
Most of the articles in the literature are assuming one organisation owning all resources. The problem
being that there are only two scenarios where this is applicable; either each organisation runs their
own model and acts accordingly on the results, or resources from all of the organisations available are
pooled together leaving the allocation of those resources to other decision mechanisms. The former
complicates the possibility of collaboration and allows duplication of efforts, whereas the latter allows
the use of sub-optimal solutions for allocation and requires the involvement of every organisation
available. In order to test the suitability of both approaches, this article is investigating two scenarios;
a scenario where each organisation works independently, and another comparing the results to real
decisions assuming Mexican authorities used a coordinated approach in the flood of 2013.

      6.1 Independent decision making
This section elaborates on the results of an instance assuming each organisation operates disregarding
activities and resources from other participants. This approach would be taken by organisations trying
to help but unwilling to collaborate with the government. In this case, each one of the actors would
run a model to identify the policy that suits them best and they would act independently.

Among the assumptions considered for this instance, partial opening of DCs was allowed and
operative personnel was interchangeable. Considering the conditions of the real flood, the model was
set to run for 50 iterations of 450 seconds each using the ε-constraint method in GAMS®. Figure 7


                                                         22
```

## Page 23

```text
shows the comparison between the best solution in terms of fill rate from each one of the agencies and
the Pareto frontier obtained from the system proposed for this instance. None of the agencies seems to
be able to deal with the situation independently.

                           120                                                                         Pareto Frontier

                           100                                                                         DICONSA




       Unfulfillment (%)
                                                                                                       DIF
                           80
                                                                                                       IMSS
                           60                                                                          SEDENA
                                                                                                       SEDESOL
                           40
                                                                                                       SEGOB
                           20                                                                          SEMAR

                             0                                                                         SMEXICO
                                 0            5              10              15             20         SGUERRERO
                                                     Cost (Million MXN)                                SSPPC


                             Figure 7. Comparison between coordinated and independent approaches in Acapulco

The importance of cooperation between agencies for different activities plays a major role, as specific
resources are only available for certain agencies. In addition, disregarding the decisions taken by other
agencies complicates overall operations. Interoperability is essential to provide a better level of
service for victims, and this factor becomes more important as the magnitude of the disaster increases.

    6.2 Assessment of the preparedness model under real circumstances
The ideal way to obtain an evaluation of the model would be to test it in a real situation, something
highly complicated as disasters are uncertain and cannot be controlled, making the task impossible (or
very unlikely) to be accomplished. The next best thing would be to compare it against the real
decisions taken in previous events and compare results.

Keeping record of every decision during a disaster can be complicated given the urgency of other
activities. Even though that makes it challenging to obtain information to reconstruct the exact
scenario of the situation experienced, in this research extra data was collected from government
authorities to assess the results obtained. Details about the management of facilities, relief and human
resources were gathered. Figure 8 shows the information obtained in terms of the main choices made
by the model. Black squares represent information obtained whereas white squares display
information unavailable. Missing data was related to the use of the resources. For instance, there is
information about the demand per shelter but not about the origin of it (where people is coming from);
or the number of personnel used for each activity but not to what facility they were employed. These
decisions can be optimised to provide the best possible outcome authorities could have gotten in the
real situation, i.e. the best allocation of resources for their decisions



                                                                   23
```

## Page 24

```text
                                                               Shelter location

                                                         Distribution centre location
                                 Facility
                                location
                                                             Demand per shelter

                                                              People relocation

                                                        Amount of stock prepositioned

                                 Stock
                                                         Type of stock prepositioned
                             prepositioning

                                                       Location of stock prepositioned

 Real activities                                      Number and type of organisations

                                                         Personnel used per activity
                               Resource
                               allocation
                                                            Allocation of vehicles

                                                      Allocation of personnel per activity

                                                                  Relief sent

                                                              Service allocation

                                 Relief
                                                               Number of trips
                              distribution

                                                              Shipment quantity

                                                               Mode selection

                                                         Number and type of vehicles

                   Figure 8. Set of decisions of the preparedness model provided by authorities

Figure 9 shows shelters (small) and DCs (medium) used by authorities in the flood of Acapulco.
There are 6 shelters that seem to be in a flooded area according to the satellite image in Pedrozo-
Acuña et al. (2014) , but for comparison facilities reported by authorities were included with perfect
connectivity.




                                                       24
```

## Page 25

```text
                                           Figure 9. Facilities used for the flood in Acapulco in 2013

The data obtained from authorities was used incorporating the same assumptions listed for
independent decision making. The ε-constraint method and the weighted-sum method were applied
for 50 iterations each with a time limit of 450 seconds. The outcome were the 46 non-dominated
points which are contrasted in Figure 10 with the Pareto frontier of the results provided by the model.

                                 120

                                 100




             Unfulfillment (%)
                                  80

                                  60
                                                                                                     MODEL
                                  40
                                                                                                     REAL ACTIVITIES
                                  20

                                   0
                                       0         5            10            15           20
                                                     Cost (Million MXN)


    Figure 10. Comparison between the real activities performed by authorities and the results from the system

It seems decisions taken by authorities could have yielded acceptable results, although the solution
with the highest fill rate is around 5% away from the best solution of the model proposed. This
solution is costlier than the solution with an equivalent level of service from the system as well.
Therefore, better solutions in terms of cost and service can be obtained using the system proposed.

7    DISCUSSION OF RESULTS
Results showed that an absence of collaboration can lead to poor level of service even with enough
resources for the situation. There is evidence that a) there is no government agency in Mexico capable
of dealing with a disaster individually, b) that there is a need for interoperability to delegate and
distribute tasks among different actors, and c) that there are potential improvements in both cost and
service by adopting a more systemic approach.

The value of the comparison between coordinated and independent decision-making goes beyond just
a theoretical proof of the unsuitability of an independent approach, but to emphasise that is a problem
that can affect any organisation. It is key for government organisations to collaborate with each other
in order to achieve better operations and avoid duplication of efforts or uneven coverage.

The major test for the model was the comparison to the decisions undertaken by authorities in reality.
The small variation in cost among solutions of the real instance was because only transportation cost
varied (considering all of the other decisions affecting cost were fixed by authorities). However, the
range in level of service shows how important is to use resources in the best way possible.


                                                                       25
```

## Page 26

```text
Table 2 shows a comparison under different metrics between the different instances. Assuming each
organisation acts independently from the others, the results were aggregated to see the impact in the
overall operations (AGENCIES). The best possible outcome of the instance based on the activities
performed by authorities was considered for further analysis (REAL). From the results of the model
proposed, the solution with maximum fill rate (MFR) was included to show the capabilities of the
model, and another solution from the frontier was chosen to show the concept of trade-off (A1ND54).

                   Table 2. Comparison of preparedness results for the flood of Acapulco

                                                  Fill Rate (%)              Facilities             Evac
                  Cost                                                                     Total   Distance
  Solution                   Agencies
                 (MXN)                   Food     Med     Health    S.C.   Shel    DCs     trips   p/person
                                                                                                    (km)
  A1ND54       10,061,802        6       76.13   33.40    99.94    99.98    42       6      46      16.14
    MFR        14,379,448        9       76.56   34.41    99.92    99.96    83      10     101      16.01
    REAL       13,542,000       10       71.36   26.05     100     98.95    56       5     110      13.68
 AGENCIES      15,896,167       10       69.99   19.25    66.98    97.02    97       3      28        8.45


From the comparison it can be seen that the use and management of organisations was not really
justified under the circumstances of the emergency, incurring in higher costs and lower performance.
That result supports the idea that having more resources in the field is not guarantee of better
operations.

The comparison in terms of fill rate of food, medicines, healthcare and shelter care show that the
solutions from the model reach better values. Looking at A1ND54 and MFR the concept of trade-off
can be clearly seen. To reach slightly better metrics in terms of food and medicine delivery the
decision-maker would have to spend over $4 million more, because of the agencies required to
achieve that slight difference. However, it is worth mentioning that difference represents satisfying
around 188 people more. That is the reason multi-objective optimisation is used, to allow the
decision-maker to weight the possibilities and find the best solution according to his/her utility.

AGENCIES delivered the highest cost and lowest fill rates in general. In this case, those fill rates
were because of the absence of distribution personnel in agencies with medical supplies, and some
resources were wasted in sending relief to the wrong shelters. Shortages of medicines and food
highlight the need to look into prepositioning policies used by authorities.

Results from the model open fewer facilities than the actual number opened by authorities (56 shelters
and 6 DCs) on more than 91% of the solutions, showing that a number of facilities might have been
unnecessary. The average occupancy rate of shelters was 80%, showing appropriate use. There is a




                                                    26
```

## Page 27

```text
need to define or upgrade current decision making processes in terms of facility location, as the
number of shelters used seem to be inadequate considering the circumstances of the disaster.

Evacuation distance is clearly better in the solution of independent decision-making. The reason is the
number of facilities activated, the size and the wide distribution of them. The large value of
evacuation distance per person is linked to the extension of the city. As this tool is focused on
preparedness, it assumes evacuation could to be performed before the disaster strikes. This approach
allows the use of evacuation plans that can handle the distances obtained by the model. The reason
these distances are deemed acceptable is because they are incurred just once (or twice when the
disaster finishes), whereas relief distribution can be performed for weeks or months, making the
location of facilities in terms of that activity highly relevant in the long term.

Considering the preferences of authorities, emphasis is placed in cost and fill rate. In that sense, the
model was able to obtain solutions with better fill rates than the other two instances, while keeping
competitive costs (lower for the solution selected for analysis). The reason is because, for example,
the difference in medicines delivered between the maximum fill rate reached by the model and the
real activities performed by authorities represents around 1,092 people. As authorities are very
focused on reaching as many people as possible, the model can help achieve that while keeping an eye
on cost. Additionally, it is important to emphasise these results were obtained with less organisations
involved, using only the right expertise in the field, which can in turn reduce the complexities of
logistics operations and allow more visibility among actors.

Despite the fact that the system has not been implemented in practice, the integration of decision
factors from authorities and the use of real data for application show the potential benefits of this
proposal. From the results obtained it can be seen how the system developed can improve disaster
operations in Mexico. Under the setting currently established by authorities, this kind of tool could be
a good fit to achieve better operations. The study of the flood of 2013 displayed improvable levels of
service accomplished with an oversupply of human resources.

This research is not only addressing a real problem, but it is also providing a solution that can be
attractive for the disaster management in countries such as Mexico. For that to happen, the conditions
specified in the section about model assumptions and context have to be appropriately analysed. The
advantages of the system proposed require a collaborative environment with an overarching decision-
maker capable of coordinating different organisations. Also, there are many challenges associated
with joint operations. These should be carefully addressed to be able to extract the expected benefits
of the application of these kind of Operational Research models.

Implementation of this system can be enhanced by the incorporation of organisations with pre-existent
agreements and relations. Even though the system is capable of supporting any organisation, in reality


                                                     27
```

## Page 28

```text
the interoperability between organisations can be a crucial factor for successful operations. Having a
set of agreements regarding information sharing, obligations and resources available beforehand can
be beneficial for activities in the field. This work is designed to provide a policy before the disaster
occurs, with solutions that are useful prior to and immediately after the phenomenon strikes. Under
those circumstances, it becomes easier to use organisations already involved. However, the exception
can be when the existent pool of actors is deemed insufficient for the situation. In that case support
from other organisations can be asked and their inclusion would require mostly sharing data about
resources at their disposal, although collaboration without prior agreements can be complex.

There are practical limitations for implementation as well. The system can be used to inform the
decision maker about how to manage logistics decisions and direct organisations involved.
Nonetheless, data plays a significant role in the application. Most of the information required by the
system can be acquired prior to the event and it is in possession of the organisations involved. That
data is in the form of inventory of resources available and guidelines. The information should be as
accurate and timely available as possible. Regarding data about the circumstances of the flood, the
analysis of different scenarios should be used to introduce information in the model resembling the
expected conditions. The thorough analysis in the GIS and constant update of prior information is
essential to improve the applicability of solutions.

Similarly, it is important to have accurate forecasting tools. Overestimating or underestimating the
situation can cause waste of resources or insufficient response. Forecasting methods combined with
hydrological analysis can significantly support the quality of the data used and the overall result of the
analysis. Additionally, the use of demand estimation methods along with the assessment of the
disaster with the GIS analysis can support the use of the system proposed.

Communication issues or obscure information can derive in poor operations. It is important that the
leading organisation keeps in contact with other agencies and organisations, particularly once a
disaster is expected, to be able to guide their activities. This paper is presenting a solution for initial
activities, therefore the use of reliable communication channels between the leading organisation and
the rest of the participants can be prepared in advanced to allow the results of the system to be able to
support field operations.

The implementation of the system requires an analyst for application and analysis of results. The
analyst requires knowledge of GIS and optimisation to deliver informed results to the decision-maker.
In terms of solution time, for large-scale disasters it would be important to apply the system as soon as
possible because it could require significant solution time.

Discussing the practical value of the system proposed, it has the possibility of performing scenario
planning, so authorities can plan under what situations national authorities should take part, and under
which conditions only local authorities are needed. That can speed-up the request process for help

                                                       28
```

## Page 29

```text
from higher authorities and allow swift deployment to manage the situation. Using different scenarios
authorities can also identify areas for improvement in the system, test the operational boundaries and
develop pre-designed plans under different circumstances.

Avoiding overcrowding and duplication of efforts by using the proposed model as an enabler for
coordination is a relevant note. Coordination is a complex topic that requires efforts at different levels
to be tackled. This article is proposing a system able to provide a setting to reduce ambiguity and
facilitate the conditions for joint operations.

In disaster management there are different participant organisations with different resources.
Therefore, there is a need to change the current practice of incorporating only one participant in
optimisation models. One of the main outcomes of this research is that it is not about sending every
organisation available, but the right organisations. The results show how better performances can be
achieved with less resources, something that can be very valuable in the field and that can change
current practices.

8   CONCLUSIONS
Taking advantage of the potential of OR to tackle relevant real-world problems, this research
proposed a method for flood preparedness focusing on the application of a multi-organisational
approach to facility location, stock prepositioning, distribution and resource allocation; a perspective
neglected until now. This research pointed out the value of considering several actors in models for
humanitarian logistics to provide a more comprehensive tool for decision-makers. The optimised
scenario of the activities performed by authorities was dominated by the Pareto frontier of the system
developed. This indicates the existence of room for improvement for the decisions currently being
made in practice by incorporating a preparedness system as the one proposed.

Using real data, the results highlight that having more resources in the field does not guarantee to
perform better operations. It is having the right resources in the field what matters. The system
designed was able to improve the outcome of real activities performed by authorities with fewer
organisations involved. The model presented here is the first of its kind to be able to handle different
organisations and decide, based on their resources, which ones ought to be activated for logistics
activities. That can prevent wastage of resources and enhance coordination.

As each organisation has limited capacity, interoperability is crucial for disaster management. The
model allows the user to find the most advantageous combination of resources and to complement
capabilities, thereby making it possible to include multiple participants in disaster management.

Exploring the capabilities of the current disaster management system by testing the operational
boundaries can avoid an unjustified overconfidence on capacity (e.g. facilities, supply) planning for
future events. This model is able to test such boundaries and identify areas of improvement for the

                                                    29
```

## Page 30

```text
decision maker and/or the organisations. Moreover, scenario analysis can be performed using this
model to have pre-designed disaster management policies under different circumstances.

Although independent participation from government organisations can seem unrealistic, under real
circumstances the complications of coordination can lead to some of them acting on their own. This
research strengthens the idea of the need of collaboration among government organisations and how
the lack of it can have significant impact in the outcome of the situation.

Discussing the transference of this model to a different context, the requirements would be based
mostly in the structure of the disaster management system. The existence of a leading organisation is
important to oversee and direct the efforts of different individual participants. The organisations
involved would require a link to the leading organisation, namely a government, and have pre-defined
agreements for operation. A communication hub would be important to ease sharing information and
facilitating the collaboration among the different participants. The other requirements would be the
existence of agreements with suppliers, financial instruments for funding disaster operations, the
existence of geographical information, the inclusion of organisations with vehicles available or the
inclusion of transportation companies, standardised units for distribution, and a prepositioning policy
for immediate deployment.

Thinking about response activities, the ideas from this paper could be used to develop a response
model to provide support for the entire duration of the flood, with a set of modifications. A static
model, as the one proposed here, could not be able to consider the evolution of events through time
(e.g. which shelters were served before). Less attention should be placed to facility location and more
to facility management. Also, inventory decisions should be introduced and the equity measure should
be incorporated across periods. Future research can be focused on the development of such model.

There are still many challenges to be addressed. Even though results from the evacuation distance
were somehow close to the benchmark, it is still a very important concern. Coupling the system
designed with traffic assignment for evacuation can be very useful. The incorporation of routing
systems would be a useful addition. The model as it is designed is not able to handle differences in
hierarchy between organisations, and the use of hierarchical models is a promising venue.

ACKNOWLEDGMENTS
The corresponding author wants to acknowledge financial support from the Consejo Nacional de
Ciencia y Tecnologia and Aston University for the development of this research.

The authors would want to thank the reviewers of this paper for their time and insightful comments to
improve the quality of the paper.




                                                   30
```

## Page 31

```text
REFERENCES
Abounacer, R., Rekik, M., & Renaud, J. (2014). An exact solution approach for multi-objective
         location–transportation problem for disaster response. Computers & Operations Research,
         41(0), 83-93. doi: http://dx.doi.org/10.1016/j.cor.2013.08.001
Adıvar, B., & Mert, A. (2010). International disaster relief planning with fuzzy credibility. [Article].
         Fuzzy Optimization & Decision Making, 9(4), 413-433. doi: 10.1007/s10700-010-9088-8
Alem, D., Clark, A., & Moreno, A. (2016). Stochastic network models for logistics planning in disaster
         relief. European Journal of Operational Research, 255(1), 187-206. doi:
         http://dx.doi.org/10.1016/j.ejor.2016.04.041
Alexander, D. (2015). Evaluation of civil protection programmes, with a case study from Mexico.
         Disaster Prevention and Management: An International Journal, 24(2), 263-283. doi:
         10.1108/DPM-12-2014-0268
Altay, N. (2013). Capability-based resource allocation for effective disaster response. IMA Journal of
         Management Mathematics, 24(2), 253-266. doi: 10.1093/imaman/dps001
Altay, N., & Green, W. G. (2006). OR/MS research in disaster operations management. European
         Journal of Operational Research, 175(1), 475-493. doi: 10.1016/j.ejor.2005.05.016
Arora, H., Raghu, T. S., & Vinze, A. (2010). Resource allocation for demand surge mitigation during
         disaster response. [Article]. Decision Support Systems, 50(1), 304-315. doi:
         10.1016/j.dss.2010.08.032
Auf der Heide, E. (1989). Disaster response: principles of preparation and coordination. St. Louis, MO:
         Mosby, Incorporated.
Balcik, B., Beamon, B. M., Krejci, C. C., Muramatsu, K. M., & Ramirez, M. (2010). Coordination in
         humanitarian relief chains: Practices, challenges and opportunities. [Article]. International
         Journal of Production Economics, 126(1), 22-34. doi: 10.1016/j.ijpe.2009.09.008
Barbarosoğlu, G., Özdamar, L., & Çevik, A. (2002). Decision Aiding: An interactive approach for
         hierarchical analysis of helicopter logistics in disaster relief operations. [Article]. European
         Journal of Operational Research, 140, 118-133. doi: 10.1016/s0377-2217(01)00222-3
Barzinpour, F., & Esmaeili, V. (2014). A multi-objective relief chain location distribution model for
         urban disaster management. The International Journal of Advanced Manufacturing
         Technology, 70(5-8), 1291-1302. doi: 10.1007/s00170-013-5379-x
Beamon, B. M., & Balcik, B. (2008). Performance measurement in humanitarian relief chains.
         [Article]. International Journal of Public Sector Management, 21(1), 4-25. doi:
         10.1108/09513550810846087
Bertrand, J. W. M., & Fransoo, J. C. (2002). Operations management research methodologies using
         quantitative modeling. International Journal of Operations & Production Management,
         22(2), 241-264. doi: doi:10.1108/01443570210414338
Bish, D. R., & Sherali, H. D. (2013). Aggregate-level demand management in evacuation planning.
         European Journal of Operational Research, 224(1), 79-92. doi: 10.1016/j.ejor.2012.07.036
Bozorgi-Amiri, A., Jabalameli, M., Alinaghian, M., & Heydari, M. (2012). A modified particle swarm
         optimization for disaster relief logistics under uncertain environment. The International
         Journal of Advanced Manufacturing Technology, 60(1-4), 357-371. doi: 10.1007/s00170-011-
         3596-8
Bozorgi-Amiri, A., Jabalameli, M. S., & Mirzapour Al-e-Hashem, S. M. J. (2011). A multi-objective
         robust stochastic programming model for disaster relief logistics under uncertainty. OR
         Spectrum, 1-29. doi: 10.1007/s00291-011-0268-x
Bretschneider, S., & Kimms, A. (2012). Pattern-based evacuation planning for urban areas. European
         Journal of Operational Research, 216(1), 57-69. doi: 10.1016/j.ejor.2011.07.015
Campbell, A. M., & Jones, P. C. (2011). Prepositioning supplies in preparation for disasters. European
         Journal of Operational Research, 209(2), 156-165. doi: 10.1016/j.ejor.2010.08.029




                                                   31
```

## Page 32

```text
Caunhye, A. M., Nie, X., & Pokharel, S. (2012). Optimization models in emergency logistics: A
         literature review. Socio-Economic Planning Sciences, 46(1), 4-13. doi:
         10.1016/j.seps.2011.04.004
CENAPRED. (2014). Information request #0413000010014 (pp. 8): Centro Nacional para la
         Prevención de Desastres.
Chang, M.-S., Tseng, Y.-L., & Chen, J.-W. (2007). A Scenario Planning Approach for the Flood
         Emergency Logistics Preparation Problem under Uncertainty. Transportation Research: Part
         E: Logistics and Transportation Review, 43(6), 737-754. doi:
         http://www.sciencedirect.com/science/journal/13665545
Chen, A. Y., Peña-Mora, F., & Ouyang, Y. (2011). A collaborative GIS framework to support
         equipment distribution for civil engineering disaster response operations. Automation in
         Construction, 20(5), 637-648. doi: http://dx.doi.org/10.1016/j.autcon.2010.12.007
De Leeuw, S., Vis, I. F. A., & Jonkman, S. N. (2012). Exploring Logistics Aspects of Flood Emergency
         Measures. Journal of Contingencies and Crisis Management, 20(3), 166-179. doi:
         10.1111/j.1468-5973.2012.00667.x
DICONSA. (2014). Information request #2015000000614: DICONSA.
Drabek, T. E., & McEntire, D. A. (2003). Emergent phenomena and the sociology of disaster: Lessons,
         trends and opportunities from the research literature. [Article]. Disaster Prevention and
         Management, 12(2), 97-112. doi: 10.1108/09653560310474214
Edrissi, A., Poorzahedy, H., Nassiri, H., & Nourinejad, M. (2013). A multi-agent optimization
         formulation of earthquake disaster prevention and management. European Journal of
         Operational Research, 229(1), 261-275. doi: http://dx.doi.org/10.1016/j.ejor.2013.03.008
Esmaeili, V., & Barzinpour, F. (2014). Integrated decision making model for urban disaster
         management: A multi-objective genetic algorithm approach. International Journal of
         Industrial Engineering Computations, 5(1), 55-70. doi: 10.5267/j.ijiec.2013.08.004
Esteves, L. S. (2013). Consequences to flood management of using different probability distributions
         to estimate extreme rainfall. [Article]. Journal of Environmental Management, 115, 98-105.
         doi: 10.1016/j.jenvman.2012.11.013
Falasca, M., & Zobel, C. (2012). An optimization model for volunteer assignments in humanitarian
         organizations. Socio-Economic Planning Sciences, 46(4), 250-260. doi:
         http://dx.doi.org/10.1016/j.seps.2012.07.003
Galindo, G., & Batta, R. (2013). Review of Recent Developments in OR/MS Research in Disaster
         Operations Management. European Journal of Operational Research(0). doi:
         http://dx.doi.org/10.1016/j.ejor.2013.01.039
García, N., Méndez, K., Reyes, R., & Marin, R. (2015). Impacto Socioeconómico de los Principales
         Desastres Ocurridos en la República Mexicana en 2013. México, D.F.: CENAPRED.
Gillespie, D. F. (1991). Coordinating community resources. In T. E. D. G. J. Hoetmer (Ed.), Emergency
         management: Principles and practice for local government (pp. pp. 55–78). Washington, DC:
         City Management Association.
Holguín-Veras, J., Jaller, M., & Wachtendorf, T. (2012). Comparative performance of alternative
         humanitarian logistic structures after the Port-au-Prince earthquake: ACEs, PIEs, and CANs.
         Transportation Research Part A: Policy and Practice, 46(10), 1623-1640. doi:
         http://dx.doi.org/10.1016/j.tra.2012.08.002
Huang, K., Jiang, Y., Yuan, Y., & Zhao, L. (2015). Modeling multiple humanitarian objectives in
         emergency response to large-scale disasters. Transportation Research Part E: Logistics and
         Transportation Review, 75(0), 1-17. doi: http://dx.doi.org/10.1016/j.tre.2014.11.007
INEGI. (2010a). México en Cifras Retrieved June 5th, 2014, from
         http://www.inegi.org.mx/movil/MexicoCifras/mexicoCifras.aspx?em=12001&i=e
INEGI. (2010b). SCINCE versión 05/2012 para escritorio. Retrieved from
         http://www.inegi.org.mx/est/scince/scince2010.aspx



                                                 32
```

## Page 33

```text
Kourgialas, N. N., & Karatzas, G. P. (2011). Flood management and a GIS modelling method to assess
         flood-hazard areas—a case study. Hydrological Sciences Journal, 56(2), 212-225. doi:
         10.1080/02626667.2011.555836
Kovács, G., & Spens, K. (2009). Identifying challenges in humanitarian logistics. [Article].
         INTERNATIONAL JOURNAL OF PHYSICAL DISTRIBUTION AND LOGISTICS MANAGEMENT,
         39(6), 506-528. doi: 10.1108/09600030910985848
Kunz, N., & Reiner, G. (2012). A meta-analysis of Humanitarian Logistics research. Journal of
         Humanitarian Logistics and Supply Chain Management 2(2), 32.
Liberatore, F., Pizarro, C., de Blas, C. S., Ortuño, M. T., & Vitoriano, B. (2013). Uncertainty in
         Humanitarian Logistics for Disaster Management. A Review. In B. Vitoriano, J. Montero & D.
         Ruan (Eds.), Decision Aid Models for Disaster Management and Emergencies (Vol. 7, pp. 45-
         74): Atlantis Press.
Liebscher, S., Kirschstein, T., & Becker, C. (2012). The flood algorithm—a multivariate, self-
         organizing-map-based, robust location and covariance estimator. Statistics and Computing,
         22(1), 325-336. doi: 10.1007/s11222-011-9250-3
Lim, M. B., Lim Jr, H., & Piantanakulchai, M. (2013). Factors Affecting Flood Evacuation Decision and
         Its Implication to Transportation Planning. [Factors Affecting Flood Evacuation Decision and
         Its Implication to Transportation Planning]. Journal of the Eastern Asia Society for
         Transportation Studies, 10(0), 163-177. doi: 10.11175/easts.10.163
Lindell, M. K., Kang, J. E., & Prater, C. S. (2011). The logistics of household hurricane evacuation.
         [journal article]. Natural Hazards, 58(3), 1093-1109. doi: 10.1007/s11069-011-9715-x
Lu, C. C. (2013). Robust weighted vertex p-center model considering uncertain data: An application
         to emergency management. European Journal of Operational Research, 230(1), 113-121. doi:
         10.1016/j.ejor.2013.03.028
Martin, K. (1993). Modeling the impact of sea level rise in Narraganset Bay, Rhode Island. In
         Worcester (Ed.), Applications in Coastal Research and Management (pp. 59-61). Geneva:
         UNITAR.
Maya Duque, P. A., Dolinskaya, I. S., & Sörensen, K. (2016). Network repair crew scheduling and
         routing for emergency relief distribution problem. European Journal of Operational
         Research, 248(1), 272-285. doi: http://dx.doi.org/10.1016/j.ejor.2015.06.026
Merz, R., & Blöschl, G. (2003). A process typology of regional floods. Water Resources Research,
         39(12), n/a-n/a. doi: 10.1029/2002wr001952
Mete, H. O., & Zabinsky, Z. B. (2010). Stochastic optimization of medical supply location and
         distribution in disaster management. International Journal of Production Economics, 126(1),
         76-84. doi: 10.1016/j.ijpe.2009.10.004
Miettinen, K. (2008). Introduction to Multiobjective Optimization: Noninteractive Approaches. In J.
         Branke, K. Deb, K. Miettinen & R. Słowiński (Eds.), Multiobjective Optimization. [electronic
         resource] : Interactive and Evolutionary Approaches: Berlin, Heidelberg : Springer Berlin
         Heidelberg, 2008.
Nagarajan, M., Shaw, D., & Albores, P. (2012). Innovative Applications of O.R.: Disseminating a
         warning message to evacuate: A simulation study of the behaviour of neighbours. [Article].
         European Journal of Operational Research, 220, 810-819. doi: 10.1016/j.ejor.2012.02.026
Naji-Azimi, Z., Renaud, J., Ruiz, A., & Salari, M. (2012). A covering tour approach to the location of
         satellite distribution centers to supply humanitarian aid. European Journal of Operational
         Research, 222(3), 596-605. doi: 10.1016/j.ejor.2012.05.001
Nolte, I. M., Martin, E. C., & Boenigk, S. (2012). Cross-Sectoral Coordination of Disaster Relief.
         [Article]. Public Management Review, 14(6), 707-730. doi: 10.1080/14719037.2011.642629
Noyan, N. (2012). Risk-averse two-stage stochastic programming with an application to disaster
         management. Computers & Operations Research, 39(3), 541-559. doi:
         10.1016/j.cor.2011.03.017



                                                 33
```

## Page 34

```text
Özdamar, L., & Ertem, M. A. (2015). Models, solutions and enabling technologies in humanitarian
         logistics. European Journal of Operational Research, 244(1), 55-65. doi:
         http://dx.doi.org/10.1016/j.ejor.2014.11.030
Pedrozo-Acuña, A., Breña-Naranjo, J. A., & Domínguez-Mora, R. (2014). The hydrological setting of
         the 2013 floods in Mexico. Weather, 69(11), 295-302. doi: 10.1002/wea.2355
Pidd, M., De Silva, F. N., & Eglese, R. W. (1996). A simulation model for emergency evacuation.
         European Journal of Operational Research, 90(3), 413-419. doi: 10.1016/0377-
         2217(95)00112-3
Rawls, C. G., & Turnquist, M. A. (2010). Pre-positioning of emergency supplies for disaster response.
         Transportation Research Part B: Methodological, 44(4), 521-534. doi:
         10.1016/j.trb.2009.08.003
Rawls, C. G., & Turnquist, M. A. (2011). Pre-positioning Planning for Emergency Response with
         Service Quality Constraints. OR Spectrum, 33(3), 481-498. doi:
         http://www.springerlink.com/link.asp?id=102498
Rawls, C. G., & Turnquist, M. A. (2012). Pre-positioning and dynamic delivery planning for short-term
         response following a natural disaster. [Article]. Socio-Economic Planning Sciences, 46(1), 46-
         54. doi: 10.1016/j.seps.2011.10.002
Renkli, Ç., & Duran, S. (2015). Pre-Positioning Disaster Response Facilities and Relief Items. Human
         and Ecological Risk Assessment: An International Journal, 21(5), 1169-1185. doi:
         10.1080/10807039.2014.957940
Rennemo, S. J., Rø, K. F., Hvattum, L. M., & Tirado, G. (2014). A three-stage stochastic facility routing
         model for disaster response planning. Transportation Research Part E: Logistics and
         Transportation Review, 62(0), 116-135. doi: http://dx.doi.org/10.1016/j.tre.2013.12.006
Rodríguez-Espíndola, O., & Gaytán, J. (2015). Scenario-based preparedness plan for floods. Natural
         Hazards, 76(2), 1241-1262. doi: 10.1007/s11069-014-1544-2
Saadatseresht, M., Mansourian, A., & Taleai, M. (2009). Evacuation planning using multiobjective
         evolutionary optimization approach. European Journal of Operational Research, 198(1), 305-
         314. doi: http://dx.doi.org/10.1016/j.ejor.2008.07.032
Salmeron, J., & Apte, A. (2010). Stochastic Optimization for Natural Disaster Asset Prepositioning.
         PRODUCTION AND OPERATIONS MANAGEMENT, 19(5), 561-574.
Santos-Reyes, J., & Beard, A. N. (2011). Applying the SDMS Model to the Analysis of the Tabasco
         Flood Disaster in Mexico. [Article]. Human & Ecological Risk Assessment, 17(3), 646-677. doi:
         10.1080/10807039.2011.571099
Savas, E. S. (1978). ON EQUITY IN PROVIDING PUBLIC SERVICES. [Article]. Management Science,
         24(8), 800-808.
SEGOB. (2006). ACUERDO por el que se emite el Manual de Organización y Operación del Sistema
         Nacional de Protección Civil. México: Retrieved from
         http://www.proteccioncivil.gob.mx/work/models/ProteccionCivil/Resource/6/1/images/mo
         osnpc.pdf.
Sheu, J.-B. (2014). Post-disaster relief–service centralized logistics distribution with survivor
         resilience maximization. Transportation Research Part B: Methodological, 68(0), 288-314.
         doi: http://dx.doi.org/10.1016/j.trb.2014.06.016
SSPPC. (2013). Refugios Temporales 2013 Región Acapulco Retrieved 29 September 2014, from
         http://i.guerrero.gob.mx/uploads/2013/05/refugios-temporales-2013-region-Acapulco.pdf
Tofighi, S., Torabi, S. A., & Mansouri, S. A. (2016). Humanitarian logistics network design under mixed
         uncertainty. European Journal of Operational Research, 250(1), 239-250. doi:
         http://dx.doi.org/10.1016/j.ejor.2015.08.059
Tomlin, C. D. (1991). Cartographic modelling. In P. Longley (Ed.), Geographic information systems
         and science: Hoboken, N.J. : John Wiley, 1991. 1st ed.
UNISDR. (2009). Reducing Disaster Risks through Science: Issues and Actions. The full report of the
         ISDR Scientific and Technical Committee 2009 (pp. 23): United Nations.


                                                   34
```

## Page 35

```text
USGS. (2010). HydroSHEDS Retrieved 10 April 2011, from
         http://gisdata.usgs.gov/website/HydroSHEDS
Ward, P. J., de Moel, H., Aerts, J. C. J. H., & Glade, T. (2011). How are flood risk estimates affected by
         the choice of return-periods? Natural Hazards & Earth System Sciences, 11(12), 3181.
Wenger, D., Quarantelli, E. L., & Dynes, R. (1986). Disaster Analysis: Emergency Management Offices
         And Arrangements (pp. 136). Delaware: UNIVERSITY OF DELAWARE, DISASTER RESEARCH
         CENTER
Wex, F., Schryen, G., Feuerriegel, S., & Neumann, D. (2014). Emergency response in natural disaster
         management: Allocation and scheduling of rescue units. European Journal of Operational
         Research, 235(3), 697-708. doi: http://dx.doi.org/10.1016/j.ejor.2013.10.029
Yi, W., & Ozdamar, L. (2007). A dynamic logistics coordination model for evacuation and support in
         disaster response activities. European Journal of Operational Research, 127(3), 1177-1193.




                                                    35
```
