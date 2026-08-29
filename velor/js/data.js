/* ============================================================
   data.js — the floor, as records rather than rows.
   Every car carries what a buyer actually asks on the phone:
   how far it has been driven, what state it is in, and what
   has been done to it.
   ============================================================ */

export const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const FLOOR = [
{
  marque:'Rolls-Royce', origin:'Goodwood, England', name:'Phantom VIII', body:'saloon',
  paint:'#E7E5DF', colour:'Arctic White', year:2022, km:'12,400', price:'₹9,50,00,000',
  engine:'6.75-litre twin-turbo V12', power:'563 bhp', torque:'900 Nm at 1,700 rpm',
  gearbox:'8-speed satellite-aided automatic', drive:'Rear-wheel drive',
  sprint:'5.3 s', top:'250 km/h, limited', weight:'2,560 kg', seats:'Four, lounge configuration',
  owners:'One', reg:'MH 01 · first registered March 2022', keys:'Two, both coded',
  service:'Full Rolls-Royce history, last attended at 11,800 km',
  status:'Road registered and taxed. Driven weekly, roughly 400 km a month.',
  health:{
    Mechanical:['A','Even compression across all twelve. No weep at the sump, turbos or transfer case.'],
    Bodywork:['A','Original panels throughout — paint depth checked at seventeen points, all within factory range.'],
    Interior:['A','Box-grain leather unmarked. Every fibre in the starlight headliner still lit.'],
    'Tyres & brakes':['A−','Continental fronts 6.1 mm, rears 5.4 mm, one matched set. Discs at 78% of new.'],
    Electronics:['A','No stored fault codes. Night vision, head-up display and rear theatre all working.']
  },
  note:'A Phantom that has been used rather than stored, which is the better history of the two — the air suspension and the V12 both prefer it. Self-levelling was recalibrated in our workshop after the last service.'
},
{
  marque:'Rolls-Royce', origin:'Goodwood, England', name:'Ghost Black Badge', body:'saloon',
  paint:'#15161A', colour:'Black Badge', year:2023, km:'8,100', price:'₹8,20,00,000',
  engine:'6.75-litre twin-turbo V12', power:'591 bhp', torque:'900 Nm at 1,700 rpm',
  gearbox:'8-speed automatic', drive:'All-wheel drive, all-wheel steering',
  sprint:'4.5 s', top:'250 km/h, limited', weight:'2,490 kg', seats:'Four',
  owners:'One', reg:'MH 02 · first registered July 2023', keys:'Two',
  service:'Two dealer services, both on schedule. Last at 7,600 km.',
  status:'Road registered. Low use — largely city, chauffeur driven.',
  health:{
    Mechanical:['A','Under warranty and unopened. Planar suspension self-test passes clean.'],
    Bodywork:['A','Darkened chrome intact, no lacquer lift at the grille surround or exhaust finishers.'],
    Interior:['A','Technical fibre trim without scuffing. Rear seat barely used.'],
    'Tyres & brakes':['A','Original Pirellis, 6.8 mm all round. Brakes effectively unworn.'],
    Electronics:['A','No codes. Illuminated fascia fully lit; all 850 stars present.']
  },
  note:'The darkest specification Rolls-Royce will build, and a car that has done almost nothing. We have driven it enough to know it is sound rather than merely new.'
},
{
  marque:'Rolls-Royce', origin:'Goodwood, England', name:'Cullinan', body:'suv',
  paint:'#1B3A63', colour:'Salamanca Blue', year:2022, km:'16,700', price:'₹6,95,00,000',
  engine:'6.75-litre twin-turbo V12', power:'563 bhp', torque:'850 Nm at 1,600 rpm',
  gearbox:'8-speed automatic', drive:'All-wheel drive',
  sprint:'5.2 s', top:'250 km/h, limited', weight:'2,660 kg', seats:'Five',
  owners:'Two', reg:'MH 04 · first registered January 2022', keys:'Two',
  service:'Full history across both owners. Last service at 15,900 km.',
  status:'Road registered. Used as a family car, including highway touring.',
  health:{
    Mechanical:['A','Air struts hold overnight with no sag. Transfer case fluid changed by us at intake.'],
    Bodywork:['A−','One repainted rear door, done to standard before our ownership and disclosed here.'],
    Interior:['A−','Light polish to the driver bolster consistent with the mileage. Nothing torn.'],
    'Tyres & brakes':['B+','Fronts at 4.2 mm — replaceable within a year. Rears and discs good.'],
    Electronics:['A','All modules report clean. Rear cameras and tailgate seating operate correctly.']
  },
  note:'The one car here with an honest repair in its history. The rear door was resprayed after a car-park knock; we have the invoice and the paint reads 190 microns against 120 elsewhere.'
},
{
  marque:'Ferrari', origin:'Maranello, Italy', name:'812 Superfast', body:'coupe',
  paint:'#C8102E', colour:'Rosso Corsa', year:2021, km:'7,850', price:'₹5,20,00,000',
  engine:'6.5-litre naturally aspirated V12', power:'789 bhp', torque:'718 Nm at 7,000 rpm',
  gearbox:'7-speed dual clutch', drive:'Rear-wheel drive, rear-wheel steering',
  sprint:'2.9 s', top:'340 km/h', weight:'1,630 kg', seats:'Two',
  owners:'One', reg:'MH 01 · first registered November 2021', keys:'Two',
  service:'Ferrari Genuine Maintenance to 2028. Annual service done at 7,200 km.',
  status:'Road registered. Weekend use, no track days recorded.',
  health:{
    Mechanical:['A','Leak-down within tolerance on all twelve. Clutch wear reads 12%.'],
    Bodywork:['A','Original paint everywhere. Front clam has PPF from new; no stone chips beneath.'],
    Interior:['A','Alcantara unfaded. Carbon racing seats without cracking at the shoulder.'],
    'Tyres & brakes':['A','Michelin Cup 2 at 5.9 mm. Carbon ceramics at 8% wear.'],
    Electronics:['A','No codes. Side slip control and e-diff calibrate normally.']
  },
  note:'Very likely the last naturally aspirated front-engined V12 Ferrari will build, and this one has been kept as such — low mileage, no track abuse, and warranty still running.'
},
{
  marque:'Ferrari', origin:'Maranello, Italy', name:'Roma', body:'coupe',
  paint:'#6E7176', colour:'Grigio Titanio', year:2022, km:'9,300', price:'₹3,76,00,000',
  engine:'3.9-litre twin-turbo V8', power:'612 bhp', torque:'760 Nm at 3,000 rpm',
  gearbox:'8-speed dual clutch', drive:'Rear-wheel drive',
  sprint:'3.4 s', top:'320 km/h', weight:'1,570 kg', seats:'Two plus occasional',
  owners:'One', reg:'MH 02 · first registered April 2022', keys:'Two',
  service:'Ferrari maintenance programme to 2029. Last at 8,800 km.',
  status:'Road registered. The most-used Ferrari on our floor, and the better for it.',
  health:{
    Mechanical:['A','Turbos spool without shaft play. No oil consumption between services.'],
    Bodywork:['A','Original panels. A single stone chip on the leading edge of the bonnet, unfilled.'],
    Interior:['A','Full leather, no bolster collapse. Passenger display functions.'],
    'Tyres & brakes':['A−','Pirelli P Zero at 5.1 mm. Discs at 82%.'],
    Electronics:['A','Clean. Both keys pair; no infotainment lag on cold start.']
  },
  note:'A Ferrari that works as a car you actually leave the house in. The chip on the bonnet is real and we have left it alone rather than blend a panel to hide it.'
},
{
  marque:'Ferrari', origin:'Maranello, Italy', name:'SF90 Stradale', body:'super',
  paint:'#F2C200', colour:'Giallo Modena', year:2023, km:'3,200', price:'₹7,50,00,000',
  engine:'4.0-litre twin-turbo V8 with three electric motors', power:'986 bhp combined', torque:'800 Nm',
  gearbox:'8-speed dual clutch', drive:'All-wheel drive, electric front axle',
  sprint:'2.5 s', top:'340 km/h', weight:'1,570 kg', seats:'Two',
  owners:'One', reg:'MH 01 · first registered February 2023', keys:'Two',
  service:'Under Ferrari warranty to 2030. Software at latest revision.',
  status:'Road registered. Charged and exercised fortnightly on our schedule.',
  health:{
    Mechanical:['A','Hybrid system state of health 99%. No derate under load on our road test.'],
    Bodywork:['A','Assetto Fiorano carbon intact, no lacquer crazing at the rear diffuser.'],
    Interior:['A','As delivered. Protective film still on the wireless charging pad.'],
    'Tyres & brakes':['A','Michelin Cup 2 at 6.6 mm. Carbon ceramics essentially unused.'],
    Electronics:['A','No codes. eManettino cycles through all four modes correctly.']
  },
  note:'A hybrid needs using, not storing, or the traction battery quietly degrades. We put this one on a fortnightly cycle the day it arrived, and the state of health has not moved since.'
},
{
  marque:'Lamborghini', origin:"Sant'Agata, Italy", name:'Huracán Tecnica', body:'super',
  paint:'#7FB800', colour:'Verde Mantis', year:2023, km:'3,750', price:'₹4,04,00,000',
  engine:'5.2-litre naturally aspirated V10', power:'631 bhp', torque:'565 Nm at 6,500 rpm',
  gearbox:'7-speed dual clutch', drive:'Rear-wheel drive, rear-wheel steering',
  sprint:'3.2 s', top:'325 km/h', weight:'1,379 kg', seats:'Two',
  owners:'One', reg:'MH 03 · first registered May 2023', keys:'Two',
  service:'Lamborghini warranty to 2026. First service completed at 3,100 km.',
  status:'Road registered. Two recorded track days, both at Buddh, both logged.',
  health:{
    Mechanical:['A','V10 dry-sumped and clean. No smoke on a hot restart, which is the tell on these.'],
    Bodywork:['A','Original. Front lifted axle used consistently — no scrape on the splitter.'],
    Interior:['A','Alcantara without shine at the wheel. Cage-free, road specification.'],
    'Tyres & brakes':['B+','Bridgestone Potenza at 4.4 mm after the track use. Ceramics at 14%.'],
    Electronics:['A','No codes. LDVI recalibrated after the second track day.']
  },
  note:'Track days are disclosed here rather than buried: two, both circuit-only, both with the car returned to us afterwards for a check. The tyres carry the evidence and are priced in.'
},
{
  marque:'Lamborghini', origin:"Sant'Agata, Italy", name:'Urus S', body:'suv',
  paint:'#1C1D21', colour:'Nero Noctis', year:2023, km:'11,200', price:'₹4,18,00,000',
  engine:'4.0-litre twin-turbo V8', power:'657 bhp', torque:'850 Nm at 2,300 rpm',
  gearbox:'8-speed automatic', drive:'All-wheel drive, torque vectoring',
  sprint:'3.5 s', top:'305 km/h', weight:'2,197 kg', seats:'Five',
  owners:'One', reg:'MH 02 · first registered March 2023', keys:'Two',
  service:'Full history. Oil and filters done by us at 10,900 km.',
  status:'Road registered. Daily driven — the mileage is city and expressway.',
  health:{
    Mechanical:['A','Air suspension holds level overnight. No rattle from the active anti-roll bars.'],
    Bodywork:['A−','Two chips on the leading edge of the bonnet, touched in and disclosed.'],
    Interior:['A−','Driver seat bolster shows use consistent with 11,000 km. No cracking.'],
    'Tyres & brakes':['A','Pirelli Scorpion at 5.8 mm. Carbon ceramics at 11%.'],
    Electronics:['A','Clean. All six drive modes engage; rear axle steering calibrated.']
  },
  note:'The one car here bought to be used every day, and it shows in the right way — even wear, full service record, nothing deferred.'
},
{
  marque:'Lamborghini', origin:"Sant'Agata, Italy", name:'Revuelto', body:'super',
  paint:'#E8590C', colour:'Arancio Apodis', year:2024, km:'1,450', price:'₹8,89,00,000',
  engine:'6.5-litre V12 with three electric motors', power:'1,001 bhp combined', torque:'725 Nm',
  gearbox:'8-speed dual clutch', drive:'All-wheel drive',
  sprint:'2.5 s', top:'350 km/h', weight:'1,772 kg', seats:'Two',
  owners:'One', reg:'MH 01 · first registered June 2024', keys:'Two',
  service:'Delivery mileage. Pre-delivery inspection and first oil done.',
  status:'Road registered. Barely run in — 1,450 km, all road.',
  health:{
    Mechanical:['A','Within running-in schedule. No abnormal readings on our diagnostic pass.'],
    Bodywork:['A','Untouched. Delivery film still on the rear arches, which we have left in place.'],
    Interior:['A','Unused. Both key pouches and the tool roll present.'],
    'Tyres & brakes':['A','Bridgestone at 7.4 mm. Brakes still bedding.'],
    Electronics:['A','No codes. Hybrid state of health 100%.']
  },
  note:'Effectively a new car with a registration. The V12 is not run in yet, so the first thousand kilometres are still yours to do properly.'
},
{
  marque:'Porsche', origin:'Stuttgart, Germany', name:'911 Turbo S', body:'coupe',
  paint:'#B9BDC1', colour:'GT Silver', year:2022, km:'11,600', price:'₹3,45,00,000',
  engine:'3.7-litre twin-turbo flat-six', power:'641 bhp', torque:'800 Nm at 2,500 rpm',
  gearbox:'8-speed PDK', drive:'All-wheel drive',
  sprint:'2.7 s', top:'330 km/h', weight:'1,640 kg', seats:'Two plus two',
  owners:'Two', reg:'MH 12 · first registered August 2022', keys:'Two',
  service:'Full Porsche history. Last service at 11,100 km.',
  status:'Road registered. Regular use including long touring runs.',
  health:{
    Mechanical:['A','Flat-six dry and quiet. PDK shifts crisply cold, which is the thing to check.'],
    Bodywork:['A','Original paint, full front PPF from new. Nothing beneath it.'],
    Interior:['A','18-way seats without bolster wear. No squeaks over broken surfaces.'],
    'Tyres & brakes':['A−','Pirelli P Zero at 5.0 mm. PCCB discs at 9% wear.'],
    Electronics:['A','No codes. Lift axle, rear steer and PDCC all functioning.']
  },
  note:'A 911 Turbo S is the easiest car here to live with and the hardest to fault, and this one has been maintained by the book. Two owners, both with the full record.'
},
{
  marque:'Porsche', origin:'Stuttgart, Germany', name:'Taycan Turbo S', body:'saloon',
  paint:'#5B7FA6', colour:'Frozen Blue', year:2023, km:'14,900', price:'₹2,54,00,000',
  engine:'Dual motor, 93.4 kWh battery', power:'750 bhp on launch', torque:'1,050 Nm',
  gearbox:'2-speed rear transmission', drive:'All-wheel drive',
  sprint:'2.8 s', top:'260 km/h', weight:'2,295 kg', seats:'Four',
  owners:'One', reg:'MH 01 · first registered January 2023', keys:'Two',
  service:'Porsche history. Software at current revision, brake service done by us.',
  status:'Road registered. Daily driven, home charged, rarely DC fast charged.',
  health:{
    Mechanical:['A','Battery state of health 96% on a Porsche diagnostic read. No cell imbalance.'],
    Bodywork:['A','Original panels, no repairs. Underside clean.'],
    Interior:['A−','Driver seat shows light use. All four screens without dead pixels.'],
    'Tyres & brakes':['A','Michelin at 5.6 mm. Surface-coated discs barely worn — regeneration does the work.'],
    Electronics:['A','No codes. Charge port doors, both sides, operate correctly.']
  },
  note:'The battery report is the important document on an electric car, and this one is good: 96% after 14,900 km, helped by an owner who charged at home rather than hammering DC.'
},
{
  marque:'Porsche', origin:'Stuttgart, Germany', name:'718 Cayman GT4', body:'coupe',
  paint:'#F4C400', colour:'Racing Yellow', year:2021, km:'9,800', price:'₹1,73,00,000',
  engine:'4.0-litre naturally aspirated flat-six', power:'414 bhp', torque:'420 Nm at 5,000 rpm',
  gearbox:'6-speed manual', drive:'Rear-wheel drive',
  sprint:'4.4 s', top:'304 km/h', weight:'1,420 kg', seats:'Two',
  owners:'Two', reg:'MH 47 · first registered September 2021', keys:'Two',
  service:'Full history. Clutch and gearbox inspected by us at intake.',
  status:'Road registered. Enthusiast owned, several track days, all disclosed.',
  health:{
    Mechanical:['A−','Engine strong. Third gear synchro is a touch notchy cold — normal for the box, noted anyway.'],
    Bodywork:['A−','Original paint with track rash on the front bumper, unrepaired and priced in.'],
    Interior:['A','Fixed-back buckets uncracked. Harness bar fitted, road-legal belts retained.'],
    'Tyres & brakes':['B','Cup 2s at 3.8 mm — track-day tyres near the end. Discs at 68%.'],
    Electronics:['A','No codes. Only real electronics here are the dampers, and they read fine.']
  },
  note:'The cheapest car on this floor and arguably the best drive on it. It has been used as intended — the tyres and the bumper say so, and both are reflected in the price rather than hidden.'
},
{
  marque:'Bentley', origin:'Crewe, England', name:'Continental GT Speed', body:'coupe',
  paint:'#EDEDEA', colour:'Glacier White', year:2023, km:'9,200', price:'₹3,95,00,000',
  engine:'6.0-litre twin-turbo W12', power:'650 bhp', torque:'900 Nm at 1,500 rpm',
  gearbox:'8-speed dual clutch', drive:'All-wheel drive, all-wheel steering',
  sprint:'3.6 s', top:'335 km/h', weight:'2,273 kg', seats:'Two plus two',
  owners:'One', reg:'MH 02 · first registered February 2023', keys:'Two',
  service:'Full Bentley history. Last at 8,700 km.',
  status:'Road registered. Touring use — long runs rather than short city trips.',
  health:{
    Mechanical:['A','W12 smooth with no misfire count stored. 48-volt anti-roll system reads clean.'],
    Bodywork:['A','Original. Diamond-knurled brightwork unmarked.'],
    Interior:['A','Hide without creasing. Rotating display cycles through all three faces.'],
    'Tyres & brakes':['A','Pirelli at 6.0 mm. Carbon ceramics at 7%.'],
    Electronics:['A','No codes. Naim system and every seat function operating.']
  },
  note:'One of the last W12 Bentleys, and a car that has done the kind of mileage a W12 likes: long, warm, uninterrupted runs. No short-trip carbon issues here.'
},
{
  marque:'Bentley', origin:'Crewe, England', name:'Flying Spur', body:'saloon',
  paint:'#1A1B1F', colour:'Onyx', year:2022, km:'18,400', price:'₹3,42,00,000',
  engine:'4.0-litre twin-turbo V8', power:'542 bhp', torque:'770 Nm at 2,000 rpm',
  gearbox:'8-speed dual clutch', drive:'All-wheel drive, all-wheel steering',
  sprint:'4.1 s', top:'318 km/h', weight:'2,330 kg', seats:'Four',
  owners:'One', reg:'MH 01 · first registered June 2022', keys:'Two',
  service:'Full history, two services. Last at 17,600 km.',
  status:'Road registered. Chauffeur driven — the highest mileage car on the floor.',
  health:{
    Mechanical:['A','V8 tight, no cam chain rattle on start. Air springs level and hold.'],
    Bodywork:['A−','Kerbing to one rear alloy, refurbished by us. Paint original throughout.'],
    Interior:['B+','Rear compartment excellent; driver seat shows the mileage honestly.'],
    'Tyres & brakes':['A−','Pirelli at 4.8 mm all round. Discs at 71%.'],
    Electronics:['A','No codes. Rear tablet, blinds and both seat modules functional.']
  },
  note:'A working car with the wear you would expect at 18,400 km, all of it in the front seats. The back of the car is close to unused, which is the half most Flying Spur buyers care about.'
},
{
  marque:'Bentley', origin:'Crewe, England', name:'Bentayga EWB', body:'suv',
  paint:'#2C4F7C', colour:'Sequin Blue', year:2023, km:'13,050', price:'₹4,10,00,000',
  engine:'4.0-litre twin-turbo V8', power:'542 bhp', torque:'770 Nm at 2,000 rpm',
  gearbox:'8-speed automatic', drive:'All-wheel drive, all-wheel steering',
  sprint:'4.6 s', top:'290 km/h', weight:'2,566 kg', seats:'Four, airline seat specification',
  owners:'One', reg:'MH 04 · first registered April 2023', keys:'Two',
  service:'Full Bentley history. Last at 12,400 km.',
  status:'Road registered. Family and airport use, mixed city and highway.',
  health:{
    Mechanical:['A','Air suspension and active anti-roll both pass self-test. No leaks.'],
    Bodywork:['A','Original panels. Underbody protection intact, no sump scrapes.'],
    Interior:['A','Airline seats cycle fully. Rear ventilation and massage both working.'],
    'Tyres & brakes':['A−','Pirelli Scorpion at 5.3 mm. Discs at 79%.'],
    Electronics:['A','No codes. Both rear entertainment tablets pair and charge.']
  },
  note:'The extended wheelbase car with the airline seat specification, which is the version worth having and the one that is hard to find used. Nothing about its history is complicated.'
},
{
  marque:'Aston Martin', origin:'Gaydon, England', name:'DB12 Coupé', body:'coupe',
  paint:'#17493C', colour:'Iridescent Emerald', year:2024, km:'4,600', price:'₹4,59,00,000',
  engine:'4.0-litre twin-turbo V8', power:'671 bhp', torque:'800 Nm at 2,750 rpm',
  gearbox:'8-speed automatic', drive:'Rear-wheel drive, electronic rear differential',
  sprint:'3.6 s', top:'325 km/h', weight:'1,685 kg', seats:'Two plus two',
  owners:'One', reg:'MH 01 · first registered January 2024', keys:'Two',
  service:'Under Aston Martin warranty to 2027. First service done at 4,100 km.',
  status:'Road registered. Weekend use, no track history.',
  health:{
    Mechanical:['A','Engine and gearbox unopened, under warranty. No leaks at intake inspection.'],
    Bodywork:['A','Original paint. Front PPF applied by the supplying dealer.'],
    Interior:['A','New-car condition. All three drive-mode profiles saved and working.'],
    'Tyres & brakes':['A','Michelin Pilot Sport S 5 at 6.9 mm. Steel discs at 92%.'],
    Electronics:['A','No codes. The in-house infotainment is on the latest map revision.']
  },
  note:'The first Aston with its own infotainment rather than a borrowed system, which sounds minor until you live with the car. Low mileage, full warranty, nothing to explain.'
},
{
  marque:'Aston Martin', origin:'Gaydon, England', name:'Vantage', body:'coupe',
  paint:'#0B3B2E', colour:'Aston Racing Green', year:2023, km:'7,400', price:'₹3,99,00,000',
  engine:'4.0-litre twin-turbo V8', power:'656 bhp', torque:'800 Nm at 2,750 rpm',
  gearbox:'8-speed automatic', drive:'Rear-wheel drive',
  sprint:'3.5 s', top:'325 km/h', weight:'1,605 kg', seats:'Two',
  owners:'One', reg:'MH 03 · first registered October 2023', keys:'Two',
  service:'Full history. Last attended at 6,900 km.',
  status:'Road registered. Regular weekend and evening use.',
  health:{
    Mechanical:['A','Strong. Exhaust valves cycle correctly, no sticking on cold start.'],
    Bodywork:['A','Original throughout, no repairs recorded or found.'],
    Interior:['A','Sports Plus seats without wear. Carbon trim uncrazed.'],
    'Tyres & brakes':['A','Michelin Pilot Sport 5 at 6.2 mm. Discs at 88%.'],
    Electronics:['A','No codes. Adaptive dampers respond correctly across all modes.']
  },
  note:'Racing Green over a black interior is the specification people ask for and rarely find. Mechanically this is the most straightforward car on the floor.'
},
{
  marque:'Aston Martin', origin:'Gaydon, England', name:'DBX707', body:'suv',
  paint:'#55585C', colour:'Satin Xenon Grey', year:2023, km:'12,800', price:'₹4,64,00,000',
  engine:'4.0-litre twin-turbo V8', power:'697 bhp', torque:'900 Nm at 2,600 rpm',
  gearbox:'9-speed wet clutch automatic', drive:'All-wheel drive',
  sprint:'3.3 s', top:'310 km/h', weight:'2,245 kg', seats:'Five',
  owners:'One', reg:'MH 02 · first registered May 2023', keys:'Two',
  service:'Full history. Wet clutch service inspection carried out by us.',
  status:'Road registered. Used year round, including monsoon months.',
  health:{
    Mechanical:['A−','Wet clutch pack measured within spec. Air suspension holds; compressor quiet.'],
    Bodywork:['A','Satin paint intact — no polish marks, which is the risk on a satin finish.'],
    Interior:['A−','Light use marks on the driver sill trim. Seats and hide unmarked.'],
    'Tyres & brakes':['A−','Pirelli at 4.9 mm. Carbon ceramics at 13%.'],
    Electronics:['A','No codes. Every camera and the 360 stitch working correctly.']
  },
  note:'Satin paint is easy to ruin with the wrong wash, so we asked. This one has been hand washed since new and the finish is even under raking light.'
},
{
  marque:'McLaren', origin:'Woking, England', name:'750S Coupé', body:'super',
  paint:'#F26522', colour:'Papaya Spark', year:2024, km:'2,100', price:'₹5,91,00,000',
  engine:'4.0-litre twin-turbo V8', power:'740 bhp', torque:'800 Nm at 5,500 rpm',
  gearbox:'7-speed dual clutch', drive:'Rear-wheel drive',
  sprint:'2.8 s', top:'332 km/h', weight:'1,389 kg', seats:'Two',
  owners:'One', reg:'MH 01 · first registered March 2024', keys:'Two',
  service:'Under McLaren warranty to 2027. Delivery inspection only.',
  status:'Road registered. Very low mileage, all road, no track.',
  health:{
    Mechanical:['A','Carbon tub with no recorded damage. Hydraulic suspension holds pressure overnight.'],
    Bodywork:['A','Original. Full front and sill PPF fitted at delivery.'],
    Interior:['A','Effectively unused. Both roof panel tools present.'],
    'Tyres & brakes':['A','Pirelli Trofeo R at 7.1 mm. Carbon ceramics unworn.'],
    Electronics:['A','No codes. Active suspension and DRS both calibrate correctly.']
  },
  note:'McLaren hydraulic suspension is the system to check on these, and the overnight pressure test is the way to do it. This one holds. Papaya Spark is the colour the factory wants them in.'
},
{
  marque:'McLaren', origin:'Woking, England', name:'Artura', body:'super',
  paint:'#9AA0A6', colour:'Ceramic Grey', year:2023, km:'5,600', price:'₹5,10,00,000',
  engine:'3.0-litre twin-turbo V6 with electric motor', power:'671 bhp combined', torque:'720 Nm',
  gearbox:'8-speed dual clutch', drive:'Rear-wheel drive',
  sprint:'3.0 s', top:'330 km/h', weight:'1,498 kg', seats:'Two',
  owners:'One', reg:'MH 02 · first registered July 2023', keys:'Two',
  service:'Full history. All software recalls applied — we have the printout.',
  status:'Road registered. Charged and driven fortnightly under our care.',
  health:{
    Mechanical:['A','Hybrid battery state of health 98%. E-motor engages without hesitation.'],
    Bodywork:['A','Original. No stress marks at the dihedral door hinges.'],
    Interior:['A','Clubsport seats unmarked. Both charging cables present.'],
    'Tyres & brakes':['A','Pirelli P Zero Corsa at 6.4 mm. Ceramics at 4%.'],
    Electronics:['A','No codes, and importantly every early-car software update has been applied.']
  },
  note:'Early Arturas had a software history worth checking. We checked: every recall and update has been applied and we hand over the dealer printout that proves it.'
},
{
  marque:'McLaren', origin:'Woking, England', name:'GT', body:'coupe',
  paint:'#E6E6E3', colour:'Silica White', year:2022, km:'10,300', price:'₹3,72,00,000',
  engine:'4.0-litre twin-turbo V8', power:'612 bhp', torque:'630 Nm at 5,500 rpm',
  gearbox:'7-speed dual clutch', drive:'Rear-wheel drive',
  sprint:'3.2 s', top:'326 km/h', weight:'1,530 kg', seats:'Two',
  owners:'Two', reg:'MH 12 · first registered March 2022', keys:'Two',
  service:'Full history across both owners. Last at 9,800 km.',
  status:'Road registered. Genuinely toured — the rear luggage bay has been used.',
  health:{
    Mechanical:['A','Proactive damping reads clean. No accumulator warnings stored.'],
    Bodywork:['A−','Two small chips at the leading edge of the roof, unrepaired and disclosed.'],
    Interior:['A','Cashmere hide clean. Rear luggage deck without scuffing.'],
    'Tyres & brakes':['A−','Pirelli PZ4 at 5.2 mm. Discs at 84%.'],
    Electronics:['A','No codes. Nose lift operates at speed as intended.']
  },
  note:'The McLaren built to be driven across a country rather than around a circuit, and this one has been. Highest mileage McLaren here and the most sorted of the three.'
},
{
  marque:'Mercedes-AMG', origin:'Affalterbach, Germany', name:'G 63', body:'box',
  paint:'#15161A', colour:'Obsidian Black', year:2023, km:'14,100', price:'₹3,60,00,000',
  engine:'4.0-litre twin-turbo V8', power:'577 bhp', torque:'850 Nm at 2,500 rpm',
  gearbox:'9-speed automatic', drive:'Permanent all-wheel drive, three locking differentials',
  sprint:'4.5 s', top:'240 km/h, limited', weight:'2,485 kg', seats:'Five',
  owners:'One', reg:'MH 01 · first registered February 2023', keys:'Two',
  service:'Full Mercedes history. Last at 13,500 km.',
  status:'Road registered. City driven, no off-road use recorded.',
  health:{
    Mechanical:['A','All three diff locks engage and release cleanly. No transfer case whine.'],
    Bodywork:['A','Original panels. Door seals and hinges tight — no sag on the heavy doors.'],
    Interior:['A−','Driver seat bolster shows light use. Nappa hide otherwise unmarked.'],
    'Tyres & brakes':['A','Pirelli Scorpion at 6.2 mm. Discs at 81%.'],
    Electronics:['A','No codes. Both screens and the 360 camera functioning.']
  },
  note:'A G 63 that has never been off road, which is what almost every buyer actually wants. The diff locks still work because we exercise them; most city cars of this age have seized linkages.'
},
{
  marque:'Mercedes-AMG', origin:'Affalterbach, Germany', name:'GT 63 S', body:'coupe',
  paint:'#5A5E63', colour:'Selenite Grey', year:2022, km:'16,200', price:'₹3,29,00,000',
  engine:'4.0-litre twin-turbo V8', power:'630 bhp', torque:'900 Nm at 2,500 rpm',
  gearbox:'9-speed wet clutch automatic', drive:'All-wheel drive with drift mode',
  sprint:'3.2 s', top:'315 km/h', weight:'2,045 kg', seats:'Four',
  owners:'Two', reg:'MH 02 · first registered August 2022', keys:'Two',
  service:'Full history. Wet clutch and rear diff serviced by us at intake.',
  status:'Road registered. Regular use, mixed city and highway.',
  health:{
    Mechanical:['A−','Wet clutch measured healthy. Rear differential fluid renewed on arrival.'],
    Bodywork:['A','Original. Rear wing deploys and retracts without hesitation.'],
    Interior:['A−','Wear consistent with 16,200 km. All four seats function.'],
    'Tyres & brakes':['B+','Michelin at 4.3 mm — a set due within the year. Ceramics at 17%.'],
    Electronics:['A','No codes. Rear axle steering and active engine mounts both correct.']
  },
  note:'The highest mileage AMG here and priced for it. Tyres are the one item due; we would rather you bought them to your own choice than fit a set to flatter the sale.'
},
{
  marque:'Mercedes-AMG', origin:'Affalterbach, Germany', name:'SL 55', body:'roadster',
  paint:'#A2172A', colour:'Patagonia Red', year:2023, km:'8,700', price:'₹2,45,00,000',
  engine:'4.0-litre twin-turbo V8', power:'469 bhp', torque:'700 Nm at 2,250 rpm',
  gearbox:'9-speed wet clutch automatic', drive:'All-wheel drive',
  sprint:'3.9 s', top:'295 km/h', weight:'1,970 kg', seats:'Two plus two',
  owners:'One', reg:'MH 03 · first registered April 2023', keys:'Two',
  service:'Full history. Roof mechanism inspected and lubricated by us.',
  status:'Road registered. Fair-weather use, roof cycled regularly.',
  health:{
    Mechanical:['A','Sound. Roof hydraulics without weep, which is the item that ages on these.'],
    Bodywork:['A','Original. Fabric roof clean and taut, no seam wear at the folds.'],
    Interior:['A','Weatherproofed leather in good order. Airscarf functioning.'],
    'Tyres & brakes':['A','Michelin at 5.9 mm. Discs at 86%.'],
    Electronics:['A','No codes. Roof cycles fully in eleven seconds, to specification.']
  },
  note:'On a folding-roof car the roof is the car. We cycled this one thirty times on intake, inspected the hydraulics for weep and lubricated the linkage. It is as good as the mileage suggests.'
}
];

