# Verbatim PDF Transcript

- Source PDF: `Alokasi_03_Yang_2017_Emergency_logistics_for_wildfire_suppression_based_on_foreca.pdf`
- Original upload filename: `Alokasi_03_Yang_2017_Emergency_logistics_for_wildfire_suppression_based_on_foreca.pdf`
- Source PDF SHA-256: `01abc101a4ff5c7196e2dfdb2d202ed6f199880a8947f7a34d06a01d78034de2`
- Extraction method: `pdftotext -layout`
- Pages: 21

This file preserves native PDF text with page boundaries. Tesseract OCR supplements pages where the native text layer is empty or corrupted.

## Page 1

```text
Ann Oper Res (2019) 283:917–937
https://doi.org/10.1007/s10479-017-2598-9

APPLICATIONS OF OR IN DISASTER RELIEF OPERATIONS



Emergency logistics for wildfire suppression based
on forecasted disaster evolution

Zhongzhen Yang1 · Liquan Guo1 · Zaili Yang1,2




Published online: 5 August 2017
© The Author(s) 2017. This article is an open access publication


Abstract This paper aims to develop a two-layer emergency logistics system with a single
depot and multiple demand sites for wildfire suppression and disaster relief. For the first
layer, a fire propagation model is first built using both the flame-igniting attributes of wildfires
and the factors affecting wildfire propagation and patterns. Second, based on the forecasted
propagation behavior, the emergency levels of fire sites in terms of demand on suppression
resources are evaluated and prioritized. For the second layer, considering the prioritized fire
sites, the corresponding resource allocation problem and vehicle routing problem (VRP) are
investigated and addressed. The former is approached using a model that can minimize the
total forest loss (from multiple sites) and suppression costs incurred accordingly. This model
is constructed and solved using principles of calculus. To address the latter, a multi-objective
VRP model is developed to minimize both the travel time and cost of the resource delivery
vehicles. A heuristic algorithm is designed to provide the associated solutions of the VRP
model. As a result, this paper provides useful insights into effective wildfire suppression by
rationalizing resources regarding different fire propagation rates. The supporting models can
also be generalized and tailored to tackle logistics resource optimization issues in dynamic
operational environments, particularly those sharing the same feature of single supply and
multiple demands in logistics planning and operations (e.g., allocation of ambulances and
police forces).

Keywords Emergency logistics · Disaster operation management · Wildfire suppression ·
Vehicle routing problem · Multiple objective decision making




B Zaili Yang
    z.yang@ljmu.ac.uk
1   Transportation Management College, Dalian Maritime University, Dalian, China
2   Liverpool Logistics, Offshore and Marine Research Institute, Liverpool John Moores University,
    Liverpool, UK


                                                                                          123
```

## Page 2

```text
918                                                             Ann Oper Res (2019) 283:917–937


1 Background

Globally, wildfire accidents, particularly those caused by humans, have become more com-
mon in recent years (Plucinski et al. 2012; Page et al. 2014; Krawchuk and Moritz 2014). For
example, from 2000 to 2013, there were 115,466 wildfires in China, the majority of which
were due to human activities. Annually, there were approximately 8248 wildfires, with over
106,127 hectares of burned area and over 117 casualties on average (China Statistical Year-
book 2014). Wildfires can result in serious losses of forest resources and personal property.
To effectively reduce and mitigate such losses, proactively developing suppression planning
and emergency logistics responses within the context of Disaster Operations Management
(DOM) is necessary. Measures that can drastically reduce the associated social, economic
and environmental impacts caused by wildfires are especially crucial.
    DOM, which was first introduced by Altay and Green III in 2006 (Altay and Green 2006),
consists of the techniques for preparing a community and reducing the severity of damages
caused by all disasters by developing communications systems, stockpiling inventory, build-
ing adequate structures, etc. (Hoyos et al. 2015). If executed properly, these techniques can
make a community more resilient to natural disasters, (Guha-Sapir and Santos 2012). Accord-
ing to FEMA (2004), the DOM life cycle can be divided into four major stages: mitigation,
preparedness, response and recovery. This four-phase life cycle provides a more focused
view of emergency operations and management actions. Emergency responses involve the
employment of resources and emergency procedures as guided by plans to preserve life, prop-
erty, the environment, and the social, economic, and political structure of the community.
The emphasis in emergency response operations is primarily placed on relief distribution,
facility location and casualty transportation. Related emergency logistics planning includes
the optimal pick-up and delivery schedules for vehicles within a considered time window
and the optimal quantities and load types picked up and delivered on these routes. In terms
of the emergency logistics planning for wildfires suppression, it includes the storage, trans-
portation and delivery of rescue resources and the allocation and management of equipment
and materials (e.g., fire-fighting forces and fire-fighting equipment). All these activities aim
to reduce the damage caused by wildfires and assist with fire disaster relief operations.
    Nevertheless, the decision-making process for emergency logistics planning has never
been straightforward. This process differs greatly from its counterparts in normal business
logistics because it involves a high level of urgency and uncertainty in terms of the number
of people affected and in need of attention (Christie and Levary 1998; Pedraza-Martinez and
Wassenhove 2012). Policy makers and technicians request scientific models to explain the
damage caused by disasters and establish future scenarios of disaster risk evolution condi-
tions (Rodrigues et al. 2014). Therefore, employing suitable tools and techniques to model
this stochasticity in the decision-making process for effective preparedness and response to
disasters is essential. Regarding wildfires, the need for such tools has led to the development
of several prediction models (Martínez et al. 2009; Thompson and Calkin 2011; Ager et al.
2014) that focus on explaining spatial–temporal patterns with regard to certain variables
(physiographic, infrastructural, socio-economic and weather-related) relating to the ignition
of wildfires. However, in the literature, few studies incorporating wildfire propagation and
logistics planning for disaster relief, revealing a research gap concerning appropriate solu-
tions for these types of logistic problems.
    In the above mentioned context, this paper aims to develop a two-layer emergency logistics
system with a single depot and multiple demand sites for wildfire suppression based on
the predicted trend in fire. The work described herein considers wildfires in the Daxingan



123
```

## Page 3

```text
Ann Oper Res (2019) 283:917–937                                                             919


Mountains in China as real investigation cases and applies the theories and methodologies
of emergency logistics management, forest science and operations research. The novelty of
this work arises from the improvement it makes on a well-established propagation model
(i.e., the Wangzhengfei model) by rendering this model capable of accurately predicting the
fire propagation behavior in the Daxingan Mountains to minimize the impact of the dynamic
characteristics of fire behavior on the distribution of suppression resources. It ranks the
severity of the fire sites in terms of indices representing the potential burned areas to assign
the emergency priorities accordingly. Moreover, this work presents a new method for solving
the allocation problem and vehicle routing problem (VRP) for the distribution of suppression
recourses by distinguishing lower and higher propagation speeds.
    To achieve this aim, the paper is organized as follows. Section 2 describes the relevant
studies in the literature. Section 3 presents the fire propagation models, whereas Sect. 4
investigates the emergency logistics planning models (i.e., VRP) based on the outcomes
from Sect. 3. In Sect. 5, real-world cases based on historical data concerning wildfires in
the Daxingan Mountains are analyzed to demonstrate and verify the models. Finally, Sect. 6
concludes the paper.


2 Literature review

Emergency logistics is distinct from general business logistics in the following four respects
(Caunhye et al. 2012): (a) Relief services are both urgent and highly diversified. (b) Accu-
rate real-time information regarding urgent relief demands is nearly impossible to obtain.
(c) The benefits of emergency logistics operations are always discounted because of non-
emergency reactions. Often, emergency logistics decisions are focused more on efficiency
and less on cost. (d) Governments intervene the market behavior to jointly participate in emer-
gency logistics services. Emergency logistics has also raised numerous challenging issues
(Sheu 2007): (a) The definition of emergency logistics remains ambiguous. (b) The timeli-
ness of relief supply and distribution is hardly controllable in the context of emergencies. (c)
Resource management for emergency logistics remains challenging. (d) Accurate, real-time
relief demand information is required but almost inaccessible. Therefore, the existing stud-
ies are classified into two categories: (1) humanitarian or DOM during the response stage,
especially for emergency logistics planning (Caunhye et al. 2016; Gutjahr and Nolz 2016;
Wang et al. 2014) and (2) disaster dynamic prediction and evaluation of the emergency level
(Sheu 2010).

2.1 Humanitarian or disaster operations management

Regarding studies on humanitarian or disaster operations, Caunhye et al. (2012) conducted a
review of optimization models and classified the findings according to the type of operations
undertaken (facility location, relief distribution and casualty transportation) and the model
types, decisions, objectives and constraints. The urgent relief distribution problems are gen-
erally formulated as multi-commodity multi-modal flow problems with time windows (Rathi
et al. 1992; Haghani and Oh 1996; Lei et al. 2015; Jin et al. 2015). Fiedrich et al. (2000)
developed a dynamic combinatorial optimization model to determine the optimal resource
rescuing schedule in order to minimize the total deaths during a search-and-rescue period.
Barbarosoğlu et al. (2002) proposed a bi-level hierarchical decomposition approach for heli-
copter planning during a disaster relief service operation. In this approach, the top level was
used to solve the tactical decision problems involving managing the helicopter fleet, crew

                                                                                    123
```

