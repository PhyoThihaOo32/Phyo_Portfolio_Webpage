// Delegation keeps feedback working for cards rebuilt by search and filters.
(() => {
  const selector = '.btn, .icon-btn, .theme-chip, .project-tag, .story-tabs button';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => !reduced.matches && document.documentElement.dataset.motion !== 'paused';
  let frame = 0;
  let latest;
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !motionAllowed()) return;
    const target = event.target.closest(selector);
    if (!target || target.disabled) return;
    latest = { target, x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const { target, x, y } = latest;
      if (!target.isConnected) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--pointer-x', `${x - rect.left}px`);
      target.style.setProperty('--pointer-y', `${y - rect.top}px`);
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
