/* High-resolution 3D globe (MapLibre GL, globe projection).
 * Base: real-time day/night composite (NASA Blue Marble + Black Marble, GIBS)
 * cross-faded into Esri World Imagery satellite tiles (to zoom 19) when zooming in.
 * Ported from the global-tracker globe and extended with animated route arcs,
 * a flying aircraft with comet trail, and a chase camera.
 */
(function () {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const wrap180 = d => ((d + 180) % 360 + 360) % 360 - 180;
  const wrap360 = d => ((d % 360) + 360) % 360;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- geo helpers ----------
  function sunPosition(date) {
    const d = (date.getTime() / 86400000) - 10957.5;
    const L = wrap360(280.460 + 0.9856474 * d) * D2R;
    const g = wrap360(357.528 + 0.9856003 * d) * D2R;
    const lam = L + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * D2R;
    const eps = 23.439 * D2R;
    const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
    const eqTimeMin = 4 * wrap180((L - ra) * R2D);
    const utcH = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    return { decRad: dec, subLngDeg: wrap180(-15 * (utcH - 12 + eqTimeMin / 60)) };
  }
  function distKm(a, b) {
    const φ1 = a[1] * D2R, φ2 = b[1] * D2R, dφ = φ2 - φ1, dλ = (b[0] - a[0]) * D2R;
    const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }
  function bearing(a, b) {
    const φ1 = a[1] * D2R, φ2 = b[1] * D2R, dλ = (b[0] - a[0]) * D2R;
    const y = Math.sin(dλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ);
    return wrap360(Math.atan2(y, x) * R2D);
  }
  // great-circle polyline, longitudes unwrapped so lines cross the antimeridian cleanly
  function gcPath(a, b, n) {
    const φ1 = a[1] * D2R, λ1 = a[0] * D2R, φ2 = b[1] * D2R, λ2 = b[0] * D2R;
    const d = distKm(a, b) / 6371;
    const pts = [];
    if (d < 1e-6) return [a.slice(), b.slice()];
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
      const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
      const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
      const z = A * Math.sin(φ1) + B * Math.sin(φ2);
      let lng = Math.atan2(y, x) * R2D;
      const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * R2D;
      if (prev !== null) { while (lng - prev > 180) lng -= 360; while (lng - prev < -180) lng += 360; }
      prev = lng;
      pts.push([lng, lat]);
    }
    return pts;
  }
  function centroid(points) {
    let x = 0, y = 0, z = 0;
    points.forEach(p => {
      const la = p[1] * D2R, lo = p[0] * D2R;
      x += Math.cos(la) * Math.cos(lo); y += Math.cos(la) * Math.sin(lo); z += Math.sin(la);
    });
    const n = points.length || 1; x /= n; y /= n; z /= n;
    return [Math.atan2(y, x) * R2D, Math.atan2(z, Math.sqrt(x * x + y * y)) * R2D];
  }

  // ---------- shared day/night earth composite ----------
  let earthPromise = null;
  let earthVer = 0;
  // Serve the composite as XYZ tiles: MapLibre caps the poles (beyond ±85°) only for tiled
  // raster sources, so a canvas source leaves holes at the poles.
  maplibregl.addProtocol('earth', async (params) => {
    const m = params.url.match(/^earth:\/\/(\d+)\/(\d+)\/(\d+)/);
    const cv = await getEarth();
    const z = +m[1], x = +m[2], y = +m[3], n = 1 << z, sz = cv.width / n;
    const T = 512, c = new OffscreenCanvas(T, T), g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(cv, x * sz, y * sz, sz, sz, 0, 0, T, T);
    const blob = await c.convertToBlob({ type: 'image/jpeg', quality: 0.93 });
    return { data: await blob.arrayBuffer() };
  });
  const liveMaps = new Set();
  function getEarth() {
    if (earthPromise) return earthPromise;
    const W = 2048, H = 2048, SRCW = 4096, SRCH = 2048;
    const MERC_MAX = Math.atanh(Math.sin(85.05 * D2R));
    const wms = (layer, extra) => 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?service=WMS&request=GetMap&version=1.1.1&styles=&srs=EPSG:4326&bbox=-180,-90,180,90&width=' + SRCW + '&height=' + SRCH + '&layers=' + layer + extra;
    const load = url => fetch(url, { mode: 'cors' }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); }).then(b => createImageBitmap(b));
    earthPromise = Promise.all([
      load(wms('BlueMarble_ShadedRelief_Bathymetry', '&format=image/jpeg')),
      load(wms('VIIRS_Black_Marble', '&format=image/jpeg&time=2016-01-01'))
    ]).then(ims => {
      const grab = im => {
        const c = document.createElement('canvas'); c.width = SRCW; c.height = SRCH;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(im, 0, 0, SRCW, SRCH);
        return g.getImageData(0, 0, SRCW, SRCH).data;
      };
      const daySrc = grab(ims[0]), nightSrc = grab(ims[1]);
      const dayW = new Uint8ClampedArray(W * H * 4), nightW = new Uint8ClampedArray(W * H * 4);
      const latRow = new Float64Array(H);
      for (let y = 0; y < H; y++) {
        const merc = MERC_MAX * (1 - 2 * y / (H - 1));
        const lat = Math.atan(Math.sinh(merc));
        latRow[y] = lat;
        const sy = Math.min(SRCH - 1, Math.max(0, Math.round((90 - lat * R2D) / 180 * (SRCH - 1))));
        for (let x = 0; x < W; x++) {
          const si = (sy * SRCW + x * 2) * 4, di = (y * W + x) * 4;
          dayW[di] = daySrc[si]; dayW[di + 1] = daySrc[si + 1]; dayW[di + 2] = daySrc[si + 2]; dayW[di + 3] = 255;
          nightW[di] = nightSrc[si]; nightW[di + 1] = nightSrc[si + 1]; nightW[di + 2] = nightSrc[si + 2]; nightW[di + 3] = 255;
        }
      }
      const lngCol = new Float64Array(W);
      for (let x = 0; x < W; x++) lngCol[x] = (-180 + 360 * (x + 0.5) / W) * D2R;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d');
      const out = ctx.createImageData(W, H), px = out.data;
      function refresh() {
        const sun = sunPosition(new Date());
        const sinDec = Math.sin(sun.decRad), cosDec = Math.cos(sun.decRad), subLng = sun.subLngDeg * D2R;
        const cosC = new Float64Array(W);
        for (let x = 0; x < W; x++) cosC[x] = Math.cos(lngCol[x] - subLng);
        const HI = Math.sin(2 * D2R), LO = Math.sin(-10 * D2R), SPAN = HI - LO;
        let i = 0;
        for (let y = 0; y < H; y++) {
          const A = Math.sin(latRow[y]) * sinDec, B = Math.cos(latRow[y]) * cosDec;
          for (let x = 0; x < W; x++, i += 4) {
            const s = A + B * cosC[x];
            let t = (HI - s) / SPAN; t = t < 0 ? 0 : t > 1 ? 1 : t;
            const a = t * t * (3 - 2 * t), b = 1 - a;
            // night side: boost the city lights a touch
            px[i] = dayW[i] * b + Math.min(255, nightW[i] * 1.25) * a;
            px[i + 1] = dayW[i + 1] * b + Math.min(255, nightW[i + 1] * 1.2) * a;
            px[i + 2] = dayW[i + 2] * b + Math.min(255, nightW[i + 2] * 1.1) * a;
            px[i + 3] = 255;
          }
        }
        ctx.putImageData(out, 0, 0);
        if (earthVer++) liveMaps.forEach(m => m._refreshEarth && m._refreshEarth());
      }
      refresh();
      setInterval(refresh, 60000);
      return cv;
    });
    earthPromise.catch(() => { earthPromise = null; });
    return earthPromise;
  }

  // ---------- icons ----------
  const PLANE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 64 64">' +
    '<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d6e6ff"/></linearGradient>' +
    '<filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="2.2" flood-color="#7cc4ff" flood-opacity="1"/></filter></defs>' +
    '<path filter="url(#g)" fill="url(#b)" d="M32 4c1.6 0 2.8 2 2.8 5v14.2l21 12v4.6l-21-6.4v12.4l6.2 4.6v3.8L32 51.6 23 54.2v-3.8l6.2-4.6V33.4l-21 6.4v-4.6l21-12V9c0-3 1.2-5 2.8-5z"/></svg>';

  function svgImage(svg, size) {
    return new Promise(res => {
      const img = new Image(size, size);
      img.onload = () => res(img);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function stars(el) {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    let html = '';
    for (let i = 0; i < 220; i++) {
      const s = rnd() < 0.86 ? 1 : 2;
      html += `<span style="left:${rnd() * 100}%;top:${rnd() * 100}%;width:${s}px;height:${s}px;--o:${0.2 + rnd() * 0.7};animation-delay:${rnd() * 4}s"></span>`;
    }
    el.innerHTML = html;
  }

  const ICON = {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>',
    follow: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg>',
    plane: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>'
  };

  // =====================================================================
  function create(container, opts) {
    opts = Object.assign({ dense: false, center: [12, 30], zoom: 1.5, spin: true, scrollZoom: 'click', onRouteClick: null, controls: true, padding: null }, opts || {});
    container.classList.add('globe');
    container.innerHTML =
      '<div class="g-stars"></div><div class="g-map"></div>' +
      (opts.controls ? `<div class="g-controls">
        <button class="gbtn glass lens" data-g="overview" aria-label="Vista globale">${ICON.globe}<span>Globo</span></button>
        <button class="gbtn glass lens" data-g="replay" aria-label="Rivedi il volo" style="display:none">${ICON.replay}</button>
        <button class="gbtn glass lens" data-g="follow" aria-label="Segui il volo" style="display:none">${ICON.follow}<span>Segui volo</span></button>
      </div>` : '') +
      '<div class="g-card glass"></div>' +
      '<div class="g-hint">Clicca per interagire · trascina per ruotare</div>';
    stars(container.querySelector('.g-stars'));
    const mapEl = container.querySelector('.g-map');
    const cardEl = container.querySelector('.g-card');
    const $btn = k => container.querySelector(`[data-g="${k}"]`);

    const style = {
      version: 8,
      projection: { type: 'globe' },
      sky: {
        'sky-color': '#000006', 'horizon-color': '#0b2046', 'fog-color': '#000006',
        'sky-horizon-blend': 0.6, 'horizon-fog-blend': 0.6, 'fog-ground-blend': 0.7,
        'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 6, 0.3, 9, 0]
      },
      sources: {
        // real-time day/night composite (NASA Blue Marble + Black Marble), see getEarth()
        earth: { type: 'raster', tileSize: 512, maxzoom: 2, attribution: 'NASA GIBS', tiles: ['earth://{z}/{x}/{y}'] },
        night: { type: 'raster', tileSize: 256, maxzoom: 8, attribution: 'NASA GIBS',
          tiles: ['https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2016-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png'] },
        sat: { type: 'raster', tileSize: 256, maxzoom: 19, attribution: 'Esri, Maxar, Earthstar Geographics',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'] },
        // place names + borders (transparent, keyless)
        labels: { type: 'raster', tileSize: 256, maxzoom: 13, attribution: 'Esri',
          tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'] }
      },
      layers: [
        { id: 'night', type: 'raster', source: 'night', layout: { visibility: 'none' }, paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 3.2, 1, 4.6, 0] } },
        { id: 'earth', type: 'raster', source: 'earth', paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 3.2, 1, 4.6, 0], 'raster-fade-duration': 300 } },
        { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0, 3.0, 0, 4.4, 1], 'raster-saturation': 0.1, 'raster-contrast': 0.08 } },
        { id: 'labels', type: 'raster', source: 'labels', paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0, 3.6, 0, 5, 0.9] } }
      ]
    };

    const map = new maplibregl.Map({
      container: mapEl, style, center: opts.center, zoom: opts.zoom,
      attributionControl: { compact: true }, maxPitch: 70, fadeDuration: 200,
      renderWorldCopies: false
    });
    liveMaps.add(map);

    // ----- scroll-zoom only after the user engages with the globe -----
    if (opts.scrollZoom !== 'always') map.scrollZoom.disable();
    if (opts.scrollZoom === 'click') {
      container.addEventListener('pointerdown', () => {
        map.scrollZoom.enable(); container.classList.add('active'); container.setAttribute('data-lenis-prevent', '');
      });
      container.addEventListener('pointerleave', () => {
        map.scrollZoom.disable(); container.classList.remove('active'); container.removeAttribute('data-lenis-prevent');
      });
    }

    // ----- earth composite: re-tile every minute as the terminator moves -----
    map._refreshEarth = () => { const src = map.getSource('earth'); if (src) src.setTiles([`earth://{z}/{x}/{y}?v=${earthVer}`]); };
    const whenStyled = fn => (function poll() { if (!alive) return; if (map.isStyleLoaded()) fn(); else setTimeout(poll, 120); })();
    let alive = true;
    // composite unavailable → fall back to NASA Black Marble tiles
    getEarth().catch(e => { console.warn('earth textures failed', e); whenStyled(() => map.setLayoutProperty('night', 'visibility', 'visible')); });

    // ----- overlay layers -----
    const EMPTY = { type: 'FeatureCollection', features: [] };
    let ready = false, pendingRoutes = null;
    const readyP = new Promise(res => {
      whenStyled(async () => {
        const img = await svgImage(PLANE_SVG, 128);
        if (!alive) return;
        map.addImage('plane-icon', img, { pixelRatio: 2 });
        map.addSource('routes', { type: 'geojson', data: EMPTY });
        map.addSource('airports', { type: 'geojson', data: EMPTY });
        map.addSource('progress', { type: 'geojson', data: EMPTY });
        map.addSource('trail', { type: 'geojson', data: EMPTY, lineMetrics: true });
        map.addSource('plane', { type: 'geojson', data: EMPTY });
        map.addLayer({ id: 'routes-glow', type: 'line', source: 'routes', layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': ['get', 'c'], 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 5, 6, 10], 'line-blur': 5, 'line-opacity': opts.dense ? 0.1 : 0.35, 'line-opacity-transition': { duration: 500 } } });
        map.addLayer({ id: 'routes-line', type: 'line', source: 'routes', layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': ['get', 'c'], 'line-width': ['interpolate', ['linear'], ['zoom'], 1, opts.dense ? 0.8 : 1.3, 6, 2.6], 'line-opacity': opts.dense ? 0.55 : 0.9, 'line-opacity-transition': { duration: 500 } } });
        map.addLayer({ id: 'routes-hit', type: 'line', source: 'routes', paint: { 'line-color': '#000', 'line-width': 16, 'line-opacity': 0 } });
        map.addLayer({ id: 'progress', type: 'line', source: 'progress', layout: { 'line-cap': 'round' },
          paint: { 'line-color': '#ffffff', 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 2, 6, 4], 'line-opacity': 0.95 } });
        map.addLayer({ id: 'trail', type: 'line', source: 'trail', layout: { 'line-cap': 'round' },
          paint: { 'line-width': ['interpolate', ['linear'], ['zoom'], 1, 7, 6, 16], 'line-blur': 4,
            'line-gradient': ['interpolate', ['linear'], ['line-progress'], 0, 'rgba(124,196,255,0)', 0.6, 'rgba(124,196,255,0.35)', 1, 'rgba(255,255,255,0.95)'] } });
        map.addLayer({ id: 'airports-halo', type: 'circle', source: 'airports',
          paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 6, 6, 14], 'circle-color': ['get', 'c'], 'circle-opacity': 0.28, 'circle-blur': 0.8, 'circle-pitch-alignment': 'map' } });
        map.addLayer({ id: 'airports', type: 'circle', source: 'airports',
          paint: { 'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 2.2, 6, 5], 'circle-color': '#ffffff', 'circle-stroke-color': ['get', 'c'], 'circle-stroke-width': 1.5, 'circle-pitch-alignment': 'map' } });
        map.addLayer({ id: 'plane', type: 'symbol', source: 'plane',
          layout: { 'icon-image': 'plane-icon', 'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.42, 4, 0.7, 7, 1.05],
            'icon-rotate': ['get', 'b'], 'icon-rotation-alignment': 'map', 'icon-pitch-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true } });
        map.on('click', 'routes-hit', e => {
          const f = e.features && e.features[0];
          if (f && opts.onRouteClick) opts.onRouteClick(f.properties.id);
        });
        map.on('mouseenter', 'routes-hit', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'routes-hit', () => { map.getCanvas().style.cursor = ''; });
        ready = true;
        res();
      });
    });

    // ----- auto-rotate until touched -----
    let spinning = !!opts.spin, focused = null;
    ['pointerdown', 'wheel', 'touchstart'].forEach(ev => map.getCanvas().addEventListener(ev, () => { spinning = false; }, { passive: true }));
    let spinRaf;
    (function spin() {
      if (spinning && !focused && map.getZoom() < 3 && !map.isMoving()) {
        const c = map.getCenter();
        map.jumpTo({ center: [c.lng + 0.035, c.lat] });
      }
      spinRaf = requestAnimationFrame(spin);
    })();

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(container);

    // ----- routes -----
    let routes = [], byId = {}, drawRaf = null;
    function routeFeatures(progressFn) {
      const feats = [];
      routes.forEach((r, i) => {
        const p = progressFn ? progressFn(i) : 1;
        if (p <= 0) return;
        const n = Math.max(2, Math.ceil(r.path.length * p));
        feats.push({ type: 'Feature', properties: { id: r.id, c: r.c }, geometry: { type: 'LineString', coordinates: r.path.slice(0, n) } });
      });
      return { type: 'FeatureCollection', features: feats };
    }
    function airportFeatures() {
      const seen = {}, feats = [];
      routes.forEach(r => [[r.a, r.pa], [r.b, r.pb]].forEach(([code, p]) => {
        if (seen[code]) return; seen[code] = 1;
        feats.push({ type: 'Feature', properties: { code, c: r.c }, geometry: { type: 'Point', coordinates: [wrap180(p[0]), p[1]] } });
      }));
      return { type: 'FeatureCollection', features: feats };
    }

    async function setRoutes(list, o) {
      o = Object.assign({ animate: true, fit: true }, o || {});
      clearFocus(true);
      routes = list.map(r => {
        const pa = [r.pa[0], r.pa[1]], pb = [r.pb[0], r.pb[1]];
        const d = distKm(pa, pb);
        const path = gcPath(pa, pb, clamp(Math.round(d / 70), 24, 180));
        return Object.assign({}, r, { dist: d, path });
      });
      byId = {}; routes.forEach(r => { byId[r.id] = r; });
      await readyP;
      if (!alive) return;
      cancelAnimationFrame(drawRaf);
      map.getSource('airports').setData(airportFeatures());
      if (o.fit && routes.length) {
        const pts = []; routes.forEach(r => { pts.push(r.pa, r.pb); });
        const c = centroid(pts);
        let maxD = 0; pts.forEach(p => { maxD = Math.max(maxD, distKm(c, p)); });
        const z = clamp(Math.log2(22000 / Math.max(600, maxD)) + 0.55, 1.5, 4.2);
        map.flyTo({ center: c, zoom: z, pitch: 0, bearing: 0, padding: { top: 0, bottom: 0, left: 0, right: 0 }, duration: 2200, curve: 1.4, essential: true });
      }
      if (!o.animate) { map.getSource('routes').setData(routeFeatures()); return; }
      const big = routes.length > 250;
      const total = big ? 2200 : 1600, stagger = big ? 900 : Math.min(700, routes.length * 60);
      const t0 = performance.now();
      let last = 0;
      (function frame(now) {
        if (!alive) return;
        if (!big || now - last > 45) {
          last = now;
          const t = now - t0;
          map.getSource('routes').setData(routeFeatures(i => {
            const delay = routes.length > 1 ? (i / (routes.length - 1)) * stagger : 0;
            const p = clamp((t - delay) / (total - stagger), 0, 1);
            return 1 - Math.pow(1 - p, 3);
          }));
          if (t > total + 50) return;
        }
        drawRaf = requestAnimationFrame(frame);
      })(t0);
    }

    // ----- focus a route: 3D camera + flying aircraft -----
    let flight = null, follow = false, pins = [];
    function clearPins() { pins.forEach(m => m.remove()); pins = []; }
    function pin(code, city, p, color) {
      const el = document.createElement('div');
      el.className = 'ap-pin';
      el.style.setProperty('--c', color);
      el.innerHTML = `<i></i>${code}<small>${city || ''}</small>`;
      const m = new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, -10] }).setLngLat([wrap180(p[0]), p[1]]).addTo(map);
      pins.push(m);
    }
    function setDim(id) {
      if (!ready) return;
      const op = id ? ['case', ['==', ['get', 'id'], id], 1, opts.dense ? 0.05 : 0.12] : (opts.dense ? 0.55 : 0.9);
      const gl = id ? ['case', ['==', ['get', 'id'], id], 0.7, 0.02] : (opts.dense ? 0.1 : 0.35);
      map.setPaintProperty('routes-line', 'line-opacity', op);
      map.setPaintProperty('routes-glow', 'line-opacity', gl);
    }
    function clearFocus(silent) {
      focused = null;
      if (flight) { cancelAnimationFrame(flight.raf); flight = null; }
      clearPins();
      if (ready) {
        map.getSource('plane').setData(EMPTY);
        map.getSource('progress').setData(EMPTY);
        map.getSource('trail').setData(EMPTY);
        setDim(null);
      }
      cardEl.classList.remove('show');
      if ($btn('follow')) { $btn('follow').style.display = 'none'; $btn('replay').style.display = 'none'; }
      setFollow(false, true);
    }

    function cameraFor(r) {
      const mid = r.path[Math.floor(r.path.length / 2)];
      const b = bearing(r.path[Math.max(0, Math.floor(r.path.length / 2) - 1)], r.path[Math.min(r.path.length - 1, Math.floor(r.path.length / 2) + 1)]);
      const zoom = clamp(Math.log2(20000 / Math.max(300, r.dist)) + 1.15, 1.7, 5.6);
      return { center: mid, zoom, pitch: r.dist > 9000 ? 38 : 55, bearing: wrap180(b - 72), padding: { top: 70, bottom: 190, left: 30, right: 30 } };
    }

    async function focus(id, card) {
      await readyP;
      const r = byId[id]; if (!r || !alive) return;
      clearFocus(true);
      focused = id; spinning = false;
      setDim(id);
      pin(r.a, r.cityA, r.pa, r.c);
      pin(r.b, r.cityB, r.pb, r.c);
      if (card) { cardEl.innerHTML = card; requestAnimationFrame(() => cardEl.classList.add('show')); }
      if ($btn('follow')) { $btn('follow').style.display = ''; $btn('replay').style.display = ''; }
      map.flyTo(Object.assign(cameraFor(r), { duration: 2800, curve: 1.5, essential: true }));
      map.once('moveend', () => { if (focused === id) fly(r); });
    }

    function interp(path, s) {
      const f = s * (path.length - 1);
      const i = Math.min(path.length - 2, Math.floor(f)), t = f - i;
      const a = path[i], b = path[i + 1];
      return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], i, h: bearing(a, b) };
    }

    function fly(r) {
      if (flight) cancelAnimationFrame(flight.raf);
      flight = { r, s: 0, last: performance.now(), hold: 0, heading: null };
      const baseDur = () => follow ? clamp(r.dist / 650, 6, 22) : clamp(r.dist / 1400, 3.8, 9);
      (function step(now) {
        if (!alive || !flight) return;
        const dt = Math.min(0.05, (now - flight.last) / 1000); flight.last = now;
        const s = flight.s;
        const ramp = Math.min(1, 0.12 + s / 0.07, 0.12 + (1 - s) / 0.07);
        flight.s = Math.min(1, s + dt / baseDur() * ramp);
        const cur = interp(r.path, flight.s);
        // smooth heading
        let h = cur.h;
        if (flight.heading !== null) { const dh = wrap180(h - flight.heading); h = flight.heading + dh * Math.min(1, dt * 6); }
        flight.heading = h;
        map.getSource('plane').setData({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: { b: h }, geometry: { type: 'Point', coordinates: cur.p } }] });
        const done = r.path.slice(0, cur.i + 1).concat([cur.p]);
        map.getSource('progress').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: done.length > 1 ? done : [cur.p, cur.p] } });
        const tailN = Math.max(2, Math.round(r.path.length * 0.14));
        const tail = r.path.slice(Math.max(0, cur.i - tailN), cur.i + 1).concat([cur.p]);
        map.getSource('trail').setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: tail.length > 1 ? tail : [cur.p, cur.p] } });
        if (follow) {
          map.jumpTo({ center: cur.p, bearing: h, pitch: 64, zoom: flight.followZoom || 5.2, padding: { top: 0, bottom: 0, left: 0, right: 0 } });
        }
        if (flight.s >= 1) {
          flight.hold += dt;
          if (flight.hold > 1.2) {
            map.getSource('trail').setData(EMPTY);
            if (follow) { setFollow(false, true); map.flyTo(Object.assign(cameraFor(r), { duration: 2600 })); }
            return;
          }
        }
        flight.raf = requestAnimationFrame(step);
      })(performance.now());
    }

    function setFollow(on, silent) {
      follow = on;
      const b = $btn('follow');
      if (b) b.classList.toggle('on', on);
      if (on && flight) {
        const cur = interp(flight.r.path, flight.s);
        flight.followZoom = clamp(Math.log2(20000 / Math.max(300, flight.r.dist)) + 3.6, 4.6, 6.2);
        const wasDone = flight.s >= 1;
        if (wasDone) { flight.s = 0; flight.hold = 0; }
        // glide into chase position, then lock on
        const saved = flight; const raf = saved.raf; cancelAnimationFrame(raf);
        map.easeTo({ center: interp(saved.r.path, saved.s).p, bearing: cur.h, pitch: 64, zoom: saved.followZoom, duration: 1400, easing: t => 1 - Math.pow(1 - t, 3) });
        map.once('moveend', () => { if (flight === saved) fly2(saved); });
      }
    }
    function fly2(saved) { const s = saved.s, fz = saved.followZoom; fly(saved.r); flight.s = s; flight.followZoom = fz; }

    if (opts.controls) {
      $btn('overview').addEventListener('click', () => { clearFocus(); map.flyTo({ center: map.getCenter(), zoom: opts.zoom, pitch: 0, bearing: 0, padding: { top: 0, bottom: 0, left: 0, right: 0 }, duration: 2200 }); if (opts.onClear) opts.onClear(); });
      $btn('follow').addEventListener('click', () => {
        if (!flight && focused) fly(byId[focused]);
        setFollow(!follow);
      });
      $btn('replay').addEventListener('click', () => { if (!focused) return; const r = byId[focused]; setFollow(false, true); map.flyTo(Object.assign(cameraFor(r), { duration: 1800 })); map.once('moveend', () => fly(r)); });
    }

    function overview() { clearFocus(); map.flyTo({ zoom: opts.zoom, pitch: 0, bearing: 0, duration: 2000 }); }

    function destroy() {
      alive = false;
      cancelAnimationFrame(spinRaf); cancelAnimationFrame(drawRaf);
      if (flight) cancelAnimationFrame(flight.raf);
      ro.disconnect(); liveMaps.delete(map);
      try { map.remove(); } catch (e) {}
    }

    if (window.Glass) window.Glass.scan(container);
    const api = { map, setRoutes, focus, overview, clearFocus, destroy, get focused() { return focused; } };
    window.__globe = api; // handy for console inspection
    return api;
  }

  window.Globe = { create, distKm, gcPath, bearing, preload: getEarth };
})();