## Page 4

```text
920                                                             Ann Oper Res (2019) 283:917–937


assignment and the number of tours undertaken by each helicopter. Özdamar et al. (2004)
noted that an emergency logistics plan can be obtained by solving a dynamic time-dependent
transportation problem with the objective of minimizing the unsatisfied demands of all com-
modities through the planning horizon. Oloruntoba et al. (2016) reviewed and analyzed three
social science and management theories (i.e., internationalization, behavioral and organi-
zational theories) as worthy of consideration by scholars and practitioners in humanitarian
operations research. Finally, Rodríguez-Espíndola et al. (2017) introduced a disaster pre-
paredness system based on a combination of multi-objective optimization and geographical
information systems to aid multi-organizational decision making.
    To address the uncertain and dynamic nature of disasters, Chang et al. (2007) developed
a scenario-based, two-stage stochastic programming model for the planning of flood emer-
gency logistics with uncertainty regarding demand locations and quantities. The first stage
consisted of grouping the disaster areas and classifying their emergency levels while mini-
mizing the expected shipping distances. The second stage consisted of a location-allocation
model, which was used to select local rescue based to open, the quantities of rescue equip-
ment to send to storehouses and the routes that emergency transportation should follow to
minimize costs. Balcik and Beamon (2008) combined the problems of resource allocation
and relief distribution by proposing a multi-period Mixed Integer Planning (MIP) model to
determine the schedules of a fixed set of vehicles and an equitable allocation of resources
by minimizing transportation and unsatisfied or late-satisfied demand costs and maximizing
the benefits to aid recipients for local distribution sites using a rolling horizon to address
uncertainties in supply and demand. Subsequently, Rawls and Turnquist (2012) developed a
multi-period version of the same approach using a two-stage, dynamic and scenario-based
stochastic programming model for the pre-positioning and allocation of facilities and the dis-
tribution of commodities after a disaster event with the objective of minimizing total costs.
Chu and Wang (2012) presented a new approach to address event probability uncertainties
and analyze the probability distribution for constructing probable fire scenarios, and Jacob-
son et al. (2012) studied the probability distributions of aspects such as the survival time and
service time of patients to develop a model for assigning different priority levels to disaster
victims. Wohlgemuth et al. (2012) developed a multi-stage mixed integer model under vari-
able demand and transport conditions in the context of disaster relief response planning and
logistics. Huang and Song (2016) discussed an emergency logistics distribution routing prob-
lem based on uncertainty theory in which some parameters lack historical data and are given
by experts’ estimations. Alem et al. (2016) developed a new two-stage stochastic network
flow model to decide how to rapidly supply humanitarian aid to disaster victims considering
the uncertainty about the exact nature and magnitude of the disaster.
    Furthermore, Liberatore et al. (2013) established five major parameters based on which
the uncertainties involved in humanitarian logistics are approached: (1) demand, including
the size of the affected population and/or the quantities of required relief goods; (2) demand
locations and (3) affected areas, indicating those directly related to the demographics of each
location and the impact of the disaster; (4) supply, including considerations of the quality
and availability of products in a post-disaster scenario; and finally, (5) the transportation
network, including all possible damage to the infrastructure and the congestion effect. Iudin
et al. (2015) applied this new approach to develop a cellular automaton forest-fire model
related to the percolation methodology. Their model combined the dynamic and static per-
colation problems and exhibited critical fluctuations under certain conditions. Rezaei-Malek
et al. (2016) developed a multi-objective, two-stage stochastic, non-linear, and mixed integer
mathematical model for relief pre-positioning in disaster management based on a new utility
level of the delivered relief commodities.

123
```

## Page 5

```text
Ann Oper Res (2019) 283:917–937                                                            921


   In DOM, many models are NP-hard (Sheu 2007; Caunhye et al. 2012); therefore, the
algorithms for solving them are intensively studied (e.g., Hoyos et al. 2015; Özdamar and
Ertem 2015; Yuan and Wang 2009). For example, Wei and Kumar (2007) proposed an ant-
colony optimization method to solve the multi-commodity and vehicle dispatch problems
that arise in disaster relief scenarios. Subsequently, Zhang et al. (2012) proposed a local
search heuristic with MIP for solving the multiple-disaster, multiple-response emergency
allocation and disaster relief problems, which were associated with the stochastic occurrence
of a secondary disaster.

2.2 Disaster dynamic prediction

During rescue operations, fire disasters may continue to develop. Therefore, forecasting the
evolution of the disasters (e.g., the fire or flood propagation) and incorporating it into the
rescue decisions is necessary (Altay and Labonte 2014; Altay and Pal 2014; Oloruntoba
2010).
    Regarding disaster evolution forecasting, García et al. (1995) introduced a logit model
to predict the number of fire days in the Whitecourt Forest of Alberta. Mandallaz and Ye
(1997) presented a general statistical methodology for predicting forest-fire occurrence using
Poisson models. Wu et al. (2015) identified three fire environment zones among the boreal
forest landscapes of northeastern China using analytical methods to examine the spatial
clustering characteristics of the environmental variables of climate, vegetation, topography,
and human activity. This work demonstrated how a developed fire environment zone map
could be used to guide forest-fire management and fire regime prediction. As these forecasts
were made at a macro level, the associated results might be used to formulate preparedness
plans. Sheu et al. (2005) developed a model for forecasting relief demand and for clustering
demand sites according to their individual uncertainty and urgency using a fuzzy clustering
technique to allocate the daily consumption of relief commodities in disaster scenarios. The
objective of this work was to minimize the costs of traveling from relief centers based on
real-time analysis. The authors presented a real-time, micro-level forecast; hence, the results
might be used as a basis for scheduling the operations of rescue vehicles and the delivery of
emergency goods in real time. To properly support humanitarian decision makers, Charles
et al. (2016) proposed a tooled methodology based on the definition of aggregate scenarios
to reliably forecast demand using past disaster data and future trends.
    Tzeng et al. (2007) developed a fuzzy multi-objective linear programming model for
the design of relief delivery systems with the objectives of minimizing the total costs and
total travel time and maximizing the minimal satisfaction during the planning period using
a method of predicting the commodity demand at each established site and an uncertainty
analysis of the achievement of each objective. This model combined emergency logistics
planning and disaster spread prediction, and its dynamic planning decisions were based on
the forecasted demands. Hu and Sheng (2015) conducted a similar study based on the principle
of disaster spread in resource networks. They proposed a property model of resource nodes
that incorporated the values of the resources, the disastrous energy of each node, the disaster
spread path, and the disaster spread characteristics. To study the disaster spread dynamics, a
state diagram was used to construct a microscopic behavior model for the resource nodes by
treating the resource nodes as agents. Then, decision models were gradually constructed to
determine the optimal time for disaster rescue and emergency resource preparation. Buscarino
et al. (2015) disclosed a model that formalized an innovative methodology for simulating
forest-fire propagation. This model was based on a multilayer network structure, which
facilitated the establishment of flexible definitions of the spatial properties of the medium


                                                                                    123
```

## Page 6

