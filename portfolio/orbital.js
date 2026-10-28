// Decorative enhancement: portfolio content never depends on WebGL.
const host = document.querySelector('.orbital-scene');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const connection = navigator.connection;

if (host && !motion.matches && !connection?.saveData) {
  init().catch(() => { host.classList.remove('is-ready'); });
}

async function init() {
  const THREE = await import('./assets/vendor/three.module.min.js');
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  host.append(renderer.domElement);
  host.classList.add('is-ready');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.z = 7;
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const core = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.92, 1)),
    new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 })
  );
  sculpture.add(core);
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const points = Array.from({ length: 129 }, (_, j) => {
      const a = j / 128 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * 1.48, Math.sin(a) * 1.48, 0);
    });
    const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0.28 }));
    ring.rotation.set(0.6 + i * 0.75, i * 0.9, i * 0.4);
    sculpture.add(ring);
    rings.push(ring);
  }
  const positions = new Float32Array(100 * 3);
  for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 8;
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(starGeometry,
    new THREE.PointsMaterial({ size: 0.023, transparent: true, opacity: 0.45, depthWrite: false }));
  scene.add(stars);

  function palette() {
    const style = getComputedStyle(document.documentElement);
    core.material.color.set(style.getPropertyValue('--accent').trim() || '#a855f7');
    rings.forEach(r => r.material.color.set(style.getPropertyValue('--accent-2').trim() || '#ffb38a'));
    stars.material.color.copy(core.material.color);
  }
  palette();
  const themeObserver = new MutationObserver(palette);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(host);

  let visible = false;
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let disposed = false;
  const pointer = { x: 0, y: 0 };
  const card = host.closest('.hero-now');
  function move(event) {
    if (event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
  }
  function reset() { pointer.x = pointer.y = 0; }
  card.addEventListener('pointermove', move, { passive: true });
  card.addEventListener('pointerleave', reset);

  function draw(now) {
    frame = 0;
    if (disposed || !visible || document.hidden || motion.matches) return;
    // Cap rendering at ~30 fps; no catch-up jumps after a background tab.
    if (!last || now - last >= 32) {
      elapsed += last ? Math.min(now - last, 60) / 1000 : 0;
      last = now;
      core.rotation.set(elapsed * 0.1, elapsed * 0.14, elapsed * 0.04);
      sculpture.rotation.y += (pointer.x * 0.35 - sculpture.rotation.y) * 0.045;
      sculpture.rotation.x += (pointer.y * 0.25 - sculpture.rotation.x) * 0.045;
      rings.forEach((r, i) => { r.rotation.z = i * 0.4 + elapsed * 0.045 * (i % 2 ? -1 : 1); });
      stars.rotation.y = elapsed * 0.012;
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    host.classList.toggle('is-ready', !motion.matches);
    if (!disposed && visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw);
  }
  const visibilityObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
  visibilityObserver.observe(host);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  renderer.domElement.addEventListener('webglcontextlost', dispose);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    visibilityObserver.disconnect();
    resizeObserver.disconnect();
    themeObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    motion.removeEventListener('change', sync);
    card.removeEventListener('pointermove', move);
    card.removeEventListener('pointerleave', reset);
    scene.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
    renderer.dispose();
    renderer.domElement.remove();
    host.classList.remove('is-ready');
  }
  // Keep the scene intact when the browser places this page in its back/forward cache.
  window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); });
}
