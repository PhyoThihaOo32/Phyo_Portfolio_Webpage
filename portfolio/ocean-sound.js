// The owner's recording loads only after an explicit sound-button press.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const dock = document.getElementById('ocean-sound');
  const button = document.getElementById('ocean-sound-toggle');
  const slider = document.getElementById('ocean-sound-volume');
  const status = document.getElementById('ocean-sound-status');
  if (!dock || !button || !slider || !status) return;
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  let context = null, level = null, source = null, buffer = null, request = null;
  let enabled = false, loading = false, generation = 0, volume = .3;
  const ocean = () => root.dataset.theme === 'ocean';
  const allowed = () => ocean() && !document.hidden;
  try {
    const stored = localStorage.getItem('ocean-sound-volume');
    if (stored !== null && Number.isFinite(Number(stored))) volume = Math.max(0, Math.min(1, Number(stored)));
  } catch { }

  function render() {
    dock.hidden = !ocean();
    dock.dataset.state = loading ? 'loading' : (enabled ? 'playing' : 'off');
    dock.classList.toggle('is-audible', enabled && !loading && volume > 0);
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-busy', String(loading));
    const label = !AudioEngine ? 'Ocean sound is unavailable in this browser' :
      (loading ? 'Cancel loading ocean waves' : (enabled ? 'Turn off ocean waves' : 'Turn on ocean waves'));
    button.setAttribute('aria-label', label); button.title = label;
    button.disabled = slider.disabled = !AudioEngine;
    slider.value = String(Math.round(volume * 100));
    slider.setAttribute('aria-valuetext', `${Math.round(volume * 100)} percent`);
  }
  function killSource() {
    if (!source) return;
    source.onended = null;
    try { source.stop(); } catch { }
    source.disconnect(); source = null;
  }
  function ramp(value, seconds) {
    if (!context || !level || context.state === 'closed') return;
    const now = context.currentTime;
    level.gain.cancelScheduledValues(now);
    level.gain.setValueAtTime(level.gain.value, now);
    level.gain.linearRampToValueAtTime(value, now + seconds);
  }
  function stop(release = false, immediate = false) {
    ++generation; enabled = false; loading = false;
    request?.abort(); request = null;
    if (release) {
      killSource(); level?.disconnect();
      const oldContext = context;
      context = level = buffer = null;
      oldContext?.close().catch(() => {});
    } else if (source && context?.state === 'running' && !immediate) {
      ramp(0, .35);
      try { source.stop(context.currentTime + .36); } catch { }
    } else {
      killSource(); context?.suspend().catch(() => {});
    }
    render();
  }
  // Crossfade the tail into the head, so the next loop continues the same wave.
  function seamless(decoded, engine) {
    const overlap = Math.min(Math.round(decoded.sampleRate * .9), Math.floor(decoded.length / 4));
    const length = decoded.length - overlap;
    const loop = engine.createBuffer(decoded.numberOfChannels, length, decoded.sampleRate);
    for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
      const input = decoded.getChannelData(channel), output = loop.getChannelData(channel);
      output.set(input.subarray(overlap));
      for (let i = 0; i < overlap; i++) {
        const phase = i / Math.max(1, overlap - 1) * Math.PI / 2;
        output[length - overlap + i] = input[decoded.length - overlap + i] * Math.cos(phase) + input[i] * Math.sin(phase);
      }
    }
    return loop;
  }
  async function start() {
    if (!AudioEngine || !allowed()) return;
    const current = ++generation;
    enabled = loading = true; status.textContent = 'Loading ocean waves…'; render();
    killSource();
    let timeout;
    try {
      if (!context || context.state === 'closed') {
        context = new AudioEngine(); level = context.createGain();
        level.gain.value = 0; level.connect(context.destination);
      }
      const engine = context;
      // Resume in the click handler, before waiting for the recording to load.
      await engine.resume();
      if (current !== generation || !allowed()) return;
      if (!buffer) {
        const controller = new AbortController(); request = controller;
        timeout = setTimeout(() => controller.abort(), 15000);
        const response = await fetch('assets/audio/ocean-waves.mp3', { signal: controller.signal });
        if (!response.ok) throw new Error('Recording unavailable');
        const decoded = await engine.decodeAudioData(await response.arrayBuffer());
        if (current !== generation || !allowed()) return;
        buffer = seamless(decoded, engine); request = null;
      }
      if (current !== generation || !allowed()) return;
      const node = engine.createBufferSource(); node.buffer = buffer; node.loop = true;
      node.connect(level); source = node;
      node.onended = () => {
        node.disconnect();
        if (source === node) {
          source = null;
          if (!enabled && context === engine) engine.suspend().catch(() => {});
        }
      };
      level.gain.cancelScheduledValues(engine.currentTime);
      level.gain.setValueAtTime(0, engine.currentTime);
      node.start(); ramp(volume, 1.8);
      loading = false; render();
      status.textContent = `Ocean waves on. Volume ${Math.round(volume * 100)} percent.`;
    } catch {
      if (current !== generation) return;
      stop(true); status.textContent = 'Ocean sound could not start. Tap the sound button to try again.';
    } finally { clearTimeout(timeout); }
  }
  button.addEventListener('click', () => {
    if (enabled) { stop(); status.textContent = 'Ocean waves off.'; }
    else start();
  });
  slider.addEventListener('input', () => {
    volume = Number(slider.value) / 100;
    try { localStorage.setItem('ocean-sound-volume', String(volume)); } catch { }
    if (enabled && !loading) ramp(volume, .18);
    render();
  });
  new MutationObserver(() => { if (!ocean()) stop(true); else render(); })
    .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(true); });
  window.addEventListener('pagehide', () => stop(true));
  window.addEventListener('pageshow', render);
  // A separate player takes priority when someone starts other local audio.
  document.addEventListener('play', event => {
    if (event.target instanceof HTMLMediaElement && !event.target.muted && enabled) stop(false, true);
  }, true);
  render();
});