```text
922                                                                 Ann Oper Res (2019) 283:917–937


and the dynamical laws governing fire propagation. The dynamical core of each node in the
network was represented by a hyperbolic reaction-diffusion equation that incorporated the
intrinsic characteristics of the ignition behavior of trees.
    Among the studies on disaster spread prediction (in the second category), statistical mod-
els are widely used in the risk assessment stage (Powell et al. 2016). For risk analysis of the
impact of natural disasters on large-scale, critical infrastructure systems, electric power distri-
bution systems, transportation systems, etc., Guikema (2009) proposed a statistical learning
methodology that incorporated a diverse set of methods designed for performing inference
analysis on large, complex data sets,. Matellini et al. (2013) developed a Bayesian network
model to investigate the evolution of fires within dwellings and to assess the probabilities
of the associated consequences. Holicky and Schleich (2000) studied fire protection systems
and used a Bayesian network to model a building fire from its onset to the structural collapse
of the building. This network included elements for the detection and automatic suppression
of fires and a node representing fire brigade intervention. A fire scenario is characterized in
terms of multiple interrelated variables, such as the ignition site, the nature of the fire, the fuel
configuration, the number and locations of the occupants, the characteristics of the structure,
and the ventilation, among others (Matellini et al. 2012). Several other studies have analyzed
the emergency levels in affected areas by evaluating the degrees of severity associated with
the affected areas (Sheu 2007; Ji and Zhu 2012).
    Despite the efforts in previous works, the above review of the current literature reveals
that there are few studies on incorporating dynamic disaster evaluation models into risk-
based emergence logistics. To address this research gap, the kernel of this paper includes
integrating models for predicting the fire propagation rates at fire sites, ranking the emergency
levels of and determining the emergency priorities of the fire sites, and finally allocating
resources and routing vehicles for suppression operations. The paper presents a new method
developed for fighting wildfires in a typical forest area in China in terms of emergency
logistics. By conducting careful calculations based on real data from wildfires that occurred
in the Daxingan Mountains on March 19th, 2003, and on June 29th, 2010, we verify the model
and demonstrate its advantages by comparing the findings with real-world observations.


3 Propagation model for wildfires in the daxingan mountains

A propagation model is used to calculate the impact of factors such as combustible materials,
weather conditions and terrain on forest-fire proliferation. Using a suitable propagation model
enables the spread pattern of wildfires in the mountain area of interest to be estimated, and
the suppression or daily protection effort to then be effectively implemented based on the
forecasted results. The most studied propagation models for this purpose are those for surface
fires because they are the most common type of wildfires in mountain areas. There are two
well-known classes of these models: real forest-fire models, in which adjacent trees catch fire
in a step-by-step manner, and simplified versions, which involve instantaneous combustion
(Iudin et al. 2015).
    The systematic propagation models are the Rothermel model, the McArthur model, the
Canadian propagation model and the Wangzhengfei propagation model (Sullivan 2009). The
Rothermel model simulates flame front propagation according to the principle of the conser-
vation of energy. This model has been widely applied in mountain areas, where combustible
materials are evenly distributed and the effects of large clusters of combustible materials can
be ignored (Rothermel 1983). However, because the Rothermel model is semi-experimental,


123
```

## Page 7

```text
Ann Oper Res (2019) 283:917–937                                                               923


certain parameters have to be obtained through experiments, and considerable input data are
needed. In most areas of China, this model cannot be used because of data unavailability
(Weise and Biging 1997; Perry 1998).
    The McArthur model, a mathematical description of McArthur’s gauge for measuring fire
risk, was developed by Noble et al. (1980). This model can be used to forecast fire weather
situations or to predict certain parameters of fire behavior. Because it can be used only in areas
where combustible materials exist in discrete units (e.g., grassplots or eucalyptus plantations),
it has typically been applied in areas with a Mediterranean climate and hence is not suitable
for areas with other climates (e.g., the Daxingan Mountains in China) (Chai et al. 1988; Yue
et al. 2007; Miao et al. 2012).
    In the Canadian forest-fire propagation model, combustible materials are divided into five
categories based on Canadian vegetation types: conifers, broad-leaved trees, mingled forest,
cutting bases and open ground. It is a statistical model, and the propagation rate equation was
determined by inspecting the attributes of 290 forest fires. Although the Canadian propaga-
tion model can clearly reproduce the entire evolution of a forest fire and forecast the flame
behavior and fire development pattern, it does not consider the heat transfer mechanisms of
the combustible materials. Because it lacks a physical basis, the model’s accuracy becomes
questionable when the actual conditions differ substantially from those corresponding to the
experimental data used to construct the model.
    The Wangzhengfei propagation model was developed based on real data from wildfires
                                                                                          ◦
in the Daxingan Mountains and is suitable for other areas with slopes of less than 60 (Yang
et al. 2011). Because the Daxingan Mountains exhibit an undulating topography with slopes
                ◦
of less than 15 accounting for 80% of the area, this model is selected to provide basic insights
for the updated fire propagation model in this work. The Wangzhengfei propagation model
is described as follows.
 • Model assumptions
A1: The initial fire propagation rate varies linearly with temperature and wind power;
                                                                                     ◦
A2: The target area exhibits an undulating topography, with no slope greater than 60 ;
A3: The target area contains regions of grassy marshland, secondary forest and coniferous
    forest;
A4: The weather data are available in a timely manner.
 • Model structure
                Fire propagation model: VF = V0 K S K W K ϕ = V0 K S K ϕ e0.1782Vw            (1)
                Initial propagation speed model: V0 = aT + bW + c                             (2)
   Here, VF is the flame spread rate (m/s), VW is the wind speed (m/s), V0 is the initial
flame spread rate (m/min), K S is a coefficient representing the different types of combustible
materials, W is the wind force (grade), K W is the coefficient of the wind force, K ϕ is the
coefficient of the geographic slope, ϕ is the slope, T is the temperature (◦ C); and a, b, and c
are parameters. Based on the research by Wang (1992), parameters a, b, and c in the Daxingan
Mountains are usually equal to 0.053, 0.048, and 0.275, respectively.
 • Variables and parameters
(1) Initial spread speed
    This quantity represents the physical and mechanical attributes of the combustible mate-
    rials and their degrees of wetness/dryness; its value is typically estimated by burning
    samples of combustible materials and by the present temperature and wind force.

                                                                                      123
```

## Page 8

```text
924                                                                                    Ann Oper Res (2019) 283:917–937


Table 1 Wind speeds and wind forces for a grassland region with zero slope

Wind grade          1                  2                    3                    4                   5                  6

Vw (m/s)                2                   3.6                 5.4                  7.4                  9.8               12.3
V F (m/min)             6.18               13.85             50.00                64.55                  83.33          144.33
Wind grade              7                   8                   9                 10                     11                 12
Vw (m/s)             14.9                  17.7              20.8                 24.2                   27.8               29.8
V F (m/min)         250.00             353.55               500.00               599.02              625.00             833.00


Table 2 K φ values corresponding to different slopes

Slopes −42◦ to −38◦         −37◦ to −33◦          −32◦ to −28◦        −27◦ to −23◦         −22◦ to −18◦          −17◦ to −13◦
Kφ         0.07             0.13                  0.21                0.32                 0.46                  0.63
Slopes −12◦ to −8◦          −7◦ to −3◦            −2◦ –2◦             3◦ –7◦               8◦ –12◦               13◦ –17◦
Kφ         0.83             0.90                  1.00                1.20                 1.60                  2.1
Slopes 18◦ –22◦             23◦ –27◦              28◦ –2◦             33◦ –37◦             38◦ –42◦
Kφ         2.9              4.1                   6.2                 10.1                 17.5



 (2) Coefficients for different types of combustible materials
     These quantities represent the degree of inflammability of each material and its
     suitability for burning. The main types of combustible materials present in the Daxin-
     gan Mountains are marshy grassland, secondary forest and coniferous forest. The
     corresponding coefficients are therefore K s marshy = 1.0, K s secondary = 0.7, and
     K s coniferous = 0.4 (Wang 1992).
 (3) Coefficient of the wind force
     A higher wind speed results in more rapid spreading of flames following the wind, i.e.,
     a higher wind-induced yield value K w . For a grassland region with zero slope, the VF
     values corresponding to wind forces of grades 1–12 are listed in Table 1 (Wen and Liu
     1994).

(4) Coefficient of the geographic slope
    This parameter is one of the most important factors affecting fire propagation. The impact
    of the slope on the propagation speed K φ is summarized in Table 2 (Wen and Liu 1994).



4 Relief allocation and vehicle routing model

Relief allocation and delivery models consider the demand at each fire site and the trans-
portation of supplies to these sites by allocated vehicles. The vehicles begin their itineraries
at depots and may serve several wildfire sites along their own routes. During this phase,
the demand quantities and location uncertainties are the major factors influencing rational
decisions.
   Because allocation and delivery decisions determine the suppression efficiency, optimizing
these decisions together based on different fire scenarios is necessary. During the suppres-
sion operations, various supplies are needed at different fire sites, and a rescue depot may

123
```

