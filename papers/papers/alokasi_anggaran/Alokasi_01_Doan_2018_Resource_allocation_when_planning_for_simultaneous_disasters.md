# Verbatim PDF Transcript

- Source PDF: `Alokasi_01_Doan_2018_Resource_allocation_when_planning_for_simultaneous_disasters.pdf`
- Original upload filename: `Alokasi_01_Doan_2018_Resource_allocation_when_planning_for_simultaneous_disasters.pdf`
- Source PDF SHA-256: `bce0bf69599bb30e18724f1408e78d3bd59900724a3bed093b726dca73e6a847`
- Extraction method: `pdftotext -layout`
- Pages: 44

This file preserves native PDF text with page boundaries. Tesseract OCR supplements pages where the native text layer is empty or corrupted.

## Page 1

```text
                                                                          The University of Manchester Research




Resource allocation when planning for simultaneous
disasters
DOI:
10.1016/j.ejor.2018.10.015


Document Version
Accepted author manuscript


Link to publication record in Manchester Research Explorer


Citation for published version (APA):
Doan, X. V., & Shaw, D. (2019). Resource allocation when planning for simultaneous disasters. European Journal
of Operational Research, 274(2), 687-709. https://doi.org/10.1016/j.ejor.2018.10.015


Published in:
European Journal of Operational Research


Citing this paper
Please note that where the full-text provided on Manchester Research Explorer is the Author Accepted Manuscript
or Proof version this may differ from the final Published version. If citing, it is advised that you check and use the
publisher's definitive version.


General rights
Copyright and moral rights for the publications made accessible in the Research Explorer are retained by the
authors and/or other copyright owners and it is a condition of accessing publications that users recognise and
abide by the legal requirements associated with these rights.


Takedown policy
If you believe that this document breaches copyright please refer to the University of Manchester’s Takedown
Procedures [http://man.ac.uk/04Y6Bo] or contact openresearch@manchester.ac.uk providing relevant details, so
we can investigate your claim.




Download date:09. Nov. 2026
```

## Page 2

```text
Accepted Manuscript


Resource Allocation When Planning for Simultaneous Disasters

Xuan Vinh Doan, Duncan Shaw

PII:                   S0377-2217(18)30867-1
DOI:                   https://doi.org/10.1016/j.ejor.2018.10.015
Reference:             EOR 15407


To appear in:          European Journal of Operational Research

Received date:         18 December 2017
Revised date:          9 August 2018
Accepted date:         8 October 2018

Please cite this article as: Xuan Vinh Doan, Duncan Shaw, Resource Allocation When Plan-
ning for Simultaneous Disasters, European Journal of Operational Research (2018), doi:
https://doi.org/10.1016/j.ejor.2018.10.015




This is a PDF file of an unedited manuscript that has been accepted for publication. As a service
to our customers we are providing this early version of the manuscript. The manuscript will undergo
copyediting, typesetting, and review of the resulting proof before it is published in its final form. Please
note that during the production process errors may be discovered which could affect the content, and
all legal disclaimers that apply to the journal pertain.
```

## Page 3

```text
                              ACCEPTED MANUSCRIPT




Highlights

• Resource allocation for multiple disasters happening simultaneously across a country

• Analyses risk of not achieving performance targets given resource constraints

• Finds resources needed to meet target performance levels

• Sensitivity analyses of financial investment options for different budgets


                                                               CR
• Analyses political effects on allocations, such as city importance



                                                                 IPT
                                          AN
                                            US
                                   M
                       ED
               PT
     CE
AC

                                              1
```

## Page 4

```text
                                       ACCEPTED MANUSCRIPT




            Resource Allocation When Planning for Simultaneous Disasters

                                      Xuan Vinh Doana , Duncan Shawb,∗
        a
          ORMS Group, Warwick Business School, University of Warwick, Coventry, CV4 7AL, United Kingdom
   b
       Alliance Manchester Business School, Humanitarian and Conflict Research Institute, Manchester, M15 6PB,
                                                 United Kingdom




Abstract
                                                                           CR
This paper uses stochastic optimisation techniques to allocate scarce national resource across eight

                                                                             IP
cities to best respond to three simultaneous disasters happening across these locations. Our first


                                                                               T
model analyses the risk of not being able to achieve performance targets given resource constraints
while our second model analyses the resources needed to meet target performance levels. A third
hybrid model (constructed from the first two models) analyses the implications of different financial

                                                     AN
budgets. Additional sensitivity analysis is performed by looking into different settings of location
importance, number of simultaneous disasters, and resource requirements. We reflect on the use


                                                       US
of such modelling techniques for these problems and discuss the influence of political aspects of
resource allocation which such models cannot address. We also reflect on the need for advanced
modelling to recognise the abilities of the users and the availability of realistic assumptions if they
are to influence the practices of disaster managers.


optimisation
                                             M
Keywords: OR in disaster relief, simultaneous disasters, resource allocation, stochastic



1. Introduction                 ED
       Disasters are exceptional events for a country, not least because of the usually long periods
                       PT
when none occurs but also because responding to them consumes vast resources. These resources
are often specific to a particular type of disaster and provide capabilities to save life, protect people

            CE
and their possessions from harm, and lessen the effects of the impact - for example, equipment to
decontaminate a population following chemical release. As disasters seldom happen, these resources
are usually scarce as it is infeasible for cities to have large quantities of specialist equipment lying

AC
idle between disasters. Consequently, some resources are often held by national government to
be shared across cities when the need arises [55]. Thus, an affected city can accumulate needed
resources through requesting mutual aid from unaffected cities [49], regional/national assets [18], and
international sources [16]. The allocation of specialist resources is made more difficult when multiple
disasters occur simultaneously, each demanding the shared resource, as “The size, complexity, and

  ∗
      Corresponding author
      Email addresses: xuan.doan@wbs.ac.uk (Xuan Vinh Doan), duncan.shaw-2@mbs.ac.uk (Duncan Shaw)



Preprint submitted to European Journal of Operational Research                                   October 13, 2018
```

## Page 5

```text
                                    ACCEPTED MANUSCRIPT




number of simultaneous disasters influence the ability of all ... [organizations] to respond. Events
may occur, particularly in multi-state disasters that exceed FEMA’s planning targets.” [2].
   The real case that our paper considers is the UK Government’s New Dimension Programme
[36] which was the UK’s £330m investment in emergency response capabilities following the 11th
September 2001 terrorist attacks in New York. The programme focused on new capabilities to
tackle three simultaneous events happening anywhere in the country including those associated
with a major flood (specifically, water rescue and high volume pumping) and those associated with
a terrorist attack (specifically, urban search and rescue, and mass decontamination). Our scenarios,

                                                                  CR
assumptions, models and analyses mirror the New Dimension Programme to answer the question -
How do we allocate scarce emergency resources (people and equipment) to respond to three large-

                                                                    IP
scale simultaneous floods or terrorist attacks happening in a country? To answer this question we
worked closely with New Dimension documentation and the UK’s Chief Fire Officers Association’s

                                                                      T
national lead officer for command and control aspects of the New Dimension Programme. The
novelty of this paper is the development of Operational Research models which focus on a major


                                              AN
problem that governments are grappling with - How to prepare for multiple simultaneous large-scale
emergencies happening at the same time, needing the same resources.

Contributions and paper outline
                                                US
   Our paper presents two models to allocate multiple types of scarce resource in preparing for,
and responding to, three simultaneous disasters. The first is a two-stage stochastic optimisation
model that allocates existing resources to achieve the best performance i.e. addressing how targets

                                       M
can be met. The second model determines the optimal resource capacity to manage all possible
scenarios i.e. addressing what additional resources are needed to meet targets. In addition to these


                           ED
two main models, we use a third (hybrid) model to analyse the impact of financial budget on how
to allocate additional resources.
   Our models reflect how simultaneous disasters thinly stretch shared resources across geograph-

                  PT
ical areas and have more complex demands because, for example: affected areas have different
time-dependent demand for resources which only become apparent at different times during the
response; resources are shared across different disaster types; and some resources are constrained by

         CE
deployment regulations. The models analyse the importance of such aspects of emergency response,
culminate in sensitivity analyses of not being able to meet the demands created by simultaneous
emergencies. We consider the influence of political factors on future investment decisions as well

AC
as compare the effect of the strategic importance of cities across a country. To explain the models,
the paper begins with a literature review of resource allocation for responding to simultaneous dis-
asters. The models are then introduced, followed by their application to a case study. Discussion
and implications conclude the paper.

2. Literature Review

   ‘Everyday emergencies’ (such as a car crash or medical incident) are foreseen events that require
a general emergency response and, for these, analysts can use historic data to plan [24]. Disasters

                                                 3
```

## Page 6

```text
                                   ACCEPTED MANUSCRIPT




are different as they can be unforeseen, rare events with extreme consequences (‘black swan’ events)
or a confluence of foreseen events in ways that create unanticipated, rare consequences (‘perfect
storm’ events) [40]. Disasters also create overwhelming demand, require a more substantial response
from scarce specialist resources, and may quickly exhaust local resources thereby requiring a wider
resource pool. Thus, disaster planning is difficult, in part, because of the need to model exceptions
for which there is often minimal or imperfect data and because of the high risks involved in using
scarce of resources [27] to protect nationally important assets [10] and help vulnerable people [50].
   Our focus is on resource allocation in disasters and there is substantial research on this topic. For

                                                                     CR
example, resource allocation in each of the four phases of the disaster life cycle [16] has been the topic
of much study: in the preparedness phase (e.g. estimating loss before a disaster happens to identify

                                                                       IP
important infrastructure to protect [50]) and in the response phase (e.g. where to move equipment
to during a disaster to meet demand [14]). The disaster life cycle also includes phases for after a

                                                                         T
disaster (recovery) [12] and to avoid the effects of a disaster (mitigation) [30] but these are not the
focus of our paper. The breadth of research on resource allocation in disasters is described in review


                                                AN
papers by Özdamar and Ertem [39] who review mathematical models developed for humanitarian
logistics, Anaya-Arenas et al [6] who review research on relief distribution networks, and de la Torre
et al [17] who review the use of disaster relief logistics.

                                                  US
   The published research on resource allocation exploits a breadth of model types but shows
a preference towards optimisation - Galindo and Batta [21] and Altay and Green [5] found that
optimisation is the most heavily exploited analytical approach in disaster analytics with 23.1% and

                                         M
32.1% of the published research (respectively) - also see Tables A.10, A.11, and A.12 in Appendix A.
This preference includes stochastic optimisation models (e.g. for prepositioning emergency logistics
[48, 46]) and dynamic optimisation models (e.g. for adapting response strategies [19, 29]). There

                            ED
is also a growing interest in using game theory to understand disasters, addressing issues such
as protecting citizens and infrastructure from aggressors who target system weaknesses [50] and
attracting donations based on perceived effectiveness in delivering relief to disaster victims [34].

                   PT
Similarly, robust optimisation models are becoming popular as they “immunize against uncertainty”
so avoid the need to provide some probabilistic information which can be difficult to estimate
for disasters [9] (e.g. likelihood of disaster scenarios). Robust optimisation has been applied to
         CE
evacuation planning to handle scenarios with significant infeasible cost [65], planning emergency
logistics to handle the problem of time-dependent uncertainty [8], organizational resilience to handle
the problem of unknown loss potential [29], and relief distribution plans to handle the uncertainties
AC
following an earthquake [35]. The objectives of disaster optimisation models are varied but include,
from Tables A.10, A.11, and A.12, to minimize expected costs [4], minimize casualties [48], minimize
completion times [63], maximize equity of those affected [45], maximize recovery coverage [12], and
maximize the fairness of relief distribution [56].
   Common across many disaster optimisation studies is resource allocation based on the value or
importance of elements being modelled, for example, the value of a target to a defender [10, 50, 27],
the value of a business function to a plan [12], the importance of an item in a relief pack [46],



                                                     4
```

## Page 7

```text
                                   ACCEPTED MANUSCRIPT




the importance of products that satisfy recipients [56], the priority of helping wounded people [66],
or the priority of transporting evacuees compared to products [38, 35]. For good reason, not all
studies optimise importance e.g. Salmerón and Apte [48] assume “both groups [of people] are
equally important in the sense that failing to meet either demand results in persons to perish”
(p566). Importance is an aspect considered in our models and is a focus of our discussion.
   While there is much research on everyday emergencies occurring at the same time, there is less on
simultaneous disasters. We define simultaneous disasters as two or more disasters that temporally
overlap, may be geographically distant, yet make demands of the same pool of resources. As this

                                                                     CR
pool is finite, the resourcing challenge is the competition from the disasters for scarce specialist
resources combined with the need to transport these across an area, efficiently, to satisfy competing

                                                                       IP
demands. We distinguish these from ‘multiple disasters’ (incidents occuring in the same place but
with no temporal overlap [47]) and from ‘secondary disasters’ [67] or ‘serial disaster chains’ (“a series

                                                                         T
of major disasters that occur as an offshoot of a major disaster” [57, p510], such as an earthquake
causing a landslide [64]). These distinctions are important because unrelated multiple incidents


                                               AN
do not make resource allocations more challenging than for single disasters, and the physical co-
location of serial disaster chains means the need for resource is geographically concentrated thereby
avoiding extensive travel and easing the challenge of mutual aid (discussed below). On the number

                                                 US
of simultaneous incidents, the UK government’s “planning assumptions [were] . . . based on three
simultaneous major incidents” [58], while the USA government sought to “develop, acquire, and
coordinate a national operational capability, and the resources and assets to simultaneously respond

                                        M
to four catastrophic plus twelve non-catastrophic incidents, anywhere in the country” [2, p11].
   This focus on simultaneous disasters is novel as “there are few methods to model the practical
situations of multiple-resource, multiple-response and multiple-point” [67, p11067] because “the

                            ED
traditional emergency resource allocation in the literature considers only a single incident at a
time” [52, p200]. When the literature considers more than one disaster, it is typically a single type
of disaster in more than one place, for example from Table A.10, simultaneous failures disrupting

                   PT
communication networks [1, 44], more than one area being affected by a storm [48], more than one
wildfire [33], or secondary disasters such as earthquake aftershocks [67]. Some research considers
simultaneous events but assumes that each rescue agency can only respond to a single event at
         CE
any time [25], while others limit the potential of applying their model to more than one incident to
future work [27]. Wex et al [63, p697] deconstructed disasters into “a large number of geographically-
dispersed incidents, such as fires and collapsed buildings” but they focus on efficient allocation of
AC
response at a local level rather than taking a national perspective. We found only two papers
that consider more than one type of disaster happening simultaneously: Albores and Shaw [3]
who evaluate three simultaneous events of different types, requiring different sorts of responses,
happening in different locations; Su et al [52, p200] who “allocate multiple emergency resources of
multiple rescue agencies to multiple concurrent incidents in a parallel manner”.
   Another aspect that is important to our paper but seldom found in the literature is the borrow-
ing of emergency resources from across cities to address the scale of the disaster, so-called mutual



                                                   5
```

## Page 8

