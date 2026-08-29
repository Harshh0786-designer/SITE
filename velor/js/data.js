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
