// Delegation keeps feedback working for cards rebuilt by search and filters.
(() => {
  const selector = '.btn, .icon-btn, .theme-chip, .project-tag, .skill-link';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => !reduced.matches && document.documentElement.dataset.motion !== 'paused';
  let frame = 0;
  let latest;
  const surfaces = '.about-card, .skill-card, .project-card, .timeline .item, .contact-card, .media-card, .recreation-card, .credit-card, .hero-now';
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !motionAllowed()) return;
    const target = event.target.closest(selector);
    const surface = event.target.closest(surfaces);
    if ((!target || target.disabled) && !surface) return;
    latest = { target, surface, x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const { target, surface, x, y } = latest;
      for (const [element, prefix] of [[target, 'pointer'], [surface, 'surface']]) {
        if (!element?.isConnected || element.disabled) continue;
        const rect = element.getBoundingClientRect();
        element.style.setProperty(`--${prefix}-x`, `${x - rect.left}px`);
        element.style.setProperty(`--${prefix}-y`, `${y - rect.top}px`);
      }
      if (surface?.classList.contains('project-card')) {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty('--art-shift-x', `${((x - rect.left) / rect.width - .5) * 5}px`);
        surface.style.setProperty('--art-shift-y', `${((y - rect.top) / rect.height - .5) * 4}px`);
      }
    });
  }, { passive: true });
  document.addEventListener('click', event => {
    const target = event.target.closest(selector);
    if (!target || target.disabled || target.id === 'motion-toggle' || !motionAllowed()) return;
    target.querySelector('.interaction-ripple')?.remove();
    const rect = target.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const ripple = document.createElement('span'); ripple.className = 'interaction-ripple'; ripple.setAttribute('aria-hidden', 'true');
    const x = event.detail ? event.clientX - rect.left : rect.width / 2;
    const y = event.detail ? event.clientY - rect.top : rect.height / 2;
    Object.assign(ripple.style, { width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${y - size / 2}px` });
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  }, true);
})();
