// Three.js is loaded only for a visible Ocean painting with motion enabled.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const frame = document.querySelector('.hero-artwork-image');
  const image = frame?.querySelector('img');
  if (!frame || !image) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  let art = null, pending = null, inView = false, generation = 0, failed = false;
  const ocean = () => root.dataset.theme === 'ocean';
  const motion = () => !reduced.matches && root.dataset.motion !== 'paused' && !document.hidden && inView;
  function dispose() {
    art?.dispose(); art = null;
    frame.querySelector('.ocean-art-canvas')?.remove();
    delete frame.dataset.artReady;
    frame.style.removeProperty('--ocean-art-tilt-x'); frame.style.removeProperty('--ocean-art-tilt-y');
  }
  function fallback() { failed = true; ++generation; dispose(); frame.dataset.artRenderer = 'static'; }
  async function sync() {
    const current = ++generation;
    if (!ocean()) { failed = false; dispose(); delete frame.dataset.artRenderer; return; }
    if (reduced.matches || navigator.connection?.saveData) { dispose(); frame.dataset.artRenderer = 'static'; return; }
    if (art) { art.setMotion(motion()); return; }
    if (failed || !motion()) { frame.dataset.artRenderer = 'static'; return; }
    frame.dataset.artRenderer = 'loading';
    try {
      pending ||= import('./ocean-art-scene.js?v=1');
      const [{ createOceanArtwork }] = await Promise.all([pending, image.decode()]);
      if (current !== generation || !ocean() || !motion()) return;
      if (!image.getAttribute('src')?.includes('aivazovsky-moonlit-sea.webp')) return;
      const canvas = document.createElement('canvas');
      canvas.className = 'ocean-art-canvas'; canvas.setAttribute('aria-hidden', 'true'); canvas.tabIndex = -1;
      Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '1' });
      frame.appendChild(canvas);
      art = createOceanArtwork(canvas, image, { onContextLost: fallback });
      art.setMotion(motion());
      frame.dataset.artRenderer = 'three'; frame.dataset.artReady = 'true';
    } catch { if (current === generation) fallback(); }
  }
  // Observe the stable figure, so a child's perspective tilt cannot pause itself.
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, { rootMargin: '120px', threshold: 0 }).observe(frame.closest('.hero-artwork') || frame);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });
  document.addEventListener('portfolio:motionchange', sync);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  frame.addEventListener('pointermove', event => {
    if (!art || !motion() || !fine.matches || event.pointerType !== 'mouse') return;
    const rect = frame.getBoundingClientRect();
    art.setPointer(((event.clientX - rect.left) / rect.width - .5) * 2, (.5 - (event.clientY - rect.top) / rect.height) * 2);
  }, { passive: true });
  frame.addEventListener('pointerleave', () => art?.setPointer(0, 0), { passive: true });
  window.addEventListener('blur', () => art?.setPointer(0, 0));
  window.addEventListener('pagehide', () => { ++generation; dispose(); });
  window.addEventListener('pageshow', event => { if (event.persisted) sync(); });
  sync();
});
