/* Hangar — app shell: data index, router, views, motion. */
(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger, Flip);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // =====================================================================
  // DATA INDEX
  // =====================================================================
  const AC = window.AIRCRAFT || {}, AL = window.AIRLINES || {}, AP = window.AIRPORTS || {}, RT = window.ROUTES || {};
  const OPS = {}, FLEET = {};
  Object.keys(RT).forEach(k => {
    const [al, t] = k.split('-');
    if (!AC[t] || !AL[al]) return;
    (OPS[t] = OPS[t] || []).push(al);
    (FLEET[al] = FLEET[al] || []).push(t);
  });
  const PREF = ['EK', 'QR', 'SQ', 'LH', 'BA', 'AF', 'KL', 'NH', 'JL', 'LX', 'TK', 'AZ', 'IB', 'TP', 'OS', 'EI', 'UA', 'DL', 'AA', 'VY', 'U2', 'W6', 'FR', 'HV'];
  const prefIdx = a => { const i = PREF.indexOf(a); return i < 0 ? 99 : i; };
  Object.values(OPS).forEach(l => l.sort((a, b) => prefIdx(a) - prefIdx(b)));
  const MAKERS = ['Airbus', 'Boeing', 'Embraer', 'Bombardier', 'ATR', 'De Havilland Canada'];
  const makerIdx = m => { const i = MAKERS.indexOf(m); return i < 0 ? 50 : i; };
  const CATS = ['Widebody', 'Narrowbody', 'Regional', 'Turboprop'];
  const CAT_IT = { Widebody: 'Fusoliera larga', Narrowbody: 'Corridoio singolo', Regional: 'Regionale', Turboprop: 'Turboelica' };
  const TYPES = Object.keys(OPS).sort((a, b) => makerIdx(AC[a].maker) - makerIdx(AC[b].maker) || (AC[b].pax || 0) - (AC[a].pax || 0) || AC[a].name.localeCompare(AC[b].name));
  Object.values(FLEET).forEach(l => l.sort((a, b) => (AC[b].pax || 0) - (AC[a].pax || 0)));
  const AIRLINE_CODES = Object.keys(FLEET).sort((a, b) => prefIdx(a) - prefIdx(b));
  const MAX = {
    speed: Math.max(...TYPES.map(t => AC[t].maxSpeed || 0)),
    range: Math.max(...TYPES.map(t => AC[t].range || 0)),
    pax: Math.max(...TYPES.map(t => AC[t].pax || 0)),
  };
  const ALL_ROUTE_COUNT = Object.values(RT).reduce((s, l) => s + l.length, 0);

  const img = (al, t) => `fleet/${al}-${t}.webp`;
  const pic = (al, t) => `src="${img(al, t)}"`;
  function setPic(el, al, t) { el.src = img(al, t); }
  // airline logo as a white monochrome mark (img/logos); falls back to the IATA code
  const logoSrc = c => `img/logos/${c}.webp`;
  const logo = (c, cls) => `<span class="logo ${cls || ''}"><img src="${logoSrc(c)}" alt="${esc((AL[c] || {}).name || c)}" decoding="async"><b>${esc(c)}</b></span>`;
  // missing livery → generic silhouette (missing logo → code)
  document.addEventListener('error', e => {
    const el = e.target;
    if (el.tagName !== 'IMG') return;
    if (el.parentNode && el.parentNode.classList && el.parentNode.classList.contains('logo')) { el.parentNode.classList.add('nologo'); return; }
    if (!el.src.endsWith('generic.webp')) el.src = 'fleet/generic.webp';
  }, true);
  const heroAirline = t => OPS[t] ? OPS[t][0] : null;
  const fmt = n => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('it-IT');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const ap = code => { const a = AP[code]; return a ? { code, lat: a[0], lng: a[1], name: a[2], city: a[3], cc: a[4], p: [a[1], a[0]] } : null; };
  function hexRgb(h) { h = String(h || '#2997ff').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function lum(rgb) { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(rgb[0]) + .7152 * f(rgb[1]) + .0722 * f(rgb[2]); }
  // brand colour made legible on black
  function vivid(hex) {
    const c = hexRgb(hex), l = lum(c);
    const m = Math.max(0, Math.min(.6, (.22 - l) * 2.6));
    const r = c.map(v => Math.round(v + (255 - v) * m));
    return `rgb(${r[0]},${r[1]},${r[2]})`;
  }
  const alColor = a => vivid((AL[a] || {}).color);
  function durStr(km, cruise) { const h = km / (cruise || 820) + 0.45; const H = Math.floor(h), M = Math.round((h - H) * 60 / 5) * 5; return `${H} h ${M ? M + ' min' : ''}`.trim(); }
  const REFS = [['Parigi', 1105], ['Londra', 1435], ['Mosca', 2375], ['Il Cairo', 2135], ['Dubai', 4330], ['New York', 6890], ['Johannesburg', 7700], ['Pechino', 8130], ['Tokyo', 9860], ['Singapore', 10030], ['Los Angeles', 10200], ['Buenos Aires', 11150], ['Perth', 13400], ['Sydney', 16300]];
  function rangeRef(km) { let best = null; REFS.forEach(r => { if (r[1] <= km) best = r; }); return best; }

  function routesOf(al, t) {
    const list = RT[al + '-' + t] || [];
    return list.map((r, i) => {
      const A = ap(r[0]), B = ap(r[1]);
      if (!A || !B) return null;
      const d = Globe.distKm(A.p, B.p);
      return { id: `${al}-${t}-${i}`, a: A.code, b: B.code, pa: A.p, pb: B.p, cityA: A.city, cityB: B.city, c: alColor(al), dist: d, al, t };
    }).filter(Boolean);
  }

  // =====================================================================
  // SHELL: smooth scroll, nav, cursor
  // =====================================================================
  const app = document.getElementById('app');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !reduced });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const nav = document.querySelector('.nav');
  let lastY = 0;
  lenis.on('scroll', ({ scroll }) => {
    const down = scroll > lastY && scroll > 200;
    nav.classList.toggle('hide', down && !spotOpen);
    lastY = scroll;
  });

  const glow = document.getElementById('cursor-glow');
  const gx = gsap.quickTo(glow, 'x', { duration: .8, ease: 'power3' }), gy = gsap.quickTo(glow, 'y', { duration: .8, ease: 'power3' });
  addEventListener('pointermove', e => { gx(e.clientX); gy(e.clientY); }, { passive: true });

  // split text into words (and optionally chars) for reveals
  function splitWords(el) {
    if (el._split) return el._split;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w"><span>${esc(w)}</span></span>`).join(' ');
    el.classList.add('split');
    el._split = el.querySelectorAll('.w > span');
    return el._split;
  }
  function splitChars(el) {
    const t = el.textContent;
    el.innerHTML = [...t].map(c => c === ' ' ? ' ' : `<span class="ch">${esc(c)}</span>`).join('');
    return el.querySelectorAll('.ch');
  }

  // 3D tilt + spotlight on content cards
  function tilt(el, max) {
    max = max || 7;
    const rx = gsap.quickTo(el, 'rotationX', { duration: .6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: .6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (px * 100) + '%'); el.style.setProperty('--my', (py * 100) + '%');
      ry((px - .5) * max * 2); rx(-(py - .5) * max * 2);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }

  function countUp(el, to, opts) {
    opts = opts || {};
    const dec = opts.dec || 0;
    const o = { v: 0 };
    return gsap.to(o, {
      v: to, duration: opts.duration || 1.8, ease: 'power3.out', delay: opts.delay || 0,
      onUpdate: () => { el.textContent = dec ? o.v.toLocaleString('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : fmt(Math.round(o.v)); }
    });
  }

  // scroll reveals: blur-to-sharp rise
  function reveals(root) {
    root.querySelectorAll('[data-split]').forEach(el => {
      const words = splitWords(el);
      gsap.from(words, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    ScrollTrigger.batch(root.querySelectorAll('.reveal'), {
      start: 'top 90%',
      onEnter: els => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: .08, overwrite: true })
    });
    root.querySelectorAll('.reveal').forEach(el => gsap.set(el, { opacity: 0 }));
    root.querySelectorAll('[data-count]').forEach(el => {
      const to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
      el.textContent = '0';
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => countUp(el, to, { dec }) });
    });
    root.querySelectorAll('.ac-card, .al-card').forEach(el => tilt(el, el.classList.contains('al-card') ? 5 : 6));
    if (window.Glass) Glass.scan(root);
  }

  // =====================================================================
  // ROUTER
  // =====================================================================
  let view = null;           // { name, key, destroy(), ctx }
  let pendingDir = 0;        // ±1 when navigating prev/next between aircraft
  let vtPlaneEl = null;      // element that should morph into the detail plane

  function parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const p = h.split('/').filter(Boolean);
    if (p[0] === 'aircraft' && AC[p[1]] && OPS[p[1]]) return { name: 'aircraft', type: p[1], al: OPS[p[1]].includes(p[2]) ? p[2] : null };
    if (p[0] === 'airline' && FLEET[p[1]]) return { name: 'airline', al: p[1] };
    return { name: 'home', section: p[0] || null };
  }

  function destroyView() {
    if (!view) return;
    try { view.destroy && view.destroy(); } catch (e) { console.warn(e); }
    if (view.ctx) view.ctx.revert();
    view = null;
  }

  function render(r) {
    destroyView();
    app.innerHTML = '';
    lenis.scrollTo(0, { immediate: true });
    const ctx = gsap.context(() => {});
    let v;
    ctx.add(() => {
      if (r.name === 'aircraft') v = AircraftView(r);
      else if (r.name === 'airline') v = AirlineView(r);
      else v = HomeView(r);
    });
    view = Object.assign({ ctx, name: r.name, r }, v);
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', r.name === 'home' && a.dataset.nav === r.section));
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  async function navigate() {
    const r = parse();
    // home → home section: just scroll
    if (view && view.name === 'home' && r.name === 'home') {
      if (r.section) view.scrollToSection(r.section);
      else lenis.scrollTo(0, { duration: 1.4 });
      document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === r.section));
      return;
    }
    // aircraft → aircraft: cinematic horizontal swap
    if (view && view.name === 'aircraft' && r.name === 'aircraft' && view.r.type !== r.type) {
      const dir = pendingDir || 1; pendingDir = 0;
      if (lenis.scroll > 40) await new Promise(res => lenis.scrollTo(0, { duration: .7, onComplete: res }));
      await view.leave(dir);
      render(Object.assign({}, r, { dir }));
      return;
    }
    if (document.startViewTransition && !reduced) {
      const plane = vtPlaneEl; vtPlaneEl = null;
      if (plane) plane.style.viewTransitionName = 'plane';
      const t = document.startViewTransition(() => { if (plane) plane.style.viewTransitionName = ''; render(Object.assign({}, r, { vt: !!plane })); });
      t.finished.finally(() => { const p = document.querySelector('.d-plane'); if (p) p.style.viewTransitionName = ''; });
    } else render(r);
  }

  // morph the clicked card image into the detail hero plane
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#/aircraft/"]');
    if (!a) return;
    const im = a.querySelector('img');
    vtPlaneEl = im || null;
  }, true);

  // =====================================================================
  // HOME
  // =====================================================================
  function acCard(t, al) {
    const a = AC[t]; al = al || heroAirline(t);
    const ops = OPS[t] || [];
    return `<a class="ac-card" href="#/aircraft/${t}${al && al !== heroAirline(t) ? '/' + al : ''}" data-type="${t}" data-maker="${esc(a.maker)}" data-cat="${esc(a.category)}">
      <div class="ac-top"><span class="ac-maker">${esc(a.maker)}</span><span class="ac-cat">${CAT_IT[a.category] || a.category}</span></div>
      <div class="ac-name">${esc(a.short || a.name)}</div>
      <div class="ac-full">${esc(a.name)}</div>
      <div class="ac-img"><img ${pic(al, t, 'card')} alt="${esc(a.name)} ${esc((AL[al] || {}).name)}" loading="lazy" decoding="async"></div>
      <div class="ac-stats"><span><b>${fmt(a.range)}</b> km</span><span><b>${fmt(a.maxSpeed)}</b> km/h</span>
        <span class="ac-ops" title="${ops.length} compagnie">${ops.slice(0, 6).map(o => `<i style="background:${alColor(o)}"></i>`).join('')}</span></div>
    </a>`;
  }

  function HomeView(r) {
    const HERO = [['EK', 'A388'], ['SQ', 'A359'], ['QR', 'A35K'], ['LH', 'B748'], ['BA', 'B78X'], ['AZ', 'A339'], ['JL', 'A35K'], ['KL', 'B789'], ['TK', 'B77W'], ['NH', 'B789'], ['AF', 'A359'], ['LX', 'B77W']]
      .filter(([a, t]) => RT[a + '-' + t] && AC[t]);
    const SHOW = [['EK', 'A388'], ['LH', 'B748'], ['QR', 'A35K'], ['SQ', 'B78X'], ['JL', 'A359'], ['AZ', 'A21N'], ['FR', 'B38M'], ['AF', 'BCS3'], ['KL', 'E295'], ['EI', 'AT76']]
      .filter(([a, t]) => RT[a + '-' + t] && AC[t]);
    const makersPresent = MAKERS.filter(m => TYPES.some(t => AC[t].maker === m));
    const allPairs = {};
    Object.keys(RT).forEach(k => {
      const [al, t] = k.split('-');
      if (!AC[t] || !AL[al]) return;
      RT[k].forEach(([a, b]) => {
        if (!AP[a] || !AP[b]) return;
        const key = a < b ? a + '-' + b : b + '-' + a;
        (allPairs[key] = allPairs[key] || { a, b, ops: [] }).ops.push([al, t]);
      });
    });
    const pairKeys = Object.keys(allPairs);
    const countries = new Set(); Object.keys(AP).forEach(c => countries.add(AP[c][4]));

    app.innerHTML = `
    <div class="home">
      <section class="flight" id="sec-volo" aria-label="Decollo">
        <div class="fl-earth"><canvas class="fl-city"></canvas><div class="fl-ground">
          <div class="fl-runway">
            <i class="fl-roll fl-center"></i>
            <div class="fl-threshold"><span class="fl-num">36</span><i class="fl-keys"></i></div>
            <i class="fl-roll fl-edges"></i>
          </div>
        </div></div>
        <div class="fl-clouds back"></div>
        <div class="fl-body">
          <img class="fl-shadow" src="img/plane-top.webp" alt="">
          <div class="fl-craft">
            <i class="fl-trail l"></i><i class="fl-trail r"></i>
            <img class="fl-plane" src="img/plane-top.webp" alt="Aereo di linea visto dall'alto">
            <i class="fl-light port"></i><i class="fl-light stbd"></i><i class="fl-light beacon"></i>
          </div>
        </div>
        <div class="fl-clouds front"></div>
        <div class="fl-haze"></div>
        <div class="fl-copy">
          <div class="fl-line"><p class="eyebrow">Pista 36 · Allineati</p><h2>Pronti al decollo.</h2></div>
          <div class="fl-line"><p class="eyebrow">V1 · Rotazione</p><h2>Spinta massima.</h2></div>
          <div class="fl-line"><p class="eyebrow">Salita · FL360</p><h2>Sopra le nuvole.</h2></div>
          <div class="fl-line"><p class="eyebrow">Crociera</p><h2>Il mondo, dall'alto.</h2></div>
        </div>
        <div class="fl-hud num">
          <div><span>ALT</span><b class="h-alt">0</b><i>ft</i></div>
          <div><span>VEL</span><b class="h-spd">0</b><i>km/h</i></div>
          <div><span>MACH</span><b class="h-mach">0,00</b><i></i></div>
          <div class="h-phase">In pista</div>
        </div>
        <div class="fl-brand" aria-hidden="true">
          <div class="fl-word"><span class="fl-word-blur">Hangar</span><span class="fl-word-sharp">Hangar</span></div>
        </div>
        <div class="fl-hint"><div class="scroll-hint"></div><span>Scorri per decollare</span></div>
      </section>

      <section class="hero">
        <div class="hero-bg"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i><div class="grid-floor"></div></div>
        <div class="hero-copy wrap">
          <p class="eyebrow hero-eyebrow">${AIRLINE_CODES.length} compagnie · ${TYPES.length} modelli · ${fmt(ALL_ROUTE_COUNT)} rotte</p>
          <h1 class="display"><span class="hl1">Ogni aereo.</span><span class="hl2 grad-text">Ogni rotta.</span></h1>
          <p class="lead hero-lead">Le flotte delle più grandi compagnie del mondo. Specifiche, livree e rotte, su un globo in altissima risoluzione.</p>
          <button class="search-pill glass lens" data-open-search>
            <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zm5.3-2.2L21 21"/></svg>
            <span>Cerca compagnia o modello</span><kbd>⌘ K</kbd>
          </button>
        </div>
        <div class="hero-stage"><img class="hero-plane" alt=""><img class="hero-plane" alt=""></div>
        <div class="hero-caption"><i class="dot"></i><span class="cap-t"></span></div>
        <div class="scroll-hint" aria-hidden="true"></div>
      </section>

      <section class="section" id="sec-compagnie">
        <div class="wrap section-head">
          <div><p class="eyebrow">Compagnie</p><h2 class="h2" data-split>Scegli una compagnia.</h2></div>
          <p class="lead reveal">Ogni flotta, ogni livrea. Trascina per esplorare.</p>
        </div>
        <div class="al-scroller" data-lenis-prevent-wheel>
          ${AIRLINE_CODES.map(c => {
            const a = AL[c]; const t = FLEET[c][0];
            return `<a class="al-card" href="#/airline/${c}" style="--c:${esc(a.color)};--c2:${esc(a.color2 || a.color)}">
              <span class="al-alliance">${esc(a.alliance || '')}</span>
              ${logo(c, 'al-logo')}
              <img class="al-plane" ${pic(c, t, 'strip')} alt="" loading="lazy" decoding="async">
              <span class="al-name">${esc(a.name)}</span>
              <span class="al-meta">${esc(a.flag || '')} ${esc(a.country)} · ${FLEET[c].length} modelli</span>
            </a>`;
          }).join('')}
        </div>
      </section>

      <section class="showcase" id="sec-flotta">
        <div class="sc-head"><p class="eyebrow">In volo</p><h2 class="h3">Scorri la flotta.</h2></div>
        ${SHOW.map(([al, t], i) => {
          const a = AC[t];
          return `<div class="sc-slide" data-i="${i}">
            <div class="sc-bgname">${esc(a.short)}</div>
            <a href="#/aircraft/${t}/${al}" class="sc-link"><img class="sc-plane" ${pic(al, t, 'hero')} alt="${esc(a.name)}"></a>
            <div class="sc-info">
              <div class="sc-title"><h3>${esc(a.name)}</h3><p>${esc(AL[al].name)} · ${esc(a.tagline || '')}</p></div>
              <div class="sc-stat"><b>${fmt(a.maxSpeed)}</b><span>km/h max</span></div>
              <div class="sc-stat"><b>${fmt(a.range)}</b><span>km autonomia</span></div>
              <div class="sc-stat"><b>${fmt(a.pax)}</b><span>passeggeri</span></div>
            </div>
          </div>`;
        }).join('')}
        <div class="sc-progress">${SHOW.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
      </section>

      <section class="section" id="sec-catalogo">
        <div class="wrap">
          <div class="section-head" style="margin-bottom:0">
            <div><p class="eyebrow">Catalogo</p><h2 class="h2" data-split>Tutti i modelli.</h2></div>
            <p class="lead reveal">Dal turboelica regionale al gigante a due ponti. Tocca un modello per scoprirlo.</p>
          </div>
          <div class="cat-filter reveal">
            <div class="chips" data-f="maker"><button class="chip on" data-v="*">Tutti</button>${makersPresent.map(m => `<button class="chip" data-v="${esc(m)}">${esc(m)}</button>`).join('')}</div>
            <div class="chips" data-f="cat"><button class="chip on" data-v="*">Ogni categoria</button>${CATS.map(c => `<button class="chip" data-v="${c}">${CAT_IT[c]}</button>`).join('')}</div>
            <span class="cat-count"><b class="num">${TYPES.length}</b> modelli</span>
          </div>
          <div class="cat-grid">${TYPES.map(t => acCard(t)).join('')}</div>
        </div>
      </section>

      <section class="section world-section" id="sec-rotte">
        <div class="wrap section-head">
          <div><p class="eyebrow">Rotte</p><h2 class="h2" data-split>Il mondo, collegato.</h2></div>
          <p class="lead reveal">Ogni linea è una rotta reale. Tocca una rotta per volarci sopra in 3D.</p>
        </div>
        <div class="world-globe reveal"></div>
        <div class="wrap world-stats">
          <div><b data-count="${pairKeys.length}">0</b><span>collegamenti</span></div>
          <div><b data-count="${Object.keys(AP).length}">0</b><span>aeroporti</span></div>
          <div><b data-count="${countries.size}">0</b><span>paesi</span></div>
        </div>
      </section>

      <footer class="footer"><div class="wrap"><span>Hangar · Catalogo flotte</span><span>Dati indicativi a scopo informativo. Imagery © NASA GIBS, Esri, CARTO.</span></div></footer>
    </div>`;

    const root = app.querySelector('.home');
    const cleanups = [];

    // ---------- hero ----------
    const planes = root.querySelectorAll('.hero-plane');
    const cap = root.querySelector('.cap-t'), capDot = root.querySelector('.hero-caption .dot');
    gsap.set(planes, { xPercent: -50, yPercent: -50, opacity: 0 });
    let hi = 0, heroTl = null, heroTimer = null, heroAlive = true, heroSeen = true;
    const heroIo = new IntersectionObserver(es => { heroSeen = es[0].isIntersecting; });
    heroIo.observe(root.querySelector('.hero'));
    function heroNext() {
      if (!heroAlive) return;
      // off screen: don't animate big images behind the user's back, check again later
      if (!heroSeen && hi > 0) { heroTimer = setTimeout(heroNext, 800); return; }
      const [al, t] = HERO[hi % HERO.length];
      const cur = planes[hi % 2], prev = planes[(hi + 1) % 2];
      setPic(cur, al, t);
      const go = () => {
        if (!heroAlive) return;
        const tl = gsap.timeline();
        if (hi > 0) tl.to(prev, { x: '-75vw', scale: 1.08, opacity: 0, duration: 1.1, ease: 'power3.in' }, 0);
        tl.fromTo(cur, { x: '70vw', y: 30, scale: .72, opacity: 0, rotate: -2 },
          { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, duration: 1.9, ease: 'expo.out' }, hi > 0 ? .55 : 0);
        tl.to(cur, { y: -10, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '>-0.2');
        gsap.to(cap, { opacity: 0, y: -6, duration: .3, onComplete: () => {
          cap.textContent = `${AL[al].name} · ${AC[t].name}`;
          capDot.style.background = alColor(al);
          gsap.fromTo(cap, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' });
        } });
        heroTl = tl;
        hi++;
        heroTimer = setTimeout(heroNext, 5200);
      };
      cur.decode ? cur.decode().then(go, go) : go();
    }
    cleanups.push(() => { heroAlive = false; heroIo.disconnect(); clearTimeout(heroTimer); heroTl && heroTl.kill(); });

    function heroIntro() {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.querySelector('.hero'), start: 'top 65%', once: true } });
      tl.from(root.querySelector('.hero-eyebrow'), { y: 20, opacity: 0, duration: 1, ease: 'expo.out' })
        .from(splitWords(root.querySelector('.hl1')), { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: .08 }, '-=.8')
        .from(splitWords(root.querySelector('.hl2')), { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: .08 }, '-=1.1')
        .from(root.querySelector('.hero-lead'), { y: 24, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=1')
        .from(root.querySelector('.search-pill'), { y: 30, scale: .9, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=1')
        .from(root.querySelector('.scroll-hint'), { opacity: 0, duration: 1 }, '-=.4')
        .from(root.querySelectorAll('.orb'), { scale: .4, opacity: 0, duration: 2.4, ease: 'power2.out', stagger: .15 }, 0);
      tl.call(heroNext, null, .5);
    }
    heroIntro();

    // ---------- takeoff: the plane rolls in on load, scroll flies it ----------
    flight(root, cleanups);

    // hero parallax on scroll
    gsap.to(root.querySelector('.hero-copy'), { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true } });
    gsap.to(root.querySelector('.hero-stage'), { scale: 1.35, yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(root.querySelector('.hero-bg'), { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } });
    root.querySelectorAll('.orb').forEach((o, i) => gsap.to(o, { yPercent: (i + 1) * 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));

    // ---------- airlines scroller (drag to scroll + reveal) ----------
    const sc = root.querySelector('.al-scroller');
    let down = null, moved = false;
    sc.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, s: sc.scrollLeft }; moved = false; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 5) { moved = true; sc.classList.add('dragging'); } sc.scrollLeft = down.s - dx; });
    const up = () => { if (!down) return; down = null; setTimeout(() => sc.classList.remove('dragging'), 0); };
    addEventListener('pointerup', up);
    cleanups.push(() => removeEventListener('pointerup', up));
    sc.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    // vertical wheel over the strip scrolls it sideways
    sc.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const max = sc.scrollWidth - sc.clientWidth;
        if ((e.deltaY > 0 && sc.scrollLeft < max - 2) || (e.deltaY < 0 && sc.scrollLeft > 2)) { e.preventDefault(); sc.scrollLeft += e.deltaY; }
      }
    }, { passive: false });
    const visibleCards = [...sc.querySelectorAll('.al-card')].filter(c => c.offsetLeft < innerWidth + 40);
    gsap.from(visibleCards, {
      x: 120, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .07, clearProps: 'transform',
      scrollTrigger: { trigger: sc, start: 'top 90%' }
    });

    // ---------- showcase: pinned scroll with fly-through transitions ----------
    const slides = [...root.querySelectorAll('.sc-slide')];
    const dots = [...root.querySelectorAll('.sc-progress i')];
    slides.forEach((s, i) => {
      if (i === 0) return;
      gsap.set(s.querySelector('.sc-plane'), { x: '110vw', scale: .75, opacity: 0 });
      gsap.set(s.querySelector('.sc-bgname'), { xPercent: -50, yPercent: -58, x: '40vw', opacity: 0 });
      gsap.set(s.querySelectorAll('.sc-info > *'), { y: 40, opacity: 0 });
    });
    gsap.set(slides[0].querySelector('.sc-bgname'), { xPercent: -50, yPercent: -58 });
    const stl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: root.querySelector('.showcase'), pin: true, anticipatePin: 1, start: 'top top', end: () => '+=' + (slides.length * 90) + '%',
        scrub: 1, snap: { snapTo: 'labelsDirectional', duration: { min: .3, max: .9 }, ease: 'power2.inOut', delay: .05 },
        onUpdate: self => { const i = Math.round(self.progress * (slides.length - 1)); dots.forEach((d, k) => d.classList.toggle('on', k === i)); }
      }
    });
    stl.addLabel('s0');
    for (let i = 1; i < slides.length; i++) {
      const a = slides[i - 1], b = slides[i];
      stl.to(a.querySelector('.sc-plane'), { x: '-115vw', scale: 1.15, rotate: -3, opacity: 0, duration: 1 }, `s${i - 1}+=0.25`)
        .to(a.querySelector('.sc-bgname'), { x: '-45vw', opacity: 0, duration: 1 }, '<')
        .to(a.querySelectorAll('.sc-info > *'), { y: -40, opacity: 0, stagger: .04, duration: .5 }, '<')
        .to(b.querySelector('.sc-plane'), { x: 0, scale: 1, rotate: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '<+0.35')
        .to(b.querySelector('.sc-bgname'), { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '<')
        .to(b.querySelectorAll('.sc-info > *'), { y: 0, opacity: 1, stagger: .05, duration: .6, ease: 'power3.out' }, '<+0.3')
        .addLabel('s' + i);
    }
    stl.to({}, { duration: .3 });

    // ---------- catalog filters with FLIP ----------
    const grid = root.querySelector('.cat-grid');
    const f = { maker: '*', cat: '*' };
    const countEl = root.querySelector('.cat-count b');
    root.querySelectorAll('.cat-filter .chips').forEach(group => group.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      group.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
      f[group.dataset.f] = b.dataset.v;
      const cards = [...grid.children];
      const state = Flip.getState(cards);
      let n = 0;
      cards.forEach(c => {
        const show = (f.maker === '*' || c.dataset.maker === f.maker) && (f.cat === '*' || c.dataset.cat === f.cat);
        c.style.display = show ? '' : 'none'; if (show) n++;
      });
      countUp(countEl, n, { duration: .6 });
      Flip.from(state, {
        duration: .75, ease: 'power3.inOut', scale: true, absolute: true, nested: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .85, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .7, delay: .15, ease: 'expo.out' }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: .85, duration: .4 }),
        onComplete: () => ScrollTrigger.refresh()
      });
    }));
    ScrollTrigger.batch(grid.querySelectorAll('.ac-card'), {
      start: 'top 92%', once: true,
      onEnter: els => gsap.fromTo(els, { y: 80, opacity: 0, rotationX: -18 }, { y: 0, opacity: 1, rotationX: 0, duration: 1.1, ease: 'expo.out', stagger: .07 })
    });
    grid.querySelectorAll('.ac-card').forEach(c => gsap.set(c, { opacity: 0 }));

    // ---------- world globe (lazy) ----------
    let globe = null;
    const gEl = root.querySelector('.world-globe');
    const pal = ['#64d2ff', '#2997ff', '#bf5af2', '#ff375f', '#ff9f0a', '#30d158'];
    const worldRoutes = pairKeys.map((k, i) => {
      const p = allPairs[k], A = ap(p.a), B = ap(p.b);
      return { id: k, a: p.a, b: p.b, pa: A.p, pb: B.p, cityA: A.city, cityB: B.city, c: alColor(p.ops[0][0]) };
    });
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting || globe) return;
      io.disconnect();
      globe = Globe.create(gEl, {
        center: [15, 35], zoom: 1.95, dense: true, onRouteClick: id => {
          const p = allPairs[id], A = ap(p.a), B = ap(p.b); const d = Globe.distKm(A.p, B.p);
          const als = [...new Set(p.ops.map(o => o[0]))];
          globe.focus(id, routeCard(A, B, d, null, p.ops));
        }
      });
      globe.setRoutes(worldRoutes, { fit: false });
    }, { rootMargin: '400px' });
    io.observe(gEl);
    cleanups.push(() => { io.disconnect(); globe && globe.destroy(); });

    reveals(root);

    function scrollToSection(s) {
      const el = root.querySelector('#sec-' + s);
      if (el) lenis.scrollTo(el, { duration: 1.6, offset: s === 'flotta' ? 0 : -40 });
    }
    if (r.section) setTimeout(() => scrollToSection(r.section), 350);

    return { scrollToSection, destroy: () => cleanups.forEach(f => f()) };
  }

  // Top-down takeoff: entrance on load, a scrubbed climb through the clouds, then the brand.
  function flight(root, cleanups) {
    const fl = root.querySelector('.flight');
    const q = s => fl.querySelector(s), qa = s => [...fl.querySelectorAll(s)];
    const body = q('.fl-body'), craft = q('.fl-craft'), shadow = q('.fl-shadow'), ground = q('.fl-ground'),
      runway = q('.fl-runway'), city = q('.fl-city'), haze = q('.fl-haze'), hint = q('.fl-hint'), hud = q('.fl-hud'),
      trails = qa('.fl-trail'), lines = qa('.fl-line');
    const hAlt = q('.h-alt'), hSpd = q('.h-spd'), hMach = q('.h-mach'), hPhase = q('.h-phase');

    // deterministic scatter
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    // Everything below is drawn once into small bitmaps, so the GPU only moves textures
    // around while scrolling (no repaints, no giant layers).

    // night-time towns: clusters of lights that swim up as the ground falls away
    const W = innerWidth, H = innerHeight, CW = Math.round(W * 1.6), CH = Math.round(H * 1.6);
    city.width = CW; city.height = CH;
    const cg = city.getContext('2d');
    for (let t = 0; t < 26; t++) {
      const cx = CW / 2 + (rnd() - .5) * CW, cy = CH / 2 + (rnd() - .5) * CH, r = 30 + rnd() * 110;
      if (Math.abs(cx - CW / 2) < 70 && Math.abs(cy - CH / 2) < 70) continue; // the airfield itself stays dark
      const n = 12 + Math.floor(rnd() * 40);
      for (let k = 0; k < n; k++) {
        const a = rnd() * Math.PI * 2, d = Math.pow(rnd(), 1.6) * r;
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, rad = rnd() < .25 ? 3.2 : 2.2;
        const c = rnd() < .75 ? '255,190,110' : rnd() < .6 ? '255,244,226' : '130,185,255', al = .35 + rnd() * .6;
        const g = cg.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${c},${al})`); g.addColorStop(1, `rgba(${c},0)`);
        cg.fillStyle = g; cg.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
    }

    // clouds: a few soft sprites, scaled up by CSS (tiny textures, cheap to move)
    const sprites = [0, 1, 2].map(() => {
      const c = document.createElement('canvas'); c.width = 320; c.height = 200;
      const g = c.getContext('2d');
      for (let i = 0; i < 7; i++) {
        const x = 70 + rnd() * 180, y = 70 + rnd() * 60, rx = 45 + rnd() * 55;
        const gr = g.createRadialGradient(x, y, 0, x, y, rx);
        const tone = 190 + Math.round(rnd() * 40);
        gr.addColorStop(0, `rgba(${tone},${tone + 10},${Math.min(255, tone + 30)},.5)`);
        gr.addColorStop(1, `rgba(${tone},${tone + 10},${Math.min(255, tone + 30)},0)`);
        g.fillStyle = gr; g.fillRect(0, 0, 320, 200);
      }
      return c.toDataURL();
    });
    const cloud = (layer, n, size, dim) => {
      const box = q('.fl-clouds.' + layer);
      for (let i = 0; i < n; i++) {
        const c = document.createElement('img');
        const w = size[0] + rnd() * (size[1] - size[0]);
        c.className = 'cloud'; c.alt = ''; c.src = sprites[i % 3];
        c.style.cssText = `width:${w.toFixed(1)}vw;left:${(rnd() * 110 - 5 - w / 2).toFixed(1)}%;opacity:${((.5 + rnd() * .5) * dim).toFixed(2)}`;
        c.dataset.speed = (.75 + rnd() * .6).toFixed(2);
        c.dataset.delay = (rnd() * 1.2).toFixed(2);
        box.appendChild(c);
      }
      return [...box.children];
    };
    const back = cloud('back', 7, [30, 55], .55), front = cloud('front', 5, [50, 85], 1);

    // runway markings loop inside a screen-sized runway: one repeat period, in whole px
    const P = Math.round(H * .15 / 2) * 2;
    fl.style.setProperty('--p', P + 'px');
    const rolls = qa('.fl-roll'), threshold = q('.fl-threshold');

    gsap.set(body, { xPercent: -50, yPercent: -50 });
    gsap.set(runway, { xPercent: -50 });
    gsap.set(city, { xPercent: -50, yPercent: -50 });
    gsap.set(shadow, { xPercent: 2.5, yPercent: 3.5 });
    gsap.set(lines.slice(1), { opacity: 0, y: 40 });
    gsap.set([...back, ...front], { y: '0vh' });
    gsap.set(trails, { scaleY: 0 });

    // entrance: the plane taxis in from below and lines up on the centreline
    // (only touches elements the scroll timeline leaves alone)
    const earth = q('.fl-earth');
    const inTl = gsap.timeline({ delay: .2 });
    if (!reduced) {
      inTl.from(earth, { opacity: 0, scale: 1.06, duration: 1.6, ease: 'power2.out' }, 0)
        .from(q('.fl-edges'), { opacity: 0, duration: 1.2, ease: 'none' }, .3)
        .from(body, { y: '80vh', duration: 2.2, ease: 'power3.out' }, .2)
        .from(lines[0].children, { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1 }, 1.3)
        .from(hud.children, { y: 20, opacity: 0, duration: 1, ease: 'expo.out', stagger: .07 }, 1.5)
        .from(hint.children, { opacity: 0, y: 16, duration: 1, ease: 'expo.out', stagger: .1 }, 1.9);
    }
    cleanups.push(() => inTl.kill());

    // HUD readout follows the (smoothed) timeline time, so it matches what's on screen
    const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
    const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
    const PH = ['In pista', 'Decollo', 'Salita', 'Crociera'];
    let lastPh = 0, last = '';
    function readout(t) {
      const spd = t < 3 ? 290 * Math.pow(t / 3, 2) : t < 8.2 ? lerp(290, 880, (t - 3) / 5.2) : lerp(880, 910, (t - 8.2) / 1.5);
      const alt = t < 2.8 ? 0 : 36000 * ease((t - 2.8) / 5.4);
      const sound = 1225 - 163 * alt / 36000; // km/h, falls with altitude
      const key = Math.round(spd / 5) + '|' + Math.round(alt / 50);
      if (key === last) return;
      last = key;
      hSpd.textContent = fmt(Math.round(spd / 5) * 5);
      hAlt.textContent = fmt(Math.round(alt / 50) * 50);
      hMach.textContent = (spd / sound).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const ph = t < .3 ? 0 : t < 3 ? 1 : t < 7 ? 2 : 3;
      if (ph !== lastPh) { lastPh = ph; hPhase.textContent = PH[ph]; gsap.fromTo(hPhase, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .4, ease: 'power3.out' }); }
    }

    const T = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: () => readout(T.time()),
      scrollTrigger: { trigger: fl, pin: true, anticipatePin: 1, start: 'top top', end: '+=460%', scrub: .7 }
    });
    const swap = (a, b, at) => T.to(lines[a], { opacity: 0, y: -40, duration: .6, ease: 'power2.in' }, at)
      .to(lines[b], { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, at + .45);

    // 0 → 3 · take-off roll: the runway streams away beneath, faster and faster
    T.to(hint, { opacity: 0, y: 20, duration: .4 }, 0)
      .to(rolls, { y: H * 3.1, duration: 3.3, ease: 'power2.in', modifiers: { y: v => (parseFloat(v) % P) + 'px' } }, 0)
      .to(threshold, { y: H * 3.1, duration: 3.3, ease: 'power2.in' }, 0)
      .to(craft, { y: '-5vh', duration: 3, ease: 'power1.in' }, 0);
    swap(0, 1, .5);

    // 2.6 → 6 · rotation and climb: shadow slips away, the ground falls back, city lights appear
    T.to(shadow, { xPercent: 22, yPercent: 16, scale: .72, opacity: .2, duration: 2.4, ease: 'power1.in' }, 2.6)
      .to(shadow, { opacity: 0, duration: .8 }, 4.8)
      .to(ground, { scale: .09, duration: 4.6, ease: 'power2.inOut' }, 2.8)
      .fromTo(city, { opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, duration: 4.4, ease: 'power2.out' }, 3.2)
      .to(craft, { scale: 1.15, y: '-2vh', duration: 3.2, ease: 'power2.inOut' }, 3);
    swap(1, 2, 3.4);
    back.forEach(c => T.fromTo(c, { y: '0vh' }, { y: () => -(innerHeight * 2.5 * c.dataset.speed) + 'px', duration: 3.4 }, 4 + +c.dataset.delay));

    // 6 → 8.4 · straight through the cloud deck, contrails form
    T.to(ground, { opacity: .5, duration: 1.6 }, 6.2)
      .to(city, { opacity: .55, duration: 1.6 }, 6.4)
      .to(haze, { opacity: .5, duration: .9, ease: 'sine.in' }, 6.5)
      .to(haze, { opacity: 0, duration: 1.2, ease: 'sine.out' }, 7.4)
      .to(trails, { scaleY: 1, duration: 2.4, ease: 'power1.out' }, 6.9);
    front.forEach(c => T.fromTo(c, { y: '0vh' }, { y: () => -(innerHeight * 2.8 * c.dataset.speed) + 'px', duration: 2.4 }, 6.1 + +c.dataset.delay * .8));
    swap(2, 3, 7);

    // 8.2 → 9.8 · straight up and out of the frame, contrails trailing behind
    T.to(craft, { y: '-140vh', duration: 1.8, ease: 'power2.in' }, 8.2)
      .to(trails, { opacity: 0, duration: .9 }, 9.2)
      .to([ground, city], { opacity: 0, duration: 1 }, 9)
      .to(lines[3], { opacity: 0, y: -30, duration: .6 }, 9.2)
      .to(hud, { opacity: 0, y: 20, duration: .6 }, 9.3);

    // 9.8 → 12 · where the plane vanished, the brand resolves
    // (blur-in faked by cross-fading a pre-blurred copy: opacity/scale only, no per-frame filter)
    const word = q('.fl-word');
    T.fromTo(word, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', immediateRender: false }, 9.8)
      .fromTo(q('.fl-word-sharp'), { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.inOut', immediateRender: false }, 10)
      .fromTo(q('.fl-word-blur'), { opacity: 1 }, { opacity: 0, duration: 1, ease: 'power2.inOut', immediateRender: false }, 10.2)
      .to({}, { duration: 1 });

    readout(0);
  }

  // glass card shown over the globe when a route is focused
  function routeCard(A, B, d, cruise, ops) {
    const byAl = {};
    (ops || []).forEach(([al, t]) => { (byAl[al] = byAl[al] || []).push(t); });
    return `<div class="gc-route">
        <div><div class="gc-code">${A.code}</div><div class="gc-city">${esc(A.city)}</div></div>
        <div class="gc-line"><svg viewBox="0 0 24 24" fill="#fff"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>
        <div style="text-align:right"><div class="gc-code">${B.code}</div><div class="gc-city">${esc(B.city)}</div></div>
      </div>
      <div class="gc-meta"><div><b>${fmt(Math.round(d))} km</b>distanza</div><div><b>${durStr(d, cruise)}</b>durata stimata</div></div>
      ${ops ? `<div class="gc-types">${Object.keys(byAl).slice(0, 8).map(al => byAl[al].slice(0, 3).map(t => `<a href="#/aircraft/${t}/${al}" style="box-shadow:inset 3px 0 0 ${alColor(al)}">${al} · ${esc(AC[t].short)}</a>`).join('')).join('')}</div>` : ''}`;
  }

  // =====================================================================
  // AIRCRAFT DETAIL
  // =====================================================================
  function AircraftView(r) {
    const t = r.type, a = AC[t], ops = OPS[t];
    let al = r.al || ops[0];
    const idx = TYPES.indexOf(t);
    const prevT = TYPES[(idx - 1 + TYPES.length) % TYPES.length], nextT = TYPES[(idx + 1) % TYPES.length];
    const ref = rangeRef(a.range);
    const similar = TYPES.filter(x => x !== t && AC[x].category === a.category).sort((x, y) => Math.abs(AC[x].pax - a.pax) - Math.abs(AC[y].pax - a.pax)).slice(0, 8);
    const alObj = () => AL[al];

    app.innerHTML = `
    <div class="detail">
      <a class="d-back glass lens" href="#/catalogo" aria-label="Torna al catalogo">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>Catalogo
      </a>
      <section class="d-hero" style="--c:${esc(alObj().color)};--c2:${esc(alObj().color2 || alObj().color)}">
        <div class="d-glow"></div>
        <div class="d-head wrap">
          <p class="eyebrow d-eyebrow">${esc(a.maker)} · ${CAT_IT[a.category] || a.category}</p>
          <h1 class="d-title">${esc(a.short)}</h1>
          <div class="d-full">${esc(a.name)}</div>
          <div class="d-tagline">${esc(a.tagline || '')}</div>
        </div>
        <div class="d-stage">
          <div class="d-bgname">${esc(a.short)}</div>
          <div class="d-plane-wrap"><img class="d-plane" ${pic(al, t, 'hero')} alt="${esc(a.name)} ${esc(alObj().name)}"><div class="d-shadow"></div></div>
          <button class="d-nav prev glass lens" aria-label="Modello precedente: ${esc(AC[prevT].name)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg><span class="d-nav-label">${esc(AC[prevT].short)}</span></button>
          <button class="d-nav next glass lens" aria-label="Modello successivo: ${esc(AC[nextT].name)}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg><span class="d-nav-label">${esc(AC[nextT].short)}</span></button>
        </div>
        <div class="d-ops-wrap">
          <div class="d-ops glass lens" role="tablist" aria-label="Compagnie">
            <span class="op-thumb"></span>
            ${ops.map(o => `<button role="tab" data-al="${o}" class="${o === al ? 'on' : ''}"><i style="background:${alColor(o)}"></i>${esc(AL[o].name)}</button>`).join('')}
          </div>
        </div>
        <div class="d-scrollcue">${ops.length} compagnie · usa ← → o scorri lateralmente per cambiare modello</div>
      </section>

      <section class="d-stats-sec">
        <div class="wrap">
          <div class="section-head"><div><p class="eyebrow">Prestazioni</p><h2 class="h2" data-split>I numeri.</h2></div></div>
          <div class="stat-grid">
            <div class="stat big accent-speed speed reveal">
              <span class="s-label">Velocità massima</span>
              <div class="s-val"><span data-count="${a.maxSpeed}">0</span><small>km/h</small></div>
              <div class="s-sub">Crociera ${fmt(a.cruiseSpeed)} km/h${a.mach ? ' · Mach ' + String(a.mach).replace('.', ',') : ''}</div>
              <div class="s-bar"><i data-w="${(a.maxSpeed / MAX.speed * 100).toFixed(1)}"></i></div>
            </div>
            <div class="stat big accent-range reveal">
              <span class="s-label">Autonomia massima</span>
              <div class="s-val"><span data-count="${a.range}">0</span><small>km</small></div>
              <div class="s-sub">${ref ? `Abbastanza per Roma → ${ref[0]} senza scalo` : 'Pensato per il corto raggio'}</div>
              <div class="s-bar"><i data-w="${(a.range / MAX.range * 100).toFixed(1)}"></i></div>
            </div>
            <div class="stat reveal"><span class="s-label">Passeggeri</span><div class="s-val"><span data-count="${a.pax}">0</span></div><div class="s-sub">Fino a ${fmt(a.paxMax)} in configurazione massima</div></div>
            <div class="stat reveal"><span class="s-label">Lunghezza</span><div class="s-val"><span data-count="${a.length}" data-dec="1">0</span><small>m</small></div><div class="s-sub">Altezza ${String(a.height).replace('.', ',')} m</div></div>
            <div class="stat reveal"><span class="s-label">Apertura alare</span><div class="s-val"><span data-count="${a.wingspan}" data-dec="1">0</span><small>m</small></div></div>
            <div class="stat reveal"><span class="s-label">Quota di tangenza</span><div class="s-val"><span data-count="${a.ceiling}">0</span><small>m</small></div></div>
            <div class="stat reveal"><span class="s-label">Peso massimo al decollo</span><div class="s-val"><span data-count="${a.mtow}" data-dec="${a.mtow < 100 ? 1 : 0}">0</span><small>t</small></div></div>
            <div class="stat reveal"><span class="s-label">Motori</span><div class="s-val"><span data-count="${a.engineCount}">0</span><small>× ${esc(a.thrust || '')}</small></div></div>
            <div class="stat reveal"><span class="s-label">Carburante</span><div class="s-val"><span data-count="${a.fuel}">0</span><small>L</small></div></div>
            <div class="stat reveal"><span class="s-label">Esemplari costruiti</span><div class="s-val"><span data-count="${a.built}">0</span></div><div class="s-sub">In servizio dal ${a.introduced}</div></div>
          </div>
        </div>
      </section>

      <section class="spec-sec">
        <div class="wrap spec-layout">
          <div class="spec-desc"><p class="eyebrow">Scheda tecnica</p><h2 class="h2" data-split>${esc(a.tagline || a.short)}</h2><p class="lead reveal">${esc(a.description || '')}</p></div>
          <div class="spec-list reveal">
            ${[['Costruttore', a.maker], ['Modello', a.name], ['Codice ICAO', a.code], ['Famiglia', a.family], ['Categoria', CAT_IT[a.category] || a.category], ['Motorizzazione', a.engines], ['Spinta / potenza', a.thrust], ['Velocità di crociera', a.mach ? `Mach ${String(a.mach).replace('.', ',')} · ${fmt(a.cruiseSpeed)} km/h` : `${fmt(a.cruiseSpeed)} km/h`], ['Primo volo', a.firstFlight], ['Entrata in servizio', a.introduced], ['Dimensioni', `${String(a.length).replace('.', ',')} × ${String(a.wingspan).replace('.', ',')} × ${String(a.height).replace('.', ',')} m`]]
              .map(([k, v]) => `<div class="spec-row"><span>${k}</span><b>${esc(v)}</b></div>`).join('')}
          </div>
        </div>
      </section>

      <section class="routes-sec">
        <div class="wrap">
          <div class="routes-head">
            <div><p class="eyebrow">Rotte operate</p><h2 class="h2 rh-title">Dove vola.</h2></div>
            <div class="rh-al lead"><i></i><span class="rh-al-name"></span></div>
          </div>
          <div class="routes-layout">
            <div class="route-list" data-lenis-prevent></div>
            <div class="route-globe"></div>
          </div>
        </div>
      </section>

      <section class="similar-sec">
        <div class="wrap section-head"><div><p class="eyebrow">Esplora</p><h2 class="h2" data-split>Modelli simili.</h2></div></div>
        <div class="sim-scroller">${similar.map(x => acCard(x)).join('')}</div>
      </section>
      <footer class="footer"><div class="wrap"><span>Hangar · ${esc(a.name)}</span><span>Dati indicativi a scopo informativo.</span></div></footer>
    </div>`;

    const root = app.querySelector('.detail');
    const cleanups = [];
    const plane = root.querySelector('.d-plane');
    const hero = root.querySelector('.d-hero');
    const title = root.querySelector('.d-title');
    const chars = splitChars(title);
    const dir = r.dir || 1;

    // ---------- enter ----------
    if (r.vt) {
      plane.style.viewTransitionName = 'plane';
      gsap.from(chars, { yPercent: 100, opacity: 0, duration: 1, ease: 'expo.out', stagger: .04, delay: .2 });
    } else {
      gsap.fromTo(plane, { x: dir * window.innerWidth * .8, scale: .8, opacity: 0, rotate: dir * -2 },
        { x: 0, scale: 1, opacity: 1, rotate: 0, duration: 1.5, ease: 'expo.out', delay: .1 });
      gsap.from(chars, { x: dir * 90, opacity: 0, filter: 'blur(10px)', duration: 1.1, ease: 'expo.out', stagger: .035 });
    }
    gsap.from(root.querySelector('.d-bgname'), { x: dir * window.innerWidth * .3, opacity: 0, duration: 1.6, ease: 'expo.out' });
    gsap.from(root.querySelectorAll('.d-eyebrow, .d-full, .d-tagline'), { y: 20, opacity: 0, filter: 'blur(8px)', duration: 1, ease: 'expo.out', stagger: .08, delay: .25 });
    gsap.from(root.querySelector('.d-ops-wrap'), { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', delay: .45 });
    gsap.from(root.querySelectorAll('.d-nav'), { scale: .4, opacity: 0, duration: .9, ease: 'back.out(2)', delay: .6, stagger: .08 });
    gsap.from(root.querySelector('.d-back'), { x: -30, opacity: 0, duration: .8, ease: 'expo.out', delay: .3 });
    // idle float
    const floatTw = gsap.to(root.querySelector('.d-plane-wrap'), { y: -12, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    // pointer parallax on the plane
    const px = gsap.quickTo(root.querySelector('.d-plane-wrap'), 'x', { duration: 1.2, ease: 'power3' });
    const pr = gsap.quickTo(root.querySelector('.d-plane-wrap'), 'rotationY', { duration: 1.2, ease: 'power3' });
    hero.addEventListener('pointermove', e => { const k = e.clientX / innerWidth - .5; px(k * -30); pr(k * 6); });
    // scroll: plane flies up and away
    gsap.to(root.querySelector('.d-stage'), { yPercent: -18, scale: 1.12, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(root.querySelector('.d-head'), { yPercent: -60, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: true } });
    // stat bars
    root.querySelectorAll('.s-bar i').forEach(b => gsap.to(b, { width: b.dataset.w + '%', duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: b, start: 'top 92%' } }));

    // ---------- operator switch ----------
    const opsEl = root.querySelector('.d-ops'), thumb = opsEl.querySelector('.op-thumb');
    function moveThumb(instant) {
      const b = opsEl.querySelector('button.on'); if (!b) return;
      if (instant) thumb.style.transition = 'none';
      thumb.style.width = b.offsetWidth + 'px';
      thumb.style.transform = `translateX(${b.offsetLeft}px)`;
      if (instant) requestAnimationFrame(() => { thumb.style.transition = ''; });
      const sl = b.offsetLeft - opsEl.clientWidth / 2 + b.offsetWidth / 2;
      opsEl.scrollTo({ left: sl, behavior: instant ? 'auto' : 'smooth' });
    }
    requestAnimationFrame(() => moveThumb(true));
    document.fonts && document.fonts.ready.then(() => moveThumb(true));
    opsEl.addEventListener('click', e => {
      const b = e.target.closest('button[data-al]'); if (!b || b.dataset.al === al) return;
      const oldIdx = ops.indexOf(al), newIdx = ops.indexOf(b.dataset.al);
      al = b.dataset.al;
      opsEl.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      moveThumb();
      history.replaceState(null, '', `#/aircraft/${t}/${al}`);
      const d = newIdx > oldIdx ? 1 : -1;
      const next = new Image(); setPic(next, al, t);
      gsap.killTweensOf(plane);
      gsap.to(plane, {
        x: -d * innerWidth * .7, scale: .92, opacity: 0, duration: .55, ease: 'power3.in', onComplete: () => {
          const show = () => {
            setPic(plane, al, t); plane.alt = `${a.name} ${AL[al].name}`;
            gsap.fromTo(plane, { x: d * innerWidth * .7, scale: .92, opacity: 0 }, { x: 0, scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' });
          };
          next.decode ? next.decode().then(show, show) : show();
        }
      });
      hero.style.setProperty('--c', AL[al].color); hero.style.setProperty('--c2', AL[al].color2 || AL[al].color);
      loadRoutes(true);
    });

    // ---------- routes ----------
    const listEl = root.querySelector('.route-list');
    const rhDot = root.querySelector('.rh-al i'), rhName = root.querySelector('.rh-al-name');
    let globe = null, curRoutes = [];
    const gEl = root.querySelector('.route-globe');
    function loadRoutes(animate) {
      curRoutes = routesOf(al, t);
      rhDot.style.background = alColor(al); rhDot.style.boxShadow = `0 0 16px ${alColor(al)}`;
      rhName.textContent = `${AL[al].name} · ${curRoutes.length} rotte`;
      listEl.innerHTML = curRoutes.map(x => `<button class="route-item" data-id="${x.id}" style="--c:${x.c}">
          <i class="ri-dot"></i>
          <div class="ri-main"><div class="ri-codes">${x.a}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>${x.b}</div>
          <div class="ri-cities">${esc(x.cityA)} → ${esc(x.cityB)}</div></div>
          <div class="ri-dist"><b>${fmt(Math.round(x.dist))} km</b>${durStr(x.dist, a.cruiseSpeed)}</div>
        </button>`).join('');
      if (animate) gsap.from(listEl.children, { x: -30, opacity: 0, duration: .7, ease: 'expo.out', stagger: .04 });
      if (globe) globe.setRoutes(curRoutes);
    }
    function focusRoute(id) {
      const x = curRoutes.find(q => q.id === id); if (!x) return;
      listEl.querySelectorAll('.route-item').forEach(b => b.classList.toggle('on', b.dataset.id === id));
      const A = ap(x.a), B = ap(x.b);
      globe.focus(id, routeCard(A, B, x.dist, a.cruiseSpeed, null) +
        `<div class="gc-types"><a href="#/airline/${al}" style="box-shadow:inset 3px 0 0 ${alColor(al)}">${esc(AL[al].name)}</a><a>${esc(a.name)}</a></div>`);
      const it = listEl.querySelector(`[data-id="${id}"]`);
      if (it) it.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    listEl.addEventListener('click', e => {
      const b = e.target.closest('.route-item'); if (!b || !globe) return;
      focusRoute(b.dataset.id);
      if (innerWidth < 900) lenis.scrollTo(gEl, { offset: -80, duration: 1 });
    });
    loadRoutes(false);
    gsap.set(listEl.children, { opacity: 0 });
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting || globe) return;
      io.disconnect();
      globe = Globe.create(gEl, { onRouteClick: focusRoute, onClear: () => listEl.querySelectorAll('.route-item').forEach(b => b.classList.remove('on')) });
      globe.setRoutes(curRoutes);
      gsap.to(listEl.children, { opacity: 1, x: 0, duration: .8, ease: 'expo.out', stagger: .05, startAt: { x: -30 } });
    }, { rootMargin: '300px' });
    io.observe(gEl);
    cleanups.push(() => { io.disconnect(); globe && globe.destroy(); });

    // ---------- prev / next ----------
    const go = (d) => { pendingDir = d; location.hash = `#/aircraft/${d > 0 ? nextT : prevT}`; };
    root.querySelector('.d-nav.prev').addEventListener('click', () => go(-1));
    root.querySelector('.d-nav.next').addEventListener('click', () => go(1));
    const onKey = e => {
      if (spotOpen || /input|textarea/i.test(document.activeElement.tagName)) return;
      if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
    };
    addEventListener('keydown', onKey);
    cleanups.push(() => removeEventListener('keydown', onKey));
    // horizontal trackpad swipe / touch swipe on the hero
    let acc = 0, lock = false, accT;
    hero.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || lock) return;
      e.preventDefault();
      acc += e.deltaX; clearTimeout(accT); accT = setTimeout(() => { acc = 0; }, 180);
      if (Math.abs(acc) > 90) { lock = true; go(acc > 0 ? 1 : -1); }
    }, { passive: false });
    let tx = null;
    hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 70) go(dx < 0 ? 1 : -1); });

    function leave(d) {
      floatTw.kill();
      return new Promise(res => {
        const tl = gsap.timeline({ onComplete: res });
        tl.to(plane, { x: -d * innerWidth * .9, scale: .9, rotate: d * 2, opacity: 0, duration: .6, ease: 'power3.in' }, 0)
          .to(chars, { x: -d * 80, opacity: 0, filter: 'blur(8px)', duration: .4, ease: 'power2.in', stagger: .02 }, 0)
          .to(root.querySelector('.d-bgname'), { x: -d * innerWidth * .3, opacity: 0, duration: .6, ease: 'power3.in' }, 0)
          .to(root.querySelectorAll('.d-eyebrow, .d-full, .d-tagline, .d-ops-wrap, .d-scrollcue'), { y: -14, opacity: 0, duration: .35, stagger: .03 }, 0);
      });
    }

    reveals(root);
    return { leave, destroy: () => cleanups.forEach(f => f()) };
  }

  // =====================================================================
  // AIRLINE DETAIL
  // =====================================================================
  function AirlineView(r) {
    const code = r.al, a = AL[code], fleet = FLEET[code];
    const flagship = fleet[0];
    const allR = [];
    const pairs = {};
    fleet.forEach(t => routesOf(code, t).forEach(x => {
      const key = x.a < x.b ? x.a + '-' + x.b : x.b + '-' + x.a;
      if (!pairs[key]) { pairs[key] = Object.assign({}, x, { id: key, types: [] }); allR.push(pairs[key]); }
      pairs[key].types.push(t);
    }));
    const aps = new Set(); allR.forEach(x => { aps.add(x.a); aps.add(x.b); });
    const ccs = new Set([...aps].map(c => AP[c][4]));
    const c1 = a.color, c2 = a.color2 || a.color;

    app.innerHTML = `
    <div class="airline">
      <a class="d-back glass lens" href="#/compagnie" aria-label="Torna alle compagnie">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>Compagnie
      </a>
      <section class="a-hero">
        <div class="a-bg">
          <i style="width:60vw;height:60vw;left:-15vw;top:-20vw;background:${esc(c1)};opacity:.45"></i>
          <i style="width:45vw;height:45vw;right:-10vw;bottom:-15vw;background:${esc(c2)};opacity:.3"></i>
        </div>
        <div class="a-code">${code}</div>
        <img class="a-plane" ${pic(code, flagship, 'airline')} alt="${esc(AC[flagship].name)} ${esc(a.name)}">
        <div class="wrap">
          ${logo(code, 'a-logo')}
          <p class="eyebrow a-eye">${esc(a.flag || '')} ${esc(a.country)}${a.alliance ? ' · ' + esc(a.alliance) : ''}</p>
          <h1 class="a-name">${esc(a.name)}</h1>
          <p class="lead a-tag">${esc(a.tagline || '')}</p>
          <div class="a-meta">
            <div><b data-count="${a.fleetSize || 0}">0</b><span>aerei in flotta</span></div>
            <div><b data-count="${a.destinations || 0}">0</b><span>destinazioni</span></div>
            <div><b>${a.founded || '—'}</b><span>fondazione</span></div>
            <div><b>${(a.hubs || []).slice(0, 2).join(' · ')}</b><span>hub principali</span></div>
          </div>
        </div>
      </section>

      <section class="fleet-sec">
        <div class="wrap">
          <div class="section-head"><div><p class="eyebrow">Flotta</p><h2 class="h2" data-split>${fleet.length} modelli in livrea.</h2></div><p class="lead reveal">${esc(a.description || '')}</p></div>
          <div class="fleet-list">
            ${fleet.map(t => { const x = AC[t]; return `<a class="fleet-row" href="#/aircraft/${t}/${code}">
              <div><div class="fr-name">${esc(x.short)}</div><div class="fr-full">${esc(x.name)}</div></div>
              <div class="fr-img"><img ${pic(code, t, 'row')} alt="${esc(x.name)}" loading="lazy"></div>
              <div class="fr-stats"><span><b>${fmt(x.pax)}</b> posti</span><span><b>${fmt(x.range)}</b> km</span><span><b>${(RT[code + '-' + t] || []).length}</b> rotte</span></div>
            </a>`; }).join('')}
          </div>
        </div>
      </section>

      <section class="routes-sec">
        <div class="wrap">
          <div class="section-head"><div><p class="eyebrow">Network</p><h2 class="h2" data-split>Dove vola ${esc(a.name)}.</h2></div>
            <div class="world-stats" style="margin:0;gap:40px"><div><b data-count="${allR.length}">0</b><span>rotte</span></div><div><b data-count="${aps.size}">0</b><span>aeroporti</span></div><div><b data-count="${ccs.size}">0</b><span>paesi</span></div></div>
          </div>
          <div class="net-globe reveal"></div>
        </div>
      </section>
      <footer class="footer"><div class="wrap"><span>Hangar · ${esc(a.name)}</span><span>Dati indicativi a scopo informativo.</span></div></footer>
    </div>`;

    const root = app.querySelector('.airline');
    const cleanups = [];
    const tl = gsap.timeline();
    tl.from(root.querySelectorAll('.a-bg i'), { scale: .3, opacity: 0, duration: 2.2, ease: 'power2.out', stagger: .2 }, 0)
      .from(root.querySelector('.a-code'), { yPercent: 40, opacity: 0, duration: 1.8, ease: 'expo.out' }, 0)
      .from(root.querySelector('.a-logo'), { y: 24, scale: .9, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out' }, .05)
      .from(root.querySelector('.a-eye'), { y: 20, opacity: 0, duration: 1, ease: 'expo.out' }, .15)
      .from(splitWords(root.querySelector('.a-name')), { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: .08 }, .2)
      .from(root.querySelector('.a-tag'), { y: 20, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out' }, .5)
      .from(root.querySelectorAll('.a-meta > div'), { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08 }, .6)
      .fromTo(root.querySelector('.a-plane'), { x: innerWidth * .7, scale: .75, opacity: 0 }, { x: 0, scale: 1, opacity: .95, duration: 2, ease: 'expo.out' }, .2)
      .from(root.querySelector('.d-back'), { x: -30, opacity: 0, duration: .8, ease: 'expo.out' }, .3);
    gsap.to(root.querySelector('.a-plane'), { y: -14, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
    gsap.to(root.querySelector('.a-plane'), { xPercent: -30, yPercent: -40, scale: 1.2, ease: 'none', scrollTrigger: { trigger: '.a-hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(root.querySelector('.a-code'), { xPercent: -15, ease: 'none', scrollTrigger: { trigger: '.a-hero', start: 'top top', end: 'bottom top', scrub: true } });
    // count-ups in hero fire immediately
    root.querySelectorAll('.a-meta [data-count]').forEach(el => { countUp(el, +el.dataset.count, { delay: .8, duration: 2 }); el.removeAttribute('data-count'); });

    root.querySelectorAll('.fleet-row').forEach((row, i) => {
      gsap.from(row.querySelector('.fr-img img'), { x: 260, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 88%' } });
      gsap.from(row.querySelectorAll('.fr-name, .fr-full, .fr-stats'), { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: row, start: 'top 88%' } });
    });

    let globe = null;
    const gEl = root.querySelector('.net-globe');
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting || globe) return;
      io.disconnect();
      globe = Globe.create(gEl, {
        onRouteClick: id => {
          const x = pairs[id]; const A = ap(x.a), B = ap(x.b);
          globe.focus(id, routeCard(A, B, x.dist, AC[x.types[0]].cruiseSpeed, x.types.map(t => [code, t])));
        }
      });
      globe.setRoutes(allR);
    }, { rootMargin: '300px' });
    io.observe(gEl);
    cleanups.push(() => { io.disconnect(); globe && globe.destroy(); });

    reveals(root);
    return { destroy: () => cleanups.forEach(f => f()) };
  }

  // =====================================================================
  // SPOTLIGHT SEARCH
  // =====================================================================
  const spot = document.getElementById('spotlight');
  const spIn = document.getElementById('sp-input');
  const spRes = document.getElementById('sp-results');
  const seg = spot.querySelector('.sp-seg'), segThumb = seg.querySelector('.sp-seg-thumb');
  let spotOpen = false, scope = 'all', sel = 0;
  function moveSeg() {
    const b = seg.querySelector('button.on');
    segThumb.style.width = b.offsetWidth + 'px'; segThumb.style.transform = `translateX(${b.offsetLeft - 4}px)`;
    segThumb.style.left = '4px';
  }
  function openSearch(sc) {
    if (spotOpen) return;
    spotOpen = true; spot.classList.add('open'); spot.setAttribute('aria-hidden', 'false');
    lenis.stop(); nav.classList.remove('hide');
    if (sc) setScope(sc);
    requestAnimationFrame(() => { moveSeg(); spIn.focus(); if (window.Glass) Glass.scan(spot); });
    runSearch();
  }
  function closeSearch() {
    if (!spotOpen) return;
    spotOpen = false; spot.classList.remove('open'); spot.setAttribute('aria-hidden', 'true');
    lenis.start(); spIn.blur();
  }
  function setScope(s) {
    scope = s;
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.scope === s));
    moveSeg(); runSearch();
  }
  seg.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setScope(b.dataset.scope); spIn.focus(); } });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-search]')) { e.preventDefault(); openSearch(); }
    else if (e.target.closest('[data-close-search]')) closeSearch();
    else if (spotOpen && e.target.closest('.sp-item')) closeSearch();
  });
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); spotOpen ? closeSearch() : openSearch(); return; }
    if (!spotOpen && e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); return; }
    if (!spotOpen) return;
    const items = [...spRes.querySelectorAll('.sp-item')];
    if (e.key === 'Escape') closeSearch();
    else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); markSel(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); markSel(items); }
    else if (e.key === 'Enter' && items[sel]) { e.preventDefault(); items[sel].click(); location.hash = items[sel].getAttribute('href'); closeSearch(); }
    else if (e.key === 'Tab') { e.preventDefault(); const o = ['all', 'airline', 'aircraft']; setScope(o[(o.indexOf(scope) + (e.shiftKey ? 2 : 1)) % 3]); }
  });
  function markSel(items) { items.forEach((it, i) => it.classList.toggle('sel', i === sel)); if (items[sel]) items[sel].scrollIntoView({ block: 'nearest' }); }
  function hl(text, q) {
    if (!q) return esc(text);
    const n = norm(text), i = n.indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function runSearch() {
    const q = norm(spIn.value.trim());
    let als = [], acs = [];
    if (scope !== 'aircraft') {
      als = AIRLINE_CODES.filter(c => {
        if (!q) return true;
        const a = AL[c];
        const hubCities = (a.hubs || []).map(h => AP[h] ? AP[h][3] : '').join(' ');
        return norm([c, a.name, a.country, a.alliance, (a.hubs || []).join(' '), hubCities].join(' ')).includes(q);
      });
    }
    if (scope !== 'airline') {
      acs = TYPES.filter(t => {
        if (!q) return true;
        const a = AC[t];
        return norm([t, a.name, a.short, a.maker, a.family, a.category, CAT_IT[a.category]].join(' ')).includes(q);
      });
    }
    if (!q && scope === 'all') { als = als.slice(0, 6); acs = acs.slice(0, 6); }
    sel = 0;
    let html = '';
    if (als.length) html += `<div class="sp-group">Compagnie</div>` + als.map(c => {
      const a = AL[c];
      return `<a class="sp-item" href="#/airline/${c}">${logo(c, 'sp-badge')}
        <div><div class="sp-t">${hl(a.name, q)}</div><div class="sp-s">${esc(a.flag || '')} ${esc(a.country)} · ${FLEET[c].length} modelli${a.alliance ? ' · ' + esc(a.alliance) : ''}</div></div><span class="sp-go">↩</span></a>`;
    }).join('');
    if (acs.length) html += `<div class="sp-group">Aerei</div>` + acs.map(t => {
      const a = AC[t];
      return `<a class="sp-item" href="#/aircraft/${t}"><img class="sp-thumb" src="${img(heroAirline(t), t)}" alt="" loading="lazy">
        <div><div class="sp-t">${hl(a.name, q)}</div><div class="sp-s">${esc(a.maker)} · ${fmt(a.range)} km · ${OPS[t].length} compagnie</div></div><span class="sp-go">↩</span></a>`;
    }).join('');
    if (!html) html = `<div class="sp-empty">Nessun risultato per “${esc(spIn.value)}”.</div>`;
    spRes.innerHTML = html;
    markSel([...spRes.querySelectorAll('.sp-item')]);
    gsap.fromTo(spRes.querySelectorAll('.sp-item'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'expo.out', stagger: .02 });
  }
  spIn.addEventListener('input', runSearch);

  // =====================================================================
  // INTRO + BOOT
  // =====================================================================
  addEventListener('hashchange', navigate);
  if (!reduced) gsap.from(nav, { y: -80, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 1 });
  render(parse());
  // warm the earth textures while the user reads the hero
  (window.requestIdleCallback || setTimeout)(() => Globe.preload(), { timeout: 2500 });
})();
