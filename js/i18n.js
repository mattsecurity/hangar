/* Hangar — UI strings and language switching (English default, Italian). */
(function () {
  'use strict';

  const LANGS = {
    en: { label: 'English', locale: 'en-US' },
    it: { label: 'Italiano', locale: 'it-IT' },
  };
  const KEY = 'hangar.lang';

  // a value is a string, or { one, other } for counts; {x} placeholders come from vars
  const S = {
    en: {
      'meta.title': 'Hangar — Every aircraft. Every route.',
      'meta.desc': 'The catalog of the world’s fleets: models, airlines, specs and routes on a 3D globe.',
      'nav.main': 'Main', 'nav.home': 'Hangar, home',
      'nav.catalog': 'Catalog', 'nav.airlines': 'Airlines', 'nav.routes': 'Routes',
      'nav.search': 'Search', 'nav.lang': 'Language',
      'sp.placeholder': 'Search airline, model, city…',
      'sp.all': 'All', 'sp.airlines': 'Airlines', 'sp.aircraft': 'Aircraft',
      'sp.empty': 'No results for “{q}”.',

      'cat.Widebody': 'Widebody', 'cat.Narrowbody': 'Narrowbody', 'cat.Regional': 'Regional', 'cat.Turboprop': 'Turboprop',
      'n.airlines': { one: '{n} airline', other: '{n} airlines' },
      'n.models': { one: '{n} model', other: '{n} models' },
      'n.routes': { one: '{n} route', other: '{n} routes' },

      'fl.aria': 'Takeoff', 'fl.planeAlt': 'Airliner seen from above',
      'fl.e1': 'Runway 36 · Lined up', 'fl.h1': 'Ready for takeoff.',
      'fl.e2': 'V1 · Rotate', 'fl.h2': 'Full thrust.',
      'fl.e3': 'Climb · FL360', 'fl.h3': 'Above the clouds.',
      'fl.e4': 'Cruise', 'fl.h4': 'The world, from above.',
      'fl.spd': 'SPD', 'fl.hint': 'Scroll to take off',
      'fl.ph0': 'On runway', 'fl.ph1': 'Takeoff', 'fl.ph2': 'Climb', 'fl.ph3': 'Cruise',

      'hero.hl1': 'Every aircraft.', 'hero.hl2': 'Every route.',
      'hero.lead': 'The fleets of the world’s biggest airlines. Specs, liveries and routes, on an ultra-high-resolution globe.',
      'hero.search': 'Search airline or model',

      'al.eyebrow': 'Airlines', 'al.title': 'Choose an airline.', 'al.lead': 'Every fleet, every livery. Drag to explore.',
      'sc.eyebrow': 'In flight', 'sc.title': 'Scroll the fleet.',
      'sc.speed': 'km/h max', 'sc.range': 'km range', 'sc.pax': 'passengers',
      'cat.eyebrow': 'Catalog', 'cat.title': 'Every model.',
      'cat.lead': 'From regional turboprops to double-deck giants. Tap a model to explore it.',
      'cat.allMakers': 'All', 'cat.allCats': 'Every category', 'cat.count': 'models',
      'rt.eyebrow': 'Routes', 'rt.title': 'The world, connected.',
      'rt.lead': 'Every line is a real route. Tap one to fly over it in 3D.',
      'st.links': 'connections', 'st.airports': 'airports', 'st.countries': 'countries', 'st.routes': 'routes',
      'foot.catalog': 'Hangar · Fleet catalog', 'foot.disclaimer': 'Indicative data, for information only.',

      'card.distance': 'distance', 'card.duration': 'est. duration',

      'd.back': 'Back to catalog', 'd.prev': 'Previous model: {name}', 'd.next': 'Next model: {name}',
      'd.cue': '{ops} · use ← → or swipe sideways to change model',
      'd.perf': 'Performance', 'd.numbers': 'The numbers.',
      'd.maxSpeed': 'Top speed', 'd.cruise': 'Cruise {v} km/h',
      'd.range': 'Max range', 'd.rangeRef': 'Enough for Rome → {city} nonstop', 'd.shortHaul': 'Built for short haul',
      'd.pax': 'Passengers', 'd.paxMax': 'Up to {n} in max-density layout',
      'd.length': 'Length', 'd.height': 'Height {v} m', 'd.wingspan': 'Wingspan', 'd.ceiling': 'Service ceiling',
      'd.mtow': 'Max takeoff weight', 'd.engines': 'Engines', 'd.fuel': 'Fuel',
      'd.built': 'Units built', 'd.since': 'In service since {y}',
      'd.spec': 'Spec sheet', 's.maker': 'Manufacturer', 's.model': 'Model', 's.icao': 'ICAO code', 's.family': 'Family',
      's.category': 'Category', 's.engines': 'Powerplant', 's.thrust': 'Thrust / power', 's.cruise': 'Cruise speed',
      's.firstFlight': 'First flight', 's.introduced': 'Entry into service', 's.dims': 'Dimensions',
      'd.routes': 'Routes flown', 'd.where': 'Where it flies.',
      'd.explore': 'Explore', 'd.similar': 'Similar models.',

      'a.back': 'Back to airlines', 'a.fleetSize': 'aircraft in fleet', 'a.dest': 'destinations',
      'a.founded': 'founded', 'a.hubs': 'main hubs', 'a.fleet': 'Fleet',
      'a.inLivery': { one: '{n} model in livery.', other: '{n} models in livery.' },
      'a.seats': 'seats', 'a.network': 'Network', 'a.where': 'Where {name} flies.',

      'g.overview': 'Global view', 'g.globe': 'Globe', 'g.replay': 'Replay flight',
      'g.follow': 'Follow flight', 'g.followShort': 'Follow', 'g.hint': 'Click to interact · drag to rotate',
    },
    it: {
      'meta.title': 'Hangar — Ogni aereo. Ogni rotta.',
      'meta.desc': 'Il catalogo delle flotte mondiali: modelli, compagnie, specifiche e rotte su un globo 3D.',
      'nav.main': 'Principale', 'nav.home': 'Hangar, home',
      'nav.catalog': 'Catalogo', 'nav.airlines': 'Compagnie', 'nav.routes': 'Rotte',
      'nav.search': 'Cerca', 'nav.lang': 'Lingua',
      'sp.placeholder': 'Cerca compagnia, modello, città…',
      'sp.all': 'Tutto', 'sp.airlines': 'Compagnie', 'sp.aircraft': 'Aerei',
      'sp.empty': 'Nessun risultato per “{q}”.',

      'cat.Widebody': 'Fusoliera larga', 'cat.Narrowbody': 'Corridoio singolo', 'cat.Regional': 'Regionale', 'cat.Turboprop': 'Turboelica',
      'n.airlines': { one: '{n} compagnia', other: '{n} compagnie' },
      'n.models': { one: '{n} modello', other: '{n} modelli' },
      'n.routes': { one: '{n} rotta', other: '{n} rotte' },

      'fl.aria': 'Decollo', 'fl.planeAlt': 'Aereo di linea visto dall’alto',
      'fl.e1': 'Pista 36 · Allineati', 'fl.h1': 'Pronti al decollo.',
      'fl.e2': 'V1 · Rotazione', 'fl.h2': 'Spinta massima.',
      'fl.e3': 'Salita · FL360', 'fl.h3': 'Sopra le nuvole.',
      'fl.e4': 'Crociera', 'fl.h4': 'Il mondo, dall’alto.',
      'fl.spd': 'VEL', 'fl.hint': 'Scorri per decollare',
      'fl.ph0': 'In pista', 'fl.ph1': 'Decollo', 'fl.ph2': 'Salita', 'fl.ph3': 'Crociera',

      'hero.hl1': 'Ogni aereo.', 'hero.hl2': 'Ogni rotta.',
      'hero.lead': 'Le flotte delle più grandi compagnie del mondo. Specifiche, livree e rotte, su un globo in altissima risoluzione.',
      'hero.search': 'Cerca compagnia o modello',

      'al.eyebrow': 'Compagnie', 'al.title': 'Scegli una compagnia.', 'al.lead': 'Ogni flotta, ogni livrea. Trascina per esplorare.',
      'sc.eyebrow': 'In volo', 'sc.title': 'Scorri la flotta.',
      'sc.speed': 'km/h max', 'sc.range': 'km autonomia', 'sc.pax': 'passeggeri',
      'cat.eyebrow': 'Catalogo', 'cat.title': 'Tutti i modelli.',
      'cat.lead': 'Dal turboelica regionale al gigante a due ponti. Tocca un modello per scoprirlo.',
      'cat.allMakers': 'Tutti', 'cat.allCats': 'Ogni categoria', 'cat.count': 'modelli',
      'rt.eyebrow': 'Rotte', 'rt.title': 'Il mondo, collegato.',
      'rt.lead': 'Ogni linea è una rotta reale. Tocca una rotta per volarci sopra in 3D.',
      'st.links': 'collegamenti', 'st.airports': 'aeroporti', 'st.countries': 'paesi', 'st.routes': 'rotte',
      'foot.catalog': 'Hangar · Catalogo flotte', 'foot.disclaimer': 'Dati indicativi a scopo informativo.',

      'card.distance': 'distanza', 'card.duration': 'durata stimata',

      'd.back': 'Torna al catalogo', 'd.prev': 'Modello precedente: {name}', 'd.next': 'Modello successivo: {name}',
      'd.cue': '{ops} · usa ← → o scorri lateralmente per cambiare modello',
      'd.perf': 'Prestazioni', 'd.numbers': 'I numeri.',
      'd.maxSpeed': 'Velocità massima', 'd.cruise': 'Crociera {v} km/h',
      'd.range': 'Autonomia massima', 'd.rangeRef': 'Abbastanza per Roma → {city} senza scalo', 'd.shortHaul': 'Pensato per il corto raggio',
      'd.pax': 'Passeggeri', 'd.paxMax': 'Fino a {n} in configurazione massima',
      'd.length': 'Lunghezza', 'd.height': 'Altezza {v} m', 'd.wingspan': 'Apertura alare', 'd.ceiling': 'Quota di tangenza',
      'd.mtow': 'Peso massimo al decollo', 'd.engines': 'Motori', 'd.fuel': 'Carburante',
      'd.built': 'Esemplari costruiti', 'd.since': 'In servizio dal {y}',
      'd.spec': 'Scheda tecnica', 's.maker': 'Costruttore', 's.model': 'Modello', 's.icao': 'Codice ICAO', 's.family': 'Famiglia',
      's.category': 'Categoria', 's.engines': 'Motorizzazione', 's.thrust': 'Spinta / potenza', 's.cruise': 'Velocità di crociera',
      's.firstFlight': 'Primo volo', 's.introduced': 'Entrata in servizio', 's.dims': 'Dimensioni',
      'd.routes': 'Rotte operate', 'd.where': 'Dove vola.',
      'd.explore': 'Esplora', 'd.similar': 'Modelli simili.',

      'a.back': 'Torna alle compagnie', 'a.fleetSize': 'aerei in flotta', 'a.dest': 'destinazioni',
      'a.founded': 'fondazione', 'a.hubs': 'hub principali', 'a.fleet': 'Flotta',
      'a.inLivery': { one: '{n} modello in livrea.', other: '{n} modelli in livrea.' },
      'a.seats': 'posti', 'a.network': 'Network', 'a.where': 'Dove vola {name}.',

      'g.overview': 'Vista globale', 'g.globe': 'Globo', 'g.replay': 'Rivedi il volo',
      'g.follow': 'Segui il volo', 'g.followShort': 'Segui volo', 'g.hint': 'Clicca per interagire · trascina per ruotare',
    },
  };

  let lang = 'en';
  try { const s = localStorage.getItem(KEY); if (LANGS[s]) lang = s; } catch (e) {}

  const listeners = [];
  const locale = () => LANGS[lang].locale;

  function t(key, vars) {
    let v = S[lang][key];
    if (v == null) v = S.en[key];
    if (v == null) return key;
    vars = vars || {};
    if (typeof v === 'object') v = vars.n === 1 ? v.one : v.other;
    return v.replace(/\{(\w+)\}/g, (m, k) => {
      const x = vars[k];
      if (x == null) return m;
      return typeof x === 'number' ? x.toLocaleString(locale()) : x;
    });
  }

  // decimal in the current locale, keeping the source precision (0.78, 12.56 …)
  function num(v, maxDec) {
    if (v == null || isNaN(v)) return '—';
    return Number(v).toLocaleString(locale(), { maximumFractionDigits: maxDec == null ? 2 : maxDec });
  }

  // static markup: data-i18n="key" sets text, data-i18n-attr="attr:key;attr:key" sets attributes
  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(p => { const [a, k] = p.split(':'); if (a && k) el.setAttribute(a.trim(), t(k.trim())); });
    });
    if (root === document) {
      document.documentElement.lang = lang;
      document.title = t('meta.title');
      const d = document.querySelector('meta[name="description"]'); if (d) d.content = t('meta.desc');
    }
  }

  function set(l) {
    if (!LANGS[l] || l === lang) return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    apply();
    listeners.forEach(f => f(l));
  }

  window.I18N = {
    LANGS, t, num, apply, set,
    get lang() { return lang; },
    get locale() { return locale(); },
    onChange: f => listeners.push(f),
  };
})();
