// Swimming interest tags with pointer capture, keyboard alternatives, and section bounds.
document.addEventListener('DOMContentLoaded', () => {
  const field = document.getElementById('passions-list');
  if (!field || !field.children.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionAllowed = () => !reduced.matches && document.documentElement.dataset.motion !== 'paused';
  const marks = ['✦', '♪', '♬', '↗', '✈', '✳', '¶', '✚', '⋆', '♡', '∞', '⌁', '♧', '✧', '◎', '❋', '≈'];
  let width = 0, height = 0, frame = 0, layoutFrame = 0, last = 0, swimTime = 0, visible = false, drag = null;
  const states = Array.from(field.children, (element, index) => {
    const label = element.textContent.trim();
    const button = document.createElement('button'); button.type = 'button'; button.className = 'interest-tag';
    button.setAttribute('aria-pressed', 'false'); button.setAttribute('aria-describedby', 'interests-help');
    const mark = document.createElement('span'); mark.className = 'interest-mark'; mark.setAttribute('aria-hidden', 'true'); mark.textContent = marks[index % marks.length];
    if (label === 'Animals') mark.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" focusable="false"><ellipse cx="6" cy="7" rx="2.5" ry="3"/><ellipse cx="12" cy="5" rx="2.5" ry="3"/><ellipse cx="18" cy="7" rx="2.5" ry="3"/><path d="M5 17c0-4 4-7 7-7s7 3 7 7c0 5-4 3-7 3s-7 2-7-3z"/></svg>';
    const text = document.createElement('span'); text.textContent = label;
    const pin = document.createElement('span'); pin.className = 'interest-pin'; pin.setAttribute('aria-hidden', 'true'); pin.textContent = '·';
    button.append(mark, text, pin); element.replaceChildren(button); element.className = 'pill draggable-interest';
    element.style.setProperty('--interest-hue', `${(index * 31 + 180) % 360}`);
    const direction = index % 2 ? -1 : 1, speed = 22 + index % 5 * 3;
    const state = { element, button, label, x: 0, y: 0, w: 0, h: 0, homeX: 0, homeY: 0, direction, speed, phase: index * 2.4, vx: direction * speed, vy: 0, bank: 0, tilt: [-2.5, 1.5, -1, 2][index % 4], pinned: false, hovered: false, focused: false, ignoreClick: 0 };
    button.title = `Drag ${label} · arrow keys move · Space pins`;
    button.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') state.hovered = true; });
    button.addEventListener('pointerleave', () => { state.hovered = false; });
    button.addEventListener('focus', () => { state.focused = true; render(); });
    button.addEventListener('blur', () => { state.focused = false; });
    button.addEventListener('pointerdown', e => {
      if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0) || drag) return;
      e.preventDefault(); button.focus({ preventScroll: true });
      drag = { state, id: e.pointerId, clientX: e.clientX, clientY: e.clientY, x: state.x, y: state.y, pinned: state.pinned, moved: false };
      button.setPointerCapture(e.pointerId);
    });
    button.addEventListener('pointermove', e => {
      if (!drag || drag.state !== state || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.clientX, dy = e.clientY - drag.clientY;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      drag.moved = true; element.classList.add('is-dragging'); field.classList.add('is-arranging');
      state.x = drag.x + dx; state.y = drag.y + dy; clamp(state); render();
    });
    button.addEventListener('pointerup', e => { if (drag?.state === state && drag.id === e.pointerId) finishDrag(false); });
    button.addEventListener('pointercancel', () => { if (drag?.state === state) finishDrag(true); });
    button.addEventListener('lostpointercapture', () => { if (drag?.state === state) finishDrag(true); });
    button.addEventListener('click', e => {
      if (e.detail && performance.now() < state.ignoreClick) return;
      pinState(state, !state.pinned); settle(state); render();
    });
    button.addEventListener('keydown', e => {
      const delta = e.shiftKey ? 28 : 10;
      const directions = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] };
      if (e.key === 'Escape' && drag?.state === state) { e.preventDefault(); finishDrag(true); return; }
      if (e.key === 'Home') { e.preventDefault(); state.x = state.homeX; state.y = state.homeY; pinState(state, false); clamp(state); render(); return; }
      if (!directions[e.key]) return;
      e.preventDefault(); const [dx, dy] = directions[e.key]; state.x += dx; state.y += dy; pinState(state, true); clamp(state); render();
    });
    button.addEventListener('animationend', () => button.classList.remove('is-settling'));
    return state;
  });
  field.classList.add('is-sticker-field');
  function pinState(state, pinned) {
    state.pinned = pinned; state.button.setAttribute('aria-pressed', String(pinned));
    state.element.classList.toggle('is-pinned', pinned);
    state.button.title = `${pinned ? 'Pinned · click to release' : 'Drag to move · click to pin'} ${state.label}`;
  }
  function settle(state) {
    state.button.classList.remove('is-settling');
    if (motionAllowed()) { void state.button.offsetWidth; state.button.classList.add('is-settling'); }
  }
  function finishDrag(cancelled) {
    const current = drag; if (!current) return;
    drag = null;
    const s = current.state;
    if (cancelled) { s.x = current.x; s.y = current.y; pinState(s, current.pinned); }
    else { pinState(s, current.moved ? true : !s.pinned); settle(s); }
    s.ignoreClick = performance.now() + 450;
    s.element.classList.remove('is-dragging'); field.classList.remove('is-arranging');
    if (s.button.hasPointerCapture(current.id)) s.button.releasePointerCapture(current.id);
    clamp(s); render();
  }
  function clamp(s) {
    s.x = Math.max(8, Math.min(Math.max(8, width - s.w - 8), s.x));
    s.y = Math.max(8, Math.min(Math.max(8, height - s.h - 8), s.y));
  }
  const locked = s => s.pinned || s.hovered || s.focused || drag?.state === s;
  function separate() {
    // Resolve neighboring tags without slowing their cruising speed.
    for (let pass = 0; pass < 8; pass++) for (let i = 0; i < states.length; i++) for (let j = i + 1; j < states.length; j++) {
      const a = states[i], b = states[j];
      const dx = a.x + a.w / 2 - b.x - b.w / 2, dy = a.y + a.h / 2 - b.y - b.h / 2;
      const overlapX = (a.w + b.w) / 2 + 4 - Math.abs(dx), overlapY = (a.h + b.h) / 2 + 4 - Math.abs(dy);
      if (overlapX <= 0 || overlapY <= 0 || (locked(a) && locked(b))) continue;
      const passing = pass < 2 && a.direction !== b.direction && height > (a.h + b.h) * 1.5;
      const axis = passing || overlapY < overlapX ? 'y' : 'x';
      const push = (axis === 'x' ? overlapX : overlapY) * ((axis === 'x' ? dx : dy) < 0 ? -1 : 1);
      if (!locked(a)) a[axis] += push * (locked(b) ? 1 : .5);
      if (!locked(b)) b[axis] -= push * (locked(a) ? 1 : .5);
      clamp(a); clamp(b);
    }
  }
  function render() {
    states.forEach(s => { s.element.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${(s.tilt + s.bank).toFixed(2)}deg)`; });
  }
  function layout() {
    layoutFrame = 0;
    if (drag) finishDrag(true);
    const oldWidth = width, oldHeight = height;
    width = field.clientWidth; if (!width) return;
    const padding = 10, gap = width < 500 ? 9 : 20, envelope = width < 500 ? 6 : 10;
    const order = states.slice();
    const previous = new Map(states.map(s => [s, { x: s.x, y: s.y, w: s.w, h: s.h }]));
    order.forEach(s => { s.w = s.button.offsetWidth; s.h = s.button.offsetHeight; });
    order.sort((a, b) => b.w - a.w);
    const rows = [];
    order.forEach(s => {
      const cellWidth = s.w + envelope, cellHeight = s.h + 8;
      let row = rows.find(r => r.w + gap + cellWidth <= width - padding * 2);
      if (!row) { row = { items: [], w: 0, h: 0 }; rows.push(row); }
      if (row.items.length) row.w += gap;
      row.items.push(s); row.w += cellWidth; row.h = Math.max(row.h, cellHeight);
    });
    const sum = rows.reduce((n, r) => n + r.h, 0);
    const packedHeight = sum + gap * (rows.length - 1) + padding * 2;
    height = Math.ceil(Math.max(width < 500 ? 250 : 206, packedHeight * (width < 500 ? 1.3 : 1.15)));
    field.style.height = `${height}px`;
    let y = padding;
    const space = rows.length > 1 ? (height - padding * 2 - sum) / (rows.length - 1) : 0;
    rows.forEach(r => {
      let x = (width - r.w) / 2;
      r.items.forEach(s => {
        s.homeX = x + envelope / 2; s.homeY = y + (r.h - s.h) / 2;
        if (!oldWidth || !s.pinned) { s.x = s.homeX; s.y = s.homeY; if (!oldWidth) pinState(s, false); }
        else { const old = previous.get(s); s.x = old.x / Math.max(1, oldWidth - old.w) * (width - s.w); s.y = old.y / Math.max(1, oldHeight - old.h) * (height - s.h); }
        clamp(s); x += s.w + envelope + gap;
      });
      y += r.h + space;
    });
    separate();
    render(); sync();
  }
  function scheduleLayout() { if (!layoutFrame) layoutFrame = requestAnimationFrame(() => layout()); }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || !motionAllowed()) return;
    if (!last || now - last >= 32) {
      const dt = last ? Math.min(50, now - last) / 1000 : 0;
      last = now;
      swimTime += dt;
      const pace = width < 500 ? .65 : 1, ease = 1 - Math.exp(-dt * 2.5);
      states.forEach(s => {
        if (locked(s)) return;
        const right = Math.max(8, width - s.w - 8);
        const turn = Math.min(34, (right - 8) / 4);
        if (s.direction > 0 && s.x >= right - turn) s.direction = -1;
        else if (s.direction < 0 && s.x <= 8 + turn) s.direction = 1;
        const cruise = s.direction * s.speed * pace * (1 + .08 * Math.sin(swimTime * .7 + s.phase));
        const depth = Math.max(0, height - s.h - 24);
        const lane = 12 + depth * (.5 + .44 * Math.sin(swimTime * .18 + s.phase)) + Math.sin(swimTime * .6 + s.phase) * 5;
        let dodge = 0;
        states.forEach(other => {
          if (other === s || (other.direction === s.direction && !locked(other))) return;
          const ahead = (other.x + other.w / 2 - s.x - s.w / 2) * s.direction;
          const dy = s.y + s.h / 2 - other.y - other.h / 2, clearance = (s.h + other.h) / 2 + 18;
          if (ahead <= 0 || ahead > (s.w + other.w) / 2 + 36 || Math.abs(dy) >= clearance) return;
          const away = Math.abs(dy) > 1 ? Math.sign(dy) : (s.phase < other.phase ? -1 : 1);
          dodge += away * 26 * (1 - Math.abs(dy) / clearance);
        });
        const vertical = Math.max(-22, Math.min(22, (lane - s.y) * .8 + dodge));
        s.vx += (cruise - s.vx) * ease;
        s.vy += (vertical - s.vy) * ease;
        s.bank += (Math.max(-3, Math.min(3, s.vy * s.direction * .2)) - s.bank) * ease;
        s.x += s.vx * dt; s.y += s.vy * dt;
        clamp(s);
      });
      separate(); render();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (!motionAllowed()) states.forEach(s => s.button.classList.remove('is-settling'));
    if (visible && !document.hidden && motionAllowed()) frame = requestAnimationFrame(tick);
  }
  layout();
  const resize = new ResizeObserver(entries => { if (Math.abs(entries[0].contentRect.width - width) > 1) scheduleLayout(); }); resize.observe(field);
  const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }); visibility.observe(field);
  const themes = new MutationObserver(scheduleLayout); themes.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.fonts.ready.then(scheduleLayout); document.fonts.addEventListener('loadingdone', scheduleLayout);
  document.addEventListener('visibilitychange', () => { if (document.hidden && drag) finishDrag(true); sync(); });
  document.addEventListener('portfolio:motionchange', sync);
});
