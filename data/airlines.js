/* Catalogo compagnie aeree — dati approssimati al 2026 (flotta = aerei a marchio/gruppo operativo principale). */
window.AIRLINES = {
  "AA": {
    code: "AA", name: "American Airlines", country: "Stati Uniti", flag: "🇺🇸",
    alliance: "oneworld", hubs: ["DFW", "CLT", "ORD", "MIA", "PHL", "PHX", "DCA", "JFK", "LAX"],
    color: "#0078D2", color2: "#C30019",
    founded: 1926, fleetSize: 980, destinations: 350,
    tagline: "Going for great.",
    description: "La più grande compagnia aerea del mondo per flotta, con un hub principale a Dallas/Fort Worth."
  },
  "AF": {
    code: "AF", name: "Air France", country: "Francia", flag: "🇫🇷",
    alliance: "SkyTeam", hubs: ["CDG", "ORY"],
    color: "#002157", color2: "#ED1C24",
    founded: 1933, fleetSize: 220, destinations: 190,
    tagline: "France is in the air.",
    description: "La compagnia di bandiera francese, simbolo di eleganza e cofondatrice dell'alleanza SkyTeam."
  },
  "AZ": {
    code: "AZ", name: "ITA Airways", country: "Italia", flag: "🇮🇹",
    alliance: "Star Alliance", hubs: ["FCO", "LIN"],
    color: "#1A4B9C", color2: "#8FC3EA",
    founded: 2020, fleetSize: 100, destinations: 90,
    tagline: "L'Italia, in volo.",
    description: "La compagnia di bandiera italiana erede di Alitalia, oggi parte del gruppo Lufthansa, con hub principale a Roma Fiumicino."
  },
  "BA": {
    code: "BA", name: "British Airways", country: "Regno Unito", flag: "🇬🇧",
    alliance: "oneworld", hubs: ["LHR", "LGW"],
    color: "#075AAA", color2: "#EB2226",
    founded: 1974, fleetSize: 290, destinations: 200,
    tagline: "To Fly. To Serve.",
    description: "La compagnia di bandiera britannica, cofondatrice di oneworld e regina di Londra Heathrow."
  },
  "DL": {
    code: "DL", name: "Delta Air Lines", country: "Stati Uniti", flag: "🇺🇸",
    alliance: "SkyTeam", hubs: ["ATL", "DTW", "MSP", "SLC", "JFK", "LAX", "SEA", "BOS", "LGA"],
    color: "#E01933", color2: "#003A70",
    founded: 1925, fleetSize: 980, destinations: 290,
    tagline: "Keep Climbing.",
    description: "Tra le compagnie più grandi e puntuali al mondo, con ad Atlanta l'aeroporto più trafficato del pianeta."
  },
  "EI": {
    code: "EI", name: "Aer Lingus", country: "Irlanda", flag: "🇮🇪",
    alliance: null, hubs: ["DUB", "ORK", "SNN"],
    color: "#00857C", color2: "#6CC24A",
    founded: 1936, fleetSize: 70, destinations: 100,
    tagline: "Il trifoglio nei cieli.",
    description: "La compagnia di bandiera irlandese, parte del gruppo IAG, ponte naturale tra Europa e Nord America."
  },
  "EK": {
    code: "EK", name: "Emirates", country: "Emirati Arabi Uniti", flag: "🇦🇪",
    alliance: null, hubs: ["DXB"],
    color: "#D71921", color2: "#C8A45C",
    founded: 1985, fleetSize: 260, destinations: 150,
    tagline: "Fly Better.",
    description: "Il più grande operatore al mondo di Airbus A380 e Boeing 777, con base a Dubai."
  },
  "FR": {
    code: "FR", name: "Ryanair", country: "Irlanda", flag: "🇮🇪",
    alliance: null, hubs: ["DUB", "STN", "BGY", "CIA"],
    color: "#073590", color2: "#F1C933",
    founded: 1984, fleetSize: 620, destinations: 235,
    tagline: "Low fares. Made simple.",
    description: "La più grande compagnia low-cost d'Europa per passeggeri trasportati, con una flotta interamente Boeing 737."
  },
  "HV": {
    code: "HV", name: "Transavia", country: "Paesi Bassi", flag: "🇳🇱",
    alliance: null, hubs: ["AMS", "ORY", "RTM", "EIN"],
    color: "#00D66C", color2: "#1A3F8E",
    founded: 1965, fleetSize: 140, destinations: 170,
    tagline: "Voli semplici, prezzi leggeri.",
    description: "Il marchio low-cost del gruppo Air France-KLM, attivo da Amsterdam e da Parigi Orly."
  },
  "IB": {
    code: "IB", name: "Iberia", country: "Spagna", flag: "🇪🇸",
    alliance: "oneworld", hubs: ["MAD"],
    color: "#D7192D", color2: "#FFCC00",
    founded: 1927, fleetSize: 90, destinations: 130,
    tagline: "Il ponte verso le Americhe.",
    description: "La compagnia di bandiera spagnola, leader dei collegamenti tra Europa e America Latina dal suo hub di Madrid."
  },
  "JL": {
    code: "JL", name: "Japan Airlines", country: "Giappone", flag: "🇯🇵",
    alliance: "oneworld", hubs: ["HND", "NRT", "ITM", "KIX"],
    color: "#CC0000", color2: "#B1B3B3",
    founded: 1951, fleetSize: 230, destinations: 100,
    tagline: "Fly into tomorrow.",
    description: "La compagnia di bandiera giapponese, riconoscibile per la gru Tsurumaru e rinomata per puntualità e ospitalità."
  },
  "KL": {
    code: "KL", name: "KLM Royal Dutch Airlines", country: "Paesi Bassi", flag: "🇳🇱",
    alliance: "SkyTeam", hubs: ["AMS"],
    color: "#00A1DE", color2: "#0E3A63",
    founded: 1919, fleetSize: 170, destinations: 160,
    tagline: "Journeys of Inspiration.",
    description: "La compagnia aerea più antica del mondo ancora attiva con il nome originale, con hub ad Amsterdam Schiphol."
  },
  "LH": {
    code: "LH", name: "Lufthansa", country: "Germania", flag: "🇩🇪",
    alliance: "Star Alliance", hubs: ["FRA", "MUC"],
    color: "#F9B000", color2: "#05164D",
    founded: 1953, fleetSize: 280, destinations: 220,
    tagline: "Say yes to the world.",
    description: "La compagnia di bandiera tedesca, cofondatrice di Star Alliance e cuore del più grande gruppo aereo europeo."
  },
  "LX": {
    code: "LX", name: "Swiss International Air Lines", country: "Svizzera", flag: "🇨🇭",
    alliance: "Star Alliance", hubs: ["ZRH", "GVA"],
    color: "#E4002B", color2: "#B3B3B3",
    founded: 2002, fleetSize: 95, destinations: 110,
    tagline: "Made of Switzerland.",
    description: "La compagnia di bandiera svizzera, parte del gruppo Lufthansa, sinonimo di precisione e qualità elvetica."
  },
  "NH": {
    code: "NH", name: "All Nippon Airways", country: "Giappone", flag: "🇯🇵",
    alliance: "Star Alliance", hubs: ["HND", "NRT", "KIX", "ITM"],
    color: "#13448F", color2: "#00A0DE",
    founded: 1952, fleetSize: 240, destinations: 100,
    tagline: "Inspiration of Japan.",
    description: "La più grande compagnia aerea giapponese, primo cliente di lancio del Boeing 787 Dreamliner."
  },
  "OS": {
    code: "OS", name: "Austrian Airlines", country: "Austria", flag: "🇦🇹",
    alliance: "Star Alliance", hubs: ["VIE"],
    color: "#D81E05", color2: "#BFBFBF",
    founded: 1957, fleetSize: 65, destinations: 120,
    tagline: "Ospitalità austriaca in volo.",
    description: "La compagnia di bandiera austriaca, parte del gruppo Lufthansa, porta tra Europa occidentale e orientale da Vienna."
  },
  "QR": {
    code: "QR", name: "Qatar Airways", country: "Qatar", flag: "🇶🇦",
    alliance: "oneworld", hubs: ["DOH"],
    color: "#8A1538", color2: "#B1B3B6",
    founded: 1993, fleetSize: 260, destinations: 170,
    tagline: "Going Places Together.",
    description: "Pluripremiata compagnia di bandiera del Qatar, con hub all'aeroporto internazionale Hamad di Doha."
  },
  "SQ": {
    code: "SQ", name: "Singapore Airlines", country: "Singapore", flag: "🇸🇬",
    alliance: "Star Alliance", hubs: ["SIN"],
    color: "#F4A51C", color2: "#1B3A73",
    founded: 1972, fleetSize: 160, destinations: 80,
    tagline: "A Great Way to Fly.",
    description: "Punto di riferimento mondiale per il servizio di bordo, opera i voli senza scalo più lunghi del mondo da Singapore Changi."
  },
  "TK": {
    code: "TK", name: "Turkish Airlines", country: "Turchia", flag: "🇹🇷",
    alliance: "Star Alliance", hubs: ["IST", "SAW"],
    color: "#E81932", color2: "#B3B3B3",
    founded: 1933, fleetSize: 480, destinations: 350,
    tagline: "Widen Your World.",
    description: "La compagnia che vola verso più paesi di qualsiasi altra al mondo, con hub al nuovo aeroporto di Istanbul."
  },
  "TP": {
    code: "TP", name: "TAP Air Portugal", country: "Portogallo", flag: "🇵🇹",
    alliance: "Star Alliance", hubs: ["LIS", "OPO"],
    color: "#00A94F", color2: "#E4002B",
    founded: 1945, fleetSize: 100, destinations: 90,
    tagline: "Il Portogallo nel mondo.",
    description: "La compagnia di bandiera portoghese, leader dei collegamenti tra Europa, Brasile e Africa da Lisbona."
  },
  "U2": {
    code: "U2", name: "easyJet", country: "Regno Unito", flag: "🇬🇧",
    alliance: null, hubs: ["LGW", "LTN", "BRS", "MXP", "GVA"],
    color: "#FF6600", color2: "#F2F2F2",
    founded: 1995, fleetSize: 360, destinations: 160,
    tagline: "Making low-cost travel easy.",
    description: "La low-cost arancione che collega le principali città europee, con una flotta interamente Airbus A320."
  },
  "UA": {
    code: "UA", name: "United Airlines", country: "Stati Uniti", flag: "🇺🇸",
    alliance: "Star Alliance", hubs: ["ORD", "DEN", "IAH", "EWR", "SFO", "IAD", "LAX", "GUM"],
    color: "#005DAA", color2: "#6CACE4",
    founded: 1926, fleetSize: 1010, destinations: 370,
    tagline: "Good leads the way.",
    description: "Cofondatrice di Star Alliance e compagnia con la più ampia rete internazionale degli Stati Uniti."
  },
  "VY": {
    code: "VY", name: "Vueling", country: "Spagna", flag: "🇪🇸",
    alliance: null, hubs: ["BCN", "FCO", "ORY"],
    color: "#FFC700", color2: "#4D4D4D",
    founded: 2004, fleetSize: 125, destinations: 120,
    tagline: "Love the way.",
    description: "La low-cost del gruppo IAG con base a Barcellona, specializzata nei collegamenti tra Spagna ed Europa."
  },
  "W6": {
    code: "W6", name: "Wizz Air", country: "Ungheria", flag: "🇭🇺",
    alliance: null, hubs: ["BUD", "OTP", "WAW", "LTN", "FCO"],
    color: "#C6007E", color2: "#2B2A8C",
    founded: 2003, fleetSize: 240, destinations: 200,
    tagline: "Volare, alla portata di tutti.",
    description: "La low-cost magenta leader nell'Europa centro-orientale, con una delle flotte Airbus A321neo più giovani al mondo."
  }
};