## Page 9

```text
Ann Oper Res (2019) 283:917–937                                                                 925

Fig. 1 Rescue operation for fast
propagation




Fig. 2 Rescue operation for slow
propagation




store many different types of emergency resources. There are two main types of emergency
resources that are needed to combat wildfires: fire-fighting forces and fire-fighting equipment.
Emergency logistics involving wildfires include the storage, transportation and delivery of
rescue resources and the use and management of the equipment and materials. Among the
activities, the most fundamental are the transportation and scheduling of the fire-fighting
forces.

4.1 Problem statement

Rescue commanders optimize the allocation of suppression resources and the routing of
vehicles based on the rate of fire propagation at each site (10 m/min is the critical rate) (Yao and
Wen 2002). In the case of rapid propagation (VF > 10 m/min), the rescue commanders may
arrange several vehicles to transport suppression resources to each fire site to minimize total
losses (Fig. 1). When the fire propagation rate is slow (VF <= 10 m/min), the commanders
may send resources to several fire sites via one vehicle (Fig. 2) (Zhang 2007; Sun et al. 2007).
This work investigates the resource allocation and vehicle dispatch problems for both cases.

                                                                                        123
```

## Page 10

```text
926                                                                 Ann Oper Res (2019) 283:917–937


4.2 Optimization model for rapid fire propagation

Suppose that a system for the transportation of suppression recourses for combating a wildfire
consists of a single depot S (with capacity s) and I fire sites (demand points with demands
di (i = 1, 2, . . ., I ) for each site).
    For the allocation and transport of the resources, both efficiency and equity should be
considered; i.e., resources should be delivered to the demand sites as soon as possible, and
each demand site should receive them on a just-in-need basis. During the suppression period,
the decision makers must maximize the total benefit from all fire sites. Therefore, they should
rank the severities of the fire sites based on the consequences of the fire accidents and damage
attributes to allocate and deliver resources accordingly. Consequently, fire propagation rate
becomes the main attribute of concern, as sites where the propagation is more rapid will
suffer more serious damage and thus should be given a higher priority.

4.2.1 Model assumptions

A1: Flames spread evenly from each fire site, with a spread radius that is proportional to
    the burn time;
A2: The quantity of suppression resources is represented in combined units of fire-fighting
    resources in a way that the number of firemen and the amount of materials in each unit
    are fixed;
A3: The suppression efficiency of all firemen is the same;
A4: The rescue vehicles are identical in terms of their type and travel speed;
A5: The flame propagation speed can be estimated and pre-defined using the model;
A6: The supplies/resources available from the depot are sufficient to satisfy the demands at
    all fire sites.

4.2.2 Variables and parameters

C1 is the loss of burning a unit of forest (hm2 ) in monetary terms, C2 is the time cost of a
combined suppression resource unit, C3 is the cost of transporting one combined resource
unit, X i is the number of combined resource units allocated to fire point i, ti1 is the time
at which suppression begins at fire site i, ti2 is the time at which the fire at fire site i is
extinguished, VFi is the fire propagation speed at fire site i, B(ti ) is the burned area at fire
site i in period t, C(ti ) is the loss due to fire at site i in period t, N is the number of firemen
in a combined resource unit, Vi is the speed of suppression, VT is the travel speed of an
emergency vehicle, di is the distance from the depot to fire site i, Ai is the number of firemen
allocated to site i, and X i∗ is the optimal number of combined resource units to allocate to
fire site i.

4.2.3 Model formulation

Let the time of ignition at fire site i be ti0 = 0; then, the time at which the firemen arrive
at the fire site is ti1 = di /VT . From A1, we know that the change in the burned area B(ti )
is continuous to the first order. In other words, the rate of increase is d B(ti )/dti . Generally,
the burning speed will decrease once the firemen begin the suppression operations. At fire
site i, after fire-fighting begins at time ti1 , the propagation rate will decrease until the fire is
extinguished at time ti2 . The burned area is represented by the triangle in Fig. 3 and can be
calculated as follows:

123
```

## Page 11

```text
Ann Oper Res (2019) 283:917–937                                                                     927

Fig. 3 The area of the burned                  dB (t )
forest at a fire site
                                                dt




                                                                        t1                     t2     t




                          
             d B(ti )         VFi ti , 0 ≤ ti ≤ ti1 , i = 1, 2, ..., I
                      =                                                                             (3)
               dti            VFi ti − Vi X i (ti − ti1 ), ti1 ≤ ti ≤ ti2 , i = 1, 2, ..., I

            i)
when d B(t
         dti |ti =ti2 = 0, ti2 = ti1 + V Fi ti1 /(Vi X i − V Fi ), i = 1, 2, ..., I , the corre-
sponding area can be calculated as follows: B(ti2 ) = VFi ti1         2 /2 + V 2 t 2 /2(V X −
                                                                                 Fi i1      i i
VFi ), i = 1, 2, ..., I .
   In suppression, there are two kinds of costs: (1) the disposable costs of transporting
suppression materials and (2) the costs of the suppression tools and the salaries of the workers.
Thus, the total loss from a wildfire can be calculated as follows:
                                        
                   2
             VFi ti1           2 t2
                             VFi  i1             C2 VFi ti1 X i
C(X i ) =             +                    C1 +                 + C3 X i Ni , i = 1, 2, ..., I (4)
                2       2(Vi X i − VFi )         Vi X i − VFi

  The value X i∗ corresponding to the extremum of Eq. (4) is the necessary number of vehicles.
                     
         VFi      1
  X i∗ =     +         (C1 VFi
                            2 V t 2 + 2C V 2 t 2 )/2C N , i = 1, 2, ..., I
                               i i1       2 Fi i1     3                                    (5)
         Vi       Vi
                                                                      
                        VFi     1
  Ai = Ni X i∗ = Ni          +       (C1 VFi
                                           2 V t 2 + 2C V 2 t 2 )/2C N , i = 1, 2, ..., I
                                              i i1      2 i F i1     3
                         Vi    Vi
                                                                                           (6)

   In this suppression scheme, the earliest time that the fire can be extinguished is calculated
as follows:

      T = Max {t12 , t22 , ..., tk2 }
                                                                                         
                               VF1 t11             VF2 t21                     VF I t I 1
        = M AX t11 +                    , t21 +              , ..., t I 1 +                 ,
                           Vi X 1 − VF1         Vi X 2 − VF2                Vi X I − VF I
                 i = 1, 2, ..., I                                                                   (7)

4.3 Optimization model for slow fire propagation

Because suppression resources must be transported within a certain time window and because
the transportation cost is directly proportional to the distance that a vehicle travels, the
allocation of suppression resources is a VRP concerning the routing of vehicles from the
rescue depot to the fire sites under the constraints placed by the vehicles’ loading capacities
(Wang et al. 2008; Zhu et al. 2007)

                                                                                               123
```

## Page 12

