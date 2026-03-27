(function(){
  const data = window.PORTFOLIO || {};
  const THEMES = ['dark','light','cyber','space','burmese'];
  const THEME_LABELS = {
    dark:'Dark',
    light:'Light',
    cyber:'Cyber',
    space:'Space',
    burmese:'Burmese'
  };

  const $ = (sel, parent=document) => parent.querySelector(sel);
  const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

  function setText(id, text){ const el = document.getElementById(id); if(el) el.textContent = text; }

  function initTheme(){
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const preferred = THEMES.includes(stored) ? stored : (data.preferences && THEMES.includes(data.preferences.theme) ? data.preferences.theme : 'dark');
    root.setAttribute('data-theme', preferred);
    const btn = document.getElementById('theme-toggle');
    const icon = btn && btn.querySelector('.icon');
    const chooser = document.getElementById('theme-chooser');
    function iconFor(theme){
      return ({
        dark:'☾', light:'☼', cyber:'⚡', space:'✦'
      })[theme] || '◎';
    }
    function updateIcon(){ if(icon) icon.textContent = iconFor(root.getAttribute('data-theme')); }
    function updateThemeMetaColor(){
      const palette = {
        dark:'#0b0f14',
        light:'#f7f8fb',
        cyber:'#0c0b1a',
        space:'#070b17',
        burmese:'#23120b'
      };
      const m = document.querySelector('meta[name="theme-color"]');
      const theme = root.getAttribute('data-theme');
      if(m){ m.setAttribute('content', palette[theme] || palette.dark); }
    }
    updateIcon();
    updateThemeMetaColor();
    if(chooser){
      chooser.innerHTML = '';
      THEMES.forEach(t=>{
        const chip = document.createElement('button');
        chip.type='button';
        chip.className='theme-chip';
        chip.dataset.theme = t;
        chip.textContent = THEME_LABELS[t] || t;
        chip.title = `Switch to ${THEME_LABELS[t] || t} theme`;
        chip.addEventListener('click', ()=>{
          root.setAttribute('data-theme', t);
          localStorage.setItem('theme', t);
          updateIcon();
          updateThemeMetaColor();
          updateChooser();
          try{ renderDailyGallery(); }catch{}
        });
        chooser.appendChild(chip);
      });
      function updateChooser(){
        const current = root.getAttribute('data-theme');
        chooser.querySelectorAll('.theme-chip').forEach(ch=>{
          ch.classList.toggle('active', ch.dataset.theme === current);
        });
      }
      updateChooser();
    }
    btn && btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const idx = THEMES.indexOf(current);
      const next = THEMES[(idx + 1 + THEMES.length) % THEMES.length];
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateIcon();
      updateThemeMetaColor();
      try{ renderDailyGallery(); }catch{}
      if(chooser){
        chooser.querySelectorAll('.theme-chip').forEach(ch=>{
          ch.classList.toggle('active', ch.dataset.theme === next);
        });
      }
    });
  }

  function renderHeader(){
    setText('brand-name', data.profile?.name || 'Your Name');
    setText('brand-role', data.profile?.role || 'Your Role');
    setText('year', new Date().getFullYear());
    try{
      const fc = document.getElementById('footer-copy');
      if(fc && data.profile?.name){ fc.innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${escapeHtml(data.profile.name)}. All rights reserved.`; }
    }catch{}
    const heroTitle = document.getElementById('hero-title');
    if(heroTitle && data.profile?.name){
      heroTitle.innerHTML = `Hello, I’m <span class="accent">${escapeHtml(data.profile.name)}</span>.`;
    }
    const subtitle = document.getElementById('hero-subtitle');
    if(subtitle && data.profile?.summary){ subtitle.textContent = data.profile.summary; }

    const avatar = document.querySelector('.avatar');
    if(avatar && data.profile?.headshot){ avatar.src = data.profile.headshot; }

    const social = document.getElementById('social-links');
    const map = {
      github: svg('github'),
      linkedin: svg('linkedin'),
      x: svg('x'),
      instagram: svg('instagram'),
      mastodon: svg('mastodon'),
      devto: svg('devto'),
      youtube: svg('youtube')
    };
    if(social && data.profile?.social){
      Object.entries(data.profile.social).forEach(([k, url]) => {
        if(url){
          const a = document.createElement('a');
          a.href = url; a.target = '_blank'; a.rel='noreferrer noopener'; a.title = k;
          a.innerHTML = map[k] || '↗';
          social.appendChild(a);
        }
      });
    }
  }

  function renderAbout(){
    const container = document.getElementById('about-content');
    if(!container) return;
    container.innerHTML = '';

    const backgrounds = data.about?.background || [];
    const empty = document.createElement('div');
    const left = card('About me', empty); // no visible text; visual only
    addCodeRain(left, 'lg', backgrounds);
    const right = document.createElement('div');
    right.className = 'about-stack';
    const focusContent = document.createElement('div'); // keep body empty; visual carries the lines
    const focusCard = card('Focus', focusContent);
    addCodeRain(focusCard, 'sm', data.about?.focus || []);
    const highlightsContent = document.createElement('div'); // hide text, keep visual
    const highlightsCard = card('Highlights', highlightsContent);
    addCodeRain(highlightsCard, 'sm', data.about?.highlights || []);
    right.appendChild(focusCard);
    right.appendChild(highlightsCard);

    container.append(left, right);
  }

  function renderSkills(){
    const grid = document.getElementById('skills-content');
    if(!grid) return;
    grid.innerHTML='';
    (data.skills || []).forEach(group =>{
      const c = document.createElement('div');
      c.className = 'skill-card';
      const h = document.createElement('h4'); h.textContent = group.category; c.appendChild(h);
      const tagWrap = document.createElement('div'); tagWrap.className='skill-tags';
      (group.items||[]).forEach(item=>{
        const tag = document.createElement('span'); tag.className='tag';
        tag.innerHTML = `<span>${escapeHtml(item.label)}</span>`;
        const meter = document.createElement('span'); meter.className='meter';
        const fill = document.createElement('span'); fill.style.width = Math.max(5, Math.min(100, +item.level||0))+'%';
        meter.appendChild(fill); tag.appendChild(meter);
        tagWrap.appendChild(tag);
      });
      c.appendChild(tagWrap);
      grid.appendChild(c);
    });
  }

  function renderProjects(){
    const filtersEl = document.getElementById('project-filters');
    const searchEl = document.getElementById('project-search');
    const grid = document.getElementById('projects-grid');
    const projects = (data.projects || []).slice();

    const allTags = Array.from(new Set(projects.flatMap(p=>p.tags||[]))).sort();
    let activeTag = 'All';

    function apply(){
      const q = (searchEl.value||'').toLowerCase();
      grid.innerHTML='';
      const shown = projects
        .filter(p => activeTag==='All' || (p.tags||[]).includes(activeTag))
        .filter(p => !q || [p.name, p.summary, ...(p.tags||[])].join(' ').toLowerCase().includes(q))
      shown.forEach(p=> grid.appendChild(projectCard(p)));
      const countEl = document.getElementById('projects-count');
      if(countEl){
        if(window.__projectsLoading){ countEl.textContent = 'Loading…'; }
        else { countEl.textContent = `${shown.length} project${shown.length===1?'':'s'}`; }
      }

      // Re-bind reveal observer for dynamically added cards
      try{
        const obs = window.__revealObserver;
        if(obs){ $$('.reveal:not(.in)', grid).forEach(el=> obs.observe(el)); }
        else { $$('.reveal', grid).forEach(el=> el.classList.add('in')); }
      } catch {}
    }

    function makeFilter(tag){
      const btn = document.createElement('button');
      btn.className = 'btn ghost';
      btn.textContent = tag; btn.setAttribute('aria-pressed', tag===activeTag);
      btn.addEventListener('click', ()=>{ activeTag = tag; $$('.filters button', filtersEl).forEach(b=>b.setAttribute('aria-pressed', b.textContent===tag)); apply(); });
      return btn;
    }

    if(filtersEl){
      filtersEl.innerHTML='';
      filtersEl.appendChild(makeFilter('All'));
      allTags.forEach(t=> filtersEl.appendChild(makeFilter(t)));
    }
    searchEl && searchEl.addEventListener('input', apply);

    apply();
  }

  function renderPassions(){
    const listEl = document.getElementById('passions-list');
    if(!listEl) return;
    listEl.innerHTML='';
    (data.passions||[]).forEach((p, idx)=>{
      const li = document.createElement('li');
      li.className='pill glow';
      li.textContent = p;
      li.style.setProperty('--hue', (idx * 27 % 360) + 'deg');
      li.title = p;
      listEl.appendChild(li);
    });
  }

  function renderTimeline(){
    const list = document.getElementById('timeline-list');
    if(!list) return; list.innerHTML='';

    const items = [];
    (data.experience||[]).forEach(e=> items.push({
      type:'work',
      title:`${e.role} · ${e.company}`,
      start:e.start, end:e.end, location:e.location,
      summary:e.summary, highlights:e.highlights
    }));
    (data.education||[]).forEach(ed=> items.push({
      type:'edu',
      title:`${ed.degree} · ${ed.school}`,
      start:ed.start, end:ed.end, location:ed.location,
      gpa: ed.gpa, summary:'', highlights:[]
    }));

    items.forEach(it=>{
      const li = document.createElement('li');
      const card = document.createElement('div'); card.className='item';

      // Header with icon + title
      const header = document.createElement('div'); header.className='tl-header';
      const icn = document.createElement('span'); icn.className='tl-icn'; icn.innerHTML = it.type==='edu' ? svg('hat') : svg('briefcase');
      const title = document.createElement('div'); title.className='tl-title';
      const strong = document.createElement('strong'); strong.textContent = it.title;
      title.appendChild(strong);

      const badges = document.createElement('div'); badges.className='tl-badges';
      if(it.gpa){ const b=document.createElement('span'); b.className='badge'; b.textContent = `GPA ${it.gpa}`; badges.appendChild(b); }
      header.append(icn, title, badges);

      // When + location
      const when = document.createElement('div'); when.className='when';
      const dur = humanDuration(it.start, it.end);
      when.textContent = `${it.start || ''} — ${it.end || ''}${dur ? ' • ' + dur : ''}`.trim();

      const loc = document.createElement('div'); loc.className='location muted';
      if(it.location){ loc.innerHTML = `${svg('pin')}<span>${escapeHtml(it.location)}</span>`; }

      const sum = document.createElement('p'); sum.textContent = it.summary || '';
      const ul = document.createElement('ul'); (it.highlights||[]).forEach(h=>{ const li=document.createElement('li'); li.textContent = h; ul.appendChild(li); });

      card.append(header, when, loc, sum, ul); li.appendChild(card); list.appendChild(li);
    });
  }

  function renderContact(){
    const email = data.profile?.email || 'you@example.com';
    const contactCfg = data.contact || {};
    const web = data.profile?.website || '#';
    const loc = data.profile?.location || 'City, Country';
    const resume = data.profile?.resume || 'assets/resume.pdf';

    const emailEl = document.getElementById('contact-email'); if(emailEl){ emailEl.textContent=email; emailEl.href = `mailto:${email}`; }
    const locEl = document.getElementById('contact-location'); if(locEl){ locEl.textContent = loc; }
    const webEl = document.getElementById('contact-website'); if(webEl){ webEl.textContent = web.replace(/^https?:\/\//,''); webEl.href = web; }
    const instaEl = document.getElementById('contact-instagram');
    if(instaEl && data.profile?.instagram){ instaEl.href = data.profile.instagram; instaEl.textContent = '@' + data.profile.instagram.replace(/^.*\//,''); }
    const discEl = document.getElementById('contact-discord');
    if(discEl && data.profile?.discord){ discEl.textContent = data.profile.discord; discEl.href = `https://discordapp.com/users/${encodeURIComponent(data.profile.discord)}`; }
    const resEl = document.getElementById('download-resume'); if(resEl){ resEl.href = resume; }
    const formEl = document.querySelector('.contact-card');
    if(formEl){
      formEl.removeAttribute('action');
      formEl.noValidate = true;
      const submitBtn = formEl.querySelector('button[type="submit"]');
      let status = formEl.querySelector('.form-status');
      if(!status){
        status = document.createElement('div');
        status.className = 'form-status muted';
        status.setAttribute('aria-live', 'polite');
        formEl.appendChild(status);
      }
      formEl.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const nameEl = formEl.querySelector('input[name="name"]');
        const emailInput = formEl.querySelector('input[name="email"]');
        const messageEl = formEl.querySelector('textarea[name="message"]');
        const honeyEl = formEl.querySelector('input[name="_honey"]');
        const name = nameEl?.value.trim() || '';
        const from = emailInput?.value.trim() || '';
        const msg = messageEl?.value.trim() || '';
        const inputs = formEl.querySelectorAll('input:not(.hp-field), textarea');
        inputs.forEach(el=> el.classList.remove('invalid'));
        status.classList.remove('error', 'success');
        if(!name || !from || !msg){
          status.textContent = 'Please add your name, email, and a message.';
          status.classList.add('error');
          inputs.forEach(el=>{ if(!el.value.trim()) el.classList.add('invalid'); });
          return;
        }
        if(!contactCfg.endpoint){
          status.textContent = 'Contact form is not configured yet.';
          status.classList.add('error');
          return;
        }
        if(honeyEl && honeyEl.value.trim()){
          // Honeypot filled; treat as success without sending
          formEl.reset();
          status.textContent = 'Message sent successfully.';
          status.classList.add('success');
          return;
        }
        submitBtn && (submitBtn.disabled = true);
        if(submitBtn){ submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = 'Sending...'; }
        status.textContent = 'Sending your message...';

        try{
          const response = await fetch(contactCfg.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name,
              email: from,
              message: msg,
              _subject: `${contactCfg.subjectPrefix || 'Portfolio message'} from ${name}`,
              _replyto: from,
              _captcha: 'false',
              _honey: honeyEl?.value || ''
            })
          });

          const result = await response.json().catch(()=> ({}));
          if(!response.ok || result.success === false || result.success === 'false'){
            throw new Error(result.message || 'Submission failed.');
          }

          formEl.reset();
          status.textContent = 'Message sent successfully.';
          status.classList.add('success');
        } catch(err){
          status.textContent = 'Message could not be sent right now. Please try again later.';
          status.classList.add('error');
        } finally {
          submitBtn && (submitBtn.disabled = false);
          if(submitBtn){ submitBtn.textContent = submitBtn.dataset.label || 'Send'; }
        }
      });
    }

    const copyBtn = document.getElementById('copy-email');
    copyBtn && copyBtn.addEventListener('click', async ()=>{
      try { await navigator.clipboard.writeText(email); copyBtn.textContent = '✓'; setTimeout(()=>copyBtn.textContent='⧉', 1200);} catch {}
    });

    const vbtn = document.getElementById('download-vcard');
    vbtn && vbtn.addEventListener('click', ()=>{
      const vcf = [
        'BEGIN:VCARD', 'VERSION:3.0',
        `FN:${data.profile?.name||'Your Name'}`,
        `EMAIL;TYPE=INTERNET:${email}`,
        data.profile?.phone ? `TEL;TYPE=CELL:${data.profile.phone}` : null,
        data.profile?.website ? `URL:${data.profile.website}` : null,
        `NOTE:${data.profile?.role||''}`,
        'END:VCARD' ].filter(Boolean).join('\n');
      const blob = new Blob([vcf], {type:'text/vcard'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'contact.vcf'; a.click(); setTimeout(()=> URL.revokeObjectURL(url), 1500);
    });
  }

  function projectCard(p){
    const card = document.createElement('article'); card.className='project-card reveal';
    const thumb = document.createElement('div'); thumb.className='thumb';
    const imgUrl = p.image || abstractThumb(p.name, (p.tags||[])[0]);
    if(imgUrl){ const img = new Image(); img.alt = p.name; img.src = imgUrl; img.loading='lazy'; img.decoding='async'; img.style.borderRadius = '.6rem'; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover'; thumb.appendChild(img); }

    const title = document.createElement('h4'); title.textContent = humanizeRepoName(p.name || '');
    const meta = document.createElement('div'); meta.className='meta';
    const left = document.createElement('span'); left.className='muted'; left.textContent = `${p.year || ''}${(p.tags||[]).length ? ' · ' : ''}${(p.tags||[]).join(' • ')}`;
    meta.appendChild(left);
    if(typeof p.stars === 'number' && p.stars > 0){
      const star = document.createElement('span'); star.className='star'; star.innerHTML = svg('star') + String(p.stars);
      meta.appendChild(star);
    }
    const sum = document.createElement('p'); sum.textContent = p.summary || '';
    const chips = document.createElement('div'); chips.className='chips';
    (p.tags||[]).slice(0,4).forEach(t=>{ const c=document.createElement('span'); c.className='chip'; c.textContent=t; chips.appendChild(c); });
    const links = document.createElement('div'); links.className='links';
    if(p.links?.demo){ const a=document.createElement('a'); a.className='btn'; a.href=p.links.demo; a.target='_blank'; a.rel='noreferrer'; a.textContent='Demo'; links.appendChild(a); }
    if(p.links?.repo){ const a=document.createElement('a'); a.className='btn ghost'; a.href=p.links.repo; a.target='_blank'; a.rel='noreferrer'; a.textContent='Code'; links.appendChild(a); }
    card.append(thumb, title, meta, sum, chips, links);
    return card;
  }

  function card(title, content){
    const c = document.createElement('section'); c.className='about-card';
    const h = document.createElement('h4'); h.textContent = title; c.appendChild(h);
    c.appendChild(content);
    return c;
  }

  function addCodeRain(cardEl, size='md', lines=[]){
    if(!cardEl || !lines.length) return;
    const rows = [...lines];
    const wrap = document.createElement('div');
    wrap.className = 'about-visual';
    if(document.documentElement.getAttribute('data-theme') === 'space'){ wrap.classList.add('space-bg'); }
    wrap.dataset.size = size;
    rows.forEach((txt, idx)=>{
      const span = document.createElement('span');
      span.textContent = txt;
      span.style.setProperty('--i', idx);
      wrap.appendChild(span);
    });
    cardEl.appendChild(wrap);
  }

  function list(items){
    const ul = document.createElement('ul');
    items.forEach((i, idx)=>{
      const li=document.createElement('li');
      li.textContent=i;
      li.classList.add('type-line');
      li.style.setProperty('--delay', `${idx * 0.12}s`);
      ul.appendChild(li);
    });
    return ul;
  }

  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s])); }

  function revealOnScroll(){
    const obs = new IntersectionObserver((entries)=>{
      for(const e of entries){ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } }
    }, {threshold: .12});
    $$('.reveal').forEach(el=> obs.observe(el));
    try { window.__revealObserver = obs; } catch {}
  }

  function scrollSpy(){
    const sections = ['about','skills','projects','passions','timeline','contact'];
    const navLinks = sections.map(id=> ({id, el: document.querySelector(`.top-nav a[href="#${id}"]`)}));
    const spy = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const id = e.target.id;
          navLinks.forEach(n=>{
            if(!n?.el) return;
            const active = n.id===id;
            n.el.classList.toggle('active', active);
            if(active) n.el.setAttribute('aria-current','page'); else n.el.removeAttribute('aria-current');
          });
        }
      });
    }, {rootMargin: '-40% 0px -50% 0px', threshold: 0});
    sections.forEach(id=>{ const el = document.getElementById(id); if(el) spy.observe(el); });
  }

  function injectJsonLd(){
    if(!data.profile?.name) return;
    const ld = {
      '@context':'https://schema.org', '@type':'Person',
      name: data.profile.name,
      jobTitle: data.profile.role,
      url: data.profile.website,
      email: data.profile.email,
      image: data.profile.headshot,
      sameAs: Object.values(data.profile.social||{}).filter(Boolean)
    };
    const s = document.createElement('script'); s.type='application/ld+json'; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderHeader();
    renderAbout();
    renderSkills();
    renderProjects();
    renderPassions();
    renderRadio();
    renderDailyGallery();
    renderTimeline();
    renderContact();
    revealOnScroll();
    scrollSpy();
    injectJsonLd();

    // Expose minimal API for enhancement hooks before we import
    try { window.__portfolioAPI = { rerenderProjects: renderProjects }; } catch {}
    // Progressive enhancement: auto-hydrate from GitHub if profile link exists
    try { enhanceFromGitHub(); } catch {}
    try { ensureProjectsHydrated(); } catch {}

    // Keyboard shortcuts
    try {
      document.addEventListener('keydown', (e) => {
        const tag = (e.target && (e.target.tagName||'')).toLowerCase();
        const isTyping = tag === 'input' || tag === 'textarea';
        if(e.key === '/' && !isTyping){ e.preventDefault(); const s=document.getElementById('project-search'); if(s){ s.focus(); s.select?.(); }}
        if((e.key === 't' || e.key === 'T') && !isTyping){ e.preventDefault(); document.getElementById('theme-toggle')?.click(); }
      });
    } catch {}

    // Scroll-to-top
    try {
      const fab = document.getElementById('scroll-top');
      const rootObs = new IntersectionObserver((entries)=>{
        for(const ent of entries){
          if(!fab) return;
          if(ent.isIntersecting){ fab.classList.remove('show'); }
          else { fab.classList.add('show'); }
        }
      }, {rootMargin: '-10% 0px 0px 0px'});
      const hero = document.getElementById('hero'); if(hero) rootObs.observe(hero);
      fab && fab.addEventListener('click', ()=> window.scrollTo({top:0, behavior: 'smooth'}));
    } catch {}

    // PWA: register service worker (best-effort)
    try {
      if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }
    } catch {}
  });
})();