```text
                                  ACCEPTED MANUSCRIPT




aid. Mutual aid is a facility that “authorizes a state [or region] to enter into a bilateral or mul-
tilateral agreements with its neighbors. A mutual aid agreement allows one government agency
to come to the aid of another” [49, p102]. Su et al [52] do not consider mutual aid as a way of
coping with simultaneous disasters, but Albores and Shaw [3] do through a prioritised system of
borrowing resources from regions in a pre-specified order. The complication that mutual aid brings
in simultaneous incidents is the conflicting priorities for which regions should satisfy which requests.
   The final aspect not often found in the disaster planning resource allocation literature which
this paper considers is the impact of deployment regulations on the ability of personnel to work

                                                                    CR
safely in hazardous situations. In existing studies often the number of personnel are modelled as a
homogeneous type [52] or not treated as a constraint [7]. However, deployment regulations ensure

                                                                      IP
safe working especially in hazardous environments, for example, the amount of aircraft flying time
for aircrew [7] or, as in our case, the working time in firefighting breathing apparatus [3]. Deployment

                                                                        T
regulations are time-dependent resource constraints which influence the capacity of staff to complete
tasks and so effect the number of staff needed to accomplish the activity on time.


                                               AN
   The issues reviewed above are central to our development of stochastic optimisation models
that consider: three simultaneous disasters of different types requiring different types of response;
the demand for scarce, shared, local and national, specialist resources; responses needed at different

                                                 US
cities that may be geographically spread; prioritising some cities based on their national importance
including the receiving of mutual aid; deployment regulations to ensure safe working. In our first
model, we handle the risk of not being able to fully respond to simultaneous disasters with existing

                                        M
capabilities using a stochastic optimisation approach. The second optimisation model addresses
how to eliminate that risk by considering additional resource capabilities. The third (hybrid) model
considers both aspects given a limited financial budget. The details of the models to analyse resource



3. Mathematical Formulations
                            ED
allocations are described next.




                   PT
3.1. Problem Description
   Reserves of national resources are strategically placed around a country to handle potential (si-

         CE
multaneous) disasters at several locations. We focus on this strategic resource allocation problem
in the preparedness phased while considering its effects in the response phase when actual simulta-
neous disaster scenarios happen. Both equipment and personnel resources are needed in response

AC
to disasters and different operations require different types of equipment. For example, search and
rescue units are needed for urban search and rescue (USAR) operations while response units are
needed for mass decontamination (MD) operations. In addition to equipment, we need specialists,
the personnel qualified to operate these equipment. We also need generalists who support special-
ists and handle generic operations. Generalists and specialists are firefighters and we assume there
are enough firefighters who can be trained as generalists and specialists. Specialist equipment units
include vehicles to transport the equipment as well as personnel needed to operate the unit. For
example, a high volume pump (HVP) unit for flood pumping operations consists of two vehicles to

                                                   6
```

## Page 9

```text
                                  ACCEPTED MANUSCRIPT




carry pump and hose equipment and required personnel. Additional specialists and generalists (if
required) travel using fire engines and we assume there are enough fire engines to transport these
additional personnel when needed.
   The requirements for resources are different for different types of disasters. For example, a
radioactive bomb attack requires specialist equipment for MD and USAR while a natural flood
would need HVP and USAR but may not need mass decontamination. Common resources such as
USARs are needed in response to several types of disasters, which makes the resource allocation
difficult given that more than one type of disasters will be considered in our models.

                                                                      CR
   Resource allocation decisions made in the preparedness phase affect decisions made in the re-
sponse phase when an actual disaster happens. In general, the first few hours after a disaster

                                                                        IP
happens are the most important to save life and protect assets, thus our models focus on these
first hours as the timespan of the response phase. In addition to specialist equipment and per-

                                                                          T
sonnel, additional generalists are required to support specialists and handle general tasks. Most
requirements of specialist equipment (and personnel) are non-cumulative, i.e., they only specify


                                               AN
the required number of specialist equipment (or personnel) at a specific time without accounting
for how long those specialist equipment (and personnel) are available before that. For example, a
requirement of 10 generalists on-site within 3 hours is satisfied if there are 10 generalists available

                                                 US
right after the third hour. These generalists can arrive on-site any time within the first 3 hours.
For some equipment, the requirement is throughput-related and cumulative, i.e., represented by the
amount of work done over time. For example, a decontamination target of 3000 causalities within 3

                                        M
hours is 3 unit-hours if the decontamination capability of the units is 1000 casualties per hour. This
requirement is satisfied if there is one response unit available right after the first hour and one more
unit is available right after the second hour. Figure 1 shows the differences between non-cumulative

                            ED
and cumulative requirements. Additional specialists are required after the first deployment period
to make sure that specialist equipment can be operated without stopping given that rest breaks
between deployment shifts are required for personnel. For generalists, we assume that initial re-

                   PT
quirements are sufficient to cover breaks between deployments given the flexibility of generalists in
handling different operations.


         CE
AC
                           Figure 1: Non-cumulative vs. cumulative requirement


   Given these time-dependent resource requirements, requested specialist equipmentand personal


                                                   7
```

## Page 10

```text
                                    ACCEPTED MANUSCRIPT




need to be transported from multiple locations to the disaster site. These resource request deci-
sions, i.e., when, where, which resource, and how much to request, need to be made throughout the
response phase. A simultaneous disaster scenario describes the details of where these simultane-
ous disasters happen and their resource requirements. Together with resource allocation decisions,
these resource request decisions determine how effective the response is in satisfying resource re-
quirements for simultaneous disaster scenarios. We aim to make resource allocation decisions which
allow effective responds, i.e., resource request decisions, to be made later in anticipation of po-
tential simultaneous disaster scenarios. Given our focus is on resource allocation decisions in the

                                                                        CR
preparedness phase, not dynamic resource request decisions in the response phase, we consider this
as a two-stage problem with resource allocation decisions in the preparedness phase as first-stage

                                                                          IP
decisions and resource request decisions in the response phase are second-stage decisions. The
scenario-based representation of uncertainty of simultaneous disasters, i.e., when and where these

                                                                            T
disasters might happen and what resource will be needed, is relevant for the two-stage models.
Given a simultaneous disaster scenario where all time-dependent resource requirements are known,


                                                  AN
resource request decisions can be determined using a multi-period setting in which the timespan
of the response phase is discretized appropriately. Figure 2 shows the overall two-stage decision
framework with respect to two phases of the disaster life cycle, preparedness and response phase.

                                                    US
                                          M
                             ED
                   PT
            Figure 2: Two-stage decision framework with respect to preparedness and response phase



3.2. Notation and Model Settings

         CE
   For clarity of exposition, Table 1 summarises all relevant parameters used to develop our math-
ematical optimisation models. We now describe these parameters.
   The set of locations where resources can be placed (and disasters might happen) is denoted by

AC
N . We let Ei ⊆ N be the list of locations from where equipment and personnel can be requested in
response to a disaster happening at location i, i ∈ N . Resources should be requested first from the
locations where a disaster happens, which implies i ∈ Ei for all i ∈ N . To emphasize the importance
of utilizing resources from the location where disasters happen, pij , j ∈ Ei , denotes the preference of
requesting resources from location j for a disaster happening at location i with pii = 1 and pij > 1
if j 6= i for all i ∈ N . The preference depends on travel times between pairs of locations among
other factors. Finally, the response time needed to transport specialist equipment and personnel
from location j to location i is denoted by rij for all i ∈ N and j ∈ Ei .

                                                      8
```

## Page 11

```text
                                    ACCEPTED MANUSCRIPT




                           Table 1: Parameters for the proposed optimisation models

 N         set of locations
 Ei        lists of locations equipment and personnel can be requested
           when a disaster happening at location i ∈ N
 pij       request preference/priority of location j, j ∈ Ei
 rij       response time needed to bring equipment and personnel from location j to location i
 R         set of equipment types
 αr        number of specialists required to operate a unit of type-r equipment, r ∈ R
 βr        number of generalists required to support a unit of type-r equipment
 or
 K
 Rk
           on-site setup time of type-r equipment
           set of disaster types                                        CR
           set of equipment types need in response to a type-k disaster, k ∈ K
 Tk

 ck,r
                                                                          IP
           set of time points when resource requirements need to be specified in response to a
           type-k disaster

                                                                            T
           indicator whether type-r equipment requirements in response to a type-k disasters are
           cumulative or not
 S         set of scenarios
 Ls
 il
 kl
                                                  AN
           set of simultaneous disasters happening in scenario s, s ∈ S
           location where disaster l happens, l ∈ Ls
           type of disaster l, l ∈ Ls
 dlr (t)

 dl0 (t)
                                                    US
           requirement for type-r equipment, r ∈ Rkl , at time t, t ∈ Tkl ,
           in response to disaster l, l ∈ Ls
           requirement for generalist at time t, t ∈ Tkl , in response to disaster l,
           l ∈ Ls
 qs
 Cr
 Ts
           probability of scenario s
           capacity of type-r equipment   M
           time horizon of resource requirements in response to all disasters in scenario s
 D
 ιi
 γr
 B
                             ED
           duration of deployment shifts (and deployment breaks)
           importance indicator of location i
           cost per unit of type-r equipment
           total budget

                    PT
      There are different types of specialist equipment and R denotes the set of all equipment types.
αr and βr denote the number of specialists and supporting generalists needed to operate a unit of
           CE
type-r equipment, r ∈ R, respectively. These personnel are transported together with equipment
units when requested. Finally, the setup time for type-r equipment before they can be operated is


AC
denoted by or for all r ∈ R.
      More than one type of disasters is considered. We use K to denote the set of disaster types
and let Rk ⊆ R be the set of equipment types needed in response to type-k disasters, k ∈ K. To
model time-dependent resource requirements throughout the timespan of the response phase, we
use Tk to denote the set of time points when requirements for all types of specialist equipment in
Rk and those for generalists need to be specified in response to type-k disasters, k ∈ K. In addition,
ck,r ∈ {0, 1} is used to indicate whether requirements for type-r equipment in response to type-k
disasters are cumulative or not for all k ∈ K and r ∈ Rk .


                                                      9
```

## Page 12

```text
                                    ACCEPTED MANUSCRIPT




   Potential simultaneous disaster scenarios are given in a set S. For a scenario s, s ∈ S, Ls denotes
the set of simultaneous disasters happening in that scenario. For each disaster l, l ∈ Ls , happening
in scenario s, il and kl denote its location and its disaster type, respectively. In addition, the
requirement for type-r specialist equipment, r ∈ Rkl at time t, t ∈ Tkl , in response to the disaster l
is denoted by dlr (t) for all l ∈ Ls . Similarly, dl0 (t) denotes the requirement for generalists at time t,
t ∈ Tkl , in response to the disaster l, l ∈ Ls . To handle time-dependent resource request decisions,
we define Ts such that [0, Ts ] is a discretized time horizon that covers all the time points when
resource requirements are specified for all simultaneous disasters happening in scenarios s. Note


                     X
                                                                       CR
that Ts can be different for different scenario s ∈ S depending on types and scales of simultaneous
disasters in those scenarios. Finally, for each scenario s, s ∈ S is assigned with a probability
of qs ≥ 0 such that
                                                                         IP
                         qs = 1. Given the set S of simultaneous disaster scenarios and current
                        s∈S


                                                                           T
total capacities Cr of type-r equipment, r ∈ R, we are ready to develop mathematical models to
determine how to allocate available resources so that whatever disaster scenario happens, it can be
handled as effectively as possible.

3.3. Penalty-Based Model                          AN
                                                    US
   The first optimisation model aims to determine if there are feasible allocations of equipment
among all locations that can respond satisfactorily to all scenarios s ∈ S given the current capacities
of all resources, i.e., resource requirements of all simultaneous disasters happening in each scenario
s are satisfied at all times during the timespan of the response phase. We impose a penalty if a

                                          M
resource requirement is not satisfied in any scenario and formulate the problem as a total expected
weighted penalty minimization problem. It is obvious that if there is no penalty (i.e., zero minimum
expected penalty), the current capacities of all resources are enough to handle effectively all given
                              ED
simultaneous disaster scenarios. Before discussing how to formulate the objective of this penalty-
based model, we describe all decision variables (see Table 2) and constraints of the model.
   Resource allocation decisions in the preparedness phases are the main first-stage decision vari-
                   PT
ables. Let wri ∈ Z+ be the number of type-r equipment units allocated at location i, i ∈ N . Given
the capacity Cr of type-r equipment, r ∈ R, these decision variables need to satisfy the following

         CE
capacity constraints:
                                         X

                                         i∈N
                                               wri = Cr ,   ∀ r ∈ R.                                    (1)



AC Given a scenario s ∈ S, time-dependent resource request decisions in the response phase are the
main second-stage decision variables. Let xi,j
                                           r,s (t) be the number of type-r equipment units, r ∈ R,
to be requested in response to disasters happening at location i, i ∈ N , from nearby locations
j ∈ Ei at the beginning of each time period t, t = 1, . . . , Ts . Together with the equipment requested,
αr · xi,j
      r,s (t) type-r specialists will be transported from location j to location i so that the equipment
can be operated. Similarly, βr · xi,j
                                  r,s (t) generalists will also travel together with the equipment
requested. In addition to these generalists who help with specialist equipment, we take into account
the requests for additional generalists to support the operation. Let xi,j
                                                                       0,s (t) be the number of



                                                      10
```

## Page 13

```text
                                    ACCEPTED MANUSCRIPT




                          Table 2: Decision variables of the penalty-based model (P)

 First-stage decision variables:
 wir       number of type-r equipment units, r ∈ R, allocated at location i, i ∈ N
 w̄ir      number of specialists who can operate type-r equipment, r ∈ R, allocated at location
           i, i ∈ N
 Second-stage decision variables:
 xi,j
   r,s (t) number of type-r equipment units, r ∈ R, requested in responses to disasters
           happening at location i, i ∈ N , from nearby location j, j ∈ Ei , at the beginning of
           time period t, t = 1, . . . , Ts , in scenario s, s ∈ S
 xi,j
   0,s (t)
                                                                         CR
           number of additional generalists requested in responses to disasters happening at
           location i, i ∈ N , from nearby location j, j ∈ Ei , at the beginning of time period t,

 x̄i,j
   r,s (t)
           t = 1, . . . , Ts , in scenario s, s ∈ S

                                                                           IP
           number of additional specialists who can operate type-r equipment, r ∈ R, requested


                                                                             T
           in responses to disasters happening at location i, i ∈ N , from nearby location j,
           j ∈ Ei , at the beginning of time period t, t = 1, . . . , Ts , in scenario s, s ∈ S
   i
 yr,s (t) number of type-r equipment units, r ∈ R, in operation at location i, i ∈ N , at the

   i (t)
 y0,s
                                                 AN
           beginning of time period t, t = 1, . . . , Ts , in scenario s, s ∈ S
           number of generalists presenting at location i, i ∈ N , at the beginning of time period
           t, t = 1, . . . , Ts , in scenario s, s ∈ S
   i (t)
 ȳr,s

   i (t)
 zr,s
                                                   US
           number of specialists who can operate type-r equipment, r ∈ R, presenting at location
           i, i ∈ N , at the beginning of time period t, t = 1, . . . , Ts , in scenario s, s ∈ S
           number of type-r equipment units, r ∈ R, ready to be operated at location i, i ∈ N , at
           the beginning of time period t, t = 1, . . . , Ts , in scenario s, s ∈ S
   i (t)
 vr,s      actual requirement of specialists who can operate type-r equipment, r ∈ R, at location
                                          M
           i, i ∈ N , at the beginning of time period t, t = 1, . . . , Ts , in scenario s, s ∈ S
 ulr,s (t) penalty value if the requirement for type-r equipment, r ∈ R, in response to disaster l,
           l ∈ Ls , is not satisfied at the beginning of time period t, t = 1, . . . , Ts , in scenario s,
           s∈S
                             ED
additional generalists that need to be requested in response to disasters happening at location i,

                   PT
i ∈ N , from nearby locations j ∈ Ei at the beginning of each time period t, t = 1, . . . , Ts . Finally,
given the requirement of rest breaks between deployment shifts, we need to request additional
specialists to arrive later to ensure the continuity of the operation of specialist equipment once it
         CE
starts. Let x̄i,j
              r,s (t) be the number of additional specialists who can operate type-r equipment, or
type-r specialists for short, r ∈ R, that need to be requested in response to disasters happening at
location i, i ∈ N , from nearby locations j ∈ Ei at the beginning of each time period t, t = 1, . . . , Ts .
AC In order to check whether resource requirements of all simultaneous disasters happening in
scenario s are satisfied, we compute how many specialist equipment units are in operation at each
                                                                        i (t) be the number of type-r
location within the time horizon [0, Ts ]. Given a scenario s ∈ S, let yr,s
equipment units, r ∈ R, which are in operation at location i, i ∈ N , at the beginning of each time
                                              i (t) be the number of generalists, and ȳ i (t) be the number
period t, t = 1, . . . , Ts . Similarly, let y0,s                                       r,s
of type-r specialists, r ∈ R, which are currently at location i, i ∈ N , at the beginning of each time
                                        i (1) = y i (1) = ȳ i (1) = 0 for all i ∈ N and r ∈ R. We can
period t, t = 1, . . . , Ts . Clearly, y0,s      r,s        r,s




                                                     11
```

