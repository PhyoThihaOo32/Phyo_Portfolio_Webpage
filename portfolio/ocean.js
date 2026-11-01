// The Ocean theme owns its renderer; other themes never download Three.js.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const atmosphere = document.getElementById('ocean-atmosphere');
  if (!atmosphere) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const image = document.querySelector('.hero-artwork-image img');
  const caption = document.querySelector('.artwork-caption');
  const credit = document.querySelector('.hero-artwork figcaption');
  const original = { src: image?.getAttribute('src'), alt: image?.alt, caption: caption?.innerHTML, credit: credit?.innerHTML };
  let scene = null, pending = null, generation = 0, lastTheme = '';
  const canAnimate = () => !reduced.matches && root.dataset.motion !== 'paused' && !document.hidden;

  function postcard(ocean) {
    if (image) { image.src = ocean ? 'assets/art/ocean/aloha-shore.svg' : original.src; image.alt = ocean ? 'Turquoise waves, a golden sun, and palms on a quiet tropical shore.' : original.alt; }
    if (caption) caption.innerHTML = ocean ? 'Stay curious.<br/><em>Go with the flow.</em>' : original.caption;
    if (credit) credit.innerHTML = ocean ? '<span>A little aloha</span><a href="#listen">Explore the ocean postcards ↘</a>' : original.credit;
  }
  function dispose() {
    if (scene) { scene.dispose(); scene = null; }
    atmosphere.replaceChildren();
    delete atmosphere.dataset.ready;
  }
  function fallback() {
    dispose();
    atmosphere.dataset.renderer = 'static';
  }
  async function activate() {
    const current = ++generation;
    if (root.dataset.theme !== 'ocean') {
      dispose(); atmosphere.hidden = true; delete atmosphere.dataset.renderer;
      return;
    }
    atmosphere.hidden = false;
    if (reduced.matches || navigator.connection?.saveData) { fallback(); return; }
    if (scene) { scene.setMotion(canAnimate()); return; }
    atmosphere.dataset.renderer = 'loading';
    try {
      pending ||= import('./ocean-scene.js?v=1');
      const { createOceanScene } = await pending;
      if (current !== generation || root.dataset.theme !== 'ocean') return;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true'); atmosphere.appendChild(canvas);
      scene = createOceanScene(canvas, { onContextLost: fallback });
      scene.setMotion(canAnimate());
      atmosphere.dataset.renderer = 'three'; atmosphere.dataset.ready = 'true';
    } catch {
      if (current === generation) fallback();
    }
  }
  function syncTheme() {
    const theme = root.dataset.theme;
    if (theme === lastTheme) return;
    lastTheme = theme; postcard(theme === 'ocean'); activate();
  }
  new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('portfolio:motionchange', () => { if (root.dataset.theme === 'ocean') { if (reduced.matches) activate(); else if (scene) scene.setMotion(canAnimate()); else activate(); } });
  document.addEventListener('visibilitychange', () => scene?.setMotion(canAnimate()));
  reduced.addEventListener('change', () => { if (root.dataset.theme === 'ocean') activate(); });
  window.addEventListener('pagehide', () => { ++generation; dispose(); });
  window.addEventListener('pageshow', e => { if (e.persisted) activate(); });
  syncTheme();
});