function svg(name){
  const icons = {
    briefcase: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 6V5a2 2 0 0 0-2-2h-0a2 2 0 0 0-2 2v1H5a2 2 0 0 0-2 2v3h18V8a2 2 0 0 0-2-2h-5zm-2-1a1 1 0 0 1 1 1v1h-2V6a1 1 0 0 1 1-1z"/><path d="M21 12H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6zM9 14h6v2H9v-2z"/></svg>',
    hat: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M4 12v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5l-8 4.36L4 12z"/></svg>',
    pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.25l-7.19-.61L12 2 9.19 8.64 2 9.25l5.46 4.72L5.82 21z"/></svg>',
    github: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.84 1.32 3.53 1 .11-.78.42-1.32.76-1.62-2.66-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.4 1.25-3.25-.13-.31-.54-1.56.12-3.26 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6 0c2.28-1.56 3.29-1.24 3.29-1.24.66 1.7.25 2.95.12 3.26.78.85 1.25 1.93 1.25 3.25 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .5z"/></svg>',
    linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.82-2.1 3.75-2.1 4.01 0 4.75 2.64 4.75 6.08V24h-4v-6.92c0-1.65-.03-3.78-2.3-3.78-2.3 0-2.65 1.79-2.65 3.66V24h-4V8.5z"/></svg>',
    x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.1 8.1L23.5 22h-6.9l-5.4-6.3L5.2 22H2l7.6-8.7L.8 2h7l4.9 5.6L18.9 2zm-1.2 18h2.1L8.5 4H6.3l11.4 16z"/></svg>',
    instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm9 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>',
    mastodon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.43 10.45c0-4.74-3.11-6.14-3.11-6.14C16.8 3.35 12.2 3 12.2 3h-.4s-4.6.35-6.12 1.31c0 0-3.11 1.4-3.11 6.14 0 5.63-.33 12.8 7.9 12.55h.7c8.23.25 7.9-6.92 7.9-12.55zm-4.4 6.62h-2.02V12.4c0-1.52-.63-2.29-1.9-2.29-1.4 0-2.11.9-2.11 2.69v4.27H8.98V10.2h1.91v1.09h.04c.27-.49 1.27-1.34 2.63-1.34 1.79 0 3.47 1.05 3.47 3.82v3.3z"/></svg>',
    devto: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 8.1v7.8H5.9c-.4 0-.7-.3-.7-.7V8.8c0-.4.3-.7.7-.7h1.6zM22 7.5v9c0 .8-.7 1.5-1.5 1.5h-17C2.7 18 2 17.3 2 16.5v-9C2 6.7 2.7 6 3.5 6h17c.8 0 1.5.7 1.5 1.5zM9.1 8.1H11c.8 0 1.5.7 1.5 1.5v4.8c0 .8-.7 1.5-1.5 1.5H9.1V8.1zm6.4 0c1 0 1.9.8 1.9 1.9v4c0 1-.8 1.9-1.9 1.9h-1.4V8.1h1.4z"/></svg>',
    youtube: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 7.2s-.2-1.6-.8-2.4c-.8-.8-1.6-.8-2-0.9C17.7 3.5 12 3.5 12 3.5h0s-5.7 0-8.7.4c-.4.1-1.2.1-2 .9-.6.8-.8 2.4-.8 2.4S0 9.1 0 11v2c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.4c.8.8 1.8.8 2.3.9 1.7.2 7.2.4 7.2.4s5.7 0 8.7-.4c.4-.1 1.2-.1 2-.9.6-.8.8-2.4.8-2.4S24 12.9 24 11V9c0-1.9-.5-3.8-.5-3.8zM9.5 14.8V8.7l6.2 3-6.2 3.1z"/></svg>'
  };
  return icons[name] || '';
}

