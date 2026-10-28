// A bounded, gently animated interest field. Static tags remain the fallback.
document.addEventListener('DOMContentLoaded', () => {
  const field = document.getElementById('passions-list');
  if (!field || !field.children.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => !reduced.matches && document.documentElement.dataset.motion !== 'paused';
  const bubbles = Array.from(field.children);
  bubbles.forEach((bubble, index) => {
    const label = bubble.textContent.trim();
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'bubble-button'; button.setAttribute('aria-pressed', 'false');
    button.title = `Pin ${label} in place`;
    const text = document.createElement('span'); text.textContent = label;
    const pin = document.createElement('span'); pin.className = 'bubble-pin'; pin.setAttribute('aria-hidden', 'true');
    button.append(text, pin);
    bubble.replaceChildren(button); bubble.className = 'pill interest-bubble';
    bubble.style.setProperty('--bubble-hue', `${(index * 29 + 185) % 360}`);
    bubble.style.setProperty('--float-duration', `${9 + (index % 5) * 1.6}s`);
    bubble.style.setProperty('--float-delay', `${-index * 1.37}s`);
    bubble.style.setProperty('--bubble-tilt', `${index % 2 ? 2 : -2}deg`);
    button.addEventListener('click', () => {
      const pinned = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(pinned));
      button.title = `${pinned ? 'Release' : 'Pin'} ${label}${pinned ? ' bubble' : ' in place'}`;
      bubble.classList.toggle('is-pinned', pinned);
      button.classList.remove('is-nudged');
      if (motionAllowed()) {
        void button.offsetWidth;
        button.classList.add('is-nudged');
      }
    });
    button.addEventListener('animationend', event => {
      if (event.animationName === 'bubble-nudge') button.classList.remove('is-nudged');
    });
  });
  field.setAttribute('aria-label', 'Interests. Activate a bubble to pin or release it.');
  field.classList.add('is-bubble-field');
  let frame = 0;
  let measuredWidth = 0;
  function layout() {
    frame = 0;
    const width = field.clientWidth;
    if (!width) return;
    measuredWidth = width;
    const compact = width < 600;
    const driftX = compact ? 4 : 13;
    const driftY = compact ? 4 : 8;
    const gap = compact ? 7 : 10;
    const padding = compact ? 13 : 17;
    const available = width - padding * 2;
    const rows = [];
    let row = { items: [], width: 0, height: 0 };
    bubbles.forEach((element, index) => {
      const button = element.firstElementChild;
      const w = button.offsetWidth;
      const h = button.offsetHeight;
      // Reserve the complete animation envelope, including the press bounce.
      const cellWidth = Math.ceil(w * 1.14 + driftX * 2);
      const cellHeight = Math.ceil(h * 1.14 + driftY * 2);
      if (row.items.length && row.width + gap + cellWidth > available) {
        rows.push(row); row = { items: [], width: 0, height: 0 };
      }
      if (row.items.length) row.width += gap;
      row.items.push({ element, w, h, cellWidth, index });
      row.width += cellWidth;
      row.height = Math.max(row.height, cellHeight);
    });
    if (row.items.length) rows.push(row);
    const totalHeight = rows.reduce((sum, r) => sum + r.height, 0);
    const minimum = compact ? 220 : 196;
    const height = Math.max(minimum, totalHeight + gap * (rows.length - 1) + padding * 2);
    field.style.height = `${height}px`;
    const verticalGap = (height - padding * 2 - totalHeight) / Math.max(1, rows.length - 1);
    let y = rows.length === 1 ? (height - totalHeight) / 2 : padding;
    rows.forEach(r => {
      let x = (width - r.width) / 2;
      r.items.forEach(({ element, w, h, cellWidth, index }) => {
        element.style.left = `${x + (cellWidth - w) / 2}px`;
        element.style.top = `${y + (r.height - h) / 2}px`;
        element.style.setProperty('--drift-x', `${driftX * (index % 2 ? -1 : 1)}px`);
        element.style.setProperty('--drift-y', `${driftY * (index % 3 ? 1 : -1)}px`);
        x += cellWidth + gap;
      });
      y += r.height + verticalGap;
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(layout);
  }
  layout();
  const resize = new ResizeObserver(entries => {
    if (Math.abs(entries[0].contentRect.width - measuredWidth) > 1) schedule();
  });
  resize.observe(field);
  const visibility = new IntersectionObserver(entries => field.classList.toggle('field-visible', entries[0].isIntersecting));
  visibility.observe(field);
  const themes = new MutationObserver(schedule);
  themes.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.fonts.ready.then(schedule);
  document.fonts.addEventListener('loadingdone', schedule);
  document.addEventListener('visibilitychange', () => field.classList.toggle('tab-hidden', document.hidden));
});