```text
928                                                                  Ann Oper Res (2019) 283:917–937


4.3.1 Model assumptions

A1: The depot possesses sufficient vehicles, and each vehicle’s loading capacity is fixed;
A2: The demands at the fire sites can be estimated based on the fire propagation rate;
A3: Each vehicle’s travel speed is fixed, and the transport time is equal to the vehicle’s travel
    time (loading/unloading times are not taken into account);
A4: A fire site with a faster propagation rate is considered to be suffering more severe fire
    damage and should be given a higher priority.

4.3.2 Variables and parameters

Let S represent the depot. D = {i|i = 1, 2, ..., I } is the set of fire sites; C = {m|m =
1, 2, ..., M} is the set of emergency vehicles; A = S ∪ D is the set of all nodes, including the
depot and the fire sites; C m is the fixed cost of vehicle m; Cimj is the unit time cost of vehicle
m traveling from i to j; di j is the distance between i and j; Q m is the approved loading
capacity of vehicle m; VFi is the fire propagation speed at fire site i; V1 is the fire-fighting
speed of the firemen; u i is the demand at fire site i (in terms of combined resource units);
u i = Ri /Vi1 ; tim is the time at which vehicle m arrives at fire site i; tiL is the latest time for
the arrival of suppression materials at fire site i; timj is the time required for vehicle m to travel
from i to j; and Vimj is the average travel speed of vehicle m from i to j.
                                              
                  1 vehicle mis used             1 vehicle m from site i to j (i  = j)
        xm =                          ; Yimj =                                              .
                  0 otherwise                    0 otherwise



4.3.3 Model formulation


                                  Min: F1 =                     tm                                (8)
                                                   m∈C       i∈D i
                                                                                   di j m
               Min: F2 =                xmCm +                              C mj        y         (9)
                                m∈C                 m∈C       i∈A     j∈A          Vimj i j
                                ym −             y m = 0, ∀m ∈ C, ∀h ∈ I                         (10)
                             i∈A i j          i∈A h j
                                                       ym > 0                                    (11)
                                            j∈D    m∈C S j

                                               y m u j ≤ Q m , ∀m ∈ C                            (12)
                                  i∈A       j∈D i j

                                                    yimj u j ≤ Q s                               (13)
                                    m∈C i∈A j∈D
                              tim = t m
                                      j + t ji y ji , ∀i, j ∈ A, ∀m ∈ C
                                            m m
                                                                                                 (14)
                                     tim ≤ tiL , ∀i ∈ D, ∀m ∈ C                                  (15)
                                 yi j = {0, 1}, ∀i, j ∈ A, ∀m ∈ C
                                  m
                                                                                                 (16)
                                        xm
                                             = {0, 1}, ∀m ∈ C                                    (17)
   In a suppression operation, both suppression speed and cost should be considered; thus,
when the fire is propagating slowly, the optimization model may have two objectives. Equation
(8), which is the primary objective, minimizes the total travel time of the emergency vehicles.

123
```

## Page 13

```text
Ann Oper Res (2019) 283:917–937                                                                  929


Table 3 Meteorological data at the fire sites

                             WDH (i = 1)           XGS (i = 2)         NDL (i = 3)       597H (i = 4)

Av. temperature (◦ C)        6                     7                   5.5               6
Av. wind speed (m/s)         7.5                   6.2                 5.1               5.5
Av. wind force (G)           4                     4                   3                 3


Table 4 Geographical data at the fire sites

                                     WDH (i = 1)         XGS (i = 2)       NDL (i = 3)   597H (i = 4)

Slope (◦ )                           0                   15                2             10
Types of combustible materials       Grassland           Grassland         Grassland     Grassland
Dis. to rescue depot (km)            24.7                30.5              31.2          28.6



Equation (9), which is the secondary objective, minimizes the total cost of the emergency
vehicles. The constraints are as follows.
    Equation (10) means that each vehicle will depart immediately after unloading at a fire
site. Equation (11) means that the rescue depot S possesses sufficient vehicles to dispatch.
Equation (12) means that the demand at any fire sites should be less than the vehicle capacity.
Equation (13) means that the sum of the demands at all fire sites should be less than the
inventory of depot S. Equation (14) means that the travel time from depot S to fire site j is
equal to the combination of the time of the vehicle’s arrival at site iwith the travel time from
i to j. Equation (15) means that the time of a vehicle’s arrival at a fire site should be earlier
than the latest time at which the site requires the resources.


5 Case study

5.1 Case of rapid propagation

 1. Fire attributes

According to the database of the Wildfires Prevention Headquarters of the Heilongjiang
province and the Scientific Data Share Center of the China Meteorological Administration,
a large-scale wildfire occurred in the Nanweng River area in the Daxingan Mountains at
10:35 on March 19th 2003. There were 4 fire sites in total: Wuoduhe (WDH), Xiaogushan
(XGS), Naduli (NDL) and 597-Highland (597H). The areas are mainly covered by marshy
grassland, brushwood and forest. The total affected area was 133, 008 hm2 , consisting of
240 hm2 of burned forestland and 132, 768 hm2 of barren mountain grassland. The suppres-
sion operation was undertaken by 385 professional firemen and 1936 forest rangers. The fire
was extinguished at 13:50 on May 23rd, 2003. Some of the detailed information that was
obtained is shown in Tables 3 and 4. Other parameters were evaluated based on the interviews
with the workers in the Forestry Bureau of the Daxingan Mountains and were as follows:
c1 = 15 Yuan, c2 = 1.3 Yuan, c3 = 0.82 Yuan, v2 = 100 km/h, v1 = 12.5 m/min, and
N = 3 persons.



                                                                                         123
```

## Page 14

```text
930                                                                 Ann Oper Res (2019) 283:917–937


Table 5 Allocation scheme for emergency supplies

                                   WDH (i = 1)      XGS (i = 2)        NDL (i = 3)       597H (i = 4)

Number of combinations             1804             3951               1350              2196
 (unit)
Number of firemen (people)         5412            11854               4049              6588
Cost for fire-fighting (yuan)      4718.4          10332.9             3529.3            5743.2
Shortest extinguish fire time          15.4            18.9               19.3              17.8
 (m)


Table 6 Comparison of real and optimized results

           Time to extinguish Combinations    Needed firemen      Cost for fire-     Expense of forest
           fire                                                   fighting           resources

Actual     2.0 months           3897          16,143 persons      2,296 Yuan         1,995,120 Yuan
Optimal 19.3 h                  9301          27,903 persons      24,324 Yuan        1,803,611 Yuan



2. Solution results
According to the models presented above [i.e., Eqs. (3, 4)], the propagation rates at the four
fire sites (WDH, XGS, NDL and 597H) were VF1 = 179.38 m/min, VF2 = 318.94 m/min,
VF3 = 105.84 m/min, and VF4 = 188.64 m/min, respectively. The calculated allocation
results for the combined suppression resource units and firemen teams are listed in Table 5.
Comparing Table 5 with Table 6 reveals that with the optimized allocation of the combined
suppression resource units and firemen teams, the wildfires could have been extinguished
in a much shorter period of time. The shortest time required for putting out the fire at a
single site is found to be 19.3 h. Compared with the actual period of 2 months, the optimized
resource allocation and transportation scheme is much more efficient, albeit higher in cost. In
the optimized analysis, 27,903 firemen are needed, which is 10,000 more than the number of
firemen who participated in the real case, and the number of combined fire-fighting resource
units is 9,301, which is 4 times greater than the actual number used. However, the higher cost
may be well justified by the actual loss of forest resources suffered.

5.2 Case of slow propagation

1. Description of the wildfire
At 10:40 on June 29th 2010, a wildfire was caused by lightning strikes in the Huzhong zone
in the region administered by the Huzhong Forest Administrative Bureau. There were 7 fire
sites: 1231-Highland (1231H), H311 Line (H311), X59 Line (X59), H59 Line (H59), LWM12
Line (LWM12), LWM3 Line (LWM3) and T6 Line (T6). The area involving the fires was
approximately 138.5 hm2 . The suppression activities were undertaken by 500 professional
firemen and 140 forest rangers. The wildfire was extinguished on July 3rd. The distances
between fire sites and the meteorological and geographical data, which were obtained from
the Forestry Bureau of the Daxingan Mountains, are provided in Tables 7, 8 and 9.
    The Huzhong Forest Administrative Bureau fire station used 3 vehicles to send suppression
materials to the 7 fire sites. The capacity of each vehicle was 9 tons, and the travel speed was
100 km/h. The fixed cost and unit time cost of each vehicle were 150 Yuan and 100 Yuan/h,

123
```

## Page 15

```text
Ann Oper Res (2019) 283:917–937                                                                                   931


Table 7 Distances between fire sites

                 Depot        1231H         H31           X59          H59         LWM12          LWM3            T6

Depot             0           42            56            63           65          50             66              45
1231H            42              0          20            33           45          35             48              64
H31              56           20                0         46           53          44             42              58
X59              63           33            46             0           60          55             52              54
H59              65           45            53            60            0          62             64              56
LWM12            50           35            44            55           62              0          65              66
LWM3             66           48            42            52           64          65             0               63
T6               45           64            58            54           56          66             63                0


Table 8 Meteorological data at the fire sites

                              Depot         1231H         H31          X59         H59     LWM12             LWM3

A. temperature (◦ C)          25            23            22           26          24      23                22
A. wind speed (m/s)           3.6           2              2           3.6         3.6     3.6                2
A. wind force (Grade)         2             1              1           2           2       2                  1


Table 9 Geographical data at the fire sites

                         Depot          1231H       H31           X59          H59         LWM12         LWM3

Slope (◦ )               10             2           5             15           13          8             8
Type of                  Meadow         Meadow      Meadow        Meadow       Meadow      Meadow        Meadow
 combustibles
Time limit (h)           4              6           6             3            4           5             6


Table 10 Fire propagation rates at the seven fire sites

                                     Base   1231H          H31          X59        H59     LWM12             LWM3

Propagation rate (m/min)             5.16   2.20           2.55         6.98       6.56    4.83              3.40



respectively. One combined resource unit consisted of two instruments, one water cannon,
one water pump and three firemen. The weight of one combined resource unit was 1000 kg,
and the suppression speed was 2.5 m/min.

 2. Results of the allocation model

The fire propagation rates at the 7 fire sites were calculated using the above propagation
model (i.e., Eqs. (3, 4)), and the results are shown in Table 10.
    Based on these speeds, the rescue priorities were ranked. A site with a higher priority
ranking requires suppression materials more urgently. Therefore, the emergency vehicles
should proceed from sites with higher scores to sites with lower ones. With the depot coded
as 0, the demands calculated according to the suppression speed and the fire propagation rate
at the fire sites are shown in Table 11 in terms of combined resource units.

                                                                                                       123
```