## Page 14

```text
                                         ACCEPTED MANUSCRIPT




compute these numbers for other time periods as follows:


                                                    X
          i              i
         yr,s (t + 1) = yr,s (t) +                               xi,j
                                                                  r,s (t + 1 − or − rij ),                                (2)
                                          j∈Ei :t+1>or +rij
                                                           "                                                        #
                                               X                                       X
          i
         y0,s            i
              (t + 1) = y0,s (t) +                             xi,j
                                                                0,s (t + 1 − tij ) +         βr · xi,j
                                                                                                   r,s (t + 1 − tij ) ,   (3)
                                          j∈Ei :t+1>tij                                r∈R
                                               X           i,j                                           
           i               i
         ȳr,s (t + 1) = ȳr,s (t) +                       x̄r,s (t + 1 − tij ) + αr · xi,j
                                                                                        r,s (t + 1 − tij ) ,              (4)
                                          j∈Ei :t+1>tij
                                                                                        CR
and specialists to be requested to fulfill the demand.
                                                                                          IP
for all r ∈ R and t = 1, . . . , Ts − 1. (2) takes into account the travel time and the setup time for
equipment to be ready at the disaster site. (3) and (4) state that additional numbers of generalists

                                                                                            T
   To handle the requirement of additional specialists to cover deployment breaks, we compute
 i (t), the number of type-r equipment units, r ∈ R, at location i, i ∈ N , which are ready to be
zr,s


                                       X
                                                           AN
operated at the beginning of period t, t = 1, . . . , Ts . We have:

                     i
                    zr,s (t) =
                                  j∈Ei :t>or +rij
                                                    xi,j
                                                             US
                                                     r,s (t − or − rij ),       ∀ r ∈ R, t = 1, . . . , Ts .


Supposing specialists can work for D time periods, i.e., the duration of each deployment shift, before
                                                                                                                          (5)




taking a break of the same interval, the actual requirement of type-r specialists is as follows:


            i
           vr,s (t) =
                        min{t,D}−1
                           X
                                      i
                                     zr,s
                                                    M
                                          (t − τ ) + 2 ·
                                                                 t−1
                                                                 X
                                                                          i
                                                                         zr,s (t − τ ), ∀ r ∈ R, t = 1, . . . , Ts .      (6)
                           τ =0
                                  ED                       τ =min{t,D}


This formulation indicates that we need to request more specialists to handle deployment breaks
after the first deployment. Similar to the case of generalists, these requirements of type-r specialists
are not cumulative. PT
   Finally, to formulate the objective of this penalty-based model, for each scenario s ∈ S, let

         CE
ulr,s (t) ≥ 0 be the penalty if the requirement for type-r equipment, r                            ∈ R, in response to the
disaster l ∈ Ls in a simultaneous disaster scenario s ∈ S is not satisfied at the beginning of the time
period t, t ∈ Tkl . For non-cumulative requirements, the penalty is defined as

AC                                                      n
                                         ulr,s (t) = max dlr (t) − yr,s
                                                                    il
                                                                              o
                                                                        (t), 0 .                                          (7)

For cumulative requirements, the penalty is defined as the cumulative shortfall,
                                                          (             t
                                                                                         )
                                                                        X
                                      ulr,s (t) = max dlr (t) −                 il
                                                                               yr,s (τ ), 0 .                             (8)
                                                                        τ =1

Given that it is more pressing to satisfy earlier requirements in the context of disaster response, we


                                                                 12
```

## Page 15

```text
                                              ACCEPTED MANUSCRIPT




weight the penalties with higher weights for smaller t. In this model, we choose the weights T − t + 1
for all t = 1, . . . , Ts , where T = max Ts . The total expected weighted penalty can be computed as
                                             s∈S

                                      X           X             X X
                                             qs          ιil                 (T − t + 1) · ulr,s (t),                                         (9)
                                      s∈S         l∈Ls         r∈Rkl t∈Tkl


where ιi is an importance indicator of location i. The higher the value of ιi is, the more important it is
to satisfy the resource requirements of disasters happening at location i. This penalty represents the


it will be the main objective in this model.                                                   CR
risk of not being able to handle uncertain simultaneous disaster scenarios effectively and minimising


   Given that requirements for specialists are not the same as requirements of specialist equip-
ment due to the need of covering deployment breaks, we introduce a secondary objective into the
model to determine how many specialists should be allocated at different locations. Let w̄ri ∈ Z+
be the number of type-r specialists, r ∈ R, that should be allocated at location i, i ∈ N . These
                                                                                                 IPT
are additional first-stage decision variables of the model and, in practice, the consideration of


                                   XX
                                                                   AN
these would help disaster managers determine and plan specialist training based on the special-
ist requirement at each location. A secondary objective of minimizing the total number of spe-
                                                   
cialist equipment and specialists,
                                                                     US
                                         wri + w̄ri allows us to determine the numbers of spe-
                                                  i∈N r∈R
cialist equipment and specialists needed at each location. Finally, to enforce the request orders
and timings for equipment and personnel, we impose
    Ts X X
                                                     ! another secondary objective of minimizing
XX                                         X
              pij (T − t + 1) · xi,j
s∈S t=1 i∈N j∈Ei
                                 0,s (t) +   xi,j
                                                         M
                                              r,s (t) . These two secondary objectives will be scaled
                                                           r∈R
appropriately to reflect their secondary nature. We can now formulate our first model (P) (P for

                                  ED
penalty) as a two-stage mixed-integer linear stochastic optimisation model as follows.

                                                                                              "N                           #
                   X          X             X X                                                XX                      
   (P ) : min
                    PT
                   s∈S
                     
                       Ts X X
                      XX
                         qs
                              l∈Ls
                                     ιil
                                           r∈Rkl t∈Tkl
                                                          (T − t + 1) · ulr,s (t) + θ ·


                                                                                              X
                                                                                               i=1 r∈R
                                                                                                            wri + w̄r

                                                                                                            !
                                                                                                                     i
                                                                                                                               + ···



         CE
          s.t.
                   µ·

                    i
                   y0,s
                              pij (T − t + 1) ·
                          s∈S t=1 i∈N j∈Ei
                               i
                        (1) = yr,s         i
                                   (1) = ȳr,s (1) = 0,
                                                                                 xi,j
                                                                                  0,s (t) +
                                                                                              r∈R

                                                                         ∀ i ∈ N , r ∈ R, s ∈ S,
                                                                                                    xi,j
                                                                                                     r,s (t)
                                                                                                             


                                                                                                                                             (10)
                                                                  X
AC                  i
                   yr,s            i
                        (t + 1) = yr,s (t) +
                                                         j∈Ei :t+1>or +rij

                                                                X
                                                                               xi,j
                                                                                r,s (t + 1 − or − rij ),


                                                                                                      X
                                                                                                                                         !
                                                                                                                                             (11)


                    i
                   y0,s            i
                        (t + 1) = y0,s (t) +                                 xi,j
                                                                              0,s (t + 1 − tij ) +          βr · xi,j
                                                                                                                  r,s (t + 1 − tij )         (12)
                                                         j∈Ei :t+1>tij                                r∈R
                                                                X                                                                
                     i               i
                   ȳr,s (t + 1) = ȳr,s (t) +                             x̄i,j                        i,j
                                                                             r,s (t + 1 − tij ) + αr · xr,s (t + 1 − tij )           ,       (13)
                                                         j∈Ei :t+1>tij
                         ∀ i ∈ N , r ∈ R, s ∈ S, t = 1, . . . , Ts − 1,



                                                                      13
```

## Page 16

```text
                                        ACCEPTED MANUSCRIPT



                                      X
                   i
                  zr,s (t) =                     xi,j
                                                  r,s (t − or − rij ),                                            (14)
                               j∈Ei :t>or +rij
                               min{t,D}−1                                t−1
                                   X                                     X
                   i                         i                                   i
                  vr,s (t) =                zr,s (t − τ ) + 2 ·                 zr,s (t − τ ),                    (15)
                                   τ =0                           τ =min{t,D}
                        ∀ i ∈ N , r ∈ R, s ∈ S, t = 1, . . . , Ts ,
                   il
                  y0,s (t) ≥ dl0 (t),     ∀ l ∈ Ls , t ∈ Tkl , s ∈ S,                                             (16)
                    il         il
                  ȳr,s (t) ≥ vr,s (t),    ∀ l ∈ Ls , r ∈ Rkl , t = 1, . . . , Ts , s ∈ S,                        (17)
                  ulr,s (t) ≥ dlr (t) − yr,s

                  ulr,s (t) ≥ dlr (t) −
                                         il

                                          X t                                      CR
                                             (t), ∀ l ∈ Ls , r ∈ Rkl : cl,r = 0, t ∈ Tkl , s ∈ S,

                                                 il
                                                         !
                                                                                                            (18)




                  N
                                          τ =1
                                                yr,s

                                                                                     IP
                                                     (τ ) , ∀ l ∈ Ls , r ∈ Rkl : cl,r = 1, t ∈ Tkl , s ∈ S, (19)

                  ulr,s (t) ≥ 0, l ∈ Ls , t ∈ Tkl , r ∈ Rkl , s ∈ S,
                  X                                                                    T                    (20)

                       wri ≤ Cr ,       ∀ r ∈ R,                                                                  (21)
                  i=1
                  XTs X
                               xj,i        i
                                r,s (t) ≤ wr ,
                                                        AN
                                                     ∀ i ∈ N , r ∈ R, s ∈ S,                                      (22)
                  t=1 j:i∈Ej
                  Ts X
                  X

                  t=1 j:i∈Ej
                                x̄j,i             j,i
                                                         US  i
                                  r,s (t) + αr · xr,s (t) ≤ w̄r ,         ∀ i ∈ N , r ∈ R, s ∈ S,                 (23)

                  xi,j       i,j        i,j
                   0,s (t), xr,s (t), x̄r,s (t) ∈ Z+ ,     ∀ i ∈ N , j ∈ Ei , r ∈ R, s ∈ S, t = 1, . . . , Ts ,   (24)
                  wri , w̄ri ∈ Z+ ,              M
                                        ∀ i ∈ N , r ∈ R,                                                          (25)



                               ED
where 0 < θ, µ < 1 are small enough scaling parameters. The first four constraints, (10), (11), (12),
                                                       i (t), y i (t), and ȳ i (t) for i ∈ N , r ∈ R,
and (13), provide calculations of the state variables y0,s     r,s           r,s
s ∈ S, and t = 1, . . . , Ts . The next two constraints, (14) and (15), handle the calculations of

                  PT
specialist requirements given the need of covering deployment breaks. The next two constraints,
(16) and (17), make sure personnel demands are satisfied. The next three constraints, (18), (19),
and (20), handle the penalties of unsatisfied equipment requirements defined in (7) and (8). The

         CE
next three constraints, (21), (22), and (23), make sure that capacity limits are taken into account
properly. Finally, the last two constraints, (24) and (25), indicates that personnel and equipment
requests as well as resource allocations need to be non-negative integers.

AC The proposed model allows us to make strategic first-stage decisions (resource allocation deci-
sions in the preparedness phase) as well operational second-stage decisions (resource request deci-
sions in the response phase) in response to potential simultaneous disaster scenarios as effectively
as possible given the current resource capabilities. It is natural to follow up with the question of
whether current resource configurations could be changed to provide better responses to potential
simultaneous disaster scenarios. In the next section, we propose another model to address this issue.




                                                            14
```

## Page 17

```text
                                        ACCEPTED MANUSCRIPT




3.4. Resource-Based Model
   The model proposed in the previous section deals with the current resource capabilities. It is
important to check whether the current resource capabilities are enough to satisfactorily respond
to all potential simultaneous disaster scenarios provided. The main objective of this second model
is to determine the minimum resource capabilities which can be used to handle all simultaneous
disaster scenarios without any penalty, i.e., all resource requirements are satisfied throughout the
timespan of the response phase. In order to model this objective, let ∆Cr ∈ Z+ be the required
number of additional type-r equipment units, r ∈ R, to guarantee that all resource requirements

                                                                                          CR
are satisfied in each simultaneous disaster scenario. These are first-stage decision variables, i.e.,
how much additional resource capabilities are needed, are determined in the preparedness phase.

                                                                                            IP
   Similar to the previous model, we again need to determine how to allocate resources at each


                                                                                              T
location and how to request specialist equipment and personnel when a simultaneous disaster sce-
nario happens. However, instead of aiming to minimize the risk of not satisfying requirements in
response to disasters in each scenario, we impose the condition that resource requirements need to

                                                         AN
be always satisfied no matter which simultaneous disaster scenario happens given the new resource
capabilities. This condition removes the risk of not being able to respond satisfactorily in poten-


                                                           US
tial simultaneous disaster scenarios. More concretely, the three penalty-related constraints (18),
(19), and (20) are now replaced by the following two new constraints, which make sure resources
requirements are satisfied no matter which simultaneous disaster scenario happens:

                     il
                         (t) ≥ dlr (t),

and
                  t
                  X
                    yr,s
                                                 M
                                                ∀ l ∈ Ls , r ∈ Rkl : cl,r = 0, t ∈ Tkl , s ∈ S,                      (26)




                  τ =1
                          il
                         yr,s
                               ED
                              (τ ) ≥ dlr (t),     ∀ l ∈ Ls , r ∈ Rkl : cl,r = 1, t ∈ Tkl , s ∈ S.

    The main objective of this model is to minimize the total cost of changes made to the current
                                                                                                                     (27)


                                           X
                  PT
resource capabilities, which is defined as   γr · ∆Cr , where γr is cost per unit of type-r equipment,
                                                   r∈R
r ∈ R. Similar to the previous model, we keep the two secondary objectives with their appropriate

         CE
scaling parameters. The second model (R) (R for resource) can be formulated as follows:


                              X
                                                         "
                                                             XX
                                                                                      #
                                                                                  

AC           (R) : min
                              r∈R
                                
                                    γr · ∆Cr + θ ·

                                  Ts X X
                                 XX
                                                         i∈N r∈R
                                                                     wri + w̄ri           + ···

                                                                                                  X
                                                                                                              !
                              µ·        pij (T − t + 1) ·                        xi,j
                                                                                   0,s (t) +            xi,j
                                                                                                         r,s (t)
                                                                                                                 
                                     s∈S t=1 i∈N j∈Ei                                             r∈R
                               i           i          i
                   s.t.       y0,s (1) = yr,s (1) = ȳr,s (1) = 0,        ∀ i ∈ N , r ∈ R, s ∈ S,                    (28)
                                                               X
                               i               i
                              yr,s (t + 1) = yr,s (t) +                          xi,j
                                                                                  r,s (t + 1 − or − rij ),           (29)
                                                             j∈Ei :t+1>or +rij




                                                             15
```

## Page 18

