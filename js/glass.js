/* Liquid Glass approximation for the web.
 * - .glass       → blur + saturation + rim light + pointer-tracked specular (CSS)
 * - .glass.lens  → + real edge refraction (SVG displacement map as backdrop-filter),
 *                  Chromium only; other engines keep the CSS material.
 */
(function () {
  const supportsLens = !!window.chrome && CSS.supports('backdrop-filter', 'blur(1px)');
  const defs = document.getElementById('lens-defs');
  let uid = 0;

  // Rounded-rect SDF normal map → R/G channels encode the displacement vector.
  function buildMap(w, h, r, band) {
    const S = 0.5; // half-res map, upscaled by feImage
    const cw = Math.max(2, Math.round(w * S)), ch = Math.max(2, Math.round(h * S));
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d');
    const img = g.createImageData(cw, ch); const px = img.data;
    const hw = w / 2, hh = h / 2; r = Math.min(r, hw, hh);
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const X = (x + .5) / S - hw, Y = (y + .5) / S - hh;
        const qx = Math.abs(X) - (hw - r), qy = Math.abs(Y) - (hh - r);
        const mx = Math.max(qx, 0), my = Math.max(qy, 0);
        const outside = Math.hypot(mx, my);
        const sdf = outside + Math.min(Math.max(qx, qy), 0) - r;
        const depth = -sdf;
        let nx = 0, ny = 0;
        if (qx > 0 && qy > 0) { nx = mx / (outside || 1); ny = my / (outside || 1); }
        else if (qx > qy) nx = 1; else ny = 1;
        nx *= Math.sign(X) || 1; ny *= Math.sign(Y) || 1;
        let m = 0;
        if (depth > 0 && depth < band) { const t = 1 - depth / band; m = t * t * (3 - 2 * t); }
        const i = (y * cw + x) * 4;
        px[i] = 128 + nx * m * 127;
        px[i + 1] = 128 + ny * m * 127;
        px[i + 2] = 128; px[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL();
  }

  function applyLens(el) {
    const rect = el.getBoundingClientRect();
    const w = Math.round(rect.width), h = Math.round(rect.height);
    if (w < 4 || h < 4) return;
    if (el._lensSize === w + 'x' + h) return;
    el._lensSize = w + 'x' + h;
    const cs = getComputedStyle(el);
    const r = parseFloat(cs.borderTopLeftRadius) || 0;
    const band = Math.min(h * 0.42, 26);
    const id = el._lensId || ('lens-' + (++uid));
    el._lensId = id;
    let f = document.getElementById(id);
    if (!f) {
      f = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      f.setAttribute('id', id);
      f.setAttribute('color-interpolation-filters', 'sRGB');
      f.setAttribute('x', '0'); f.setAttribute('y', '0');
      f.setAttribute('filterUnits', 'userSpaceOnUse');
      defs.appendChild(f);
    }
    f.setAttribute('width', w); f.setAttribute('height', h);
    const href = buildMap(w, h, r, band);
    f.innerHTML =
      `<feImage href="${href}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>` +
      `<feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="soft"/>` +
      `<feDisplacementMap in="soft" in2="map" scale="${Math.round(band * 1.9)}" xChannelSelector="R" yChannelSelector="G" result="disp"/>` +
      `<feColorMatrix in="disp" type="saturate" values="1.7"/>`;
    const v = `url(#${id}) blur(5px) brightness(1.07)`;
    el.style.backdropFilter = v;
    el.style.webkitBackdropFilter = v;
  }

  const ro = supportsLens ? new ResizeObserver(entries => entries.forEach(e => applyLens(e.target))) : null;
  function scan(root) {
    if (!supportsLens) return;
    (root || document).querySelectorAll('.lens').forEach(el => {
      if (el._lensObserved) return;
      el._lensObserved = true;
      ro.observe(el);
    });
  }

  // pointer-tracked specular highlight on every glass surface
  document.addEventListener('pointermove', e => {
    const g = e.target.closest && e.target.closest('.glass');
    if (g) {
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      g.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
  }, { passive: true });

  window.Glass = { scan, supportsLens };
  document.addEventListener('DOMContentLoaded', () => scan());
})();
