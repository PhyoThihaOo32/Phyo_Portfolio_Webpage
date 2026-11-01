import * as THREE from './assets/vendor/three/three-ocean.module.js';

// A small, self-contained scene: GPU waves, drifting clouds, and wind in the palms.
export function createOceanScene(canvas, { onContextLost } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.debug.onShaderError = () => { throw new Error('Ocean shaders are not supported by this graphics context.'); };
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#c2e9f6');
  scene.fog = new THREE.FogExp2('#cdebf0', .009);
  const camera = new THREE.PerspectiveCamera(48, 1, .1, 400);
  camera.position.set(0, 6, 18);
  const geometries = new Set(), materials = new Set(), textures = new Set();
  const geometry = g => { geometries.add(g); return g; };
  const material = m => { materials.add(m); return m; };
  const addMesh = (g, m, parent = scene) => { const mesh = new THREE.Mesh(g, m); parent.add(mesh); return mesh; };
  const coarse = matchMedia('(pointer: coarse)').matches;
  let width = 1, height = 1, frame = 0, last = 0, time = 0, running = false, disposed = false;
  const pointer = new THREE.Vector2(), easedPointer = new THREE.Vector2();

  const sky = addMesh(geometry(new THREE.SphereGeometry(260, 24, 16)), material(new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 vSky; void main(){vSky=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec3 vSky;
      void main(){
        float high=smoothstep(-.08,.8,vSky.y);
        vec3 color=mix(vec3(.78,.91,.94),vec3(.41,.75,.94),high);
        float warmth=exp(-pow((vSky.y-.06)*5.,2.));
        color=mix(color,vec3(1.,.91,.76),warmth*.16);
        gl_FragColor=vec4(color,1.);
      }`
  })));
  sky.renderOrder = -2;
  const sun = addMesh(geometry(new THREE.SphereGeometry(3.2, 24, 16)), material(new THREE.MeshBasicMaterial({ color: '#ffe7aa', fog: false })));
  sun.position.set(20, 13, -68);
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = glowCanvas.height = 128;
  const ctx = glowCanvas.getContext('2d');
  if (ctx) {
    const glow = ctx.createRadialGradient(64, 64, 12, 64, 64, 64);
    glow.addColorStop(0, 'rgba(255,236,177,.7)'); glow.addColorStop(.45, 'rgba(255,230,169,.23)'); glow.addColorStop(1, 'rgba(255,230,169,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(glowCanvas); texture.colorSpace = THREE.SRGBColorSpace; textures.add(texture);
    const halo = new THREE.Sprite(material(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, fog: false })));
    halo.position.copy(sun.position); halo.scale.set(24, 24, 1); scene.add(halo);
  }

  const waveUniforms = {
    uTime: { value: 0 },
    uSun: { value: new THREE.Vector3(.35, .7, -.45).normalize() },
    uShallow: { value: new THREE.Color('#5ad1d4') },
    uDeep: { value: new THREE.Color('#299bb8') },
    uHorizon: { value: new THREE.Color('#c2e6ec') }
  };
  const waterGeometry = geometry(new THREE.PlaneGeometry(240, 220, coarse ? 80 : 128, coarse ? 60 : 96));
  waterGeometry.rotateX(-Math.PI / 2); waterGeometry.translate(0, 0, -65);
  const water = addMesh(waterGeometry, material(new THREE.ShaderMaterial({
    uniforms: waveUniforms,
    vertexShader: `uniform float uTime; varying vec3 vWorld; varying vec3 vWaveNormal;
      void main(){
        vec3 p=position;
        float a=p.x*.42+p.z*.24+uTime*.65;
        float b=p.x*.17-p.z*.48+uTime*.43;
        float c=p.x*.82+p.z*.65-uTime*.82;
        p.y=sin(a)*.14+sin(b)*.17+sin(c)*.035;
        float dx=cos(a)*.0588+cos(b)*.0289+cos(c)*.0287;
        float dz=cos(a)*.0336-cos(b)*.0816+cos(c)*.02275;
        vWaveNormal=normalize(vec3(-dx,1.,-dz));
        vec4 world=modelMatrix*vec4(p,1.); vWorld=world.xyz;
        gl_Position=projectionMatrix*viewMatrix*world;
      }`,
    fragmentShader: `uniform float uTime; uniform vec3 uSun; uniform vec3 uShallow; uniform vec3 uDeep; uniform vec3 uHorizon;
      varying vec3 vWorld; varying vec3 vWaveNormal;
      void main(){
        vec3 viewDirection=normalize(cameraPosition-vWorld);
        vec3 normal=normalize(vWaveNormal);
        float distanceToEye=length(cameraPosition-vWorld);
        vec3 color=mix(uShallow,uDeep,smoothstep(8.,75.,distanceToEye));
        color*=.91+.14*max(dot(normal,uSun),0.);
        float ripple=pow(.5+.5*sin(vWorld.x*.34+vWorld.z*1.35-uTime*.55+sin(vWorld.x*.2)),20.);
        float glint=pow(max(dot(reflect(-uSun,normal),viewDirection),0.),68.);
        color=mix(color,vec3(.89,1.,.98),ripple*.12+glint*.3);
        float fresnel=pow(1.-max(dot(normal,viewDirection),0.),3.);
        color=mix(color,uHorizon,fresnel*.28);
        color=mix(color,uHorizon,smoothstep(45.,150.,distanceToEye));
        gl_FragColor=vec4(color,1.);
        #include <colorspace_fragment>
      }`
  })));
  water.renderOrder = 0;
  scene.add(new THREE.HemisphereLight('#f1ffff', '#8bcbb4', 1.65));
  const sunlight = new THREE.DirectionalLight('#fff1ca', 1.1); sunlight.position.set(20, 24, -25); scene.add(sunlight);
  const landMaterial = material(new THREE.MeshLambertMaterial({ color: '#6f9e87' }));
  const distantMaterial = material(new THREE.MeshLambertMaterial({ color: '#92b7a5' }));
  const hillGeometry = geometry(new THREE.SphereGeometry(1, 24, 14));
  function island(x, z, scale, m) {
    const group = new THREE.Group(); group.position.set(x, -.7, z); group.scale.setScalar(scale); scene.add(group);
    [[0, 0, 0, 7, 2.5, 3.6], [4.5, .1, -.6, 5.8, 4.2, 3.4], [-5, -.2, .4, 6, 1.8, 3]].forEach(([px, py, pz, sx, sy, sz]) => {
      const hill = addMesh(hillGeometry, m, group); hill.position.set(px, py, pz); hill.scale.set(sx, sy, sz);
    });
  }
  island(17, -68, 1, landMaterial); island(-38, -104, 1.35, distantMaterial);

  const cloudMaterial = material(new THREE.MeshBasicMaterial({ color: '#f6fcff', transparent: true, opacity: .5, depthWrite: false, fog: false }));
  const cloudGeometry = geometry(new THREE.SphereGeometry(1, 12, 8));
  const clouds = [];
  [[-29, 18, -85, 1.1], [31, 22, -112, 1.6], [3, 25, -130, 1.2]].forEach(([x, y, z, size], index) => {
    const group = new THREE.Group(); group.position.set(x, y, z); scene.add(group);
    for (let i = 0; i < 4; i++) { const puff = addMesh(cloudGeometry, cloudMaterial, group); puff.position.set(i * 2.8, Math.sin(i * 2) * .45, 0); puff.scale.set(3.2 * size, (1.1 + i % 2 * .4) * size, 1.2 * size); }
    clouds.push({ group, x, phase: index * 2 });
  });

  const trunkMaterial = material(new THREE.MeshLambertMaterial({ color: '#9b9970' }));
  const leafMaterial = material(new THREE.MeshLambertMaterial({ color: '#4f9c82', side: THREE.DoubleSide }));
  const coconutMaterial = material(new THREE.MeshLambertMaterial({ color: '#7c8862' }));
  const coconutGeometry = geometry(new THREE.SphereGeometry(.18, 8, 6));
  function frond(length) {
    const vertices = [], indices = [];
    const profile = t => Math.sin(t * Math.PI) * .8 - t * t * 1.4;
    function triangle(a, b, c) { const start = vertices.length / 3; vertices.push(...a, ...b, ...c); indices.push(start, start + 1, start + 2); }
    for (let i = 0; i < 13; i++) {
      const t = i / 13, next = (i + 1) / 13;
      triangle([t * length, profile(t), -.035], [next * length, profile(next), 0], [t * length, profile(t), .035]);
      if (!i) continue;
      for (const side of [-1, 1]) triangle([t * length, profile(t), 0], [(t + .1) * length, profile(t + .1), 0], [t * length + .5, profile(t) - .24, side * (.1 + Math.sin(t * Math.PI) * .72)]);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); g.setIndex(indices); g.computeVertexNormals();
    return geometry(g);
  }
  function palm(height, lean, phase) {
    const group = new THREE.Group(); scene.add(group);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -.8, 0), new THREE.Vector3(lean * .15, height * .35, .1), new THREE.Vector3(lean * .6, height * .75, .05), new THREE.Vector3(lean, height, 0)]);
    addMesh(geometry(new THREE.TubeGeometry(curve, 16, .145, 7, false)), trunkMaterial, group);
    const crown = new THREE.Group(); crown.position.set(lean, height, 0); group.add(crown);
    const leaves = [];
    for (let i = 0; i < 8; i++) {
      const leaf = addMesh(frond(3 + i % 3 * .35), leafMaterial, crown); leaf.rotation.y = i * Math.PI / 4 + phase; leaf.rotation.z = .08 + i % 2 * .12; leaves.push(leaf);
    }
    for (let i = 0; i < 3; i++) { const coconut = addMesh(coconutGeometry, coconutMaterial, crown); coconut.position.set(Math.sin(i * 2) * .3, -.23, Math.cos(i * 2) * .3); }
    return { group, crown, leaves, phase };
  }
  const palms = [palm(8.5, 1.8, .2), palm(9.2, -1.4, 2.1)];
  palms[0].group.position.z = 1; palms[1].group.position.z = 2;

  function draw() {
    waveUniforms.uTime.value = time;
    easedPointer.lerp(pointer, .035);
    camera.position.x = easedPointer.x * .4;
    camera.position.y = 6 + easedPointer.y * .2 + Math.min(1, scrollY / Math.max(1, innerHeight)) * .25;
    camera.lookAt(0, .1, -30);
    palms.forEach(p => { p.crown.rotation.z = Math.sin(time * .48 + p.phase) * .035; p.leaves.forEach((leaf, i) => { leaf.rotation.x = Math.sin(time * .75 + i + p.phase) * .035; }); });
    clouds.forEach(c => { c.group.position.x = c.x + Math.sin(time * .022 + c.phase) * 5; });
    renderer.render(scene, camera);
  }
  function tick(now) {
    frame = 0; if (!running || disposed) return;
    if (!last || now - last >= 33) { time += last ? Math.min(60, now - last) / 1000 : 0; last = now; draw(); }
    frame = requestAnimationFrame(tick);
  }
  function resize() {
    if (disposed) return;
    width = innerWidth; height = innerHeight; camera.aspect = width / height; camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.2 : 1.5)); renderer.setSize(width, height, false);
    const span = 2 * Math.tan(48 * Math.PI / 360) * 17 * camera.aspect;
    palms[0].group.position.x = -span / 2 - 1.8; palms[1].group.position.x = span / 2 + 1.6;
    palms.forEach(p => p.group.scale.setScalar(width < 600 ? .78 : 1));
    draw();
  }
  function setMotion(value) {
    running = Boolean(value) && !disposed; cancelAnimationFrame(frame); frame = 0; last = 0;
    if (running) frame = requestAnimationFrame(tick);
  }
  function move(e) { if (!running || e.pointerType === 'touch') return; pointer.set((e.clientX / width - .5) * 2, (e.clientY / height - .5) * 2); }
  function lost(e) { e.preventDefault(); onContextLost?.(); }
  function dispose() {
    if (disposed) return;
    disposed = true; setMotion(false);
    window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); canvas.removeEventListener('webglcontextlost', lost);
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
    scene.clear(); renderer.dispose(); renderer.forceContextLoss();
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', move, { passive: true });
  canvas.addEventListener('webglcontextlost', lost);
  try { resize(); } catch (error) { dispose(); throw error; }
  return { setMotion, dispose };
}