```text
                                          ACCEPTED MANUSCRIPT



                                                                                                                          !
                                                       X                                     X
                  i
                 y0,s            i
                      (t + 1) = y0,s (t) +                           xi,j
                                                                      0,s (t + 1 − tij ) +          βr · xi,j
                                                                                                          r,s (t + 1 − tij ) (30)
                                                  j∈Ei :t+1>tij                              r∈R
                                                      X                                                           
                   i               i
                 ȳr,s (t + 1) = ȳr,s (t) +                       x̄i,j                        i,j
                                                                     r,s (t + 1 − tij ) + αr · xr,s (t + 1 − tij ) ,          (31)
                                                  j∈Ei :t+1>tij
                         ∀ i ∈ N , r ∈ R, s ∈ S, t = 1, . . . , Ts − 1,
                                  X
                  i
                 zr,s (t) =               xi,j
                                           r,s (t − or − rij ),                                                               (32)
                               j∈Ei :t>or +rij
                               min{t,D}−1
                  i
                 vr,s (t) =
                                   X

                                   τ =0
                                                i
                                               zr,s (t − τ ) + 2 ·
                                                                        t−1
                                                                        X

                                                                     τ =min{t,D}
                                                                                    i
                                                                                   zr,s
                                                                                       CR
                                                                                        (t − τ ),                             (33)


                  il
                 y0,s
                   il
                 ȳr,s
                         ∀ i ∈ N , r ∈ R, s ∈ S, t = 1, . . . , Ts ,
                      (t) ≥ dl0 (t),
                              il
                       (t) ≥ vr,s (t),
                                          ∀ l ∈ Ls , t ∈ Tkl , s ∈ S,                    IP
                                           ∀ l ∈ Ls , r ∈ Rkl , t = 1, . . . , Ts , s ∈ S,
                                                                                           T
                                                                                                                              (34)
                                                                                                                              (35)
                  il
                 yr,s (t) ≥ dlr (t),      ∀ l ∈ Ls , r ∈ Rkl : cl,r = 0, t ∈ Tkl , s ∈ S,                                     (36)
                 t
                 X

                 τ =1
                 X
                         il
                        yr,s (τ ) ≥ dlr (t),              AN
                                                 ∀ l ∈ Ls , r ∈ Rkl : cl,r = 1, t ∈ Tkl , s ∈ S,                              (37)


                 i∈N
                 Ts X
                 X
                        wri ≤ Cr + ∆Cr ,


                               xj,i        i
                                                   ∀ r ∈ R,
                                                            US                                                                (38)


                                r,s (t) ≤ wr ,       ∀ i ∈ N , r ∈ R, s ∈ S,                                                  (39)
                 t=1 j:i∈Ej
                 Ts X
                 X

                 t=1 j:i∈Ej
                                x̄j,i
                                                 Mj,i
                                                             i
                                  r,s (t) + αr · xr,s (t) ≤ w̄r ,         ∀ i ∈ N , r ∈ R, s ∈ S,                             (40)

                 xi,j       i,j
                                ED     i,j
                  0,s (t), xr,s (t), x̄r,s (t) ∈ Z+ ,

                 wri , w̄ri ∈ Z+ ,     ∀ i ∈ N , r ∈ R, ,
                                                            ∀ i ∈ N , j ∈ Ei , r ∈ R, s ∈ S, t = 1, . . . , Ts ,              (41)
                                                                                                                              (42)

                  PT
                 ∆Cr ∈ Z+ , ∀ r ∈ R.

   In this model, two constraints (36) and (37) make sure that all equipment requirements are
                                                                                                                              (43)




         CE
satisfied. The constraint (21) in the previous model is replaced by (38). Note that this model does
not need probabilistic information of potential simultaneous disaster scenarios, which can be an
advantage given that, in reality, it is usually difficult to determine the probability of simultaneous

AC
disaster scenarios occurring. To conclude this section, we provide a comparison between the two
proposed models in Table 3. Note that an additional hybrid model, which we call budget-based model
(see Appendix D), is proposed later to incorporate decisions on buying and allocating additional
resources given a limited budget while minimizing the risk of not satisfying all resource requirements
in potential simultaneous disaster scenarios.




                                                              16
```

## Page 19

```text
                                        ACCEPTED MANUSCRIPT




                     Table 3: Comparison between the penalty-based and resource-based model

                             Penalty-base model (P)                       Resource-based model (R)
        Main objective       To minimize the risk of not                  To minimize the cost of
                             satisfying all resource requirements         additional resource capabilities
        Distinct decision    Penalty decision variables ulr,s (t)         Additional resource capability
        variables                                                         decision variables ∆Cr
        Resource             Penalty-related constraints:                 Resource requirements always
        requirement          (18), (19), and (20)                         satisfied:
        constraints                                                       (36) and (37)
        Capacity
        constraints
                             X

                             i∈N
                                   wri ≤ Cr , ∀ r ∈ R
                                                                          X

                                                                          i∈N CR
                                                                              wri ≤ Cr + ∆Cr , ∀ r ∈ R



4. Case Study

4.1. Case Study Development
                                                                                IPT
       To build the models we first wrote a case study of UK planning for a disaster. The case study was

                                                      AN
developed using Critical Incident Case Study method [60] which is used to explore the relationships
between variables in a significant critical situation, so is particularly useful for understanding disaster

                                                        US
response [61]. Our critical incident was the deployment of UK New Dimension resources [53, 3].
We collected data to understand the deployment context and factors to be modelled.
       There were three aspects to developing the case study. First, a document review [11] identified
publicly available details about the New Dimension Programme such as: preparing for three simul-

                                              M
taneous incidents [58] of different types [53], small number of core regions/cities [3], throughputs
[13], protocols for requesting additional resources [3], financial details [36] and regular travel times.


                                ED
Documents were mostly from the UK Government plus limited academic literature. While useful
in giving official government information, the documents did not contain sufficient detail on factors
to model - hence we sought detailed information from collaboration with experts.

                      PT
       Second, we collaborated with a recently retired strategic commander who had 40 years of ex-
perience working in and commanding UK emergency response operations 1 . From this expert we
enhanced our understanding of the factors from the document review and identified new factors to

            CE
better align the models with real world practices. Initially we conducted two unstructured inter-
views with the expert which followed the exploratory method of critical incident technique [60, p2]
which is “used for the study of factors, variables, or behaviours that are critical to the success or

AC
failure of an activity”. Thus, in these interviews the expert talked about critical incidents and past
experiences of managing New Dimension incidents response from which we extracted the structure
of the emergency response context, practical insights, variables and relationships between variables.
For example, we found additional details about appropriate scenarios (flooding and terrorist at-

   1
     Shortly after the 9/11 attacks, the expert was appointed as the UK Chief Fire Officers Association’s national lead
officer for command and control aspects of the New Dimension Programme and, in an associated role, designed the
national course to train the UK’s strategic commanders to prepare them for command of disaster response operations,
including New Dimension, so was a nationally recognised authority.


                                                          17
```

## Page 20

```text
                                  ACCEPTED MANUSCRIPT




tack), transportation of equipment, equipment set up times, manpower and equipment availability,
staff requirements for safe working, and shift breaks. After the first interview we wrote a detailed 7
page case study of New Dimension response to an incident to create a case study scenario (on which
Section 4.2 is based), with timings and resources requests (Figure 3), capacities and requirements
(Table 4) and targets (Tables B.13 and B.14). The case was enhanced with details from the second
interview. The expert provided feedback on each version of the written case study and provided
feedback to correct information and add nuances to enhance its realism. Our initial models were
built based on this case study but many remaining questions led to three follow-up interviews with

                                                                   CR
the expert. As the expert was not a modeller, we did not present our actual models during follow-up
interviews but we did present (in a written and narrative, non-technical manner) their variables,

                                                                     IP
assumptions and logic. To consider how they were treated in the model, each interview took the
expert through new developments of the model to gain feedback on how to more closely align it with

                                                                       T
operational realities - after which the written case was updated and checked by the expert. Also,
by understanding additional nuances we identified variables appropriate for sensitivity analysis. All


                                                 AN
interviews were held across five half-day sessions.
    While the bases for our case were New Dimension practices, on advice of the expert to avoid
political and security considerations we changed or generated some details which had no significance

                                                   US
on the process of analysis. For example, we changed country information (layout, population
information and priority of cities (Fig 3)) and we generated details to respect political sensitivities
(such as location importance - ιi in Tables 6a and 6b), and security considerations (such as risk
likelihoods - qs ).
                                        M
    Lastly, once mature we gave the written case to two other UK commanders who exercised to
receive New Dimension resources for real emergencies. We interviewed these commanders with a

                            ED
view to using their knowledge of our critical incident to check its variables, assumptions and logic to
ensure it was as realistic as possible without compromising sensitivities. Interviews were structured
by the written case as we traced through its contents to gain feedback. The interviews increased

                      PT
our confidence in the case as no major changes were identified. The product was a case which
experts gave us confidence accurately reflected the New Dimension Programme realities and which
is provided in Sections 4.2 and 4.3. We now explain the case.
          CE
4.2. Case Study Description
    We situate our study in a country which has 54 million inhabitants, 27 million of whom live in its

AC
eight major cities (A-H). Each city has a large population with a similar demography. These cities
are considered as network locations where we need to prepare resource allocation for responding
to simultaneous disasters. The estimated travel times between cities are displayed in Figure 3. In
addition, given that the specialist equipment is seldom used and so not stored in the city centre,
we need to consider the time to move equipment to the scene from its storage location within each
city (displayed in bracket next to each city).
    When disasters happen, cities can request the help of equipment/personnel from other cities to
augment their own resources. When a city requests such help, there is an established protocol for

                                                  18
```

## Page 21

```text
                                   ACCEPTED MANUSCRIPT




                                                                        CR
                                                                          IPT
                                                 AN
                   Figure 3: City map, estimated travel times, and resource request orders


                                                   US
the order in which they ask for help. If another city is not able to supply assistance when asked
(or not able to supply sufficient assistance to meet the response targets), the next city on the list
is asked to provide assistance i.e. A will ask B first, C second, and so on until it has sufficient

                                         M
resource. The list is displayed next to each city in Figure 3.
   The national government in this country has a policy that each of the eight cities must plan suffi-
cient emergency resources to address two types of disaster: coordinated terrorist attacks and major
                            ED
flooding. Declaring a disaster means that city officials can ask neighbouring cities for assistance
in the form of emergency response personnel and equipment to help tackle the disaster. Further-
more, the national government has set performance targets that emergency responders should plan
                  PT
to meet. However, even during a disaster, specialists and generalists need 5 hours break between
deployments to allow for recuperation and ensure safe working.

         CE
   The first disaster for which cities must plan is a series of coordinated terrorist attacks involving
radioactive bombs (so-called ‘dirty bombs’) which contaminate an area. Two main tasks needed are
mass decontamination of affected people and urban search and rescue to find victims. To conduct

AC
mass decontamination (MD), responders require a vehicle called an IRU (Incident Response Unit) to
transport the equipment. Each IRU can transport two MD1 structures (to decontaminate members
of public) and one MD4 structure (to decontaminate firefighters and their equipment). Throughput
of each MD1 structure is 150 people processed each hour of operation and there are 72 IRUs within
the country. Urban search and rescue (USAR) operations are conducted using USAR units. There
are 20 USAR units in the country.
   The second disaster is a major flood (either coastal or from nearby reservoirs). The locations
of cities that are more vulnerable to a flood have been identified. The potential for the collapse of


                                                     19
```

## Page 22

```text
                                  ACCEPTED MANUSCRIPT




city structures from flood waters bring the need for two main operations: flood water pumping and
USAR. USAR operations use USAR units as in a terrorist attack disaster. Flood water pumping
operation needs High Volume Pump (HVP) units, each of which consists of one pump vehicle unit
and one hose unit vehicle. There are 46 HVP units available in the country. Requirements for all
three specialist equipment are in Table 4. Note that the demand requirement for IRU is cumulative
while those for other specialist equipment are non-cumulative.
                        Table 4: Capacity and requirements for specialist equipment

                         Unit type
                         Number of units available
                         Specialists per unit
                                                         IRU
                                                          72
                                                          10
                                                                 USAR
                                                                  20
                                                                  10
                                                                       CR  HVP
                                                                            46
                                                                             2
                         Generalists per unit
                         Setup time (mins)
                                                          20
                                                          60
                                                                  25
                                                                  30     IPT
                                                                             5
                                                                            60

   Research has been conducted to estimate the maximum target response levels (e.g. amount of


                                                AN
equipment/personnel) needed to deliver an appropriate weight of response to a disaster taking into
account the population size of each city. The detailed target response levels for terrorist attack
disaster are in Table B.13 while those for flooding disaster are in Table B.14 in Appendix B.

                                                  US
   The objective is to allocate these equipment around the country so that response targets can
be met when simultaneous disasters happen. The national policy requires response to up to three
simultaneous disasters. Therefore, we generate all potential scenarios in which three simultaneous
disasters of a same type happen in three different cities, either terrorist bomb attacks or major
                                         M
flooding. For example, a scenario is three simultaneous disasters happening in any three cities A-H,
e.g., A, B and H. Given our focus is on resource allocation, we will not consider scenarios with less

                            ED
than three simultaneous disasters. Also, we only need to consider maximum target response levels
in the scenarios. If scenarios with maximum target response levels can be handled efficiently, other
scenarios with lower target response levels can be handled appropriately too. Given eight cities

                   PT
and two disaster types, a total 112 scenarios of three simultaneous disasters can be constructed.
Given that there are limited data that can be used to estimate the actual probabilities of these
scenarios, we use equal probabilities for all scenarios in the first model (P) as suggested by the

         CE
experts. Arguably, equal scenario probabilities in this model indicate that inadequate response
levels (due to lack of resources) in any disaster scenarios are equally important. In the next section,
we show how the case study is solved and report the results.

AC
4.3. Computational Results
   Both proposed models, (P) and (R), are mixed-integer optimisation problems with a scenario-
based structure. In this case study, the demand requirements indicate that the time horizon we need
to consider for these disaster scenarios is 10 hours. Given other time-related inputs, it is reasonable
to set the time unit to be 20 minutes, i.e., 30 time periods will be considered over the time horizon.
We heuristically set θ = 10−3 and µ = 10−5 for the secondary objectives and the detailed heuristics
is described in Appendix C.1. The models are solved using IBM CPLEX 12.7 coded in C++ on

                                                    20
```

## Page 23

```text
                                    ACCEPTED MANUSCRIPT




a Linux computer with 3.00 gigahertz CPU and 32 gigabyte RAM. Before reporting the results
obtained from the models, we generate random instances of the models with different numbers of
cities to test the chosen optimisation software the computational aspect. The random instances are
generated with random locations chosen uniformly within a square box of 100 by 100. The travel
times are computed based on their Euclidean distances. The request preferences are determined
based on distances between locations. Simultaneous disaster scenarios are constructed as in the
case study with three disasters of a same type (either flooding or terrorist attack) happening at
three different cities. The setup times are also randomly generated but the maximum setup time

                                                                         CR
is set to be 3 time periods. The periods when resource requirements are provided are generated
randomly within the planning horizon with the total number of these periods is kept the same as

                                                                           IP
in the case study. The first of these periods is generated such that it is always possible to fulfil the
requests if there are enough resources by taking into consideration the setup times. The amounts

                                                                             T
of resources requested are randomly generated using a uniform distribution with the maximum
variation of 20% from the amount requested of the same resource in the case study. Finally, we


                                                  AN
keep the deployment duration the same as in the case study. Using this data generation procedure,
we generate 10 instances for each value of |N |, the number of locations, from 5 to 12. Figure C.13
in Appendix C.2 shows the city locations in a 9-city random instance while Figure C.14 shows

                                                    US
different time-dependent IRU resource requirements in 10 different random instances.
   We solve generated random instances using IBM CPLEX with MIP relative gap of 0.01% and
time limit of 3600 seconds. Figure 4 shows sizes of these instances in terms of number of decision

                                          M
variables and number of constraints for the model (P). The average computational times as well as
the worst-case and best-case computational times among 10 instances are plotted in Figure 5 given
different numbers of locations. We focus mainly on results of the model (P) here. For the model

                             ED
(R), similar results of computational times are obtained - reported in Figure C.15 in Appendix C.3.




                   PT
         CE        Figure 4: Problem sizes of model (P) given different numbers of locations

AC The results show that the size of the problem increases almost exponentially in terms of the
number of locations. For |N | = 11, there are almost 107 decision variables and 1.5 × 106 constraints.
Computational times also increase exponentially in terms of the number of locations. Among 10
randomly generated instances for |N | = 11, there is one instance that cannot be solved within the
time limit (returning zero first-stage solutions which are feasible). The remaining instances can
be solved with the average computational time of approximately 2800 seconds. For |N | = 12, all
generated instances cannot be solved within the time limit. Given their large sizes, approximately


                                                      21
```