function humanizeRepoName(name){
  if(!name) return '';
  // Keep overrides like C++ intact if present in display text elsewhere
  const s = name.replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  return s.split(' ').map(w=> w.length>2 ? w[0].toUpperCase()+w.slice(1) : w.toUpperCase()).join(' ');
}

function abstractThumb(seed, subtitle){
  const colors = [
    ['#7C3AED','#10B981'],
    ['#0EA5E9','#7C3AED'],
    ['#22D3EE','#6366F1'],
    ['#F472B6','#7C3AED'],
    ['#14B8A6','#84CC16']
  ];
  const i = Math.abs(hash(seed)) % colors.length;
  const [c1,c2] = colors[i];
  const text = escapeHtml((seed||'').slice(0,3).toUpperCase());
  const svg = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="640" height="360" fill="#0b0f14"/><circle cx="520" cy="300" r="180" fill="url(#g)" opacity="0.22"/><circle cx="140" cy="80" r="120" fill="url(#g)" opacity="0.16"/><rect x="24" y="24" width="592" height="312" rx="18" fill="url(#g)" opacity="0.10"/><text x="40" y="70" fill="#e6edf3" font-family="Inter, system-ui" font-size="28" font-weight="700">${text}</text><text x="40" y="100" fill="#96a2b3" font-family="Inter, system-ui" font-size="14">${escapeHtml(subtitle||'')}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function hash(str){
  let h=0; for(let i=0;i<str.length;i++){ h=(h<<5)-h + str.charCodeAt(i); h|=0; }
  return h;
}

// --- Progressive enhancement: GitHub auto-import ---------------------------
async function enhanceFromGitHub(){
  const data = window.PORTFOLIO || {};
  const gh = data.profile?.social?.github || data.profile?.website || '';
  const username = parseGithubUsername(gh);
  if(!username) return;
  try{ window.__projectsLoading = true; }catch{}

  const headers = { 'Accept':'application/vnd.github+json' };
  try{
    const t = (window.PORTFOLIO && window.PORTFOLIO.integrations && window.PORTFOLIO.integrations.githubToken) || '';
    if(t){ headers['Authorization'] = `Bearer ${t}`; }
  }catch{}
  const apiBase = `https://api.github.com/users/${encodeURIComponent(username)}`;

  // Fetch user for location/bio (best-effort)
  try {
    const ures = await fetch(apiBase, { headers });
    if(ures.ok){
      const u = await ures.json();
      if(u?.location && (!data.profile.location || data.profile.location === '')){
        data.profile.location = u.location;
        const locEl = document.getElementById('contact-location');
        if(locEl) locEl.textContent = u.location;
      }
      if(u?.bio && (!data.profile.summary || data.profile.summary.includes('I design and ship'))){
        // Use GitHub bio only if summary is default-ish
        const subtitle = document.getElementById('hero-subtitle');
        data.profile.summary = u.bio;
        if(subtitle) subtitle.textContent = u.bio;
      }
    }
  } catch {}

  // Fetch repositories and populate projects
  try {
    const rres = await fetch(`${apiBase}/repos?per_page=100&sort=updated`, { headers });
    if(!rres.ok) return;
    const repos = (await rres.json()) || [];
    const filtered = repos.filter(r => !r.fork && !r.archived);
    filtered.sort((a,b) => (b.stargazers_count||0) - (a.stargazers_count||0));
    const top = filtered.slice(0, 12).map(r => ({
      name: r.name,
      year: (r.created_at ? new Date(r.created_at).getFullYear() : ''),
      summary: r.description || '',
      tags: [r.language].filter(Boolean),
      links: { demo: r.homepage || '', repo: r.html_url },
      image: '',
      featured: false,
      stars: r.stargazers_count || 0
    }));

    // Augment with top languages (best-effort)
    for (let i = 0; i < top.length; i++){
      const repo = filtered[i];
      if(!repo || !repo.languages_url) continue;
      try{
        const lres = await fetch(repo.languages_url, { headers });
        if(lres.ok){
          const langs = await lres.json();
          const pairs = Object.entries(langs).sort((a,b)=> b[1]-a[1]).slice(0,2).map(([k])=>k);
          const uniq = Array.from(new Set([...(top[i].tags||[]), ...pairs].filter(Boolean)));
          top[i].tags = uniq;
        }
      }catch{}
    }

    // Apply overrides from content.js if provided
    const overrides = (window.PORTFOLIO && window.PORTFOLIO.projectOverrides) || {};
    for (const p of top){
      const ov = overrides[p.name];
      if(ov){ Object.assign(p, ov); }
    }

    // Merge: keep any existing explicit featured projects at the top (after overrides)
    const current = Array.isArray(data.projects) ? data.projects.filter(p => p.featured) : [];
    data.projects = [...current, ...top];
    const grid = document.getElementById('projects-grid'); if(grid){ grid.innerHTML=''; }
    const filters = document.getElementById('project-filters'); if(filters){ filters.innerHTML=''; }
    const search = document.getElementById('project-search'); if(search){ search.value=''; }
    // Re-render with new data
    if(typeof window !== 'undefined' && window.__portfolioAPI && typeof window.__portfolioAPI.rerenderProjects === 'function'){
      window.__portfolioAPI.rerenderProjects();
    }
  } catch {}
  finally { try{ window.__projectsLoading = false; }catch{} }
}

function parseGithubUsername(url){
  try{
    if(!url) return '';
    // Accept forms: https://github.com/user, http://github.com/user/, github.com/user
    const u = new URL(url.includes('http') ? url : `https://${url}`);
    if(!u.hostname.includes('github.com')) return '';
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[0] || '';
  }catch{ return ''; }
}

function ensureProjectsHydrated(){
  // If after a short delay there are no cards, fall back to overrides
  setTimeout(async () => {
    const grid = document.getElementById('projects-grid');
    if(!grid) return;
    const hasCards = grid.children.length > 0;
    if(hasCards) return;
    const data = window.PORTFOLIO || {};
    const overrides = data.projectOverrides || {};
    const gh = data.profile?.social?.github || data.profile?.website || '';
    const username = parseGithubUsername(gh) || 'PhyoThihaOo32';
    const keys = Object.keys(overrides);
    if(!keys.length) return;
    const fallback = keys.map(k => ({
      name: overrides[k].name || k,
      year: '',
      summary: overrides[k].summary || '',
      tags: overrides[k].tags || [],
      links: { demo: overrides[k].demo || '', repo: `https://github.com/${username}/${k}` },
      image: overrides[k].image || '',
      featured: !!overrides[k].featured,
      stars: 0
    }));
    if(fallback.length){
      data.projects = fallback;
      if(window.__portfolioAPI && typeof window.__portfolioAPI.rerenderProjects==='function'){
        window.__portfolioAPI.rerenderProjects();
      }
    }
  }, 1800);
}

// --- Radio (Apple Music embed) ---------------------------------------------
function renderRadio(){
  const data = window.PORTFOLIO || {};
  const wrap = document.getElementById('radio-embed');
  if(!wrap) return;
  wrap.innerHTML = '';

  // If an external radio URL is provided, embed it directly
  const ext = (data.music && data.music.externalEmbedUrl) || '';
  if(ext){
    const iframe = document.createElement('iframe');
    iframe.src = ext;
    iframe.title = 'Lofi Radio';
    iframe.style.width = '100%';
    iframe.style.height = '420px';
    iframe.style.border = '0';
    iframe.allow = 'autoplay *; encrypted-media *; fullscreen *; clipboard-write';
    // No sandbox to avoid blocking audio on some stations
    wrap.appendChild(iframe);

    const tools = document.createElement('div'); tools.className='row'; tools.style.marginTop = '.6rem';
    const openLink = document.createElement('a'); openLink.className='btn'; openLink.textContent='Open lofi.cafe ↗'; openLink.href = ext; openLink.target='_blank'; openLink.rel='noreferrer';
    tools.append(openLink); wrap.appendChild(tools);
    return;
  }

  // From content.js or localStorage (Apple only)
  const stored = localStorage.getItem('applePlaylistUrl');
  let url = (data.music && data.music.applePlaylistUrl) || stored || '';

  if(!url){
    const box = document.createElement('div');
    box.className = 'muted';
    box.innerHTML = `
      <p>Paste your Apple Music playlist URL and press Save — or use a Lofi preset.</p>
      <div class="row">
        <input id="apple-url" type="url" placeholder="https://music.apple.com/..." style="flex:1; min-width:220px" />
        <button id="apple-save" class="btn">Save</button>
        <button id="apple-lofi" class="btn ghost">Use Lofi</button>
      </div>
      <div class="row" id="apple-presets"></div>`;
    wrap.appendChild(box);
    const save = document.getElementById('apple-save');
    save?.addEventListener('click', ()=>{
      const v = document.getElementById('apple-url').value.trim();
      if(v){ localStorage.setItem('applePlaylistUrl', v); (data.music ||= {}).applePlaylistUrl = v; renderRadio(); }
    });
    document.getElementById('apple-lofi')?.addEventListener('click', ()=>{
      const lofi = (data.music && data.music.defaultLofi) || '';
      if(lofi){ localStorage.setItem('applePlaylistUrl', lofi); (data.music ||= {}).applePlaylistUrl = lofi; renderRadio(); }
    });
    try{
      const presets = (data.music && data.music.presets) || [];
      const row = document.getElementById('apple-presets');
      presets.forEach(p=>{
        const b = document.createElement('button'); b.className='btn ghost'; b.textContent = p.label; b.addEventListener('click', ()=>{ localStorage.setItem('applePlaylistUrl', p.url); (data.music ||= {}).applePlaylistUrl = p.url; renderRadio(); }); row.appendChild(b);
      });
    }catch{}
    return;
  }

  // Build embed src
  // Apple links look like: https://music.apple.com/us/playlist/...; embed domain is https://embed.music.apple.com
  try{
    const u = new URL(url);
    const country = u.pathname.split('/')[1] || (data.music?.country || 'us');
    const embed = new URL(url.replace('://music.apple.com', '://embed.music.apple.com'));
    const iframe = document.createElement('iframe');
    iframe.allow = 'autoplay *; encrypted-media *; fullscreen *; clipboard-write';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('height', '360');
    iframe.style.width = '100%';
    iframe.style.maxWidth = '100%';
    iframe.style.overflow = 'hidden';
    iframe.style.background = 'transparent';
    iframe.sandbox = 'allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation';
    iframe.src = embed.toString();
    wrap.appendChild(iframe);

    // Controls row: Change / Lofi / Clear
    const tools = document.createElement('div'); tools.className='row'; tools.style.marginTop = '.6rem';
    const changeBtn = document.createElement('button'); changeBtn.className='btn ghost'; changeBtn.textContent='Change playlist';
    const lofiBtn = document.createElement('button'); lofiBtn.className='btn ghost'; lofiBtn.textContent='Use Lofi';
    const clearBtn = document.createElement('button'); clearBtn.className='btn ghost'; clearBtn.textContent='Clear';
    const openLink = document.createElement('a'); openLink.className='btn'; openLink.textContent='Open in Apple Music ↗'; openLink.href = url; openLink.target='_blank'; openLink.rel='noreferrer';
    tools.append(changeBtn, lofiBtn, clearBtn, openLink); wrap.appendChild(tools);
    changeBtn.addEventListener('click', ()=>{ localStorage.removeItem('applePlaylistUrl'); (data.music ||= {}).applePlaylistUrl=''; renderRadio(); });
    lofiBtn.addEventListener('click', ()=>{ const l=(data.music && data.music.defaultLofi)||''; if(l){ localStorage.setItem('applePlaylistUrl', l); (data.music ||= {}).applePlaylistUrl=l; renderRadio(); }});
    clearBtn.addEventListener('click', ()=>{ localStorage.removeItem('applePlaylistUrl'); (data.music ||= {}).applePlaylistUrl=''; renderRadio(); });
  } catch {
    const err = document.createElement('p'); err.className='muted'; err.textContent = 'Invalid Apple Music URL.'; wrap.appendChild(err);
  }

  // Render the gallery side
  try { renderDailyGallery(); } catch {}
}

async function renderDailyGallery(){
  try { if(window.__gallerySource === 'masters') return; } catch {}
  const data = window.PORTFOLIO || {};
  const items = data.gallery || [];
  const artEl = document.getElementById('gallery-art');
  const titleEl = document.getElementById('gallery-title');
  const bylineEl = document.getElementById('gallery-byline');
  const descEl = document.getElementById('gallery-desc');
  if(!artEl || !titleEl || !bylineEl) return;

  // First, try local bundled masters if present (multiple fallbacks for paths)
  const manifestCandidates = [
    'assets/art/masters/masters.json?v=6',
    '/portfolio/assets/art/masters/masters.json?v=6'
  ];
  for(const m of manifestCandidates){
    try{
      const manifestUrl = new URL(m, location.href).toString();
      const res = await fetch(manifestUrl, {cache:'no-store'});
      if(res.ok){
        const masters = await res.json();
        if(Array.isArray(masters) && masters.length){
          renderLocalDaily(masters, artEl, titleEl, bylineEl, descEl);
          try { window.__gallerySource = 'masters'; } catch {}
          bindKenBurns();
          return;
        }
      }
    }catch{}
  }
  
  const theme = document.documentElement.getAttribute('data-theme');
  if(theme === 'burmese'){
    try{
      const manifestUrl = new URL('assets/art/burmese/manifest.json?v=1', location.href).toString();
      const res = await fetch(manifestUrl, {cache:'no-store'});
      if(res.ok){
        const imgs = await res.json();
        if(Array.isArray(imgs) && imgs.length){
          renderLocalDaily(imgs, artEl, titleEl, bylineEl, descEl);
          try{ window.__gallerySource = 'burmese'; }catch{}
          bindKenBurns();
          return;
        }
      }
    }catch{}
  }
  if(theme === 'cyber'){
    try{
      const manifestUrl = new URL('assets/art/cyber/manifest.json?v=5', location.href).toString();
      const res = await fetch(manifestUrl, {cache:'no-store'});
      if(res.ok){
        const imgs = await res.json();
        if(Array.isArray(imgs) && imgs.length){
          renderLocalDaily(imgs, artEl, titleEl, bylineEl, descEl);
          try{ window.__gallerySource = 'cyber'; }catch{}
          bindKenBurns();
          return;
        }
      }
    }catch{}
  }

  if(data.remoteGallery?.enabled !== false && data.remoteGallery?.source === 'met'){
    await renderMetDaily(items, artEl, titleEl, bylineEl).then(()=>{ try{ window.__gallerySource = 'met'; }catch{}; }).catch(()=>{
      renderLocalDaily(items.length?items:[], artEl, titleEl, bylineEl);
      try{ window.__gallerySource = 'local'; }catch{}
    });
  } else {
    renderLocalDaily(items, artEl, titleEl, bylineEl, descEl);
    try{ window.__gallerySource = 'local'; }catch{}
  }
  bindKenBurns();
}

  function renderLocalDaily(items, artEl, titleEl, bylineEl, descEl){
    const today = new Date();
    const day = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(today.getFullYear(),0,0)) / 86400000);
    let idx = Number(sessionStorage.getItem('galleryIndex'));
    if(!Number.isInteger(idx)) idx = items.length ? day % items.length : 0;
    let attempts = 0;
    function apply(){
      if(attempts > items.length + 2){ showSpinner(artEl, false); return; }
      const it = items.length ? items[((idx%items.length)+items.length)%items.length] : null;
      if(!it || !it.image){ return; }
      const img = document.getElementById('gallery-img');
      if(img){
        showSpinner(artEl, true);
        setGalleryImage(img, it.image);
        img.alt = `${it.title||'Artwork'} — ${it.artist||''}`.trim();
        img.classList.add('kenburns');
        img.onload = ()=>{ trySetAccentFromImage(img); showSpinner(artEl, false); attempts=0; };
        img.onerror = ()=>{ attempts++; idx++; apply(); };
      }
      else { artEl.style.backgroundImage = `url(${it.image})`; }
      if(it.title){ titleEl.textContent = it.title; }
      if(it.artist || it.year){ bylineEl.textContent = [it.artist,it.year].filter(Boolean).join(' · '); }
      if(descEl){ descEl.textContent = it.desc || 'Public‑domain artwork, courtesy of The Met.'; }
      sessionStorage.setItem('galleryIndex', idx);
    }
  apply();
  document.getElementById('gallery-prev')?.addEventListener('click', ()=>{ idx--; apply(); });
  document.getElementById('gallery-next')?.addEventListener('click', ()=>{ idx++; apply(); });
}