## Page 16

```text
932                                                                 Ann Oper Res (2019) 283:917–937


Table 11 Demands for               Priority ranking    Fire point                      Demand
emergency materials at the seven                                                       combination
fire sites
                                   1                   H59 line (point 1)               3
                                   2                   SWM12 line (point 2)             3
                                   3                   1231 highland (point 3)          2
                                   4                   SWM3 line (point 4)              2
                                   5                   T6 line (point 5)                1
                                   6                   X59 line (point 6)               1
                                   7                   H31 line (point 7)               1



3. Vehicle routes
The VRP model could be effectively solved using an immune clonal algorithm (ICA) (Ma
et al. 2009). The ICA, which is derived from the traditional evolutionary algorithm, introduces
the mechanisms of avidity maturation, cloning and memorization. The performance of the
corresponding operators is characterized by rapid convergence and a good global search
capability. The property of rapid convergence to a global optimum of ICA is used to accelerate
the searching for the most suitable subset among a number of vehicle routing plans (Zhang
et al. 2005). The parameters of the algorithm were denoted as follows: initial population of
an immune body, N =100; number of codes in each immune body, ai (it) = 21; terminating
generation, gmax = 100; clone ratio, q = 5; the expected remaining population of an immune
body, Nn = 20.
    Given that objective 1 (i.e., Eq. (8)) carries much more importance than objective 2 (i.e.,
Eq. (9)) in the decision-making process, we assigned them different weights, w1 = α = 0.9
and w2 = (1 − α) = 0.1, to combine them into the integrated objective function F =
αF1 + (1 − α)F2 . After 50 generations of calculations, the output results were obtained as
follows.
1. The optimal routes of the 3 vehicles were found to be 0 → 1 → 5 → 0 (for Vehicle 1),
   0 → 2 → 6 → 0 (for Vehicle 2), and 0 → 3 → 4 → 7 → 0 (for Vehicle 3). The total
   transportation time of all vehicles is 6.05 h, and the corresponding cost is 6720 Yuan.
2. The vehicle arrival time, transportation costs and travel distances on each path are listed
   in Table 12.
    The results indicate that the vehicles can reach all the fire sites in less than 2 h without
compromising the efficiency of suppression. Meantime, on each path, a site with more severe
fire conditions will be given a higher priority. The vehicles always travel from high priority
sites to the low priority sites.


6 Discussions and conclusions

This paper proposes a new two-layer emergency logistics system for wildfire suppression
involving a single depot and multiple demand sites. The real case analysis substantiates that
during a wildfire suppression operation, the plans for allocating and transporting suppression
resources have a strong impact on the efficiency of the operations. Compared with the existing
findings in Lee et al. (2012), the resource deployment is optimized and shifted from the
planning sites with the highest fire burned areas to the planning sites with the highest standard

123
```

## Page 17

```text
Ann Oper Res (2019) 283:917–937                                                                  933


Table 12 Vehicle routes and the corresponding costs and distances

                     Vehicle   R-0    F-1     F-2    F-3    F-4     F-5    F-6    F-7    R-0    Sum.

Arrival time         1                0.65    –      –      –       1.21   –      –      1.66   1.86
                     2                –       0.5    –      –       –      1.05   –      1.68   1.55
                     3                –       –      0.42   0.90    –      –      1.32   1.88   2.64
Trans. cost (yuan)   1         –      –       –      –      –       –      –      –      –      2160
                     2         –      –       –      –      –       –      –      –      –      2180
                     3         –      –       –      –      –       –      –      –      –      2380
Trans. dis. (km)     1                65      –      –      –       121    –      –      166    166
                     2                –       50     –      –       –      105           168    168
                     3                –       –      42     90      –      –      132    188    188




response requirements (i.e., highest priority). As a result, the optimal resource allocation and
vehicle routing plans based on our optimization model are a better solution compared to the
existing findings in the literature. Thus, the proposed optimization models provide powerful
insights into emergency logistics planning for wildfire suppression operations. Because of the
high research demand on emergency logistics for dynamic disaster relief (taking into account
risk evolution), the findings from this study can also be generalized to tackle other logistics
resource optimization issues in dynamic operational environments, particularly those sharing
the same feature of a single supply and multiple demands in logistics planning and operations
(e.g., allocation of ambulances and police forces).
The major contributions of this work are the ability of the models to analyze the emergency
logistics operations by considering different fire propagation patterns and the factors affecting
those patterns. Fire propagation models are constructed to calculate the fire propagation rate
and the damaged area at each fire site. The outcomes can serve as suitable criteria for deter-
mining the priority of demand for suppression resources. An emergency logistics delivery
plan based on dynamic fire propagation behavior is applied to address wildfire suppression
in real time. According to historical data from wildfires that occurred in the Daxingan Moun-
tains, two case studies are analyzed to verify the proposed models and validate the findings
that different logistics planning schemes should be adopted for wildfire accidents with dif-
ferent fire propagation rates. The optimal results based on minimizing the disaster losses
and logistics costs in the case of slow propagation demonstrate that transporting suppression
resources to several fire sites using a single vehicle is more effective. In this case, the VRP is
the most important concern. By contrast, in the case of rapid fire propagation, each fire site
must be served by one or more dedicated vehicles; therefore, matching the fire sites to the
corresponding vehicles is the most important consideration.
    The study left some problems unsolved. First, when combining objective 1 and objective
2 into the integrated objective function, we consider α to be 0.9 in the empirical study and
analyzed the case in which objective 1 carries much more importance than objective 2 in the
decision process. Assigning α different values in a sensitivity analysis to test its influence on
the final decision could reveal the optimal solutions in dynamic and different scenarios and
thus aid in better decision making. Second, in the fire propagation model, we use the flame
spread rate as the dominant indicator to predict the fire development pattern; however, several
other indicators (e.g., fire intensity and flaming area et al.) could possibly have some effects
on the fire propagation trend. Therefore, investigating how their individual/combined effects

                                                                                         123
```

## Page 18

