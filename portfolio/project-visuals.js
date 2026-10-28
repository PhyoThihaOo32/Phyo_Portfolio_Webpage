const projectMotionObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-visible', entry.isIntersecting)))
  : null;

// Lightweight, code-native looping illustrations, rather than heavy GIF downloads.
function projectAnimation(repo) {
  const visuals = {
    SafeYork: { color: '#5ee7ba', label: 'GUARDIAN / SAFETY SIGNAL', art: `
      <g class="visual-grid" stroke="currentColor" opacity=".12">${[140,200,260,320,380,440,500].map(x=>`<path d="M${x} 65v200"/>`).join('')}${[95,145,195,245].map(y=>`<path d="M115 ${y}h410"/>`).join('')}</g>
      <g fill="none" stroke="currentColor"><circle cx="320" cy="170" r="84" opacity=".22"/><circle cx="320" cy="170" r="57" opacity=".35"/><circle class="signal-ring" cx="320" cy="170" r="42"/><circle class="signal-ring delayed" cx="320" cy="170" r="42"/></g>
      <path d="M320 119l35 13v34c0 24-17 40-35 49-18-9-35-25-35-49v-34z" fill="#102c2b" stroke="currentColor" stroke-width="2"/>
      <path class="signal-check" d="M305 166l11 11 22-25" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle class="visual-blink" cx="450" cy="126" r="5" fill="currentColor"/><text x="422" y="250">SIGNAL ACTIVE</text>` },
    MindEase: { color: '#86c9ff', label: 'MINDEASE / A MOMENT OF CALM', art: `
      <circle class="breathing-halo" cx="320" cy="160" r="61" fill="currentColor" opacity=".12"/>
      <circle class="breathing-core" cx="320" cy="160" r="38" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <g class="calm-waves" fill="none" stroke="currentColor" stroke-width="2"><path d="M90 214Q150 170 210 214T330 214T450 214T570 214" opacity=".65"/><path d="M90 235Q150 191 210 235T330 235T450 235T570 235" opacity=".3"/><path d="M90 256Q150 212 210 256T330 256T450 256T570 256" opacity=".15"/></g>
      <text x="278" y="168" style="font-size:13px;letter-spacing:4px">BREATHE</text>` },
    'code-memory-visualizer': { color: '#c7a2ff', label: 'CODE MEMORY / EXECUTION TRACE', art: `
      <g fill="#151c30" stroke="currentColor" stroke-opacity=".24"><rect x="85" y="93" width="225" height="162" rx="12"/><rect x="350" y="93" width="205" height="162" rx="12"/></g>
      <g style="font-size:14px;letter-spacing:0"><text x="105" y="123">01  const data = [4, 8]</text><text x="105" y="154">02  let total = 0</text><text x="105" y="185">03  for (value of data)</text><text x="105" y="216">04    total += value</text></g>
      <rect class="execution-step" x="96" y="104" width="202" height="27" rx="5" fill="currentColor" opacity=".15"/>
      <g fill="none" stroke="currentColor" stroke-width="1.5"><rect x="372" y="140" width="66" height="60" rx="6"/><rect x="454" y="140" width="66" height="60" rx="6"/><path class="data-flow" d="M310 171h62" stroke-dasharray="5 6"/></g>
      <text x="396" y="177" style="font-size:22px">4</text><text x="479" y="177" style="font-size:22px">8</text><text x="375" y="226">STACK / HEAP</text>` },
    LogicDiagramAI: { color: '#73e7ce', label: 'LOGIC DIAGRAM / IDEAS INTO CIRCUITS', art: `
      <g fill="none" stroke="currentColor" stroke-width="2"><path class="circuit-flow" d="M115 125h104v35h61M115 225h104v-35h61M354 175h80v-50h85" stroke-dasharray="8 7"/><path d="M280 133h33a42 42 0 010 84h-33z" fill="#102a2a"/><circle cx="115" cy="125" r="13"/><circle cx="115" cy="225" r="13"/><circle cx="520" cy="125" r="16"/></g>
      <circle class="visual-blink" cx="520" cy="125" r="8" fill="currentColor"/><text x="105" y="97">A</text><text x="105" y="264">B</text><text x="290" y="181">AND</text><text x="462" y="225">OUTPUT / 1</text>` },
    pathFinder_project: { color: '#ffbd81', label: 'PATHFINDER / AUTOMATED QUALITY', art: `
      <g fill="none" stroke="currentColor" stroke-opacity=".25"><rect x="122" y="85" width="396" height="183" rx="12"/><path d="M122 115h396"/></g>
      <g fill="currentColor" opacity=".6"><circle cx="139" cy="100" r="3"/><circle cx="151" cy="100" r="3"/><circle cx="163" cy="100" r="3"/></g>
      ${['LOGIN','CHECKOUT','CONFIRMATION'].map((t,i)=>`<g class="test-row" style="--delay:${i*.7}s"><path d="M148 ${144+i*39}l6 6 11-13" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="185" y="${150+i*39}">${t}</text><rect x="382" y="${139+i*39}" width="104" height="6" rx="3" fill="currentColor" opacity=".3"/></g>`).join('')}` },
    Phyo_Portfolio_Webpage: { color: '#f3cf80', label: 'PORTFOLIO / BUILT WITH CURIOSITY', art: `
      <g fill="#17202a" stroke="currentColor" stroke-opacity=".3"><rect x="115" y="78" width="410" height="195" rx="12"/><path d="M115 107h410"/></g>
      <path d="M138 95h27m12 0h12" stroke="currentColor" opacity=".5"/>
      <text x="143" y="155" style="font-size:23px;letter-spacing:0">Hello, I'm Phyo.</text><path d="M143 175h170m-170 12h125" stroke="currentColor" opacity=".3"/>
      <rect class="visual-blink" x="321" y="136" width="3" height="23" fill="currentColor"/>
      ${[0,1,2].map(i=>`<g class="mini-card" style="--delay:${i*.3}s"><rect x="${143+i*119}" y="211" width="105" height="40" rx="5" fill="currentColor" opacity=".1"/><path d="M${155+i*119} 225h45m-45 10h66" stroke="currentColor" opacity=".5"/></g>`).join('')}` }
  };
  const v = visuals[repo];
  if (!v) return '';
  return `<svg class="project-loop" viewBox="0 0 640 360" aria-hidden="true" focusable="false" style="color:${v.color}" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="360" fill="#0b1320"/>
    <ellipse cx="320" cy="180" rx="230" ry="145" fill="currentColor" opacity=".035"/>
    <path d="M28 63h584M28 294h584" stroke="currentColor" opacity=".13"/>
    <text x="30" y="326" fill="currentColor" opacity=".7" style="font:10px monospace;letter-spacing:2px">${v.label}</text>
    <g fill="currentColor" style="font:11px monospace;letter-spacing:1.5px">${v.art}</g>
  </svg>`;
}
