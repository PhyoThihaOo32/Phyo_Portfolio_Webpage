import * as THREE from './assets/vendor/three/three-ocean.module.js';

// Image-based depth keeps the full painting in frame while its sea catches the light.
export function createOceanArtwork(canvas, image, { onContextLost } = {}) {
  const frame = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 1.2 : 1.5));
  renderer.debug.onShaderError = () => { throw new Error('The artwork shader is not supported.'); };
  const scene = new THREE.Scene();
  const aspect = image.naturalWidth / image.naturalHeight;
  const camera = new THREE.PerspectiveCamera(45, aspect, .1, 10);
  camera.position.z = 1 / Math.tan(Math.PI / 8);
  const pointer = new THREE.Vector2(), eased = new THREE.Vector2();
  const source = document.createElement('canvas');
  let texture, geometry, material, observer, animation = 0, last = 0, time = 0;
  let running = false, disposed = false, strength = 0, lastTilt = '';
  const uniforms = {
    uImage: { value: null }, uTime: { value: 0 },
    uPointer: { value: eased }, uStrength: { value: 0 }, uAspect: { value: aspect }
  };
  function draw() {
    uniforms.uTime.value = time;
    uniforms.uStrength.value = strength;
    const tilt = `${(eased.y * 1.4).toFixed(3)} ${(eased.x * 1.8).toFixed(3)}`;
    if (tilt !== lastTilt) {
      frame.style.setProperty('--ocean-art-tilt-x', `${(eased.y * 1.4).toFixed(3)}deg`);
      frame.style.setProperty('--ocean-art-tilt-y', `${(eased.x * 1.8).toFixed(3)}deg`);
      lastTilt = tilt;
    }
    renderer.render(scene, camera);
  }
  function tick(now) {
    animation = 0;
    if (!running || disposed) return;
    if (!last || now - last >= 32) {
      const dt = last ? Math.min(60, now - last) : 16;
      last = now; time += dt / 1000;
      eased.lerp(pointer, 1 - Math.exp(-dt / 180));
      strength += (1 - strength) * (1 - Math.exp(-dt / 750));
      draw();
    }
    animation = requestAnimationFrame(tick);
  }
  function setMotion(value) {
    const next = Boolean(value) && !disposed;
    if (next === running) return;
    running = next; cancelAnimationFrame(animation); animation = 0; last = 0;
    if (running) animation = requestAnimationFrame(tick);
    else {
      pointer.set(0, 0); eased.set(0, 0); strength = 0; lastTilt = '';
      frame.style.removeProperty('--ocean-art-tilt-x'); frame.style.removeProperty('--ocean-art-tilt-y');
    }
  }
  function resize() {
    if (disposed) return;
    renderer.setSize(Math.max(1, frame.clientWidth), Math.max(1, frame.clientHeight), false);
    if (running) draw();
  }
  function lost(event) { event.preventDefault(); setMotion(false); onContextLost?.(); }
  function dispose() {
    if (disposed) return;
    setMotion(false); disposed = true;
    observer?.disconnect(); canvas.removeEventListener('webglcontextlost', lost);
    geometry?.dispose(); material?.dispose(); texture?.dispose(); scene.clear();
    renderer.dispose(); renderer.forceContextLoss(); source.width = source.height = 1;
    frame.style.removeProperty('--ocean-art-tilt-x'); frame.style.removeProperty('--ocean-art-tilt-y');
  }
  try {
    source.width = Math.min(720, image.naturalWidth);
    source.height = Math.round(source.width / aspect);
    const ctx = source.getContext('2d');
    if (!ctx) throw new Error('Artwork texture is unavailable.');
    ctx.drawImage(image, 0, 0, source.width, source.height);
    texture = new THREE.CanvasTexture(source); texture.colorSpace = THREE.SRGBColorSpace;
    uniforms.uImage.value = texture;
    geometry = new THREE.PlaneGeometry(aspect * 2, 2, 48, 64);
    material = new THREE.ShaderMaterial({
      uniforms, depthTest: false, depthWrite: false,
      vertexShader: `
        uniform float uTime; uniform float uStrength; uniform vec2 uPointer;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          float edge = smoothstep(0., .09, uv.x) * smoothstep(0., .09, 1. - uv.x)
            * smoothstep(0., .08, uv.y) * smoothstep(0., .08, 1. - uv.y);
          float shore = 1. - smoothstep(.08, .4, uv.y);
          float depth = mix(.16, 1., shore);
          p.z += depth * .026 * edge * uStrength;
          p.xy += uPointer * vec2(.014, .01) * depth * edge * uStrength;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
        }`,
      fragmentShader: `
        uniform sampler2D uImage; uniform float uTime; uniform float uStrength; uniform float uAspect;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv;
          float edge = smoothstep(0., .06, uv.x) * smoothstep(0., .06, 1. - uv.x);
          float sea = smoothstep(.06, .15, uv.y) * (1. - smoothstep(.36, .405, uv.y));
          vec2 ship = (uv - vec2(.665, .4)) / vec2(.145, .14);
          vec2 people = (uv - vec2(.225, .135)) / vec2(.115, .095);
          sea *= (1. - exp(-dot(ship, ship) * 1.5)) * (1. - exp(-dot(people, people) * 1.5)) * edge;
          vec2 current = vec2(
            sin(uv.y * 118. + uTime * .64 + sin(uv.x * 17.)) * .0017,
            cos(uv.x * 67. - uTime * .48) * .00065
          ) * sea * uStrength;
          vec4 color = texture2D(uImage, clamp(uv + current, vec2(0.), vec2(1.)));
          vec2 moon = (uv - vec2(.444, .734)) * vec2(uAspect, 1.);
          float halo = exp(-dot(moon, moon) * 1400.);
          float breathe = .5 + .5 * sin(uTime * .34);
          color.rgb += vec3(1., .88, .56) * halo * (.003 + breathe * .006) * uStrength;
          float width = mix(.095, .018, smoothstep(.08, .38, uv.y));
          float reflection = exp(-pow((uv.x - .445 + sin(uv.y * 42. + uTime * .18) * .012) / width, 2.));
          float shimmer = .5 + .5 * sin(uv.y * 188. - uTime * .8 + sin(uv.x * 42.));
          color.rgb += vec3(1., .88, .61) * reflection * sea * shimmer * .004 * uStrength;
          gl_FragColor = vec4(color.rgb, 1.);
          #include <colorspace_fragment>
        }`
    });
    scene.add(new THREE.Mesh(geometry, material));
    canvas.addEventListener('webglcontextlost', lost);
    observer = new ResizeObserver(resize); observer.observe(frame);
    resize(); draw();
  } catch (error) { dispose(); throw error; }
  return { setMotion, setPointer(x, y) { pointer.set(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y))); }, dispose };
}