```text
934                                                                         Ann Oper Res (2019) 283:917–937


influence the accuracy of the fire propagation model is a worthwhile future direction. Finally,
in the relief allocation and vehicle routing model, the impact of the conditions of wildfires
suppression paths on the optimization results can be further investigated. Given that the
conditions of the suppression paths may also affect the total cost of the emergency vehicles,
a comparative study of the relief allocation problem and VRP under different suppression
path conditions based on the existing research would be interesting.
    Our possible future research plan includes studies of the relief allocation problem and VRP
for wildfire suppression with multiple depots and a single demand site or multiple depots
and multiple demand sites. This research plan may also involve comparative analysis the
suitability of different optimization algorithms (e.g., the ant-colony algorithm and genetic
algorithm) for solving these kinds of relief allocation and vehicle routing issues.

Acknowledgements The authors would like to thank the State Key Program of National Natural Science
Foundation of China [grant number 71431001], the Fundamental Research Funds for the Central Universities
of China [grant number 3132016303], and the EU FP7 Marie Curie IRSES project “ENRICH” (PIRSES-GA-
2013-(612546)) for theirs financial support.

Open Access This article is distributed under the terms of the Creative Commons Attribution 4.0 Interna-
tional License (http://creativecommons.org/licenses/by/4.0/), which permits unrestricted use, distribution, and
reproduction in any medium, provided you give appropriate credit to the original author(s) and the source,
provide a link to the Creative Commons license, and indicate if changes were made.



References
Ager, A., Preisler, H. K., Arca, B., Spano, D., & Salis, M. (2014). Wildfire risk estimation in the Mediterranean
     area. Environmetrics, 25, 384–396.
Alem, D., Clark, A., & Moreno, A. (2016). Stochastic network models for logistics planning in disaster relief.
     European Journal of Operational Research, 255(1), 187–206.
Altay, N., & Green, W. G. (2006). OR/MS research in disaster operations management. European Journal of
     Operational Research, 175(1), 475–493.
Altay, N., & Labonte, M. (2014). Challenges in humanitarian information management and exchange: Evidence
     from Haiti. Disasters, 38(S1), 50–72.
Altay, N., & Pal, R. (2014). Information diffusion among agents: Implications for humanitarian operations.
     Production and Operations Management, 23(6), 1015–1027.
Balcik, B., & Beamon, B. M. (2008). Facility location in humanitarian relief. International Journal of Logistics
     Research and Applications, 11(2), 101–121.
Barbarosoğlu, G., Özdamar, L., & Çevik, A. (2002). An interactive approach for hierarchical analysis of
     helicopter logistics in disaster relief operations. European Journal of Operational Research, 140(1),
     118–133.
Buscarino, A., Famoso, C., Fortuna, L., Frasca, M., & Xibilia, M. G. (2015). Complexity in forest fires:
     From simple experiments to nonlinear networked models. Communication Nonlinear Science Numerical
     Simulation, 22, 660–675.
Caunhye, A. M., Nie, X., & Pokharel, S. (2012). Optimization models in emergency logistics: A literature
     review. Socio-Economic Planning Sciences, 46(1), 4–13.
Caunhye, A. M., Zhang, Y. D., Li, M. Z., & Nie, X. F. (2016). A location-routing model for prepositioning and
     distributing emergency supplies. Transportation Research Part E: Logistics and Transportation Review,
     90, 161–176.
Chai, R. H., Zhao, Y. S., & Du, X. W. (1988). Studies on predicting model of grassland fire spread. Journal of
     Northeast Forestry University, 16(4), 90–94.
Chang, M. S., Tseng, Y. L., & Chen, J. W. (2007). A scenario planning approach for the flood emergency
     logistics preparation problem under uncertainty. Transportation Research Part E: Logistics and Trans-
     portation Review, 43(6), 737–754.
Charles, A., Lauras, M., Van Wassenhove, L. N., & Dupont, L. (2016). Designing an efficient humanitarian
     supply network. Journal of Operations Management, 47, 58–70.




123
```

## Page 19

```text
Ann Oper Res (2019) 283:917–937                                                                                935


Christie, P. M. J., & Levary, R. R. (1998). The use of simulation in planning the transportation of patients to
      hospitals following a disaster. Journal of Medical Systems, 22(5), 289–300.
Chu, G., & Wang, J. (2012). Study on probability distribution of fire scenarios in risk assessment to emergency
      evacuation. Reliability Engineering & System Safety, 99(3), 24–32.
FEMA, (2004). The four phases of disaster. FEMA—Federal Emergency Management Agency.
      http://www.google.co.uk/?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwjM59 LnmY-
      TOAhVFL8AKHblUD_oQFgglMAA&=http%3A%2F%2Fwww.training.fema.gov%2Femiweb%2Fdo
      wnloads%2Fis10_unit3.doc&usg=AFQjCNFWEiNJMLoc5nVju-zL6BBHT-DvkA Accessed on 20 July
      2016.
Fiedrich, F., Gehbauer, F., & Rickers, U. (2000). Optimized resource allocation for emergency response after
      earthquake disasters. Safety Science, 35(1), 41–57.
García, C., Woodard, P., Titus, S., Adamowicz, W., & Lee, B. (1995). A logit model for predicting the daily
      occurrence of human caused forest-fi res. International Journal Wildland Fire, 5, 101–111.
Guha-Sapir, D., & Santos, I. (2012). The economic impacts of natural disasters. Oxford: Oxford University
      Press.
Guikema, S. D. (2009). Natural disaster risk analysis for critical infrastructure systems: An approach based
      on statistical learning theory. Reliability Engineering and System Safety, 94(4), 855–860.
Gutjahr, W. J., & Nolz, P. C. (2016). Multicriteria optimization in humanitarian aid. European Journal of
      Operational Research, 252(2), 351–366.
Haghani, A., & Oh, S. C. (1996). Formulation and solution of a multi-commodity, multi-modal network flow
      model for disaster relief operations. Transportation Research Part A, 30(3), 231–250.
Holicky, M., & , J. (2000). Fire safety assessment using Bayesian causal network. In Cottam, Harvey, Pape,
      and Tait (Eds.), Foresight and Precaution (pp. 1301–1306).
Hoyos, M. C., Morales, R. S., & Akhavan-Tabatabaei, R. (2015). OR models with stochastic components in
      disaster operations management: A literature survey. Computers & Industrial Engineering, 82, 183–197.
Hu, Z. H., & Sheng, Z. H. (2015). Disaster spread simulation and rescue time optimization in a resource
      network. Information Sciences, 298, 118–135.
Huang, X., & Song, L. (2016). An emergency logistics distribution routing model for unexpected events.
      Annals of Operations Research. doi:10.1007/s10479-016-2300-7.
Iudin, D. I., Sergeyev, Y. D., & Hayakawa, M. (2015). Infinity computations in cellular automaton forest-fire
      model. Communication Nonlinear Science Numerical Simulation, 20, 861–870.
Jacobson, E. U., Argon, N. T., & Ziya, S. (2012). Priority assignment in emergency response. Operations
      Research, 60(4), 813–832.
Ji, G. J., & Zhu, C. H. (2012). A study on emergency supply chain and risk based on urgent relief service in
      disasters. Systems Engineering Procedia, 5, 313–325.
Jin, S., Jeong, S., Kim, J., & Kim, K. (2015). A logistics model for the transport of disaster victims with various
      injuries and survival probabilities. Annals of Operations Research, 230(1), 17–33.
Krawchuk, M. A., & Moritz, M. A. (2014). Burning issues: Statistical analyses of global fire data to inform
      assessments of environmental change. Environmetrics, 25(6), 472–481.
Le Page, Y., Morton, D., Bond-Lamberty, B., Pereira, J. M. C., & Hurt, G. (2014). HESFIRE: An explicit fi re
      model for projections in the coupled humane earth system. Bio-geoscience Discussion, 11, 10779–10826.
Lee, Y., Fried, J. S., Albers, H. J., & Haight, R. G. (2012). Deploying initial attack resources for wildfire
      suppression: Spatial coordination, budget constraints, and capacity constraints. Canadian Journal of
      Forest Research, 43(1), 56–65.
Lei, L., Pinedo, M., Qi, L., Wang, S. B., & Yang, J. (2015). Personal scheduling and supplies provisioning in
      emergency relief operations. Annals of Operations Research, 235(1), 487–515.
Liberatore, F., Pizarro, C., Blas, C., Ortuo, M., & Vitoriano, B. (2013). Uncertainty in humanitarian logistics
      for disaster management. A review. In B. Vitoriano, J. Montero, & D. Ruan (Eds.), Decision aid models
      for disaster management and emergencies (Vol. V7, pp. 45–74)., Atlantis computational intelligence
      systems Amsterdam: Atlantis Press.
Ma, J., Gao, L., & Shi, G. (2009). An improved immune clonal selection algorithm and its applications for
      VRP. In 2009 IEEE International Conference on Automation and Logistics (pp. 2097–2100). IEEE.
Mandallaz, D., & Ye, R. (1997). Prediction of forest fires with Poisson models. Canadanian Journal of Forest
      Research, 27, 1685–1694.
Martínez, J., Vega-García, C., & Chivieco, E. (2009). Human-caused wildfire risk rating for prevention planning
      in Spain. Journal Environmental Management, 90, 1241–1252.
Matellini, D. B., Wall, A. D., Jenkinson, I. D., Wang, J., & Pritchard, R. (2013). Modelling dwelling fire
      development and occupancy escape using Bayesian network. Reliability Engineering and System Safety,
      114, 75–91.




                                                                                                     123
```

## Page 20