async function renderMetDaily(fallbackItems, artEl, titleEl, bylineEl){
  const storeKey = `dailyArt-${new Date().toISOString().slice(0,10)}`;
  try{
    const cached = localStorage.getItem(storeKey);
    if(cached){
      const it = JSON.parse(cached);
      if(it?.image){ apply(it); bindNav(loadByOffset); return; }
    }
  }catch{}

  const ids = await getMetIds();
  if(!ids || !ids.length) throw new Error('No MET ids');
  const baseIdx = dayOfYear() % ids.length;
  const it = await getMetObject(ids[baseIdx]);
  apply(it); bindNav(loadByOffset);
  try{ localStorage.setItem(storeKey, JSON.stringify(it)); }catch{}

  async function loadByOffset(delta){
    const i = ((baseIdx + delta) % ids.length + ids.length) % ids.length;
    const item = await getMetObject(ids[i]);
    apply(item);
  }

  function apply(obj){
    const img = document.getElementById('gallery-img');
    if(img){
      showSpinner(artEl, true);
      setGalleryImage(img, obj.image);
      img.alt = `${obj.title||'Artwork'} — ${obj.artist||''}`.trim();
      img.classList.add('kenburns');
      img.onload = ()=>{ trySetAccentFromImage(img); showSpinner(artEl, false); };
      img.onerror = ()=>{ showSpinner(artEl, false); img.removeAttribute('src'); };
    }
    else { artEl.style.backgroundImage = `url(${obj.image})`; }
    titleEl.innerHTML = obj.url ? `<a href="${obj.url}" target="_blank" rel="noreferrer">${escapeHtml(obj.title)}</a>` : escapeHtml(obj.title);
    bylineEl.textContent = `${obj.artist || 'Unknown'} · ${obj.year || ''}`;
    const descEl = document.getElementById('gallery-desc'); if(descEl){ descEl.textContent = obj.desc || ''; }
  }

  function bindNav(loader){
    let offset = 0; 
    document.getElementById('gallery-prev')?.addEventListener('click', async ()=>{ offset--; await loader(offset); });
    document.getElementById('gallery-next')?.addEventListener('click', async ()=>{ offset++; await loader(offset); });
    const fitBtn = document.getElementById('gallery-fit');
    const art = document.getElementById('gallery-art');
    if(art){
      const pref = localStorage.getItem('galleryFit') || 'fit';
      art.classList.toggle('fill', pref === 'fill');
      fitBtn?.addEventListener('click', ()=>{
        const isFill = art.classList.toggle('fill');
        localStorage.setItem('galleryFit', isFill ? 'fill' : 'fit');
      });
    }
  }
}