## Page 24

```text
                                   ACCEPTED MANUSCRIPT




               Figure 5: Computational times of model (P) given different numbers of locations

                                                                        CR
1.5 × 107 decision variables and 2 × 106 constraints, the physical memory required to handle these

                                                                          IP
instances exceeds 20 gigabytes. We solve one of the instances again without time limit and an


                                                                            T
optimal solution is found (with the given MIP optimality gap of 0.01%) after approximately 9000
seconds during which the physical memory required increases to almost 30 gigabytes. There are
few heuristics to solve large-scale mixed-integer stochastic optimisation problems such as integer

                                                 AN
L-shaped algorithms [28] which rely on optimality cuts or progressive hedging algorithms (PHA)
(see, e.g.,[59, 20]) which use scenario decomposition. For the two proposed stochastic optimisation
models, scenario decomposition is more effective than the introduction of optimality cuts to provide

                                                   US
approximation of the second-stage objective. Given that the main case study, which is a focus of
the paper, can be solved by IBM CPLEX, we only report some results of the PHA heuristic in
Appendix C.4. Results obtained for the case study are reported next.

                                         M
4.3.1. Penalty-Based Model and Location Importance
   The first model (P) provides us with resource allocation given the existing capabilities of the

                            ED
country. For these experiments, we set the importance of all locations to be the same, i.e., ιi = 1 for
all i ∈ N . The results show in every scenario considered with three simultaneous disasters, there
are not enough USAR units to meet the demand for USAR operations. Given 20 USAR units are

                   PT
available in the country, the model recommends to place 10 units in A and 10 units in C. This is
reasonable given that the resource requirements in A are the highest while the location of C acts as
a transit hub, which allows us to move equipment and personnel around efficiently. For example,

         CE
when three simultaneous terrorist attacks happen in A, B, and D, the optimal solution is to use 10
USAR units located in A for the attack in A while moving 10 USAR units located in C to D. Both
A and C need 5 more USAR units to fulfill the requirements while B received no USAR units at

AC
all. A similar situation arises for scenarios with three simultaneous flooding disasters. For example,
when there are floods happening in F, G, and H at the same time, certain USAR units are moved
from A and C to H and F to partially satisfy the demand requirements while G received no USAR
units. Figure 6 shows two cases of unsatisfied demands happening in these examples.
   In contrast to USAR resource, the results show that there are enough IRUs and HVP units.
The allocation of all resources are displayed in Table 5a. It also shows that we only need to use
48 (out of 72) IRUs and 35 (out 46) HVP units without causing any issue in handling the given
scenarios of three simultaneous disasters, either terrorist attacks or major flooding. For HVP, the

                                                     22
```

## Page 25

```text
                                     ACCEPTED MANUSCRIPT




                                                                            CR
                   Figure 6: Unsatisfied demands due to insufficient number of USAR units


                                                                              IP
results indicate that D and G are also important given that they can act as transit hubs, from where

                                                                                T
equipment and resources can be delivered to disaster sites efficiently when requested.
   Given that we need extra specialists to handle deployment breaks, the number of specialists


                                                    AN
based in each city can be higher than the number required to handle the specialist equipment. For
example, the results show 30 HVP specialists are required in A (instead of 20 to handle 10 HVP
units). These extra specialists will be transfered to disaster locations to replace the first group of

                                                      US
specialists during their deployment breaks if needed when disasters happen. Similarly, even though
there is no USAR units located in B and D, the model recommends to keep some specialists at
these two locations so that deployment breaks can be handle efficiently. In addition to allocation

                                           M
decisions, the results from the model also provide operational decisions, i.e., how to send specialist
equipment and personnel between cities to handle demand requirements when disasters happen.
Examples of these operations are given in Appendix B for two scenarios, one for terrorist attacks

                             ED
and the other for major flooding.
                           Table 5: Resource allocation results from different models


  scenarios        PT
  (a) Stochastic optimisation model with all


            A    B    C     D    E    F   G     H
                                                           (b) Single scenario of three bomb attacks at A,
                                                           B, and D
                                                                       A    B     C     D   E   F   G   H
    IRU
   USAR
   HVP
         CE 6
            10
            10
                 6
                 0
                 3
                      6
                      10
                      3
                            6
                            0
                            5
                                 6
                                 0
                                 3
                                      6
                                      0
                                      3
                                          6
                                          0
                                          5
                                                6
                                                0
                                                3
                                                             IRU
                                                            USAR
                                                            HVP
                                                                        6
                                                                       10
                                                                        0
                                                                             6
                                                                            10
                                                                             0
                                                                                  0
                                                                                  0
                                                                                  0
                                                                                        6
                                                                                        0
                                                                                        0
                                                                                            0
                                                                                            0
                                                                                            0
                                                                                                0
                                                                                                0
                                                                                                0
                                                                                                    0
                                                                                                    0
                                                                                                    0
                                                                                                        0
                                                                                                        0
                                                                                                        0


AC To evaluate the stochastic optimisation model, we compute two measures, the Expected Value
of Perfect Information (EVPI) and the Value of Stochastic Solution (VSS). The EVPI considers the
penalties obtained from wait-and-see solutions for individual scenarios, i.e. with perfect information,
and compares the expected value (WS) of these penalties with the expected penalty (RP) obtained
from the stochastic optimisation model (P). On the other hand, the VSS compares the performance
of solutions obtained from the deterministic model when data are assumed to be deterministic with
that of the solution obtained from the stochastic optimisation model in terms of expected penalty.
For this case study, the expected value of the penalties obtained with wait-and-see solutions is

                                                      23
```

## Page 26

```text
                                      ACCEPTED MANUSCRIPT




WS = 215.01 while the minimal expected penalty of the stochastic optimisation model is RP =
289.66. The EVPI is computed as EVPI = RP - WS = 74.65. It shows that the expected penalty
is decreased by 25.77% with perfect information. In order to compute VSS, we need to select data
for the deterministic model as a reference. Given that there is no “average” scenario to represent
all scenarios, we use individual disaster scenarios as reference data for the deterministic model. We
compare the expected penalties (EEVs) obtained from these 112 deterministic solutions with the
expected penalty obtained from the stochastic solution and the VSS measure is computed as VSS
= EEV - RP. The results show that the average expected penalty from deterministic solutions is

                                                                         CR
2028.66 (7 times increase), the minimum is 1489.30 (5 times increase) while the maximum is 2545.10
(8 times increase). Under this setting of reference data for the deterministic model, wait-and-see

                                                                           IP
solutions for individual scenarios are solutions of deterministic models. These solutions focused only
on three locations specified in each scenario. For example, when there are three simultaneous bomb

                                                                             T
attacks at A, B, and D, the optimal solution is to allocate 6 IRUs at each of these locations, 10
USARs each at A and B, and there is no need to allocate any HVPs (see Table 5b).


                                                   AN
   Clearly, if this scenario happens, the wait-and-see solution mentioned will results in the minimum
penalty, which shows the value of perfect information. However, if a different scenario happens,
no matter whether it is another bomb attack scenario at different locations or a flooding scenario,

                                                     US
the provided solution will not be able to cope. Indded, it performs much worse with the expected
penalty of 1646.30 than the stochastic solution (RP=289.66) given the stochastic solution considers
all scenarios in which disasters can happen at any three locations and it reflects how resources are

                                         M
allocated as shown in Table 5a. The analysis of VSS therefore indicates the importance of the
stochastic solution compared to deterministic solutions in this case study.
   The initial setting of location importance assumes that the risk of not satisfying resource re-

                            ED
quirements at any location is equivalently significant. In reality, these parameters can be set by
disaster managers based on different criteria. We present here two potential approaches to set the
importance ιi of all locations. The first approach is based on the level of resource requirements at

                     PT
each location. Given the resource requirements in Tables B.13 and B.14, we run model (P) with two
additional settings, I1 and I2, for location importance, which splits the locations into three groups
based on population size, (A), (D,G), and (B,C,E,F,H). These settings are shown in Table 6a.
          CE          Table 6: Location importance settings based on different criteria

                (a) Population size                                        (b) Geopolitics

AC   I1
     I2
          A
          1
          1
                D
               0.5
               0.5
                     G
                     0.5
                     0.5
                            B
                           0.2
                           0.1
                                  C
                                 0.2
                                 0.1
                                        E
                                       0.2
                                       0.1
                                              F
                                             0.2
                                             0.1
                                                     H
                                                    0.2
                                                    0.1
                                                             I3
                                                             I4
                                                                   A
                                                                  0.2
                                                                  0.1
                                                                          B
                                                                         0.5
                                                                         0.5
                                                                                C
                                                                               0.5
                                                                               0.5
                                                                                       D
                                                                                      0.5
                                                                                      0.5
                                                                                              H
                                                                                             0.5
                                                                                             0.5
                                                                                                   E
                                                                                                   1
                                                                                                   1
                                                                                                       F
                                                                                                       1
                                                                                                       1
                                                                                                           G
                                                                                                           1
                                                                                                           1

   With these two settings of location importance, the results show that the allocation of equipment
remains the same as the original setting. The changes appear in the allocation of specialists,
especially the specialists for USAR units. Figure 7a shows these changes in detail with I0 denoting
the original setting of location importance. The results show that when we reduce the importance of


                                                     24
```

## Page 27

```text
                                    ACCEPTED MANUSCRIPT




other locations as compared to that of A, the allocation of USAR specialists concentrates more and
more on A (due to its importance and size). On the other hand, the allocation of USAR specialists
in C reflects the significance of its transit hub nature.




                                                                              CR
              Figure 7: USAR specialist allocation given different settings of location importance




                                                                                IP
   The second approach of how to set the importance parameters is based on a hypothetical po-
litical assumption under which the three northern locations E, F, and G are the most important

                                                                                  T
whereas the southern location A is the least important. The two additional settings of importance
parameters, I3 and I4, are shown in Table 6b.


                                                    AN
   With these two new settings of location importance, the allocation of USAR units is completely
changed. One now should allocate 10 USAR units in D and the remaining 10 units in G, which
shows the importance of G as well as the transit hub nature of both D and G. The allocation of

                                                      US
USAR specialists is also changed with the results shown in Figure 7b. Similar to the allocation of
USAR units, the allocation of USAR specialists emphasize the importance of D and G. When the
importance of A is reduced further, the allocation of USAR specialist concentrates more on D and
G. These results show that it is critical to calibrate these importance settings appropriately.
                                              M
4.3.2. Resource-Based Model and Budget Analysis


                             ED
   Given the need more equipment to satisfy resource requirements when the given simultaneous
disaster scenarios happen, we now run the second model (R) to figure out the needed additional
amounts of resources. For this model (R), we use the costs per unit shown in Table 7.

                   PT Table 7: Cost per unit (in million pounds) for specialist equipment

                                              IRU     USAR         HVP
                                         γr   0.77     4.4         1.17
         CE
   The results show that one would need 25 more USAR units (or 45 units in total) to efficiently
handle all given simultaneous disaster scenarios and no additional IRUs or HVP units are required.
AC
The allocation of USAR units does not concentrate on A and C any more. The additional units
are allocated in various locations and it shows that G is an important location given its transit hub
nature. The detailed allocation is shown in Table 8.
                         Table 8: Allocation of USAR units given additional resources

                                    A     B    C     D     E   F    G     H
                                    10    0    10    5     5   5    9     1



                                                      25
```

## Page 28

```text
                                        ACCEPTED MANUSCRIPT




    We now consider the effect of number of simultaneous disasters in each scenario on required
resources. We vary the number of simultaneous disasters in each scenario from 1 to 7 and solve the
model (R) using all scenarios in each case. Table 9 shows the total number of scenarios, |Sk |, given
k simultaneous disasters in each scenario, for k = 1, . . . , 7.
               Table 9: Total number of scenarios given different number of simultaneous disatsers

                                 k      1    2     3      4      5     6     7
                                |Sk |   16   56   112    140    112    56    16


                                                                            CR
    The results show that allocations for HVPs remain the same in all cases while those for IRUs
only reduce slightly, by 4 IRUs when k = 1 and 1 IRUs when k = 2). It implies there are enough

                                                                              IP
IRUs and HVPs and their allocations allows us to handle effectively multiple disasters at different


                                                                                T
locations simultaneously with minimum requests from other locations. On the other hand, there are
not enough USAR units and even for scenarios with single disasters, we still need 10 more USAR
units. Figure 8 shows the total numbers of additional USAR units needed to handle scenarios of k
simultaneous disasters, k = 1, . . . , 7.
                                                   AN
                                                     US
                                             M
       Figure 8: Number of additional USAR units needed given different number of simultaneous disasters

                              ED
    The number of additional USAR units needed is increased when the number of simultaneous
disasters in each scenario increases, showing more USAR units are essential since they are needed

                    PT
in both types of disasters. Similar to the original case of three simultanous disasters, in addition
to A and C being important locations, G also becomes important with a high number of allocated
USAR units. For example, when there are k = 7 simultaneous disasters in each scenarios, 15 USAR

          CE
units are allocated at G, which is the same allocated at A and C.
    The need of additional resources depends on resource requirements in each scenario. In the next
experiment, we vary the resource requirements with a scaling factor σ, i.e., dlr (t) ← σ · dlr (t) and

AC
dl0 (t) ← σ ·dl0 (t) for all r, l, and t, where σ ∈ [0.4, 1.6]. Figure 9 shows the total amounts of resources
needed to handle three simultaneous disasters with different levels of resource requirements. We
can see that when σ = 0.4, no additional resources are needed and when σ = 1.6, all three resources
requires additional units. The results show that the current capacity of HVPs is appropriate for a
slight increase (less than 20%) in the level of resource requirements while that of IRUs can handle
three simultaneous disasters if the resource requirements are increased by 50%. The constraint is
the USAR resource, whose current capacity can only handle less than 50% of the current level of
resource requirements.

                                                        26
```

## Page 29