/* every car is addressed by the slug of its model name, and the one-line
   spec on a card is just the long engine description worn down */
const shortEngine = (e) => {
  if(/kWh/.test(e)) return 'Electric';
  const litres = (e.match(/^([\d.]+)-litre/) || [])[1];
  const layout = (e.match(/\b(V\d+|flat-six|W\d+|V\d)\b/i) || [])[1];
  const hybrid = /electric motor|electric motors/.test(e) ? ' Hybrid' : '';
  return [litres, layout].filter(Boolean).join(' ') + hybrid;
};

FLOOR.forEach(c => {
  c.id = slug(c.name);
  c.spec = `${c.year} · ${c.km} km · ${shortEngine(c.engine)}`;
});

/* the marques on the floor, in the order they first appear, each with the
   count, where it is built, and how we read it */
const BLURB = {
  'rolls-royce': 'Goodwood builds cars to be sat in as much as driven, and the three we hold reflect that — two saloons and the Cullinan, every one of them on the 6.75-litre V12, every interior intact.',
  'ferrari': 'Maranello\u2019s current range spans a naturally aspirated V12, a turbocharged grand tourer and a hybrid. We hold one of each, which is about as complete a picture of the modern range as three cars can give.',
  'lamborghini': 'Sant\u2019Agata\u2019s cars are the loudest thing on any floor and the hardest to inspect honestly, because track use hides well. Ours are graded on what the tyres and the ceramics actually show.',
  'porsche': 'Stuttgart makes the easiest cars here to live with and the hardest to fault. Ours run from a manual Cayman through a Turbo S to an electric saloon, which is most of what Porsche now is.',
  'bentley': 'Crewe\u2019s W12 is nearly finished, and one of our three carries the last of it. All three have the long, warm mileage that these engines prefer to short city runs.',
  'aston-martin': 'Gaydon\u2019s current cars are the best they have built, and all three of ours are 2023 or later. Mechanically straightforward, and specified the way people actually ask for rather than the way they sat on a forecourt.',
  'mclaren': 'Woking builds around a carbon tub and hydraulic suspension, which is what we test first and hardest. All three of ours hold pressure overnight, which is the number that matters on these.',
  'mercedes-amg': 'Affalterbach\u2019s range runs from a box on axles to a four-door coup\u00e9 to a roadster. We have one of each, and not one of them has been asked to do something it was not built for.'
};

