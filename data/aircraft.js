/* Catalogo aeromobili — specifiche costruttore (valori tipici/approssimati).
   maxSpeed = MMO convertito a quota di crociera (~1.062 km/h per Mach 1); turboelica: velocità massima di crociera.
   built = esemplari consegnati circa, aggiornato al 2026. */
window.AIRCRAFT = {

  /* ───────────── AIRBUS A320ceo ───────────── */
  "A318": {
    code: "A318", name: "Airbus A318", short: "A318", maker: "Airbus", family: "A320ceo", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 5750, pax: 107, paxMax: 132,
    length: 31.44, wingspan: 34.10, height: 12.56, mtow: 68, ceiling: 12500, fuel: 24210,
    engines: "2 × CFM International CFM56-5B / Pratt & Whitney PW6000A", engineCount: 2, thrust: "106 kN",
    firstFlight: 2002, introduced: 2003, built: 80,
    tagline: "Piccolo. Ma sempre Airbus.",
    description: "Il membro più compatto della famiglia A320, con la stessa cabina ampia e i comandi fly-by-wire. Capace perfino di atterrare a London City."
  },
  "A319": {
    code: "A319", name: "Airbus A319", short: "A319", maker: "Airbus", family: "A320ceo", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 6950, pax: 124, paxMax: 160,
    length: 33.84, wingspan: 34.10, height: 11.76, mtow: 75.5, ceiling: 12000, fuel: 24210,
    engines: "2 × CFM International CFM56-5B / IAE V2500", engineCount: 2, thrust: "120 kN",
    firstFlight: 1995, introduced: 1996, built: 1490,
    tagline: "Compatto. Versatile. Ovunque.",
    description: "Quasi quattro metri più corto dell'A320, con la stessa cabina e un'autonomia generosa. Ideale per rotte sottili e piste impegnative."
  },
  "A320": {
    code: "A320", name: "Airbus A320", short: "A320", maker: "Airbus", family: "A320ceo", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 6150, pax: 150, paxMax: 180,
    length: 37.57, wingspan: 35.80, height: 11.76, mtow: 78, ceiling: 12000, fuel: 24210,
    engines: "2 × CFM International CFM56-5B / IAE V2500", engineCount: 2, thrust: "120 kN",
    firstFlight: 1987, introduced: 1988, built: 4750,
    tagline: "L'icona del corto raggio.",
    description: "Il primo aereo di linea con comandi di volo fly-by-wire digitali. Ha ridefinito il trasporto aereo europeo e ne è ancora il cuore."
  },
  "A321": {
    code: "A321", name: "Airbus A321", short: "A321", maker: "Airbus", family: "A320ceo", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 5950, pax: 185, paxMax: 220,
    length: 44.51, wingspan: 35.80, height: 11.76, mtow: 93.5, ceiling: 12000, fuel: 23580,
    engines: "2 × CFM International CFM56-5B / IAE V2500", engineCount: 2, thrust: "147 kN",
    firstFlight: 1993, introduced: 1994, built: 1790,
    tagline: "Più spazio, stessa agilità.",
    description: "La versione allungata della famiglia A320: quasi sette metri di cabina in più per le rotte più trafficate."
  },

  /* ───────────── AIRBUS A320neo ───────────── */
  "A20N": {
    code: "A20N", name: "Airbus A320neo", short: "A320neo", maker: "Airbus", family: "A320neo", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 6300, pax: 165, paxMax: 194,
    length: 37.57, wingspan: 35.80, height: 11.76, mtow: 79, ceiling: 12130, fuel: 26730,
    engines: "2 × CFM LEAP-1A / Pratt & Whitney PW1100G", engineCount: 2, thrust: "120 kN",
    firstFlight: 2014, introduced: 2016, built: 2600,
    tagline: "Stessa forma. Tutto nuovo.",
    description: "Motori di nuova generazione e sharklet alle estremità alari: fino al 20% di carburante in meno per posto. Il bestseller di Airbus."
  },
  "A21N": {
    code: "A21N", name: "Airbus A321neo", short: "A321neo", maker: "Airbus", family: "A320neo", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 7400, pax: 200, paxMax: 244,
    length: 44.51, wingspan: 35.80, height: 11.76, mtow: 97, ceiling: 12130, fuel: 32940,
    engines: "2 × CFM LEAP-1A / Pratt & Whitney PW1100G", engineCount: 2, thrust: "147 kN",
    firstFlight: 2016, introduced: 2017, built: 2200,
    tagline: "Un corridoio, oltre l'oceano.",
    description: "Fino a 244 posti e autonomia transatlantica nelle versioni LR e XLR. Un solo corridoio, possibilità da widebody."
  },

  /* ───────────── AIRBUS A220 (ex Bombardier CSeries) ───────────── */
  "BCS1": {
    code: "BCS1", name: "Airbus A220-100", short: "A220-100", maker: "Airbus", family: "A220", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 6390, pax: 110, paxMax: 135,
    length: 35.00, wingspan: 35.10, height: 11.50, mtow: 63.1, ceiling: 12500, fuel: 21805,
    engines: "2 × Pratt & Whitney PW1500G", engineCount: 2, thrust: "93 kN",
    firstFlight: 2013, introduced: 2016, built: 85,
    tagline: "Nato Bombardier, oggi Airbus.",
    description: "Progettato come Bombardier CS100 e adottato da Airbus nel 2018. Cabina ampia, finestrini grandi e motori a ingranaggi silenziosissimi."
  },
  "BCS3": {
    code: "BCS3", name: "Airbus A220-300", short: "A220-300", maker: "Airbus", family: "A220", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 6700, pax: 140, paxMax: 160,
    length: 38.70, wingspan: 35.10, height: 11.50, mtow: 70.9, ceiling: 12500, fuel: 21805,
    engines: "2 × Pratt & Whitney PW1500G", engineCount: 2, thrust: "103 kN",
    firstFlight: 2015, introduced: 2016, built: 445,
    tagline: "Dalla CSeries al futuro.",
    description: "Già Bombardier CS300, oggi il modello più venduto della famiglia A220. Efficienza di nuova generazione sotto i 160 posti."
  },

  /* ───────────── AIRBUS WIDEBODY ───────────── */
  "A332": {
    code: "A332", name: "Airbus A330-200", short: "A330-200", maker: "Airbus", family: "A330", category: "Widebody",
    maxSpeed: 913, cruiseSpeed: 871, mach: 0.82, range: 13450, pax: 247, paxMax: 406,
    length: 58.82, wingspan: 60.30, height: 17.39, mtow: 242, ceiling: 12500, fuel: 139090,
    engines: "2 × GE CF6-80E1 / Pratt & Whitney PW4000 / Rolls-Royce Trent 700", engineCount: 2, thrust: "316 kN",
    firstFlight: 1997, introduced: 1998, built: 660,
    tagline: "Lungo raggio, su misura.",
    description: "La versione accorciata dell'A330, nata per le rotte lunghe e a domanda contenuta. Affidabile ed efficiente, in servizio in tutto il mondo."
  },
  "A333": {
    code: "A333", name: "Airbus A330-300", short: "A330-300", maker: "Airbus", family: "A330", category: "Widebody",
    maxSpeed: 913, cruiseSpeed: 871, mach: 0.82, range: 11750, pax: 277, paxMax: 440,
    length: 63.66, wingspan: 60.30, height: 16.79, mtow: 242, ceiling: 12500, fuel: 139090,
    engines: "2 × GE CF6-80E1 / Pratt & Whitney PW4000 / Rolls-Royce Trent 700", engineCount: 2, thrust: "316 kN",
    firstFlight: 1992, introduced: 1994, built: 780,
    tagline: "Il cavallo di battaglia.",
    description: "Oltre trent'anni di servizio e centinaia di esemplari in flotta. Capacità e comfort per il medio e il lungo raggio."
  },
  "A339": {
    code: "A339", name: "Airbus A330-900neo", short: "A330neo", maker: "Airbus", family: "A330neo", category: "Widebody",
    maxSpeed: 913, cruiseSpeed: 871, mach: 0.82, range: 13334, pax: 287, paxMax: 460,
    length: 63.66, wingspan: 64.00, height: 16.79, mtow: 251, ceiling: 12500, fuel: 139090,
    engines: "2 × Rolls-Royce Trent 7000", engineCount: 2, thrust: "320 kN",
    firstFlight: 2017, introduced: 2018, built: 170,
    tagline: "Il classico, reinventato.",
    description: "Motori Rolls-Royce Trent 7000, ala più ampia e cabina Airspace. Fino al 25% di carburante in meno per posto rispetto alla generazione precedente."
  },
  "A343": {
    code: "A343", name: "Airbus A340-300", short: "A340-300", maker: "Airbus", family: "A340", category: "Widebody",
    maxSpeed: 913, cruiseSpeed: 871, mach: 0.82, range: 13700, pax: 295, paxMax: 440,
    length: 63.69, wingspan: 60.30, height: 16.85, mtow: 276.5, ceiling: 12500, fuel: 147850,
    engines: "4 × CFM International CFM56-5C", engineCount: 4, thrust: "151 kN",
    firstFlight: 1991, introduced: 1993, built: 218,
    tagline: "Quattro motori. Nessun limite.",
    description: "Nato per le rotte lunghissime quando i bimotori avevano ancora dei vincoli. Quattro CFM56 e un'eleganza senza tempo."
  },
  "A346": {
    code: "A346", name: "Airbus A340-600", short: "A340-600", maker: "Airbus", family: "A340", category: "Widebody",
    maxSpeed: 913, cruiseSpeed: 881, mach: 0.83, range: 14450, pax: 380, paxMax: 475,
    length: 75.36, wingspan: 63.45, height: 17.22, mtow: 380, ceiling: 12630, fuel: 195620,
    engines: "4 × Rolls-Royce Trent 500", engineCount: 4, thrust: "267 kN",
    firstFlight: 2001, introduced: 2002, built: 97,
    tagline: "Lungo. Elegante. Inconfondibile.",
    description: "Per anni l'aereo di linea più lungo del mondo. Quattro Rolls-Royce Trent 500 e una cabina spaziosa per i voli intercontinentali."
  },
  "A359": {
    code: "A359", name: "Airbus A350-900", short: "A350-900", maker: "Airbus", family: "A350", category: "Widebody",
    maxSpeed: 945, cruiseSpeed: 903, mach: 0.85, range: 15000, pax: 315, paxMax: 440,
    length: 66.80, wingspan: 64.75, height: 17.05, mtow: 283, ceiling: 13100, fuel: 141000,
    engines: "2 × Rolls-Royce Trent XWB-84", engineCount: 2, thrust: "374 kN",
    firstFlight: 2013, introduced: 2015, built: 630,
    tagline: "Progettato per il futuro.",
    description: "Oltre metà della struttura in materiali compositi. Silenzioso, efficiente e capace di voli senza scalo di oltre 18 ore."
  },
  "A35K": {
    code: "A35K", name: "Airbus A350-1000", short: "A350-1000", maker: "Airbus", family: "A350", category: "Widebody",
    maxSpeed: 945, cruiseSpeed: 903, mach: 0.85, range: 16100, pax: 369, paxMax: 480,
    length: 73.79, wingspan: 64.75, height: 17.08, mtow: 319, ceiling: 13100, fuel: 159000,
    engines: "2 × Rolls-Royce Trent XWB-97", engineCount: 2, thrust: "431 kN",
    firstFlight: 2016, introduced: 2018, built: 120,
    tagline: "Il più grande bimotore Airbus.",
    description: "Sette metri più lungo dell'A350-900, con carrelli a sei ruote e motori Trent XWB-97. Pensato per sostituire i quadrimotori."
  },
  "A388": {
    code: "A388", name: "Airbus A380-800", short: "A380", maker: "Airbus", family: "A380", category: "Widebody",
    maxSpeed: 945, cruiseSpeed: 903, mach: 0.85, range: 15000, pax: 545, paxMax: 853,
    length: 72.72, wingspan: 79.75, height: 24.09, mtow: 575, ceiling: 13100, fuel: 320000,
    engines: "4 × Rolls-Royce Trent 900 / Engine Alliance GP7200", engineCount: 4, thrust: "311 kN",
    firstFlight: 2005, introduced: 2007, built: 251,
    tagline: "Il gigante dei cieli.",
    description: "Due ponti interi, quattro motori e spazio per oltre 500 passeggeri. Il più grande aereo di linea mai costruito."
  },

  /* ───────────── BOEING 717 / 737 ───────────── */
  "B712": {
    code: "B712", name: "Boeing 717-200", short: "717", maker: "Boeing", family: "717", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 818, mach: 0.77, range: 3815, pax: 106, paxMax: 134,
    length: 37.81, wingspan: 28.45, height: 8.92, mtow: 54.9, ceiling: 11280, fuel: 13892,
    engines: "2 × Rolls-Royce BR715", engineCount: 2, thrust: "93 kN",
    firstFlight: 1998, introduced: 1999, built: 156,
    tagline: "L'ultimo dei Douglas.",
    description: "Nato come McDonnell Douglas MD-95 e completato da Boeing. Robusto e agile, pensato per voli brevi e frequenti."
  },
  "B737": {
    code: "B737", name: "Boeing 737-700", short: "737-700", maker: "Boeing", family: "737 NG", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 839, mach: 0.79, range: 5570, pax: 126, paxMax: 149,
    length: 33.63, wingspan: 35.79, height: 12.55, mtow: 70.1, ceiling: 12500, fuel: 26020,
    engines: "2 × CFM International CFM56-7B", engineCount: 2, thrust: "117 kN",
    firstFlight: 1997, introduced: 1998, built: 1128,
    tagline: "Compatto, affidabile, ovunque.",
    description: "Il più corto della Next Generation, a suo agio su piste brevi e rotte sottili. È anche la base del Boeing Business Jet."
  },
  "B738": {
    code: "B738", name: "Boeing 737-800", short: "737-800", maker: "Boeing", family: "737 NG", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 839, mach: 0.79, range: 5436, pax: 162, paxMax: 189,
    length: 39.47, wingspan: 35.79, height: 12.55, mtow: 79, ceiling: 12500, fuel: 26020,
    engines: "2 × CFM International CFM56-7B", engineCount: 2, thrust: "121 kN",
    firstFlight: 1997, introduced: 1998, built: 4990,
    tagline: "Il 737 per eccellenza.",
    description: "Quasi cinquemila esemplari consegnati: la spina dorsale di compagnie low-cost e di bandiera in tutto il mondo."
  },
  "B739": {
    code: "B739", name: "Boeing 737-900ER", short: "737-900", maker: "Boeing", family: "737 NG", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 839, mach: 0.79, range: 5460, pax: 178, paxMax: 220,
    length: 42.11, wingspan: 35.79, height: 12.55, mtow: 85.1, ceiling: 12500, fuel: 29660,
    engines: "2 × CFM International CFM56-7B", engineCount: 2, thrust: "121 kN",
    firstFlight: 2000, introduced: 2001, built: 557,
    tagline: "Next Generation, formato extra.",
    description: "La variante più capiente del 737 NG. Nella versione ER, uscite aggiuntive e serbatoi ausiliari consentono fino a 220 posti."
  },
  "B38M": {
    code: "B38M", name: "Boeing 737 MAX 8", short: "737 MAX 8", maker: "Boeing", family: "737 MAX", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 839, mach: 0.79, range: 6570, pax: 162, paxMax: 210,
    length: 39.52, wingspan: 35.92, height: 12.29, mtow: 82.2, ceiling: 12500, fuel: 25941,
    engines: "2 × CFM LEAP-1B", engineCount: 2, thrust: "130 kN",
    firstFlight: 2016, introduced: 2017, built: 2300,
    tagline: "Il 737, reinventato.",
    description: "Motori CFM LEAP-1B e winglet Advanced Technology per circa il 14% di carburante in meno rispetto al 737 NG."
  },
  "B39M": {
    code: "B39M", name: "Boeing 737 MAX 9", short: "737 MAX 9", maker: "Boeing", family: "737 MAX", category: "Narrowbody",
    maxSpeed: 871, cruiseSpeed: 839, mach: 0.79, range: 6110, pax: 178, paxMax: 220,
    length: 42.16, wingspan: 35.92, height: 12.29, mtow: 88.3, ceiling: 12500, fuel: 25941,
    engines: "2 × CFM LEAP-1B", engineCount: 2, thrust: "130 kN",
    firstFlight: 2017, introduced: 2018, built: 260,
    tagline: "Più posti, stessa efficienza.",
    description: "La versione allungata del 737 MAX: fino a 220 passeggeri con l'efficienza dei motori LEAP-1B."
  },

  /* ───────────── BOEING 747 ───────────── */
  "B744": {
    code: "B744", name: "Boeing 747-400", short: "747-400", maker: "Boeing", family: "747", category: "Widebody",
    maxSpeed: 977, cruiseSpeed: 903, mach: 0.85, range: 13450, pax: 416, paxMax: 660,
    length: 70.66, wingspan: 64.44, height: 19.41, mtow: 396.9, ceiling: 13750, fuel: 216840,
    engines: "4 × GE CF6-80C2 / Pratt & Whitney PW4000 / Rolls-Royce RB211-524", engineCount: 4, thrust: "282 kN",
    firstFlight: 1988, introduced: 1989, built: 694,
    tagline: "La Regina dei cieli.",
    description: "Il jumbo che ha reso il lungo raggio accessibile a tutti. La gobba iconica, quattro motori e una leggenda lunga oltre cinquant'anni."
  },
  "B748": {
    code: "B748", name: "Boeing 747-8 Intercontinental", short: "747-8", maker: "Boeing", family: "747", category: "Widebody",
    maxSpeed: 956, cruiseSpeed: 908, mach: 0.855, range: 14320, pax: 410, paxMax: 605,
    length: 76.25, wingspan: 68.45, height: 19.35, mtow: 447.7, ceiling: 13100, fuel: 242470,
    engines: "4 × GE GEnx-2B67", engineCount: 4, thrust: "296 kN",
    firstFlight: 2011, introduced: 2012, built: 48,
    tagline: "L'ultima regina.",
    description: "Il 747 più lungo e moderno mai costruito, con motori GEnx e ali ridisegnate. L'ultimo capitolo di una leggenda."
  },

  /* ───────────── BOEING 757 / 767 ───────────── */
  "B752": {
    code: "B752", name: "Boeing 757-200", short: "757-200", maker: "Boeing", family: "757", category: "Narrowbody",
    maxSpeed: 913, cruiseSpeed: 850, mach: 0.80, range: 7250, pax: 200, paxMax: 239,
    length: 47.32, wingspan: 38.05, height: 13.56, mtow: 115.7, ceiling: 12800, fuel: 43490,
    engines: "2 × Rolls-Royce RB211-535 / Pratt & Whitney PW2000", engineCount: 2, thrust: "193 kN",
    firstFlight: 1982, introduced: 1983, built: 994,
    tagline: "Potenza pura.",
    description: "Spinta abbondante e ali generose: decolla da piste corte e attraversa l'Atlantico. Un solo corridoio, prestazioni da primato."
  },
  "B753": {
    code: "B753", name: "Boeing 757-300", short: "757-300", maker: "Boeing", family: "757", category: "Narrowbody",
    maxSpeed: 913, cruiseSpeed: 850, mach: 0.80, range: 6295, pax: 243, paxMax: 295,
    length: 54.43, wingspan: 38.05, height: 13.56, mtow: 123.6, ceiling: 12800, fuel: 43490,
    engines: "2 × Rolls-Royce RB211-535 / Pratt & Whitney PW2000", engineCount: 2, thrust: "193 kN",
    firstFlight: 1998, introduced: 1999, built: 55,
    tagline: "Lungo come nessun altro.",
    description: "Il bimotore a corridoio singolo più lungo mai prodotto. Capacità quasi da widebody su rotte a corto e medio raggio."
  },
  "B763": {
    code: "B763", name: "Boeing 767-300ER", short: "767-300", maker: "Boeing", family: "767", category: "Widebody",
    maxSpeed: 913, cruiseSpeed: 850, mach: 0.80, range: 11070, pax: 218, paxMax: 351,
    length: 54.94, wingspan: 47.57, height: 15.85, mtow: 186.9, ceiling: 13100, fuel: 91380,
    engines: "2 × GE CF6-80C2 / Pratt & Whitney PW4000 / Rolls-Royce RB211-524H", engineCount: 2, thrust: "282 kN",
    firstFlight: 1986, introduced: 1988, built: 583,
    tagline: "Il pioniere dell'Atlantico.",
    description: "Il bimotore che ha aperto l'era ETOPS sulle rotte transatlantiche. Doppio corridoio con configurazione 2-3-2."
  },
  "B764": {
    code: "B764", name: "Boeing 767-400ER", short: "767-400", maker: "Boeing", family: "767", category: "Widebody",
    maxSpeed: 913, cruiseSpeed: 850, mach: 0.80, range: 10415, pax: 245, paxMax: 375,
    length: 61.37, wingspan: 51.92, height: 16.87, mtow: 204.1, ceiling: 13100, fuel: 91380,
    engines: "2 × GE CF6-80C2 / Pratt & Whitney PW4000", engineCount: 2, thrust: "282 kN",
    firstFlight: 1999, introduced: 2000, built: 38,
    tagline: "Il 767 più lungo.",
    description: "Fusoliera allungata, estremità alari inclinate e cabina ispirata al 777. Appena 38 esemplari costruiti."
  },

  /* ───────────── BOEING 777 ───────────── */
  "B772": {
    code: "B772", name: "Boeing 777-200ER", short: "777-200ER", maker: "Boeing", family: "777", category: "Widebody",
    maxSpeed: 945, cruiseSpeed: 892, mach: 0.84, range: 13080, pax: 301, paxMax: 440,
    length: 63.73, wingspan: 60.93, height: 18.52, mtow: 297.6, ceiling: 13100, fuel: 171170,
    engines: "2 × GE90-94B / Pratt & Whitney PW4090 / Rolls-Royce Trent 895", engineCount: 2, thrust: "417 kN",
    firstFlight: 1996, introduced: 1997, built: 422,
    tagline: "L'inizio di una leggenda.",
    description: "Il primo aereo di linea progettato interamente al computer. La versione ER ha reso il bimotore padrone del lungo raggio."
  },
  "B773": {
    code: "B773", name: "Boeing 777-300", short: "777-300", maker: "Boeing", family: "777", category: "Widebody",
    maxSpeed: 945, cruiseSpeed: 892, mach: 0.84, range: 11165, pax: 368, paxMax: 550,
    length: 73.86, wingspan: 60.93, height: 18.51, mtow: 299.4, ceiling: 13100, fuel: 171170,
    engines: "2 × Pratt & Whitney PW4098 / Rolls-Royce Trent 892", engineCount: 2, thrust: "436 kN",
    firstFlight: 1997, introduced: 1998, built: 60,
    tagline: "Capienza senza compromessi.",
    description: "Dieci metri più lungo del 777-200, pensato per le rotte ad altissima densità. Ne sono stati costruiti appena 60."
  },
  "B77L": {
    code: "B77L", name: "Boeing 777-200LR", short: "777-200LR", maker: "Boeing", family: "777", category: "Widebody",
    maxSpeed: 945, cruiseSpeed: 892, mach: 0.84, range: 15843, pax: 317, paxMax: 440,
    length: 63.73, wingspan: 64.80, height: 18.57, mtow: 347.5, ceiling: 13100, fuel: 181280,
    engines: "2 × GE90-110B1", engineCount: 2, thrust: "489 kN",
    firstFlight: 2005, introduced: 2006, built: 61,
    tagline: "Nessuna meta è lontana.",
    description: "Per anni l'aereo di linea con la maggiore autonomia al mondo: oltre 15.800 km senza scalo. Spinto dai potentissimi GE90-110B."
  },
  "B77W": {
    code: "B77W", name: "Boeing 777-300ER", short: "777-300ER", maker: "Boeing", family: "777", category: "Widebody",
    maxSpeed: 945, cruiseSpeed: 892, mach: 0.84, range: 13650, pax: 365, paxMax: 550,
    length: 73.86, wingspan: 64.80, height: 18.51, mtow: 351.5, ceiling: 13100, fuel: 181280,
    engines: "2 × GE90-115B", engineCount: 2, thrust: "513 kN",
    firstFlight: 2003, introduced: 2004, built: 830,
    tagline: "Il re del lungo raggio.",
    description: "Capacità, autonomia e i motori più potenti mai montati su un aereo di linea. Il riferimento per le rotte intercontinentali."
  },

  /* ───────────── BOEING 787 ───────────── */
  "B788": {
    code: "B788", name: "Boeing 787-8 Dreamliner", short: "787-8", maker: "Boeing", family: "787", category: "Widebody",
    maxSpeed: 956, cruiseSpeed: 903, mach: 0.85, range: 13530, pax: 248, paxMax: 381,
    length: 56.72, wingspan: 60.12, height: 17.02, mtow: 227.9, ceiling: 13100, fuel: 126210,
    engines: "2 × GE GEnx-1B / Rolls-Royce Trent 1000", engineCount: 2, thrust: "280 kN",
    firstFlight: 2009, introduced: 2011, built: 390,
    tagline: "Il Dreamliner originale.",
    description: "Il primo aereo di linea con fusoliera in composito. Finestrini più grandi, aria più umida e cabina pressurizzata a quota più bassa."
  },
  "B789": {
    code: "B789", name: "Boeing 787-9 Dreamliner", short: "787-9", maker: "Boeing", family: "787", category: "Widebody",
    maxSpeed: 956, cruiseSpeed: 903, mach: 0.85, range: 14010, pax: 296, paxMax: 420,
    length: 62.81, wingspan: 60.12, height: 17.02, mtow: 254, ceiling: 13100, fuel: 126370,
    engines: "2 × GE GEnx-1B / Rolls-Royce Trent 1000", engineCount: 2, thrust: "320 kN",
    firstFlight: 2013, introduced: 2014, built: 790,
    tagline: "Il sogno, più lontano.",
    description: "Sei metri più lungo del 787-8 e con maggiore autonomia. Il Dreamliner più diffuso al mondo."
  },
  "B78X": {
    code: "B78X", name: "Boeing 787-10 Dreamliner", short: "787-10", maker: "Boeing", family: "787", category: "Widebody",
    maxSpeed: 956, cruiseSpeed: 903, mach: 0.85, range: 11730, pax: 336, paxMax: 440,
    length: 68.28, wingspan: 60.12, height: 17.02, mtow: 254, ceiling: 13100, fuel: 126370,
    engines: "2 × GE GEnx-1B / Rolls-Royce Trent 1000 TEN", engineCount: 2, thrust: "340 kN",
    firstFlight: 2017, introduced: 2018, built: 150,
    tagline: "Il Dreamliner più capiente.",
    description: "Il più lungo della famiglia 787, pensato per le rotte ad alta densità. Fino al 25% di carburante in meno per posto rispetto agli aerei che sostituisce."
  },

  /* ───────────── BOMBARDIER CRJ ───────────── */
  "CRJ2": {
    code: "CRJ2", name: "Bombardier CRJ200", short: "CRJ200", maker: "Bombardier", family: "CRJ", category: "Regional",
    maxSpeed: 903, cruiseSpeed: 818, mach: 0.77, range: 3045, pax: 50, paxMax: 50,
    length: 26.77, wingspan: 21.21, height: 6.22, mtow: 24, ceiling: 12500, fuel: 8080,
    engines: "2 × GE CF34-3B1", engineCount: 2, thrust: "41 kN",
    firstFlight: 1991, introduced: 1992, built: 1021,
    tagline: "Il jet regionale originale.",
    description: "Il primo jet regionale di grande successo, derivato dal business jet Challenger. Cinquanta posti e la velocità di un jet."
  },
  "CRJ7": {
    code: "CRJ7", name: "Bombardier CRJ700", short: "CRJ700", maker: "Bombardier", family: "CRJ", category: "Regional",
    maxSpeed: 903, cruiseSpeed: 828, mach: 0.78, range: 2656, pax: 70, paxMax: 78,
    length: 32.51, wingspan: 23.24, height: 7.57, mtow: 35, ceiling: 12500, fuel: 10977,
    engines: "2 × GE CF34-8C5", engineCount: 2, thrust: "61 kN",
    firstFlight: 1999, introduced: 2001, built: 330,
    tagline: "Regionale, con stile.",
    description: "Fusoliera allungata e ala nuova rispetto al CRJ200. Settanta posti per collegare i piccoli aeroporti ai grandi hub."
  },
  "CRJ9": {
    code: "CRJ9", name: "Bombardier CRJ900", short: "CRJ900", maker: "Bombardier", family: "CRJ", category: "Regional",
    maxSpeed: 903, cruiseSpeed: 828, mach: 0.78, range: 2876, pax: 76, paxMax: 90,
    length: 36.40, wingspan: 24.85, height: 7.51, mtow: 38.3, ceiling: 12500, fuel: 10977,
    engines: "2 × GE CF34-8C5", engineCount: 2, thrust: "64,5 kN",
    firstFlight: 2001, introduced: 2003, built: 480,
    tagline: "Il più capiente della serie.",
    description: "Fino a 90 posti con la stessa agilità della famiglia CRJ. Un pilastro delle reti regionali nordamericane ed europee."
  },

  /* ───────────── EMBRAER ───────────── */
  "E145": {
    code: "E145", name: "Embraer ERJ145", short: "ERJ145", maker: "Embraer", family: "ERJ", category: "Regional",
    maxSpeed: 828, cruiseSpeed: 786, mach: 0.74, range: 2870, pax: 50, paxMax: 50,
    length: 29.87, wingspan: 20.04, height: 6.75, mtow: 22, ceiling: 11280, fuel: 6450,
    engines: "2 × Rolls-Royce AE 3007A", engineCount: 2, thrust: "33 kN",
    firstFlight: 1995, introduced: 1997, built: 700,
    tagline: "Cinquanta posti, zero compromessi.",
    description: "Il jet regionale che ha reso Embraer un protagonista mondiale. Configurazione 1-2, senza posti centrali."
  },
  "E170": {
    code: "E170", name: "Embraer 170", short: "E170", maker: "Embraer", family: "E-Jet", category: "Regional",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 3900, pax: 72, paxMax: 78,
    length: 29.90, wingspan: 26.00, height: 9.85, mtow: 37.2, ceiling: 12500, fuel: 11625,
    engines: "2 × GE CF34-8E", engineCount: 2, thrust: "63 kN",
    firstFlight: 2002, introduced: 2004, built: 191,
    tagline: "Il primo E-Jet.",
    description: "Il capostipite della famiglia E-Jet, con fusoliera a doppia bolla e nessun posto centrale. Comfort da grande jet in formato regionale."
  },
  "E75L": {
    code: "E75L", name: "Embraer 175", short: "E175", maker: "Embraer", family: "E-Jet", category: "Regional",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 4070, pax: 76, paxMax: 88,
    length: 31.68, wingspan: 28.65, height: 9.86, mtow: 40.4, ceiling: 12500, fuel: 11625,
    engines: "2 × GE CF34-8E", engineCount: 2, thrust: "63 kN",
    firstFlight: 2003, introduced: 2005, built: 900,
    tagline: "Il regionale d'America.",
    description: "L'E-Jet più diffuso, colonna portante delle reti regionali statunitensi. Questa variante adotta estremità alari maggiorate per ridurre i consumi."
  },
  "E190": {
    code: "E190", name: "Embraer 190", short: "E190", maker: "Embraer", family: "E-Jet", category: "Regional",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 4537, pax: 100, paxMax: 114,
    length: 36.24, wingspan: 28.72, height: 10.57, mtow: 51.8, ceiling: 12500, fuel: 16153,
    engines: "2 × GE CF34-10E", engineCount: 2, thrust: "89 kN",
    firstFlight: 2004, introduced: 2005, built: 568,
    tagline: "Grandi idee, formato regionale.",
    description: "Il ponte tra jet regionale e narrowbody: circa cento posti, due per lato, nessun posto centrale."
  },
  "E195": {
    code: "E195", name: "Embraer 195", short: "E195", maker: "Embraer", family: "E-Jet", category: "Regional",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 4260, pax: 116, paxMax: 124,
    length: 38.65, wingspan: 28.72, height: 10.55, mtow: 52.3, ceiling: 12500, fuel: 16153,
    engines: "2 × GE CF34-10E", engineCount: 2, thrust: "89 kN",
    firstFlight: 2004, introduced: 2006, built: 172,
    tagline: "Il più grande E-Jet.",
    description: "La versione più capiente della prima generazione E-Jet, ideale per le rotte europee a domanda media."
  },
  "E295": {
    code: "E295", name: "Embraer 195-E2", short: "E195-E2", maker: "Embraer", family: "E-Jet E2", category: "Regional",
    maxSpeed: 871, cruiseSpeed: 828, mach: 0.78, range: 4815, pax: 132, paxMax: 146,
    length: 41.50, wingspan: 35.12, height: 10.90, mtow: 61.5, ceiling: 12500, fuel: 17050,
    engines: "2 × Pratt & Whitney PW1900G", engineCount: 2, thrust: "102 kN",
    firstFlight: 2017, introduced: 2019, built: 110,
    tagline: "Silenzioso. Efficiente. Nuovo.",
    description: "La seconda generazione E-Jet: ala nuova, motori Pratt & Whitney GTF e circa il 25% di carburante in meno per posto."
  },

  /* ───────────── TURBOELICA ───────────── */
  "AT46": {
    code: "AT46", name: "ATR 42-600", short: "ATR 42", maker: "ATR", family: "ATR", category: "Turboprop",
    maxSpeed: 556, cruiseSpeed: 530, mach: null, range: 1326, pax: 48, paxMax: 50,
    length: 22.67, wingspan: 24.57, height: 7.59, mtow: 18.6, ceiling: 7620, fuel: 5625,
    engines: "2 × Pratt & Whitney Canada PW127M", engineCount: 2, thrust: "1.611 kW",
    firstFlight: 2010, introduced: 2012, built: 110,
    tagline: "Piccolo, agile, instancabile.",
    description: "Il turboelica ideale per piste corte e isole remote. Consumi minimi e cabina moderna per i collegamenti regionali."
  },
  "AT76": {
    code: "AT76", name: "ATR 72-600", short: "ATR 72", maker: "ATR", family: "ATR", category: "Turboprop",
    maxSpeed: 510, cruiseSpeed: 480, mach: null, range: 1370, pax: 70, paxMax: 78,
    length: 27.17, wingspan: 27.05, height: 7.65, mtow: 23, ceiling: 7620, fuel: 6370,
    engines: "2 × Pratt & Whitney Canada PW127M", engineCount: 2, thrust: "2.051 kW",
    firstFlight: 2009, introduced: 2011, built: 1000,
    tagline: "Il re delle rotte regionali.",
    description: "Il turboelica regionale più venduto al mondo. Consuma fino al 40% in meno di un jet regionale di pari capacità."
  },
  "DH8D": {
    code: "DH8D", name: "De Havilland Canada Dash 8-400", short: "Dash 8-400", maker: "De Havilland Canada", family: "Dash 8", category: "Turboprop",
    maxSpeed: 667, cruiseSpeed: 580, mach: null, range: 2040, pax: 78, paxMax: 90,
    length: 32.83, wingspan: 28.42, height: 8.34, mtow: 29.3, ceiling: 8230, fuel: 6526,
    engines: "2 × Pratt & Whitney Canada PW150A", engineCount: 2, thrust: "3.781 kW",
    firstFlight: 1998, introduced: 2000, built: 620,
    tagline: "Turboelica, velocità da jet.",
    description: "Il turboelica di linea più veloce in servizio, già noto come Bombardier Q400. Riduzione attiva di rumore e vibrazioni per un comfort da jet."
  }
};