```text
                                     ACCEPTED MANUSCRIPT




                                                                           CR
                                                                             IP
           Figure 9: Total mumbers of resource units needed given different resource requirement levels


                                                                               T
   Next, we analyse the effect of the budget for additional resources. To effectively handle three
simultanous disasters, the total amount of money needed for additional resources is £110m. In

                                                   AN
reality, the budget could be smaller and we now analyse the impact of budget on how to buy and
allocate additional resources. In order to do so, we construct a new model (B) (B for budget)

                                                     US
which incorporates decisions buying and allocating additional resources with a given budget while
aiming to minimize the risk of not satisfying all resource requirements when simultaneous disaster
scenarios happen. The budget-based model (B) can be constructed based on the two proposed
models (P) and (R) with an additional budget parameter B. The details of the model (B) are
                                            M
presented in Appendix D. We run the model (B) with different levels of budget B while considering
two importance settings, I1 and I3. It is obvious that the budget will be used for additional USAR

                              ED
units given that other resources are already sufficient. Figure 10 shows the allocation results of
additional USAR units under those two settings for location importance. The total number of
USAR units increases from 20 to 42 when the budget increases from 0 to £100m. When the budget

                    PT
is small, the location importance plays a significant role in deciding where to allocate USAR units.
If the budget is increased, additional USAR units are spread to various locations, especially those
which can act as transit hubs (C, D and G). When the budget is close to sufficient (B = 100),

         CE
both allocation results are exactly the same, which shows that the diminishing influence of location
importance setting. The results are close to the ones obtained from the model (R) of unlimited
budget without any location importance setting. In the next section, we discuss the implications of

AC
these results for our case study as well as disaster planning applications in general.




     Figure 10: Allocation of USAR units given different budgets under different location importance settings



                                                       27
```

## Page 30

```text
                                    ACCEPTED MANUSCRIPT




5. Discussions and Conclusions

   The proposed models are built to address two issues faced by decision makers in disaster plan-
ning. The first issue is how to minimize the risk of not being able to meet the response targets for all
disaster scenarios given existing capabilities. The second issue is how to reduce or eliminate that risk
by purchasing additional resources. We have demonstrated that these issues can be addressed using
the proposed stochastic optimisation models. Real constraints such as requirements on deployment
breaks can be handled effectively in these mathematical optimisation models. For the first model,


                                                                        CR
we argue that equal scenario probabilities can be considered if there are limited data. However, if
we gather experts’ opinions on the risks (or probabilities) of these simultaneous disaster scenarios


                                                                          IP
and estimate them with some confidence intervals, the stochastic optimisation model (P) could be
extended to a robust stochastic optimisation model to handle the ambiguity in scenario probabilities

                                                                            T
(see, e.g., [54]). In practice, it could be difficult for experts to estimate such risks [40]. This difficulty
is reflected in the UK where the national government’s Cabinet Office only publishes estimates of
single events occurring in the next five years e.g. coastal and inland flooding are estimate to have

                                                  AN
a probability of “between 1 in 200 and 1 in 20”; while “catastrophic terrorist attacks” is “medium
low” [37]. Similar to scenario probabilities, it is also difficult to estimate the (maximum) target

                                                    US
response levels for disaster scenarios, i.e., the scales of the simultaneous disasters, especially when
they are time dependent. The proposed models could benefit from an accurate estimation model of
these disaster scales or one could attempt to model the uncertainty of these target respone levels
in a relevant robust stochastic optimisation model. Computationally, the proposed models have a

                                          M
large number of second-stage decision variables and constraints due to the multi-period structure
of its second stage. Even though the focus of the paper is the case study, further development of


                             ED
more efficient heuristics could be useful for larger applications.
   Models such as the ones described in this paper present new ways of analysing the issues to
identify efficient configurations of resources for disaster response. One practical consideration often
missing from these models, however, is the political nature of decision making which is especially
                    PT
notable in disaster management [50, 41]. In the preparedness phase, resource allocations should
recognize the characteristics of an area/city, i.e., that different cities have different hazards, risks,

         CE
vulnerabilities and defenses [50]. Thus, citizens will experience disasters differently because of how
they have prepared their personal resilience [51] and because of exogenous factors, for example:
the ease of access to physical upgrades to better disaster-proof houses [32]; societal deprivation

AC
that reduces local resource availability to attenuate negative effects; operational limitations that
cause response systems to operate sub-optimally [42]. Partly because disasters are evocative, many
characteristics (including those mentioned here) are politically charged so resource allocations can
be politically influenced especially when inequalities across a population are exposed and make
headlines. Here, the equality of citizens concept [62] highlights the need for government to establish
a consistency of response for citizens irrespective of where they live to ensure that local inequalities
of preparedness do not put some people at a disproportionate risk. In both preparation and response
there exists a tension between the need for equality across a country and enhanced protection of


                                                     28
```

## Page 31

```text
                                  ACCEPTED MANUSCRIPT




areas of special importance, for example, those that contain critical national infrastructure or create
national economic wellbeing. Consequently, some areas may be perceived to receive priority when
resource allocations are decided. Thus, while our results may indicate rational allocations, these are
not necessarily politically feasible [31]. Ultimately, the intervention of political will could inform
solutions because disasters are political spaces [55]. Although a limitation, this is also the strength
of analytical models in their power to bring transparency and evidence to such decisions - cutting
through political biases. In our proposed models, we introduce the local importance parameters
which decision makers can set to partially balance out the political dimensions of implementation
when the final decisions are made.
                                                                    CR
   Another practical consideration made in this paper is that the decision makers are expert risk

                                                                      IP
managers, potentially with knowledge and know-how relevant to the models [41] but not with
an analytical training. This is problematic as Gonçalves [22] found that humanitarian decision

                                                                        T
makers often rely on experience and simple decision heuristics which lead to non-optimal decisions.
Analytical models offer different ways of thinking but the skills required to decipher their intricacies


                                               AN
(and their results) may not be possessed by potential users. Thus, we concentrate on aligning our
model as closely as possible to information actually available in the context - to allow for maximum
translation by emergency responders. Aligned with this is our assertion that our models are more

                                                 US
useful in the planning phase rather than in the heat of emergency response, especially the budget
model to consider the purchase of additional resource. In trainings, potential users can benefit
from the analytical capabilities offered by such models e.g. to stress test their knowledge of the

                                        M
relationship between variables; experiment with resource configurations to explore the dynamics
of the system they seek to understand; and, tailor the inputs, processes and outputs to their
particular context. Once confidence has been built in training sessions, testing their ability to

                            ED
calculate optimality during emergency exercises (and thereby produce output to be integrated into
the decision making process) is a step towards operational deployment during real incidents.
   In conclusion, we began this paper by noting that the allocation of scarce resources is a challenge

                   PT
for disaster preparation and response and this is especially apparent given the political nature of
the contexts. The models we provide can inform decisions by giving an evidence base to balance the
politics when allocating scarce national resource so that all citizens are equally protected from the
         CE
effects of simultaneous disasters. While there may be a temptation to procure as much equipment
as funds allow, the balance of different types of equipment requires understanding of the tradeoffs
in achieving performance targets. Such models are institutionalised in other fields and so their
AC
propagation in disaster management is worthwhile to inform investment and allocation decisions.
On future work, robust stochastic optimisation models could be considered to handle the ambiguity
in scenario probabilities and the uncertainty in target response levels. Computationally, efficient
heuristics for larger instances, perhaps with additional practical constraints, are also relevant as
future work.




                                                  29
```

## Page 32

```text
                                  ACCEPTED MANUSCRIPT




Acknowledgement

   The authors thank two anoymnous reviewers for their valuable comments and detailed sugges-
tions on improving the manuscript.



References

 [1] P. Agarwal, A. Efrat, S. Ganjugunte, D. Hay, S. Sankararaman, and G. Zussman. Network

     Conference, MILCOM 2010, pages 1824–1829. IEEE, 2010.         CR
     vulnerability to single, multiple, and probabilistic physical attacks. In Military Communications

 [2] Federal Emergency Management Agency. Nation Prepared: Federal Emergency Management


     attack. Computers & Operations Research, 35(6):1924–1943, 2008.
                                                                     IP
     Agency Strategic Plan, Fiscal Year 2003-2008. U.S. Department of Homeland Security, 2003.
 [3] P. Albores and D. Shaw. Government preparedness: Using simulation to prepare for a terrorist

                                                                       T
 [4] D. Alem, A. Clark, and A. Moreno. Stochastic network models for logistics planning in disaster
     relief. European Journal of Operational Research, 255(1):187–206, 2016.

                                              AN
 [5] N. Altay and W. Green. OR/MS research in disaster operations management. European Journal
     of Operational Research, 175(1):475–493, 2006.
 [6] A. Anaya-Arenas, J. Renaud, and A. Ruiz. Relief distribution networks: a systematic review.

                                                US
     Annals of Operations Research, 223(1):53–79, 2014.
 [7] N. Bastian, P. Griffin, E. Spero, and L. Fulton. Multi-criteria logistics modeling for military
     humanitarian assistance and disaster relief aerial delivery operations. Optimization Letters,
     10(5):921–953, 2016.

                                       M
 [8] A. Ben-Tal, B. Chung, R. Mandala, and T. Yao. Robust optimization for emergency logistics
     planning: Risk mitigation in humanitarian relief supply chains. Transportation Research Part
     B: Methodological, 45(8):1177–1189, 2011.

     2009.                 ED
 [9] A. Ben-Tal, L. El Ghaoui, and A. Nemirovski. Robust optimization. Princeton University Press,

[10] V. Bier, N. Haphuriwat, J. Menoyo, R. Zimmerman, and A. Culpen. Optimal resource al-
     location for defense of targets based on differing measures of attractiveness. Risk Analysis,
                  PT
     28(3):763–770, 2008.
[11] G. Bowen. Document analysis as a qualitative research method. Qualitative Research Journal,
     9(2):27–40, 2009.

         CE
[12] K.-M. Bryson, H. Millar, A. Joseph, and A. Mobolurin. Using formal MS/OR modeling to
     support disaster recovery planning. European Journal of Operational Research, 141(3):679–
     688, 2002.
[13] H. Carter, J. Drury, R. Amlôt, G. Rubin, and R. Williams. Effective responder communication
AC   improves efficiency and psychological outcomes in a mass decontamination field experiment:
     implications for public behaviour in the event of a chemical incident. PloS ONE, 9(3):e89846,
     2014.
[14] M.-S. Chang, Y.-L. Tseng, and J.-W. Chen. A scenario planning approach for the flood emer-
     gency logistics preparation problem under uncertainty. Transportation Research Part E: Lo-
     gistics and Transportation Review, 43(6):737–754, 2007.
[15] Y.-C. Chiu and H. Zheng. Real-time mobilization decisions for multi-priority emergency re-
     sponse resources and evacuation groups: model formulation and solution. Transportation Re-
     search Part E: Logistics and Transportation Review, 43(6):710–736, 2007.


                                                 30
```

## Page 33

```text
                                  ACCEPTED MANUSCRIPT




[16] D. Coppola. Introduction to international disaster management. Butterworth-Heinemann,
     2006.
[17] L. de la Torre, I. Dolinskaya, and K. Smilowitz. Disaster relief routing: Integrating research
     and practice. Socio-Economic Planning Sciences, 46(1):88–97, 2012.
[18] M. Fagel. Principles of emergency management and emergency operations centers (EOC). CRC
     Press, 2016.
[19] F. Fiedrich, F. Gehbauer, and U. Rickers. Optimized resource allocation for emergency response
     after earthquake disasters. Safety Science, 35(1):41–57, 2000.
[20] D. Gade, G. Hackebeil, S. Ryan, J.-P. Watson, R. Wets, and D. Woodruff. Obtaining lower

     ematical Programming, 157(1):47–67, 2016.                     CR
     bounds from the progressive hedging algorithm for stochastic mixed-integer programs. Math-

[21] G. Galindo and R. Batta. Review of recent developments in OR/MS research in disaster


     operations. Operations Management Research, 4(1):39–50, 2011.
                                                                     IP
     operations management. European Journal of Operational Research, 230(2):201–211, 2013.
[22] P. Gonçalves. Balancing provision of relief and recovery with capacity building in humanitarian

                                                                       T
[23] M. Grabowski, C. Rizzo, and T. Graig. Data challenges in dynamic, large-scale resource
     allocation in remote regions. Safety Science, 87:76–86, 2016.

                                               AN
[24] L. Green and P. Kolesar. Anniversary article: Improving emergency responsiveness with man-
     agement science. Management Science, 50(8):1001–1014, 2004.
[25] Y. Huang, Y. Fan, and R. Cheu. Optimal allocation of multiple emergency service resources for

                                                 US
     protection of critical transportation infrastructure. Transportation Research Record: Journal
     of the Transportation Research Board, 2022:1–8, 2007.
[26] A. Iannoni and R. Morabito. A multiple dispatch and partial backup hypercube queuing model
     to analyze emergency medical systems on highways. Transportation Research Part E: Logistics

                                        M
     and Transportation Review, 43(6):755–771, 2007.
[27] W. Kroshl, S. Sarkani, and T. Mazzuchi. Efficient allocation of resources for defense of spatially
     distributed networks using agent-based simulation. Risk Analysis, 35(9):1690–1705, 2015.

                            ED
[28] G. Laporte and F. Louveaux. The integer L-shaped method for stochastic integer programs
     with complete recourse. Operations Research Letters, 13(3):133–142, 1993.
[29] C. MacKenzie, H. Baroud, and K. Barker. Static and dynamic resource allocation models for
     recovery of interdependent systems: application to the Deepwater Horizon oil spill. Annals of

                   PT
     Operations Research, 236(1):103–129, 2016.
[30] C. MacKenzie and C. Zobel. Allocating resources to enhance resilience, with application to
     Superstorm Sandy and an electric utility. Risk Analysis, 36(4):847–862, 2016.

         CE
[31] A. Meltsner. Political feasibility and policy analysis. Public Administration Review, pages
     859–867, 1972.
[32] E. Michel-Kerjan, S. Hochrainer-Stigler, H. Kunreuther, J. Linnerooth-Bayer, R. Mechler,
     R. Muir-Wood, N. Ranger, P. Vaziri, and M. Young. Catastrophe risk models for evaluat-
AC   ing disaster risk reduction investments in developing countries. Risk Analysis, 33(6):984–999,
     2013.
[33] R. Minciardi, R. Sacile, and E. Trasforini. Resource allocation in integrated preoperational
     and operational management of natural hazards. Risk Analysis, 29(1):62–75, 2009.
[34] A. Nagurney, E. Flores, and C. Soylu. A generalized Nash equilibrium network model for post-
     disaster humanitarian relief. Transportation Research Part E: Logistics and Transportation
     Review, 95:1–18, 2016.
[35] M. Najafi, K. Eshghi, and W. Dullaert. A multi-objective robust optimization model for
     logistics planning in the earthquake response phase. Transportation Research Part E: Logistics


                                                  31
```

## Page 34