async function getMetIds(){
  const cached = sessionStorage.getItem('metObjectIDs');
  if(cached){ try { return JSON.parse(cached); } catch {}}
  const cfg = (window.PORTFOLIO && window.PORTFOLIO.remoteGallery) || {};
  const params = new URLSearchParams({ hasImages:'true', q: cfg.query || '*' });
  if(cfg.departmentId){ params.set('departmentId', String(cfg.departmentId)); }
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/search?${params.toString()}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('met search failed');
  const data = await res.json();
  const ids = (data.objectIDs || []).filter(Boolean).slice(0, 500);
  sessionStorage.setItem('metObjectIDs', JSON.stringify(ids));
  return ids;
}

async function getMetObject(id){
  const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
  if(!res.ok) throw new Error('met object failed');
  const o = await res.json();
  const parts = [];
  if(o.medium) parts.push(o.medium);
  if(o.culture) parts.push(o.culture);
  if(o.classification) parts.push(o.classification);
  if(o.artistDisplayBio) parts.push(o.artistDisplayBio);
  const desc = parts.filter(Boolean).join(' • ');
  return {
    title: o.title || 'Artwork',
    artist: o.artistDisplayName || 'Unknown',
    year: o.objectDate || '',
    image: o.primaryImageSmall || o.primaryImage || '',
    url: o.objectURL || '',
    desc
  };
}