export const MARQUES = FLOOR.reduce((list, c) => {
  const id = slug(c.marque);
  const found = list.find(m => m.id === id);
  if(found) found.n++;
  else list.push({ name: c.marque, id, n: 1, home: c.origin, blurb: BLURB[id] || '' });
  return list;
}, []);

export const carsOf = (id) => FLOOR.filter(c => slug(c.marque) === id);

/* ============================================================
   CRAFT — what the cars are actually made of.
   One page per material, written from the inspection bay rather
   than the brochure: what it is, how it is built, what we look
   for, and what goes wrong with it in this climate.
   ============================================================ */

export const CRAFT = [
{
  id:'leather-seats', name:'Leather seats & stitching',
  lede:'A seat is the part of the car you are in contact with for every minute you own it, and the first place a false history shows up.',
  blocks:[
    ['What it is', [
      'The hides used at this level are full-grain or semi-aniline: the top layer of the skin, with the grain left intact rather than sanded off and embossed. Full-grain is stronger and ages by developing a patina; corrected grain, which most volume cars use, wears by losing its printed surface and never recovers.',
      'A single Phantom interior takes the hides of several bulls, chosen from herds kept away from barbed wire so the skins carry no scar lines. That is not marketing — it is why the panels can be cut large and unbroken.'
    ]],
    ['How it is made', [
      'Hides are drum-dyed rather than surface-sprayed, so colour runs through the leather instead of sitting on it. Panels are then cut to a nesting pattern that keeps the grain direction consistent across a seat, foam is laid up over the frame, and the cover is drawn down and stitched.',
      'Stitching is where cost hides. A single row is quick; a double row with a contrast thread has to be laid parallel within a millimetre over a curve, and cross-stitching or quilting multiplies that. Thread is usually a bonded nylon or polyester — strong, but it abrades where a leg swings across it a thousand times.'
    ]],
    ['What goes wrong', [
      'The driver bolster collapses first, because it takes the whole weight of a person getting in. Foam breaks down under the hide before the hide itself fails, so a seat can look sound and feel wrong.',
      'In humidity, untreated hide takes up moisture and then dries hard. In direct sun it bleaches unevenly and the top coat crazes. And denim transfers dye into pale leather permanently within about a year of daily use.'
    ]],
    ['Living with it', [
      'A damp microfibre and a pH-neutral cleaner, twice a year, is the whole regime. Anything that leaves a shine is a silicone dressing, and silicone seals the hide so it cannot breathe — the surface then cracks from underneath.'
    ]]
  ],
  checks:[
    'Bolster foam pressed by hand along its length, not just looked at',
    'Stitch rows traced for pulled or abraded thread, especially the outer seam of the driver seat',
    'Hide flexed to see whether it returns or stays creased',
    'Colour transfer checked on pale interiors with a white cloth',
    'Seat frame and rails cycled through their full travel for play'
  ],
  terms:[
    ['Full-grain','The outermost layer with the grain intact. Ages, rather than wears out.'],
    ['Semi-aniline','Dyed through, with a light protective coat. The compromise most marques use.'],
    ['Drum-dyed','Colour taken up through the whole thickness, not sprayed on the surface.'],
    ['Bonded thread','Nylon or polyester thread coated to resist abrasion at the seams.']
  ]
},
{
  id:'steering-wheel', name:'Steering wheel',
  lede:'The most honest odometer on any car. A wheel cannot be wound back, and the way its rim has worn tells you what the numbers on the dash may not.',
  blocks:[
    ['What it is', [
      'Under the leather is a cast magnesium or aluminium armature — light, stiff, and carrying the airbag, the clock spring, the horn contacts and, increasingly, the capacitive sensors that tell the car your hands are on it.',
      'Over that goes a moulded foam of varying density: firmer at the nine and three positions where you hold it, softer at the rim top. The wrap is then hide, Alcantara, or on the sportier cars a mix of both.'
    ]],
    ['How it is made', [
      'The cover is cut in three or four pieces and hand-stitched onto the rim in place, which is why the seam sits where it does — usually at six o’clock, out of the hands. The twelve o’clock marker on a performance car is either a stitched band or a moulded strip, and on a well-made wheel it is exactly centred.',
      'Buttons and paddles are separate assemblies. Paddles at this level are machined aluminium or magnesium, fixed to the column rather than the wheel so they stay put as you steer.'
    ]],
    ['What goes wrong', [
      'Alcantara shines. The nap flattens where hands rest and takes on a hard grey polish that cannot be brushed out — it is the clearest mileage tell on a car whose seats have been reconditioned.',
      'Button lacquer wears through to the plastic beneath on the two or three controls anyone actually uses. Paddles develop lateral play at the pivot. And a wheel that has been re-wrapped is usually obvious from a seam in the wrong place or stitching that does not match the rest of the interior.'
    ]],
    ['Living with it', [
      'Alcantara wants a soft brush and a damp cloth, worked in one direction. Solvent wipes dissolve the backing adhesive and the nap lifts away in patches.'
    ]]
  ],
  checks:[
    'Rim examined at nine and three under raking light for shine and nap flattening',
    'Stitch seam located — a re-wrap rarely puts it back where the factory did',
    'Every button pressed and its lacquer checked for wear-through',
    'Paddles moved laterally at the pivot for play',
    'Airbag cover seam checked for even gaps, which a deployment repair rarely restores'
  ],
  terms:[
    ['Armature','The cast metal skeleton the wheel is built on.'],
    ['Alcantara','A suede-like microfibre. Grippier than leather, and far quicker to show wear.'],
    ['Clock spring','The coiled ribbon that keeps electrical contact while the wheel turns.'],
    ['Twelve marker','The band or stripe at top dead centre on a performance wheel.']
  ]
},
{
  id:'dashboard', name:'Dashboard materials',
  lede:'The largest single surface in the cabin, and the one this climate attacks hardest. Everything about a dashboard is a response to heat.',
  blocks:[
    ['What it is', [
      'A dashboard is three things stacked: a rigid substrate, usually a glass-filled polypropylene, that carries the structure and the airbag chute; a foam layer for feel and for the way it collapses in an impact; and a skin.',
      'The skin is where the cars separate. Volume cars use a slush-moulded PVC or TPO skin — a powder cast against a heated tool, which is why the grain looks identical on every car. At this level the top roll is usually hand-wrapped hide, cut and stitched over the foam like an upholstered panel.'
    ]],
    ['How it is made', [
      'A wrapped dash is built up on the substrate by hand: the hide is warmed, drawn over compound curves, and held while the adhesive grabs. Where two panels meet, a stitched seam runs the length of the car — and on the best of them that seam is a single unbroken line from door to door.',
      'The instrument binnacle and the top roll get the most attention because they sit in the driver’s eyeline and take the most sun. Anti-glare grain is embossed into the upper surface for exactly that reason.'
    ]],
    ['What goes wrong', [
      'Heat is the whole story. Above about 60°C on the surface — which a dark dash reaches in a Mumbai car park — adhesive plasticises and the skin lifts, first at the A-pillar corners where the panel is under the most tension.',
      'Older soft-touch coatings go tacky as the plasticiser migrates out, and once a dash is sticky it cannot be cleaned back. Stitched hide shrinks slightly as it dries, which shows as a wave in a seam that used to be straight.'
    ]],
    ['Living with it', [
      'Shade matters more than any product. A sunshade in a parked car does more for a dashboard than a decade of dressings, and silicone shine products accelerate exactly the failure they are meant to hide.'
    ]]
  ],
  checks:[
    'A-pillar corners pressed for lift or bubbling under the skin',
    'Top roll seam sighted along its length for waves that indicate shrinkage',
    'Surface tested for tack with a clean fingertip in a hidden area',
    'Panel run over a broken road surface, listening for squeak at the windscreen joint',
    'Colour compared between the sun-exposed top and the shaded lower panel'
  ],
  terms:[
    ['Substrate','The rigid moulding underneath that carries the structure.'],
    ['Slush moulding','A skin cast by tumbling powder against a heated tool.'],
    ['Top roll','The upper section of the dash, in the driver’s eyeline and the sun.'],
    ['Plasticiser migration','The softener leaving a coating over time, leaving it tacky.']
  ]
},
{
  id:'metal-details', name:'Metal & aluminium details',
  lede:'The switches, vent surrounds and treadplates you touch every day. Solid metal is heavier, colder and more expensive than the plated plastic that imitates it — and it is the difference you feel before you notice.',
  blocks:[
    ['What it is', [
      'The hardware at this level is machined from solid billet: vent controls, pull switches, gear selectors, speaker grilles, pedal faces. Aluminium mostly, sometimes stainless for treadplates, occasionally magnesium where weight matters.',
      'Bentley knurls its rotaries in a diamond pattern; Rolls-Royce uses organ-stop pulls for the vents; McLaren mills the switchgear thin to save grams. The point of solid metal is thermal mass — it feels cold in the hand and stays cold, which plated ABS never does.'
    ]],
    ['How it is made', [
      'A control is turned or milled from bar stock, then finished one of three ways. Brushed gives a directional grain, applied with an abrasive belt so the lines run consistently across a set of parts. Bead-blasting gives an even matt. Polishing takes it to a mirror.',
      'Then it is usually anodised: an electrochemical process that grows a hard oxide layer into the surface rather than depositing a coating on top of it. That is why anodising cannot chip — but it can be worn through.'
    ]],
    ['What goes wrong', [
      'Anodising wears at touch points. On a heavily used car the ignition surround and the volume knob go bright where the finish has been rubbed away, and it cannot be touched in — the part is replaced or refinished whole.',
      'Coastal humidity is the other enemy. Mumbai air pits unprotected aluminium and lifts the lacquer on darkened chrome, which then corrodes underneath in a way that looks like a bloom under the surface. Once that starts it does not stop.'
    ]],
    ['Living with it', [
      'A damp cloth, nothing abrasive. Metal polish on an anodised part removes the finish it was meant to protect — the shine you get is the aluminium underneath, and it will not last.'
    ]]
  ],
  checks:[
    'Touch points — ignition, volume, selector — checked for wear-through of the anodising',
    'Brightwork examined under raking light for lacquer lift and blooming beneath',
    'Knurled surfaces run under a fingernail for flattened peaks',
    'Treadplates checked for scoring and for fastener alignment after removal',
    'Magnet run over metal-look trim to sort the solid from the plated'
  ],
  terms:[
    ['Billet','Solid bar stock, machined rather than cast or moulded.'],
    ['Anodising','A hard oxide layer grown into aluminium. Wears through; cannot chip.'],
    ['Knurling','A cut pattern that gives grip. Diamond knurling is Bentley’s signature.'],
    ['Bead-blasting','An even matt finish produced by blasting with fine media.']
  ]
},
{
  id:'trim', name:'Piano-black & wood trim',
  lede:'Two very different materials asked to do the same job. One is a slice of a tree; the other is a sheet of plastic pretending to be a lacquered piano lid. Both scratch.',
  blocks:[
    ['What it is', [
      'Wood veneer is a thin leaf cut from a single log, book-matched so the grain mirrors across the centreline of the car. A set of veneers for one interior comes from one tree, which is why a damaged panel is so hard to replace convincingly years later.',
      'Piano black is not wood at all. It is a moulded polymer with a high-gloss lacquer over it, sometimes over a carbon or plastic substrate. It is cheap to form into complex shapes, which is why it spread across every cabin in the last decade.'
    ]],
    ['How it is made', [
      'A veneer is laid onto a substrate, then built up with successive coats of polyurethane lacquer — often more than ten, cured and flatted between coats. The stack is then sanded through progressively finer grades and polished. The depth you see is real: you are looking through a millimetre of clear lacquer at the grain below.',
      'Open-pore finishes skip most of that. The wood is sealed but not filled, so the grain stays textured under the hand. It is more expensive to get right, and it does not scratch the way gloss does.'
    ]],
    ['What goes wrong', [
      'Piano black scratches if you look at it. Every dry dusting drags whatever grit is on the cloth across the lacquer, and the result is a haze of fine swirls that only shows in direct light — which is exactly the light a showroom avoids.',
      'Veneer clouds when moisture penetrates a lacquer crack, usually starting at a fixing hole or a panel edge. Sustained UV fades the colour unevenly, so a car parked with one side to the sun ends up with mismatched trim across the cabin.'
    ]],
    ['Living with it', [
      'Never dry dust piano black. A damp microfibre, one direction, then a dry one behind it. Wood wants the same, and both want to be kept out of the sun.'
    ]]
  ],
  checks:[
    'Gloss panels sighted under a raking light for swirl marks, which flat light hides',
    'Veneer edges checked for lifting and for clouding under the lacquer',
    'Colour compared between the sunward and shaded sides of the cabin',
    'Fixing points examined for radiating cracks in the lacquer',
    'Grain match checked across the centreline — a replaced panel rarely matches'
  ],
  terms:[
    ['Book-matched','Adjacent veneer leaves opened like a book so the grain mirrors.'],
    ['Open-pore','Sealed but unfilled, so the grain stays textured. Harder to do, harder to mark.'],
    ['Flatting','Sanding a lacquer coat level before the next one goes on.'],
    ['Swirl marks','Fine circular scratches from dry wiping. The default state of used piano black.']
  ]
},
{
  id:'paint-body', name:'Exterior paint & body lines',
  lede:'Paint is four layers and about 120 microns — roughly the thickness of a sheet of paper. Which is why a gauge tells you more about a car’s history in ten minutes than the seller will in an hour.',
  blocks:[
    ['What it is', [
      'From the steel outwards: an electrocoat for corrosion, a primer to fill and to give the topcoat something to key into, the basecoat that carries the colour and any metallic or pearl flake, and a clearcoat that provides the gloss and the UV protection. Together, about 100 to 140 microns on a factory panel.',
      'Tri-coat colours — the deep whites and reds — add a translucent mid-coat, which is why they cost more to repair: the painter has to rebuild three layers in register, not two.'
    ]],
    ['How it is made', [
      'A modern body is dipped, primed, and sprayed by robot in a controlled booth, then baked. The consistency of the orange peel — the fine texture in the clearcoat — is a signature of that process, and it is very hard to match by hand.',
      'Body lines are pressed into the panel, not added. A swage line running the length of a Continental has to hold its reflection unbroken from headlamp to tail, and the only way to judge one is to stand at the corner of the car and sight down it.'
    ]],
    ['What goes wrong', [
      'A repainted panel reads thicker on the gauge, usually 160 microns and up. It often has a different orange peel, and there is frequently overspray in the door shut or on a rubber seal where the masking stopped.',
      'Otherwise: stone chips on leading edges, kerb rash on the alloys and lower sills, and lacquer peel where UV has broken the clearcoat down — which starts on horizontal surfaces, so the roof and the boot lid before anything else.'
    ]],
    ['Living with it', [
      'Two buckets, a pH-neutral shampoo and a straight-line wash. Automatic brush washes are what put the swirl marks into most dark cars, and paint protection film is worth it on the leading edges long before it is worth it anywhere else.'
    ]]
  ],
  checks:[
    'Paint depth gauged at seventeen points and compared panel to panel',
    'Door, bonnet and boot shuts inspected for overspray and masking lines',
    'Body sighted along from each corner for reflection breaks in the swage lines',
    'Panel gaps measured, not eyeballed, and compared side to side',
    'Colour matched under daylight and under sodium light, which separates a good respray from a great one'
  ],
  terms:[
    ['Micron','A thousandth of a millimetre. Factory paint runs 100–140 of them.'],
    ['Orange peel','The fine texture in cured clearcoat. Its consistency is a factory signature.'],
    ['Tri-coat','A colour with a translucent mid-layer. Expensive to repair convincingly.'],
    ['Swage line','A pressed crease that carries a reflection down the length of a panel.']
  ]
}
];
