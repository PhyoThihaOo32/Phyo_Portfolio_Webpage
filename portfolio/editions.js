// A progressive featured-story explorer. The full project list stays available.
document.addEventListener('DOMContentLoaded', () => {
  const host = document.getElementById('project-spotlight');
  const projects = (window.PORTFOLIO?.projects || []).filter(p => p.featured).slice(0, 3);
  if (!host || !projects.length || typeof projectAnimation !== 'function') return;
  const intro = document.createElement('div'); intro.className = 'spotlight-intro';
  const kicker = document.createElement('p'); kicker.className = 'section-kicker'; kicker.textContent = 'A closer look';
  const label = document.createElement('p'); label.textContent = 'Three ideas. Three different kinds of impact.';
  intro.append(kicker, label);
  const tabs = document.createElement('div'); tabs.className = 'story-tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Featured project stories');
  const panel = document.createElement('div'); panel.className = 'story-panel'; panel.id = 'featured-story-panel'; panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0;
  const visual = document.createElement('div'); visual.className = 'spotlight-visual'; visual.setAttribute('aria-hidden', 'true');
  const copy = document.createElement('div'); copy.className = 'story-copy';
  const number = document.createElement('span'); number.className = 'story-number'; number.setAttribute('aria-hidden', 'true');
  const category = document.createElement('p'); category.className = 'project-category';
  const title = document.createElement('h4'); title.id = 'featured-story-title';
  const body = document.createElement('p'); body.className = 'story-description';
  const focus = document.createElement('p'); focus.className = 'story-focus';
  const links = document.createElement('div'); links.className = 'story-links';
  copy.append(number, category, title, body, focus, links); panel.append(visual, copy);
  function activate(index) {
    const p = projects[index];
    for (const [i, button] of Array.from(tabs.children).entries()) {
      button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1;
    }
    panel.setAttribute('aria-labelledby', `story-tab-${index}`);
    visual.innerHTML = projectAnimation(p.repoName, 'spotlight');
    number.textContent = `0${index + 1}`;
    category.textContent = p.category || 'Selected project'; title.textContent = p.detail?.heading || p.name;
    body.textContent = p.detail?.build || p.summary;
    focus.textContent = p.detail?.focus || '';
    links.replaceChildren();
    for (const [key, text] of [['demo', 'Explore live demo ↗'], ['repo', 'View source ↗']]) {
      if (!p.links?.[key]) continue;
      const a = document.createElement('a'); a.href = p.links[key]; a.textContent = text;
      a.target = '_blank'; a.rel = 'noreferrer'; links.appendChild(a);
    }
  }
  projects.forEach((p, i) => {
    const tab = document.createElement('button'); tab.type = 'button'; tab.setAttribute('role', 'tab'); tab.id = `story-tab-${i}`;
    tab.setAttribute('aria-controls', panel.id);
    const ordinal = document.createElement('span'); ordinal.textContent = `0${i + 1}`; ordinal.setAttribute('aria-hidden', 'true');
    const name = document.createElement('span'); name.textContent = p.name;
    tab.append(ordinal, name); tab.addEventListener('click', () => activate(i));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % projects.length;
      if (event.key === 'ArrowLeft') next = (i - 1 + projects.length) % projects.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = projects.length - 1;
      if (next === undefined) return;
      event.preventDefault(); activate(next); tabs.children[next].focus();
    });
    tabs.appendChild(tab);
  });
  host.append(intro, tabs, panel); activate(0); host.hidden = false;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => visual.classList.toggle('motion-visible', entries[0].isIntersecting));
    observer.observe(visual);
  } else visual.classList.add('motion-visible');
});
