// Visitor preference complements the operating system's reduced-motion setting.
(() => {
  const button = document.getElementById('motion-toggle');
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch { }
  function apply() {
    const stopped = paused || reduced.matches;
    root.dataset.motion = stopped ? 'paused' : 'running';
    button.disabled = reduced.matches;
    button.setAttribute('aria-pressed', String(stopped));
    button.setAttribute('aria-label', reduced.matches ? 'Animations paused by your system preference' : (stopped ? 'Resume decorative animations' : 'Pause decorative animations'));
    button.title = button.getAttribute('aria-label');
    button.querySelector('span').textContent = stopped ? '▶' : 'Ⅱ';
    document.dispatchEvent(new Event('portfolio:motionchange'));
  }
  button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'running'); } catch { }
    apply();
  });
  reduced.addEventListener('change', apply);
  apply();
})();
