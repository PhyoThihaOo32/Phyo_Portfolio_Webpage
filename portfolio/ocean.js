// The owner-selected wave loop loads only while Ocean is visible and motion is allowed.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const atmosphere = document.getElementById('ocean-atmosphere');
  if (!atmosphere) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const image = document.querySelector('.hero-artwork-image img');
  const caption = document.querySelector('.artwork-caption');
  const credit = document.querySelector('.hero-artwork figcaption');
  const original = { src: image?.getAttribute('src'), alt: image?.alt, caption: caption?.innerHTML, credit: credit?.innerHTML };
  let video = null, lastTheme = '', playback = 0;
  const canAnimate = () => !reduced.matches && root.dataset.motion !== 'paused' && !document.hidden;

  function postcard(ocean) {
    if (image) { image.src = ocean ? 'assets/art/ocean/aloha-shore.svg' : original.src; image.alt = ocean ? 'Turquoise waves, a golden sun, and palms on a quiet tropical shore.' : original.alt; }
    if (caption) caption.innerHTML = ocean ? 'Stay curious.<br/><em>Go with the flow.</em>' : original.caption;
    if (credit) credit.innerHTML = ocean ? '<span>A little aloha</span><a href="#listen">Explore the ocean postcards ↘</a>' : original.credit;
  }
  function dispose() {
    ++playback;
    const oldVideo = video;
    video = null;
    if (oldVideo) {
      oldVideo.pause(); oldVideo.removeAttribute('src'); oldVideo.load(); oldVideo.remove();
    }
    delete atmosphere.dataset.ready;
  }
  function fallback() {
    dispose();
    atmosphere.dataset.renderer = 'static';
  }
  function activate() {
    const currentPlayback = ++playback;
    if (root.dataset.theme !== 'ocean') {
      dispose(); atmosphere.hidden = true; delete atmosphere.dataset.renderer;
      return;
    }
    atmosphere.hidden = false;
    if (reduced.matches || navigator.connection?.saveData) { fallback(); return; }
    if (!canAnimate()) {
      video?.pause();
      if (!video) atmosphere.dataset.renderer = 'static';
      return;
    }
    if (!video) {
      const loop = document.createElement('video');
      loop.className = 'ocean-wave-video';
      loop.muted = true; loop.defaultMuted = true; loop.loop = true; loop.playsInline = true;
      loop.disablePictureInPicture = true;
      loop.setAttribute('aria-hidden', 'true'); loop.tabIndex = -1;
      loop.addEventListener('loadeddata', () => {
        if (video === loop) atmosphere.dataset.ready = 'true';
      });
      loop.addEventListener('error', () => { if (video === loop) fallback(); });
      loop.src = 'assets/art/ambient/ocean-glow-waves.mp4';
      video = loop; atmosphere.appendChild(loop);
    }
    atmosphere.dataset.renderer = 'video';
    const currentVideo = video;
    currentVideo.play().catch(() => {
      if (currentPlayback === playback && video === currentVideo && canAnimate()) fallback();
    });
  }
  function syncTheme() {
    const theme = root.dataset.theme;
    if (theme === lastTheme) return;
    lastTheme = theme; postcard(theme === 'ocean'); activate();
  }
  new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('portfolio:motionchange', activate);
  document.addEventListener('visibilitychange', activate);
  reduced.addEventListener('change', () => { if (root.dataset.theme === 'ocean') activate(); });
  window.addEventListener('pagehide', dispose);
  window.addEventListener('pageshow', e => { if (e.persisted) activate(); });
  syncTheme();
});