function dayOfYear(d=new Date()){
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(),0,0))/86400000);
}

// Palette extraction
function trySetAccentFromImage(img){
  try{
    const c = document.createElement('canvas');
    const w = c.width = 32; const h = c.height = 32; const ctx = c.getContext('2d', {willReadFrequently:true});
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0,0,w,h).data;
    let r=0,g=0,b=0,count=0;
    for(let i=0;i<data.length;i+=4){ const a=data[i+3]; if(a<200) continue; r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
    if(!count) return;
    r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
    const accent = `rgb(${r}, ${g}, ${b})`;
    const accent2 = `rgb(${Math.min(255, r+20)}, ${Math.min(255, g+20)}, ${Math.min(255, b+20)})`;
    const root = document.documentElement;
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-2', accent2);
  }catch{ /* cross-origin may block */ }
}

// Duration helper for timeline
function humanDuration(startStr, endStr){
  if(!startStr) return '';
  const s = parseDate(startStr); if(!s) return '';
  const e = (!endStr || /present/i.test(endStr)) ? new Date() : parseDate(endStr);
  if(!e) return '';
  let months = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth());
  months = Math.max(0, months);
  const years = Math.floor(months/12);
  const rem = months % 12;
  const parts = [];
  if(years) parts.push(`${years} yr${years>1?'s':''}`);
  if(rem) parts.push(`${rem} mo${rem>1?'s':''}`);
  return parts.join(' ');
}