```text
                                 ACCEPTED MANUSCRIPT




     and Transportation Review, 49(1):217–249, 2013.
[36] House of Commons. New Dimension - enhancing the Fire and Rescue Services’ capacity to
     respond to terrorist and other large-scale incidents. Technical Report Tenth Report of Session
     2008–09, Public Accounts Committee, UK Government, 2009.
[37] Cabinet Office. National risk register for civil emergencies - 2015 edition. Technical report,
     UK Government, 2015.
[38] L. Özdamar and O. Demir. A hierarchical clustering and routing procedure for large scale
     disaster relief logistics planning. Transportation Research Part E: Logistics and Transportation
     Review, 48(3):591–602, 2012.

                                                                  CR
[39] L. Özdamar and M. Ertem. Models, solutions and enabling technologies in humanitarian
     logistics. European Journal of Operational Research, 244(1):55–65, 2015.
[40] E. Paté-Cornell. On “black swans” and “perfect storms”: risk analysis and management when

                                                                    IP
     statistics are not enough. Risk Analysis, 32(11):1823–1833, 2012.
[41] J. Powell, N. Mustafee, A. Chen, and M. Hammond. System-focused risk identification and as-

                                                                      T
     sessment for disaster preparedness: Dynamic threat analysis. European Journal of Operational
     Research, 254(2):550–564, 2016.
[42] G. Preece, D. Shaw, and H. Hayashi. Application of the viable system model to analyse

     Operational Research, 243:312–322, 2015. AN
     communications structures: A case study of disaster response in Japan. European Journal of

[43] N. Rachaniotis, T. Dasaklis, C. Pappis, and L. van Wassenhove. Multiple location and routing

     2013.                                      US
     models in humanitarian logistics. In Humanitarian and relief logistics, pages 43–57. Springer,

[44] M. Rahnamay-Naeini, J. Pezoa, G. Azar, N. Ghani, and M. Hayat. Modeling stochastic cor-
     related failures and their effects on network reliability. In Proceedings of 20th International

                                       M
     Conference on Computer Communications and Networks (ICCCN), pages 1–6. IEEE, 2011.
[45] K. Ransikarbum and S. Mason. Multiple-objective analysis of integrated relief supply and
     network restoration in humanitarian logistics operations. International Journal of Production

                           ED
     Research, 54(1):49–68, 2016.
[46] C. Rawls and M. Turnquist. Pre-positioning and dynamic delivery planning for short-term
     response following a natural disaster. Socio-Economic Planning Sciences, 46(1):46–54, 2012.
[47] N. Ray-Bennett. Multiple disasters and policy responses in pre-and post-independence Orissa,

                  PT
     India. Disasters, 33(2):274–290, 2009.
[48] J. Salmerón and A. Apte. Stochastic optimization for natural disaster asset prepositioning.
     Production and Operations Management, 19(5):561–574, 2010.

         CE
[49] A. Settle. Financing disaster mitigation, preparedness, response, and recovery. Public Admin-
     istration Review, 45:101–106, 1985.
[50] X. Shan and J. Zhuang. Cost of equity in homeland security resource allocation in the face of
     a strategic attacker. Risk Analysis, 33(6):1083–1099, 2013.
AC
[51] D. Shaw, J. Scully, and T. Hart. The paradox of social resilience: How cognitive strategies
     and coping mechanisms attenuate and accentuate resilience. Global Environmental Change,
     25:194–203, 2014.
[52] Z. Su, G. Zhang, Y. Liu, F. Yue, and J. Jiang. Multiple emergency resource allocation for
     concurrent incidents in natural disasters. International Journal of Disaster Risk Reduction,
     17:199–212, 2016.
[53] New Dimension Regional Team. National guidance document: Fire service mass decontamina-
     tion. Technical report, New Dimension Regional Team, 2003.
[54] A. Thiele. Robust stochastic programming with uncertain probabilities. IMA Journal of


                                                 32
```

## Page 35

```text
                                 ACCEPTED MANUSCRIPT




     Management Mathematics, 19(3):289–321, 2007.
[55] V. Tselios and E. Tompkins. Local government, political decentralisation and resilience to
     natural hazard-associated disasters. Environmental Hazards, 2017. Forthcoming.
[56] G.-H. Tzeng, H.-J. Cheng, and T. Huang. Multi-objective optimal planning for designing
     relief delivery systems. Transportation Research Part E: Logistics and Transportation Review,
     43(6):673–686, 2007.
[57] J. Wang, X. Gu, and T. Huang. Using Bayesian networks in analyzing powerful earthquake
     disaster chains. Natural Hazards, 68(2):509–527, 2013.
[58] B. Ward. Work of the national resilience team. In Fleet Engineers Conference & Exhibition,
     2011.
                                                                 CR
[59] J.-P. Watson and D. Woodruff. Progressive hedging innovations for a class of stochastic mixed-
     integer resource allocation problems. Computational Management Science, 8(4):355–370, 2011.

     247–248, 2010.                                                IP
[60] T. Weatherbee. Critical incident case study. Encyclopedia of Case Study Research, pages


                                                                     T
[61] K. Weick. The vulnerable system: An analysis of the Tenerife air disaster. Journal of Man-
     agement, 16(3):571–593, 1990.
[62] P. Werbner. Exoticising citizenship: anthropology and the new citizenship debate. Canberra
     Anthropology, 21(2):1–27, 1998.
                                             AN
[63] F. Wex, G. Schryen, S. Feuerriegel, and D. Neumann. Emergency response in natural disaster
     management: Allocation and scheduling of rescue units. European Journal of Operational
     Research, 235(3):697–708, 2014.
                                               US
[64] Q. Xu, S. Zhang, and W. Li. Spatial distribution of large-scale landslides induced by the 5.12
     Wenchuan earthquake. Journal of Mountain Science, 8(2):246–260, 2011.
[65] T. Yao, S. Mandala, and B. Chung. Evacuation transportation planning under uncertainty: A

                                      M
     robust optimization approach. Networks and Spatial Economics, 9(2):171–189, 2009.
[66] W. Yi and A. Kumar. Ant colony optimization for disaster relief operations. Transportation
     Research Part E: Logistics and Transportation Review, 43(6):660–672, 2007.


     11071, 2012.
                           ED
[67] J.-H. Zhang, J. Li, and Z.-P. Liu. Multiple-resource and multiple-depot emergency response
     problem considering secondary disasters. Expert Systems with Applications, 39(12):11066–



                  PT
Appendix A. Reviews of Papers in Resource Allocation in Disaster Management

   Tables A.10, A.11, and A.12 list a variety of papers in resource allocation in disasters manage-
        CE
ment with different models, objectives, and settings.



AC

                                                33
```

## Page 36

```text
                                                        Table A.10: Reviews of papers in resource allocation disaster management
                            AC
     Citation               Model Type                     Objective(s)                            Characteristic(s)                                           Types of event         Disaster stage
     This paper                                                                                                                                                Terrorist    and       Preparedness     /
                            Two-stage stochastic opti-     Minimise the penalty of not being       Response     capacity    to    simultaneous   incidents     flooding               Response
                            misation                       able to satisfy demand and mini-        happening across a country based on,                de-
                                                           mize the total cost of additional ca-   mand/availability/targets, deployment regulations,
                                                           pacities to meet demand                 protocols for requesting assistance from other cities,
                                                                                                   transportation
                                         CE
     Agarwal     et   al,   Combinatorial    optimisa-                                             Probabilistic network failure model including: nodes                               Mitigation
     2010 [1]               tion                           Analyse vulnerable points by mea-       of communications hubs, links between nodes, loca-          Telecommunication
                                                           suring impact of attacks on net-        tion nodes, intersection of links, distance links, cuts     collapse from un-
                                                           works                                   to links, probability of failure                            specified disaster
     Albores & Shaw,        Discrete event simulation                                                                                                          Terrorist       and    Preparedness
     2008 [3]                                              Analyse the time taken for adequate     Three concurrent incidents across nine locations,           flooding
                                                          PT
                                                           response to arrive at scene             travel times, crew and equipment availability, priority
                                                                                                   to request mutual aid
     Alem et al, 2016                                                                              Risk-averse model of budget allocation based on fleet
     [4]                    Mixed-integer two stage        Minimise costs of prepositioning        of vehicle types, procurement, lead times, demand in        Flooding        and    Preparedness     /
                            stochastic optimisation        stock and vehicles, and excess in-      relief centres, and demand in warehouses                    landslide              Response
                                                           ventory and unmet demand
                                                                       ED
     Bastian     et   al,                                                                          Trade-off between supply chain efficiency and supply        Humanitarian aid       Response
     2016 [7]               Mixed-integer   stochastic     Minimise the response time, target      chain responsiveness, trade-off between cost, response
                            weighted goal program-         budget, and the total amount of aid     time and amount of demand satisfied
                            ming optimisation              shortage
     Bier et al, 2008       Non-linear optimisation                                                                                                            Terrorist              Mitigation / Pre-
     [10]                                                  Minimise expected loss from attack      Optimize budget allocation for defending multiple                                  paredness
34
                                                                                          M        terrorist targets based on probability of attack, prob-
                                                                                                   ability of success, cost effectiveness of defence, value
                                                                                                   of target
     Bryson et al, 2002     Mixed integer linear opti-                                                                                                         Unspecified            Recovery
     [12]                   misation                       Maximise the total value of recovery    Develop a disaster recovery plan by selecting between
                                                           coverage provided by selected sub-      alternative subplans according to disaster types, re-
                                                           plans                                   covery effects, resources
     Chang et al, 2007                                                                             Resource allocation based on rescue areas and level of      Flooding
                            Two-stage ttochastic opti-     Model 1: Minimise expected ship-                                                                                           Preparedness
                                                                                                    AN
     [14]                                                                                          emergency as well as organizational structure, store
                            misation                       ping distance of rescue equip-          locations, resource availability, travel distances
                                                           ment.    Model 2: Minimise costs
                                                           of setup, equipment, transporta-
                                                           tion, supply-shortage and demand-
                                                           shortage penalty
                                                                                                                                                                                                           ACCEPTED MANUSCRIPT


     Chiu &       Zheng,                                                                                                                                                              Response
     2007 [15]              Linear   optimisaton    of     Minimise travel time of evacuees        The flow of evacuees and emergency response re-             No-notice     disas-
                                                                                                      US
                            node-arc network               and emergency response groups           sources to destinations using a traffic network based       ters
                                                                                                   on an evacuation zone, safe destinations, and priori-
                                                                                                   tised routing strategies
     Fiedrich et      al,                                                                                                                                      Earthquake             Response
     2000 [19]              Dynamic      combinatorial     Minimise the total number of fatal-     Search and rescue performance based on the classi-
                            optimisation                   ities                                   faction of affected areas, facilities in those areas, re-
                                                                                                   sources, and time factors (e.g. survival rates, proba-
                                                                                                                                      CR
                                                                                                   bility of secondary event)
     Grabowski et al,                                                                                                                                          Oil spill              Response
     2016 [23]              Dynamic resource alloca-       Resource allocation and effective-      Assess the effectiveness and allocation of resources for
                            tion                           ness of response                        remote environmental disasters through capabilities,
                                                                                                   equipment, time period, incidents
                                                                                                                                        IP
                                                                                                                                          T
```

## Page 37

```text
                                               Table A.11: Reviews of papers in resource allocation in disaster management (cont.)
                             AC
     Citation                Model Type                   Objective(s)                            Characteristic(s)                                          Types of event     Disaster stage
     This paper                                                                                                                                              Terrorist    and   Preparedness       /
                             Two-stage stochastic opti-   Minimise the penalty of not being       Response    capacity   to    simultaneous   incidents      flooding           Response
                             misation                     able to satisfy demand and mini-        happening across a country based on,              de-
                                                          mize the total cost of additional ca-   mand/availability/targets, deployment regulations,
                                          CE
                                                          pacities to meet demand                 protocols for requesting assistance from other cities,
                                                                                                  transportation
     Iannoni & Mora-                                                                              Configuration and operation of dispatch policies           Medical response   Response
     bito, 2007 [26]         Hypercube, spatially dis-    Analyse the expected coverage           based on call types, response capabilities, location-
                             tributed queuing                                                     based response protocols, multiple dispatches
                                                          PT
     Kroshl et al, 2015                                                                                                                                      Terrorist          Mitigation / Re-
     [27]                    Integer programming and      Minimise damage on spatially dis-       Use Stackelberg ‘leader follower’ game to allocate de-                        sponse
                             evolutionary agent based     tributed node/arc network               fensive / attacker resources to achieve stable strate-
                             optimisation                                                         gies
     MacKenzie & Zo-                                                                                                                                         Storm              Mitigation
     bel, 2016 [30]          Robust optimisation          Maximise system resilience by re-       Allocate fixed resources to reducing loss and improv-
                                                          ducing loss and improving recovery      ing recovery assuming the effect of allocating re-
                                                                      ED
                                                          time                                    sources to those are known to be linear, exponential,
                                                                                                  quadratic, or logarithmic
     MacKenzie et al,                                                                                                                                        Oil spill          Recovery
     2016 [29]               Static and dynamic opti-     Minimise (economic direct and in-       Determine static and dynamic resource allocations
                             misation                     direct) production loss due to dis-     to create regional economic recovery from disruption
35                                                        ruption
                                                                                         M        assuming consumers stop purchasing and producers
                                                                                                  stop producing
     Michel-Kerjan et                                                                                                                                                           Preparedness
     al, 2013 [32]           Probabilistic catastrophe    Analyse risk, costs and benefits of     Evaluate the effectiveness of strategies to prepare        Storm and earth-
                             cost benefit model           disaster reduction strategies           buildings such as roof upgrades and strengthened win-      quake
                                                                                                  dows / doors and the impact of this on cost of the
                                                                                                  event
     Minciardi    et   al,   Mathematical    optimisa-                                                                                                       Wildfire           Preparedness       /
                                                          Minimise potential unmet demand,        Manage disasters in (pre-)operational stages by
                                                                                                   AN
     2009 [33]               tion                                                                                                                                               Response
                                                          inappropriate assignment of re-         analysing resource availability/location, demand, cost
                                                          source, and costs                       of moving resources and of storing resources
     Nagurney     et   al,   Generalised Nash equilib-                                            Non-governmental organization attracting financial         Hurricane          Response     /   Re-
     2016 [34]               rium network model           Maximise the financial gains from       donations based their visibility through media of the                         covery
                                                          donors relative to the visibility of    relief item flow allocations and perceived effectiveness
                                                                                                                                                                                                       ACCEPTED MANUSCRIPT

                                                          their effectiveness at disaster sites   at disaster sites
     Najafi et al, 2013                                                                                                                                      Earthquake         Response
                                                                                                     US
     [35]                    Multi-objective robust op-   Minimise the unserved injured peo-      Manage logistics of supplies and injured people
                             timisation                   ple, unsatisfied demands, and vehi-     in a multi-objective, multi-mode, multi-commodity,
                                                          cles utilized in the response           multi-period stochastic model
     Ozdamar      and        Mixed-integer linear opti-                                           Efficient network flow model using a hierarchical          Earthquake         Response
     Demir, 2012 [38]        misation                     Minimise travel time of vehicles and    “cluster first, route second” approach based on ve-
                                                          promote efficient resource utilisa-     hicle and supply availability, importance of injured
                                                          tion
                                                                                                                                     CR
                                                                                                  people and commodities, travel times
     Rachaniotis et al,      Stochastic optimisation                                              Last mile aid distribution fleet management through        Humanitarian aid   Response
     2013 [43]                                            Minimise travel time of aid to ben-     analysing vehicle allocation and routing, hubs, and
                                                          eficiaries                              demand for aid
                                                                                                                                       IP
                                                                                                                                         T
```

## Page 38

