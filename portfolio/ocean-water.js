// A small, transparent water surface follows the mouse without moving the content.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const surfaces = '.hero-artwork-image, .gallery-art, .about-card, .skill-card, .project-card, .timeline .item, .contact-card, .media-card, .recreation-card, .credit-card, .hero-now, .hero-proof';
  const allowed = () => root.dataset.theme === 'ocean' && root.dataset.motion !== 'paused' &&
    !reduced.matches && finePointer.matches && !document.hidden;
  let scenes = [], active = null, frame = 0, lastDraw = 0;

  function remove(scene) { scene.canvas.remove(); }
  function clear() {
    cancelAnimationFrame(frame);
    frame = 0; lastDraw = 0; active = null;
    scenes.forEach(remove); scenes = [];
  }
  function leave() {
    if (active) active.fading = true;
    active = null;
  }
  function drop(scene, now) {
    scene.ripples.push({ x: scene.x, y: scene.y, born: now });
    if (scene.ripples.length > 4) scene.ripples.shift();
    scene.lastDrop = now;
    scene.dropX = scene.aimX; scene.dropY = scene.aimY;
  }
  function create(element, x, y, now) {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return null;
    const ratio = Math.min(devicePixelRatio || 1, 1.35, Math.sqrt(900000 / (rect.width * rect.height)));
    canvas.className = 'ocean-water-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    // Keep decoration out of layout even while a stylesheet update is rolling out.
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      borderRadius: 'inherit', pointerEvents: 'none',
      zIndex: element.matches('.hero-artwork-image, .gallery-art') ? '3' : '-1'
    });
    canvas.width = Math.ceil(rect.width * ratio);
    canvas.height = Math.ceil(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const scene = {
      element, canvas, ctx, width: rect.width, height: rect.height,
      x: x - rect.left, y: y - rect.top, aimX: x - rect.left, aimY: y - rect.top,
      opacity: 0, fading: false, lastMove: now, lastDrop: now, ripples: []
    };
    element.appendChild(canvas);
    drop(scene, now);
    return scene;
  }
  function strokeWater(ctx, x, y, radius, phase, opacity) {
    const light = ctx.createLinearGradient(x - radius, y, x + radius, y);
    light.addColorStop(0, 'rgba(23, 124, 154, 0)');
    light.addColorStop(.24, 'rgba(23, 124, 154, .28)');
    light.addColorStop(.53, 'rgba(204, 248, 255, .62)');
    light.addColorStop(.8, 'rgba(31, 148, 175, .3)');
    light.addColorStop(1, 'rgba(31, 148, 175, 0)');
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = light;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const angle = i / 64 * Math.PI * 2;
      const r = radius * (1 + .025 * Math.sin(angle * 3 + phase));
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r * .58;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
  function draw(scene, now, dt) {
    const { ctx, width, height } = scene;
    const follow = 1 - Math.exp(-dt / 115);
    scene.x += (scene.aimX - scene.x) * follow;
    scene.y += (scene.aimY - scene.y) * follow;
    scene.opacity += ((scene.fading ? 0 : 1) - scene.opacity) * (1 - Math.exp(-dt / (scene.fading ? 240 : 210)));
    ctx.clearRect(0, 0, width, height);

    // Two fine, open curves catch the light like a small current under the cursor.
    const bend = Math.sin(now / 1050) * 3;
    const glint = ctx.createLinearGradient(scene.x - 82, scene.y, scene.x + 82, scene.y);
    glint.addColorStop(0, 'rgba(35, 145, 172, 0)');
    glint.addColorStop(.35, 'rgba(35, 145, 172, .18)');
    glint.addColorStop(.62, 'rgba(204, 248, 255, .54)');
    glint.addColorStop(1, 'rgba(35, 145, 172, 0)');
    ctx.globalAlpha = scene.opacity * .8;
    ctx.strokeStyle = glint;
    ctx.lineWidth = 1;
    for (const offset of [-6, 8]) {
      ctx.beginPath();
      ctx.moveTo(scene.x - 82, scene.y + offset);
      ctx.bezierCurveTo(scene.x - 25, scene.y - 15 + offset + bend,
        scene.x + 22, scene.y + 17 + offset - bend, scene.x + 82, scene.y - 2 + offset);
      ctx.stroke();
    }
    scene.ripples = scene.ripples.filter(ripple => now - ripple.born < 2100);
    const reach = Math.min(132, Math.max(80, Math.min(width, height) * .52));
    for (const ripple of scene.ripples) {
      const age = (now - ripple.born) / 2100;
      const radius = 10 + reach * (1 - (1 - age) ** 2);
      const opacity = scene.opacity * (1 - age) ** 1.4 * .85;
      strokeWater(ctx, ripple.x, ripple.y, radius, now / 1100, opacity);
      strokeWater(ctx, ripple.x, ripple.y + 2, radius + 3, now / 1100 + .4, opacity * .38);
    }
    ctx.globalAlpha = 1;
  }
  function tick(now) {
    frame = 0;
    if (!allowed()) { clear(); return; }
    if (lastDraw && now - lastDraw < 32) { frame = requestAnimationFrame(tick); return; }
    const dt = Math.min(now - (lastDraw || now - 16), 70);
    lastDraw = now;
    if (active && now - active.lastMove > 1300) leave();
    scenes = scenes.filter(scene => {
      if (!scene.element.isConnected || (scene.fading && scene.opacity < .015)) {
        if (active === scene) active = null;
        remove(scene); return false;
      }
      draw(scene, now, dt);
      return true;
    });
    if (scenes.length) frame = requestAnimationFrame(tick); else lastDraw = 0;
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || event.buttons || !allowed()) { if (scenes.length) clear(); return; }
    const element = event.target instanceof Element ? event.target.closest(surfaces) : null;
    if (!element || event.target instanceof HTMLIFrameElement) { leave(); return; }
    const now = performance.now();
    if (active?.element !== element) {
      leave();
      active = scenes.find(scene => scene.element === element) || create(element, event.clientX, event.clientY, now);
      if (!active) return;
      if (!scenes.includes(active)) scenes.push(active);
      active.fading = false;
      while (scenes.length > 3) remove(scenes.shift());
    }
    const rect = element.getBoundingClientRect();
    active.aimX = event.clientX - rect.left; active.aimY = event.clientY - rect.top;
    active.lastMove = now;
    if (now - active.lastDrop > 190 && Math.hypot(active.aimX - active.dropX, active.aimY - active.dropY) > 18) drop(active, now);
    if (!frame) frame = requestAnimationFrame(tick);
  }, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget || event.relatedTarget instanceof HTMLIFrameElement) leave(); }, { passive: true });
  document.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') clear(); }, { passive: true });
  document.addEventListener('scroll', clear, { passive: true, capture: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
  new MutationObserver(() => { if (!allowed()) clear(); }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] });
  reduced.addEventListener('change', () => { if (!allowed()) clear(); });
  finePointer.addEventListener('change', () => { if (!allowed()) clear(); });
  window.addEventListener('resize', clear, { passive: true });
  window.addEventListener('blur', clear);
  window.addEventListener('pagehide', clear);
})();