```text
936                                                                        Ann Oper Res (2019) 283:917–937


Matellini, D. B., Wall, A. D., Jenkinson, I. D., Wang, J., & Pritchard, R. (2012). A Bayesian network model
      for fire development and occupant response within dwellings. In G. Be’ renguer & S. Guedes (Eds.),
      Advances in safety, reliability and risk management: ESREL 2011. London: Taylor and Francis Group.
Miao, S. X., Huang, Y., Zhang, B., & Sun, H. Y. (2012). Improvement of the forest fires simulation algorithm
      based on the Rothermel model. Geomatics World, 6, 14–21.
Noble, I. R., Gill, A. M., & Bary, G. A. V. (1980). McArthur’s fire-danger meters expressed as equations.
      Australian Journal of Ecology, 5(2), 201–203.
Oloruntoba, R. (2010). An analysis of the Cyclone Larry emergency relief chain: Some key success factors.
      International Journal of Production Economics, 126(1), 85–101.
Oloruntoba, R., Hossain, G. F., & Wagner, B. (2016). Theory in humanitarian operations research. Annals of
      Operations Research. doi:10.1007/s10479-016-2378-y.
Özdamar, L., Ekinci, E., & Küçükyazici, B. (2004). Emergency logistics planning in natural disasters. Annals
      of Operations Research, 129, 217–245.
Özdamar, L., & Ertem, M. A. (2015). Models, solutions and enabling technologies in humanitarian logistics.
      European Journal of Operational Research, 244(1), 55–65.
Pedraza-Martinez, A. J., & Wassenhove, L. N. V. (2012). Transportation and vehicle fleet management in
      humanitarian logistics: Challenges for future research. Euro Journal on Transportation & Logistics,
      1(1–2), 185–196.
Perry, G. L. W. (1998). Current approaches to modelling the spread of wild land fire a review. Progress in
      Physical Geography, 22, 222–245.
Plucinski, M. P., Gould, J. S., Mccarthy, G. J., & Hollis, J. J. (2012). The effect of aerial suppression on the
      containment time of Australian wildfires estimated by fire management personnel. International Journal
      of Wildland Fire, 21(3), 219–229.
Powell, J. H., Mustafee, N., Chen, A. S., & Hammond, M. (2016). System-focused risk identification and assess-
      ment for disaster preparedness: Dynamic threat analysis. European Journal of Operational Research,
      254(2), 550–564.
Rathi, A. K., Solanki, R. S., & Church, R. L. (1992). Allocating resources to support a multicommodity flow
      with time windows. Logistics & Transportation Review, 28(2), 167–188.
Rawls, C. G., & Turnquist, M. A. (2012). Pre-positioning and dynamic delivery planning for short-term
      response following a natural disaster. Socio-Economic Planning Sciences, 46, 46–54.
Rezaei-Malek, M., Tavakkoli-Moghaddam, R., Cheikhrouhou, N., & Taheri-Moghaddam, A. (2016). An
      approximation approach to a trade-off among efficiency, efficacy, and balance for relief pre-positioning
      in disaster management. Transportation Research Part E: Logistics and Transportation Review, 93,
      485–509.
Rodríguez-Espíndola, O., Albores, P., & Brewster, C. (2017). Disaster preparedness in humanitarian logistics:
      A collaborative approach for resource management in floods. European Journal of Operational Research.
Rodrigues, M., Riva, J. D. L., & Fotheringham, S. (2014). Modeling the spatial variation of the explanatory
      factors of human-caused wildfires in Spain using geographically weighted logistic regression. Applied
      Geography, 48(2), 52–63.
Rothermel, R. C. (1983). A mathematical model for predicting fire spread in wild land fuels. USDA: Forest
      Service Research Paper INT-115, 1972 / ROTHERMEL R C. How to predict the spread and intensity of
      forest and range fires [R]. USDA: Forest Service Research General Technical Report INT-143, 1983.
Sheu, J. B. (2007). Challenges of emergency logistics management. Transportation Research Part E: Logistics
      and Transportation Review, 43(6), 655–659.
Sheu, J. B. (2007). An emergency logistics distribution approach for quick response to urgent relief demand
      in disasters. Transportation Research Part E: Logistics and Transportation Review, 43(6), 687–709.
Sheu, J. B. (2010). Dynamic relief-demand management for emergency logistics operations under large-scale
      disasters. Transportation Research Part E: Logistics and Transportation Review, 46(1), 1–17.
Sheu, J. B., Chen, Y. H., & Lan, L. W. (2005). A novel model for quick response to disaster relief distribution.
      Proceedings of the Eastern Asia Society for Transportation Studies, 5, 2454–2462.
Sun, Y., Chi, H., & Jia, C. L. (2007). Nonlinear mixed-integer programming model for emergency resource
      dispatching with multi-path. Operations Research and Management Science, 16(5), 5–8.
Sullivan, A. L. (2009). Wildland surface fire spread modelling, 1990–2007.3: Simulation and mathematical
      analogue models. International Journal of Wildland Fire, 18(4), 387–403.
Thompson, M. P., & Calkin, D. E. (2011). Uncertainty and risk in wildland fire management: A review. Journal
      of Environmental Management, 92, 1895–1909.
Tzeng, G. H., Cheng, H. J., & Huang, T. D. (2007). Multi-objective optimal planning for designing relief
      delivery systems. Transportation Research Part E: Logistics and Transportation Review, 43(6), 673–
      686.




123
```

## Page 21

```text
Ann Oper Res (2019) 283:917–937                                                                            937


Wang, H. J., Du, L. J., & Ma, S. H. (2014). Multi-objective open location-routing model with split deliv-
     ery for optimized relief distribution in post-earthquake. Transportation Research Part E: Logistics and
     Transportation Review, 69, 160–179.
Wang, S. S., Wang, Y., & Deng, Y. S. (2008). Emergency resources allocation among multiple disaster places
     under fair priority principle. Operations Research and Management Science, 17(3), 16–21.
Wang, Z. F. (1992). The configuration of general wildfires system. Forestry Science and Technology, 1992(3),
     22–24. (in Chinese).
Wei, Y., & Kumar, A. (2007). Ant colony optimization for disaster relief operations. Transportation Research
     Part E: Logistics and Transportation Review, 43(6), 660–672.
Weise, D. R., & Biging, G. S. (1997). A qualitative comparison of fire spread models cooperation wind and
     slope effects. Forest Science, 43(2), 170–180.
Wen, G. Y., & Liu, Y. (1994). A model of forest fires spread and its application. Journal of Northeast Forestry
     University, 22(2), 31–36. (in Chinese).
Wohlgemuth, S., Oloruntoba, R., & Clausen, U. (2012). Dynamic vehicle routing with anticipation in disaster
     relief. Socio-Economic Planning Sciences, 46(4), 261–271.
Wu, Z. W., He, H. S., Yang, J., & Liang, Y. (2015). Defining fire environment zones in the boreal forests of
     northeastern China. Science of the Total Environment, 518–519, 106–116.
Yang, G. B., Tang, X. M., & Li, Y. O. (2011). Self-adaptive correction of simulation error on dynamic data
     driven forest fire spreading model. Journal of Northeast Forestry University, 39(11), 29–32+45.
Yao, S. R., & Wen, D. Y. (2002). Monument theory of forest fire prevention and control. Beijing: Chinese
     Forestry Press.
Yuan, Y., & Wang, D. (2009). Path selection model and algorithm for emergency logistics management.
     Computers & Industrial Engineering, 56(3), 1081–1094.
Yue, J. Z., Feng, Z. K., & Jiang, W. (2007). Building time limited forecasting model of gravely extra-large
     fire suppression in Daxingan Mountains Forest Region. Journal of Beijing Forestry University, 29(A2),
     128–131.
Zhang, F. (2007). Emergency Vehicle Scheduling base on Commodity Demand Degree. Doctoral Dissertation
     of Harbin Institute of Technology. Harbin, China.
Zhang, J. H., Li, J., & Liu, Z. P. (2012). Multiple-resource and multiple-depot emergency response problem
     considering secondary disasters. Expert Systems with Applications, 39(12), 11066–11071.
Zhang, X., Wang, S., Shan, T., et al. (2005). Selective SVMs ensemble driven by immune clonal algorithm[C].
     inWorkshops on Applications of Evolutionary Computation (pp. 325–333). Berlin Heidelberg: Springer.
Zhu, J. M., Han, J. Y., & Liu, D. G. (2007). Vehicle routing model for medical supplies in large-scale emer-
     gencies. Chinese Journal of Management Science, 15(SI), 711–715.




                                                                                                  123
```