```text
                                              Table A.12: Reviews of papers in resource allocation in disaster management (cont.)
                           AC
     Citation              Model Type                    Objective(s)                            Characteristic(s)                                           Types of event       Disaster stage
     This paper                                                                                                                                              Terrorist    and     Preparedness       /
                           Two-stage stochastic opti-    Minimise the penalty of not being       Response     capacity  to    simultaneous   incidents       flooding             Response
                           misation                      able to satisfy demand and mini-        happening across a country based on,              de-
                                                         mize the total cost of additional ca-   mand/availability/targets, deployment regulations,
                                                         pacities to meet demand                 protocols for requesting assistance from other cities,
                                                                                                 transportation
                                        CE
     Ransikarbum and       Multi-objective integer op-                                           Equity-based strategic decisions in supply, distribu-       Earthquake           Response     /   Re-
     Mason, 2016 [45]      timisation                    Maximise the equity through satis-      tion and network distribution based on a network of                              covery
                                                         fied demand and minimise the un-        disrupted supply ports, demand warehouses, trans-
                                                         satisfied demand and cost               portation links
     Rahnamay-             Stochastic      geographic                                                                                                                             Mitigation
     Naeini et al, 2011    stress simulation             Analyse the reliability and effi-       Analyse centres of stress which create correlated fail-     Telecommunication
                                                         PT
     [44]                                                ciency of networks to simulataneous     ures in communications network reliability to under-        collapse from un-
                                                         failures                                stand network vulnerability including node and link         specified disaster
                                                                                                 failure
     Rawls & Turn-         Stochastic mixed-integer                                                                                                          Storm                Preparedness       /
     quist, 2012 [46]      optimisation                  Minimise expected cost from select-     Determine the location and amount of different types                             Response
                                                         ing pre-position locations, stocking    of resource to be pre-positioned based on multiple
                                                                     ED
                                                         and storage factors, transportation     locations of uncertain demand, uncertain stock and
                                                         of resource, unmet demand               transportation availability

     Salmeron      and     Stochastic mixed-integer                                              Strategic budget allocation for the purchasing and po-      Storm                Preparedness
     Apte, 2010 [48]       optimisation                  Minimise expected casualties and        sitioning of resources for relief based on evacuation
                                                         people not evacuated
36
                                                                                        M        demand and supply, supplies for non-evacuees

     Shan & Zhuang,        Sequential game theory                                                Effect of the equity coefficient on optimal defensive al-   Terrorist            Preparedness
     2013 [50]                                           Minimise expected loss by allocat-      location and the expected loss by allocating defensive
                                                         ing part of resources equally and the   resources according to the risk of potential targets
                                                         remainder according to risk             while allocating a portion across all regions equally
     Su et al, 2016 [52]   Integer linear optimisation                                                                                                       Unspecified          Response
                                                         Minimise travel time of resources       Allocate multiple emergency resources to multiple
                                                         and and the cost of allocated re-       concurrent incidents based on response time and cost
                                                                                                  AN
                                                         sources
     Tzeng et al, 2007     Fuzzy multi-objective op-                                                                                                         Earthquake           Response
     [56]                  timisation                    Maximise efficiency (by minimis-        Ensure difficult to reach areas receive aid based on
                                                         ing cost and travel time) and max-      different relief package being transported from a col-
                                                         imise fairness (by maximising satis-    lection point to a relief centre to a demand point in-
                                                                                                                                                                                                         ACCEPTED MANUSCRIPT

                                                         faction) of relief distribution         cluding aspects such as package volume, travel time,
                                                                                                 transport cost
                                                                                                    US
     Wex et al, 2014       Binary quadratic optimi-                                              Modified multiple travelling salesman problem and           Earthquake           Response
     [63]                  sation                        Minimise sum of completion times        parallel-machine scheduling problem to schedule res-
                                                         of incidents weighted by their sever-   cue units and assign them to incidents in order to
                                                         ity                                     minimize casualties and economic loss
     Yi   &    Kumar,      Mixed-integer    multi-                                               Logistics of disaster relief using dynamic vehicle rout-    Humanitarian aid     Response
     2007 [66]             commodity network flow        Minimise time delay in provid-          ing and multi-commodity dispatch to analyse different
                                                         ing prioritized resources to affected
                                                                                                                                    CR
                           model                                                                 vehicle types to transport aid to affected areas and to
                                                         people                                  evacuate wounded people
     Zhang et al, 2012     Mixed-integer linear opti-                                                                                                        Earthquake           Response
     [67]                  misation                      Minimise the resource cost of the       Analyses the priority of preference for each location
                                                         primary disaster and the expecta-       where the secondary disasters will take place with cer-
                                                         tion cost of secondary disaster         tain possibilities
                                                                                                                                      IP
                                                                                                                                        T
```

## Page 39

```text
                                      ACCEPTED MANUSCRIPT




Appendix B. Case Study: Target Response Levels

   Table B.13 displays the target response levels for terrorist attack disaster while those for flooding
disaster are shown in Table B.14.
   Table B.13: Response targets of equipment being on-site and operational following a terrorist attack disaster

                    City/Operation        Mass decontamination
                                          Process 3000 casualties within 3 hrs
                    A                     Remainder of 1000 casualties within 10 hrs


                    D, G
                                          Require 50 generalists
                                                                            CR
                                          Process 3000 casualties within 3 hrs
                                          Remainder of 1000 casualties within 10 hrs


                    B, C, E, F, H
                                          Require 50 generalists
                                          Process 3000 casualties within 3 hrsIPT
                                          Remainder of 1000 casualties within 10 hrs
                                          Require 50 generalists
                    City/Operation        Urban search and rescue

                    A                               AN
                                          Provide 10 USAR units within 2 hrs
                                          Remainder of 5 units within 10 hrs
                                          Require 150 generalists

                    D, G                              US
                                          Provide 10 USAR units within 4 hrs
                                          Remainder of 5 units within 10 hrs
                                          Require 100 generalists
                                          Provide 10 USAR units within 4 hrs
                    B, C, E, F, H
                                            M
                                          Remainder of 5 units within 10 hrs
                                          Require 80 generalists


                               ED
      Table B.14: Response targets of equipment being on-site and operational following a flooding disaster

                        City/Operation        Flood water pumping
                        A                     Provide 10 HVP units within 2 hrs
                    PT  D, G
                        B, C, E, F, H
                                              Provide 5 HVP units within 2 hrs
                                              Provide 3 HVP units within 2 hrs
                        City/Operation        Urban search and rescue
         CE             A
                                              Provide 10 USAR units within 2 hrs
                                              Remainder of 5 units within 10 hrs
                                              Require 150 generalists

AC                      D, G
                                              Provide 10 USAR units within 4 hrs
                                              Remainder of 5 units within 10 hrs
                                              Require 100 generalists
                                              Provide 10 USAR units within 4 hrs
                        B, C, E, F, H         Remainder of 5 units within 10 hrs
                                              Require 80 generalists




                                                        37
```

## Page 40

```text
                                         ACCEPTED MANUSCRIPT




Appendix C. Computational Tests: Settings and Additional Results

Appendix C.1. Parameter Settings
   We first solve the model only with the primary objective of minimising the total expected
weighted penalty by setting θ = µ = 0. The results show that resource requests do not follow
the given preferences. We heuristically set the value of µ to µ = 10−5 with which the penalty
                                                                 XX  Ts X X
remains the same as with µ = 0 while the secondary objective of               pij (T − t + 1) ·
                                                                                   s∈S t=1 i∈N j∈Ei
                           !
 xi,j
  0,s (t) +
              X

              r∈R
                    xi,j
                     r,s (t)                                                   CR
                               decreases significantly and becomes stable as show in Figure C.11. Similarly,




θ. According to Figure C.12, with θ = 10−3 , the secondary objective of
                                                                        XX       IP
in order to determine the actual (minimum) numbers of specialist equiment and specialists, espe-
cially when there are more than enough resources, we need to set an appropriate positive value for

                                                                                   T      
                                                                                wri + w̄ri achieve
                                                                                        i∈N r∈R
its minimum value given that the penalty remains the same as with θ = 0. Given the analysis, we
set θ = 10−3 and µ = 10−5 for all experiments.
                                                       AN
                                                         US
                                                M
                                  ED
                      Figure C.11: Values of preference-related secondary objective with different µ




                        PT
         CE
AC                     Figure C.12: Values of resource-related secondary objective with different θ



Appendix C.2. Random Instance Generation: Examples
   Figure C.13 shows the city locations in a 9-city random instance while Figure C.14 shows different
time-dependent IRU resource requirements in 10 different random instances.


                                                           38
```

## Page 41

```text
                                  ACCEPTED MANUSCRIPT




                                                                        CR
                       Figure C.13: City locations in a random instance with 9 cities

                                                                          IPT
                                                AN
                                                  US
                                         M
          Figure C.14: Time-dependent IRU resource requirements in 10 different random instances

                           ED
Appendix C.3. Computational Results for Model (R) using IBM CPLEX
   Figure C.15 shows computational times of the model (R) given different numbers of cities.
                 PT
        CE
AC
              Figure C.15: Computational times of model (R) given different numbers of cities



Appendix C.4. Computational Results with PHA



                                                    39
```

## Page 42

```text
                                   ACCEPTED MANUSCRIPT




   We implement the PHA algorithm using a similar framework as described in [20, Algorithm
2] for two-stage mixed-integer stochastic optimisation problems with scenario bundles. For our
models, the scenarios are bundled such that all locations and all types of disasters are covered
in most of the bundles. The lower bound is computed from the first initialisation stage of the
algorithm ([20, Proposition 1]). The original algorithm requires us to solve mixed-integer quadratic
optimisation problems in the decomposition stage and it is impractical to solve given the sizes
of tested instances. We modify these sub-problems by replacing the proximal term with squared
two-norm by the proximal term with `1 -norm, which allows us to reformulate the sub-problems

                                                                      CR
as mixed-integer linear optimisation problems. These problems are solved with IBM CPLEX. We
follow recommendations in [59] for parameter selection and termination criteria. The best solution

                                                                        IP
(in terms of the objective) among all solutions obtained in the last iteration of the PHA algorithm
is chosen as the heuristic solution. We solve instances of the model (P) with different number of

                                                                          T
cities using this PHA-based heuristic and compare the results with those with IBM CPLEX. Figure
C.16 shows that with large instances of more than 9 cities, the heuristic is more efficient in terms



CPLEX cannot handle them.
                                                AN
of computational time. In addition, given the advantage of the PHA algorithm in terms of memory
usage, we are able to solve larger instances with 15 and 20 cities using the heuristic whereas IBM


                                                  US
                                         M
                            ED
                   PT
            Figure C.16: PHA vs. CPLEX computational times given different numbers of locations


   The trade-off is the quality of the final solution. Let define ZH and ZL to be the objective value
        CE
of the heuristic solution and the lower bound, respectively, obtained from the PHA algorithm, and
Z ∗ to be the optimal value obtained from IBM CPLEX. Figure C.17 shows the actual (relative)
                 ZH − Z ∗                                          Z H − ZL

AC
optimal gap ρ =
                   Z∗
                          and   the maximum   optimality gap  ρm =
                                                                      ZL
                                                                            for all tested instances
with different numbers of cities. The results indicate that the maximum gaps can be close to 50%
but the actual gaps are much smaller. The PHA algorithm achieves 7% gap in the best instance
while it is approximately 25% in the worst instance. Note that the PHA algorithm is a heuristic for
mixed-integer problems and these computational results show that while it can solve larger instances
than IBM CPLEX, the quality of the solution is not guaranteed to be high in all instances.




                                                    40
```

## Page 43

```text
                                                   ACCEPTED MANUSCRIPT




                                                                                              CR
                 Figure C.17: Actual and maximum (relative) optimal gaps for different instances


Appendix D. Budget-Based Model (B)                                                              IP
   The budget-based model (B) incorporates the additional resources into the capacity constraints:T
                                                   N
                                                   X

                                                   i=1
                                                                 AN
                                                         wri ≤ Cr + ∆Cr ,         ∀ r ∈ R,


and imposes an additional budget constraint,

detailed model (B) is written as follows:
                                                                   US
                                                                   X

                                                                   r∈R
                                                                          γr · ∆Cr ≤ B, where B is the total budget. The




   (B) : min
                   X
                         qs
                              X
                                     ιi l
                                             X X         M (T − t + 1) · ulr,s (t) + θ ·
                                                                                             "N
                                                                                              XX

                                                                                               i=1 r∈R
                                                                                                           wri + w̄ri
                                                                                                                        
                                                                                                                            #
                                                                                                                                + ···
                   s∈S


                   µ·
                      
                      
                        Ts X X
                       XX
                              l∈Ls

                                  ED
                         s∈S t=1 i∈N j∈Ei
                                            r∈Rkl t∈Tkl


                               pij (T − t + 1) ·                               xi,j
                                                                                0,s (t) +
                                                                                            X

                                                                                            r∈R
                                                                                                  xi,j
                                                                                                   r,s (t)
                                                                                                           !
                                                                                                           


          s.t.
                    PT
                    i
                   y0,s
                    i
                   yr,s
                               i
                        (1) = yr,s
                        (t + 1) = yr,s
                                           i
                                   (1) = ȳr,s
                                   i
                                       (t) +
                                               (1) = 0,
                                                                X
                                                                          ∀ i ∈ N , r ∈ R, s ∈ S,
                                                                              xi,j
                                                                               r,s (t + 1 − or − rij ),
                                                                                                                                          (D.1)
                                                                                                                                          (D.2)

         CE         i
                   y0,s            i
                        (t + 1) = y0,s (t) +
                                                          j∈Ei :t+1>or +rij

                                                              X

                                                          j∈Ei :t+1>tij
                                                                            xi,j
                                                                             0,s (t + 1 − tij ) +
                                                                                                    X

                                                                                                    r∈R
                                                                                                           βr · xi,j
                                                                                                                 r,s (t + 1 − tij ) (D.3)
                                                                                                                                          !


                                                              X                                                                   
AC                   i
                   ȳr,s             i
                         (t + 1) = ȳr,s (t) +
                                                          j∈Ei :t+1>tij
                          ∀ i ∈ N , r ∈ R, s ∈ S, t = 1, . . . , Ts − 1,
                                                                           x̄i,j                        i,j
                                                                             r,s (t + 1 − tij ) + αr · xr,s (t + 1 − tij )            ,   (D.4)


                                   X
                    i
                   zr,s (t) =              xi,j
                                            r,s (t − or − rij ),                                                                          (D.5)
                                 j∈Ei :t>or +rij
                                 min{t,D}−1                                     t−1
                                            X                                   X
                    i                                 i                                    i
                   vr,s (t) =                        zr,s (t − τ ) + 2 ·                  zr,s (t − τ ),                                  (D.6)
                                            τ =0                            τ =min{t,D}
                         ∀ i ∈ N , r ∈ R, s ∈ S, t = 1, . . . , Ts ,

                                                                     41
```

## Page 44

```text
                         ACCEPTED MANUSCRIPT




      il
     y0,s (t) ≥ dl0 (t),     ∀ l ∈ Ls , t ∈ Tkl , s ∈ S,                                       (D.7)
       il         il
     ȳr,s (t) ≥ vr,s (t),    ∀ l ∈ Ls , r ∈ Rkl , t = 1, . . . , Ts , s ∈ S,                  (D.8)
     ulr,s (t) ≥ dlr (t) − yr,s
                            il
                                (t), ∀ l ∈ Ls , r ∈ Rkl : cl,r = 0, t ∈ Tkl , s ∈ S,          (D.9)
                               t
                                            !
                             X
     ulr,s (t) ≥ dlr (t) −          il
                                   yr,s (τ ) , ∀ l ∈ Ls , r ∈ Rkl : cl,r = 1, t ∈ Tkl , s ∈ S(D.10)
                             τ =1
     ulr,s (t) ≥ 0, l ∈ Ls , t ∈ Tkl , r ∈ Rkl , s ∈ S,                                      (D.11)
     N
     X

     i=1
     X
           wri ≤ Cr + ∆Cr ,

           γr · ∆Cr ≤ B,
                                    ∀ r ∈ R,
                                                                CR                            (D.12)

                                                                                              (D.13)
     r∈R
     Ts X
     X

     t=1 j:i∈Ej
                  xj,i        i
                   r,s (t) ≤ wr ,    ∀ i ∈ N , r ∈ R, s ∈ S,
                                                                  IPT                         (D.14)

     Ts X
     X                                      
     t=1 j:i∈Ej

     xi,j       i,j
                   x̄j,i
                                       AN
                                     j,i         i
                     r,s (t) + αr · xr,s (t) ≤ w̄r ,


                           i,j
      0,s (t), xr,s (t), x̄r,s (t) ∈ Z+ ,
                                                       ∀ i ∈ N , r ∈ R, s ∈ S,                (D.15)

                                            ∀ i ∈ N , j ∈ Ei , r ∈ R, s ∈ S, t = 1, . . . , Ts ,(D.16)
     wri , w̄ri ∈ Z+ ,
     ∆Cr ∈ Z+ , ∀ r ∈ R.
                                         US
                           ∀ i ∈ N , r ∈ R,                                                   (D.17)
                                                                                              (D.18)


                               M
               ED
     PT
 CE
AC

                                            42
```
