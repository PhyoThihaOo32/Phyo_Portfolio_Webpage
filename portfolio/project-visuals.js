// Original interface illustrations, not screenshots. Animation is decorative.
const projectMotionObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-visible', entry.isIntersecting)))
  : null;

function projectAnimation(repo, context = 'card') {
  const panel = (x, y, w, h, body, extra = '') => `<g ${extra}><rect class="art-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="13" fill="#101d30" stroke="#ffffff" stroke-opacity=".1"/>${body}</g>`;
  const text = (x,y,t,size=12,color='#a8b9d0') => `<text class="${color === '#a8b9d0' ? 'art-copy' : 'art-strong'}" x="${x}" y="${y}" fill="${color}" font-size="${size}">${t}</text>`;
  const bar = (x,y,w,opacity='.25') => `<rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" fill="currentColor" opacity="${opacity}"/>`;
  const data = {
    SafeYork: { color:'#62ecc1', secondary:'#1687a7', name:'SafeYork', subtitle:'A little more peace of mind.', art: `
      <g stroke="currentColor" stroke-opacity=".11" fill="none"><path d="M35 110h365M35 175h365M35 240h365M110 65v215M200 65v215M290 65v215"/><path d="M50 250l78-72 64 25 74-99 96 31" stroke-width="12" stroke-opacity=".07"/></g>
      <g fill="none" stroke="currentColor"><circle class="signal-ring" cx="210" cy="174" r="49"/><circle class="signal-ring delayed" cx="210" cy="174" r="49"/></g>
      <circle class="art-symbol-panel" cx="210" cy="174" r="42" fill="#123b3a" stroke="currentColor" stroke-opacity=".6"/>
      <path d="M210 147l18 7v19c0 12-10 23-18 27-8-4-18-15-18-27v-19z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M202 173l6 6 12-14" fill="none" stroke="currentColor" stroke-width="2.5"/>
      ${panel(387,57,190,231,`${text(407,85,'YOUR SAFETY',10)}${text(407,114,'You’re connected.',16,'#e8fff6')}<circle class="visual-blink" cx="415" cy="143" r="4" fill="currentColor"/>${text(428,147,'Trusted contacts',11)}${bar(407,162,145)}<rect x="407" y="188" width="150" height="43" rx="10" fill="currentColor" opacity=".15"/>${text(439,215,'SEND SOS',13,'#8affd9')}${text(407,263,'Privacy comes first',10)}`)}
      ${panel(64,243,230,42,`<circle cx="85" cy="264" r="4" fill="currentColor"/>${text(100,269,'Safety timer · ready',12,'#d8fff0')}`)}` },
    MindEase: { color:'#a7b9ff', secondary:'#e59ecb', name:'MindEase', subtitle:'Room to pause. Space to breathe.', art:`
      ${panel(53,63,222,221,`${text(76,94,'A MOMENT FOR YOU',10)}${text(76,123,'How are you feeling?',16,'#f0edff')}<g fill="none" stroke="currentColor" stroke-width="1.5">${[0,1,2].map(i=>`<circle cx="${99+i*65}" cy="165" r="19" opacity="${i===1?1:.4}"/><path d="M${91+i*65} 169q8 9 16 0"/><path d="M${93+i*65} 158h2m8 0h2"/>`).join('')}</g>${bar(76,213,142)}${bar(76,228,104)}${text(76,260,'Your journal, your space.',11)}`)}
      <circle class="breathing-halo" cx="434" cy="159" r="80" fill="currentColor" opacity=".1"/><circle class="breathing-core" cx="434" cy="159" r="51" fill="none" stroke="currentColor" stroke-opacity=".7"/>
      ${text(403,164,'BREATHE',12,'#e6e8ff')}<g class="calm-waves" fill="none" stroke="currentColor"><path d="M317 250q55-35 110 0t110 0" opacity=".7"/><path d="M317 267q55-35 110 0t110 0" opacity=".3"/></g>` },
    'code-memory-visualizer': { color:'#c9a6ff', secondary:'#608cff', name:'Code Memory', subtitle:'Make the invisible understandable.', art:`
      ${panel(49,63,272,223,`${text(69,90,'PROGRAM',10)}<g font-family="monospace">${text(69,123,'01  data = [4, 8]',14,'#d9c1ff')}${text(69,154,'02  total = 0',14,'#d9c1ff')}${text(69,185,'03  for value in data:',14,'#d9c1ff')}${text(69,216,'04    total += value',14,'#d9c1ff')}</g><rect class="execution-step" x="59" y="104" width="252" height="27" rx="5" fill="currentColor" opacity=".15"/>${text(69,264,'STEP THROUGH EXECUTION',10)}`)}
      ${panel(354,63,236,223,`${text(375,90,'MEMORY',10)}${text(375,124,'data →',13,'#e2dcff')}<g fill="none" stroke="currentColor"><rect x="376" y="142" width="84" height="67" rx="7"/><rect x="476" y="142" width="84" height="67" rx="7"/></g>${text(408,184,'4',25,'#e4cfff')}${text(508,184,'8',25,'#e4cfff')}${text(375,241,'STACK',10)}${bar(375,252,140)}${text(502,241,'HEAP',10)}`)}<path class="data-flow" d="M321 174h33" stroke="currentColor" stroke-width="2" stroke-dasharray="4 5"/>` },
    LogicDiagramAI: { color:'#8bf0d2', secondary:'#549de5', name:'LogicDiagramAI', subtitle:'From a thought to a working circuit.', art:`
      ${panel(52,78,208,191,`${text(73,108,'YOUR IDEA',10)}${text(73,145,'“Build a circuit',16,'#dbfff2')}${text(73,168,'with two inputs.”',16,'#dbfff2')}${bar(73,191,148)}<rect x="73" y="215" width="139" height="31" rx="8" fill="currentColor" opacity=".15"/>${text(96,235,'GENERATE →',11,'#baffeb')}`)}
      <g fill="none" stroke="currentColor" stroke-width="2"><path class="circuit-flow" d="M304 124h44v35h48M304 226h44v-35h48M470 175h60v-51h39" stroke-dasharray="6 6"/><path class="art-symbol-panel" d="M396 139h38a36 36 0 010 72h-38z" fill="#12322e"/><circle cx="304" cy="124" r="10"/><circle cx="304" cy="226" r="10"/><circle cx="570" cy="124" r="13"/></g>
      <circle class="visual-blink" cx="570" cy="124" r="6" fill="currentColor"/>${text(411,179,'AND',12,'#c7ffec')}${text(298,98,'A',12)}${text(298,254,'B',12)}` },
    pathFinder_project: { color:'#ffc594', secondary:'#b888e4', name:'PathFinder QA', subtitle:'Confidence in every critical flow.', art:`
      ${panel(56,66,528,218,`${text(78,95,'TEST RUN / E-COMMERCE',10)}<circle class="visual-blink" cx="553" cy="91" r="4" fill="currentColor"/>${['Authentication','Checkout journey','Order confirmation'].map((t,i)=>`<g class="test-row" style="--delay:${i*.7}s"><circle cx="91" cy="${131+i*47}" r="10" fill="currentColor" opacity=".12"/><path d="M86 ${131+i*47}l4 4 7-8" fill="none" stroke="currentColor" stroke-width="2"/>${text(115,136+i*47,t,14,'#f5e4d8')}<rect x="461" y="${119+i*47}" width="86" height="24" rx="12" fill="currentColor" opacity=".12"/>${text(480,135+i*47,'PASS',10,'#ffcd9e')}</g>`).join('')}`)}` },
    Phyo_Portfolio_Webpage: { color:'#f3d28d', secondary:'#c29cff', name:'Personal Portfolio', subtitle:'A small corner of the internet, built by me.', art:`
      ${panel(66,56,508,236,`<path d="M66 86h508" stroke="#ffffff" stroke-opacity=".1"/>${text(85,77,'PHYO / PORTFOLIO',9)}${text(449,77,'WORK  ABOUT',9)}${text(88,126,'Thoughtful code.',24,'#fff0ca')}${text(88,157,'Useful experiences.',24,'#fff0ca')}${bar(88,177,198)}<rect x="88" y="195" width="104" height="25" rx="6" fill="currentColor" opacity=".16"/>${text(101,211,'VIEW MY WORK',9,'#ffe8b5')}${[0,1,2].map(i=>`<g class="mini-card" style="--delay:${i*.3}s"><rect x="${88+i*153}" y="236" width="138" height="38" rx="6" fill="currentColor" opacity=".08"/>${bar(100+i*153,248,70)}${bar(100+i*153,259,105,'.12')}</g>`).join('')}<circle cx="471" cy="149" r="42" fill="currentColor" opacity=".08"/><path d="M457 135l-13 14 13 14m28-28l13 14-13 14m-9-35l-9 42" fill="none" stroke="currentColor" stroke-width="2"/>` )}` }
  };
  const v=data[repo]; if(!v) return '';
  const id='art-'+repo.replace(/[^a-z0-9]/gi,'-')+'-'+context;
  return `<svg class="project-loop" viewBox="0 0 640 360" aria-hidden="true" focusable="false" style="--illustration-accent:${v.color};--illustration-secondary:${v.secondary};color:var(--illustration-ink, var(--illustration-accent))" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${id}"><stop stop-color="${v.secondary}" stop-opacity=".48"/><stop offset="1" stop-color="${v.secondary}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}-base" x2="1" y2="1"><stop class="art-base-first" stop-color="#16263e"/><stop class="art-base-last" offset="1" stop-color="#080f1b"/></linearGradient>
      <pattern id="${id}-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" fill="none" stroke="currentColor" stroke-opacity=".045" stroke-width=".6"/></pattern>
    </defs>
    <rect width="640" height="360" fill="url(#${id}-base)"/>
    <ellipse cx="520" cy="80" rx="300" ry="240" fill="url(#${id})"/>
    <rect width="640" height="360" fill="url(#${id}-grid)"/>
    <g class="art-composition" font-family="Arial, sans-serif">${v.art}</g>
    <g class="art-frame" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-width="1"><path d="M16 48V16h32m544 0h32v32M16 312v32h32m544 0h32v-32"/></g>
    <g font-family="Arial, sans-serif">${text(32,32,v.name.toUpperCase(),10,v.color)}${text(450,32,'INTERFACE CONCEPT',9)}${text(32,331,v.subtitle,13)}</g>
  </svg>`;
}