function parseDate(str){
  // Accept formats like 'Mar 2026', '2024', '2024-01'
  const d = new Date(str);
  return isNaN(d) ? null : d;
}

// Robust image setter with fallbacks for relative/absolute paths
function setGalleryImage(img, url){
  try{ img.removeAttribute('crossorigin'); }catch{}
  const bust = (u)=> u ? u + (u.includes('?') ? '&' : '?') + 'v=5' : u;
  const candidates = [];
  if(url) candidates.push(bust(url));
  try{ candidates.push(bust(new URL(url, location.href).toString())); }catch{}
  const base = (location.pathname.endsWith('/') ? location.pathname : location.pathname.replace(/[^/]+$/, ''));
  if(url && !url.startsWith(base)) candidates.push(bust(base + url.replace(/^\//,'')));
  let i = 0; const tryNext = ()=>{ if(i >= candidates.length) return; img.src = candidates[i++]; };
  img.onerror = tryNext; tryNext();
}

function showSpinner(container, on){
  let s = container.querySelector('.spinner');
  if(on){
    if(!s){ s = document.createElement('div'); s.className='spinner'; s.style.position='absolute'; s.style.inset='0'; s.style.display='grid'; s.style.placeItems='center'; s.innerHTML = '<div style="width:24px;height:24px;border-radius:50%;border:3px solid rgba(255,255,255,.2);border-top-color:var(--accent);animation:spin 1s linear infinite"></div>'; container.appendChild(s); }
  } else { s && s.remove(); }
}

// Choose a station the browser can play
function pickSupportedStation(url, audio){
  try{
    const test = (u)=>{
      if(!u) return '';
      const lower = u.toLowerCase();
      const type = lower.endsWith('.mp3') ? 'audio/mpeg' : lower.endsWith('.aac') ? 'audio/aac' : (lower.endsWith('.ogg') || lower.includes('.opus')) ? 'audio/ogg' : '';
      if(!type) return u; // unknown, try anyway
      return audio.canPlayType(type) ? u : '';
    };
    const t = test(url); if(t) return t;
  }catch{}
  return url;
}
