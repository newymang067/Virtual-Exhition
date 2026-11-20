
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/* =========================
   BASIC SETUP
========================= */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080808);
scene.fog = new THREE.Fog(0x080808, 12, 35);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.7, 6);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

/* =========================
   LIGHTING
========================= */

scene.add(new THREE.AmbientLight(0xffffff, 0.55));

const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(0, 8, 5);
scene.add(mainLight);

function addSpotlight(x, y, z, color = 0xffffff) {
  const light = new THREE.SpotLight(color, 65, 18, Math.PI / 5, 0.5);
  light.position.set(x, y, z);
  light.target.position.set(x, 0, z);
  scene.add(light);
  scene.add(light.target);
}

addSpotlight(-4, 4.5, -3);
addSpotlight(4, 4.5, -3);
addSpotlight(0, 4.5, 3);

/* =========================
   MATERIALS
========================= */

const wallMat = new THREE.MeshStandardMaterial({
  color: 0x202020,
  roughness: 0.85
});

const floorMat = new THREE.MeshStandardMaterial({
  color: 0x101010,
  roughness: 0.9
});

const blackMat = new THREE.MeshStandardMaterial({
  color: 0x050505,
  roughness: 0.65
});

const redMat = new THREE.MeshStandardMaterial({
  color: 0xe32636,
  roughness: 0.5
});

/* =========================
   ROOM 01
========================= */

function createBox(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

// Floor
createBox(14, 0.2, 18, floorMat, 0, -0.1, 0);

// Ceiling
createBox(14, 0.2, 18, blackMat, 0, 5, 0);

// Back wall
createBox(14, 5, 0.2, wallMat, 0, 2.5, -9);

// Left wall
createBox(0.2, 5, 18, wallMat, -7, 2.5, 0);

// Right wall: leave an opening for Room 02
createBox(0.2, 5, 5, wallMat, 7, 2.5, -6.5);
createBox(0.2, 5, 5, wallMat, 7, 2.5, 6.5);
createBox(0.2, 1.3, 8, wallMat, 7, 4.35, 0);

/* =========================
   POSTERS
========================= */

function makePoster(title, description, x, y, z, rotationY = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, 1024, 768);

  ctx.fillStyle = '#e32636';
  ctx.fillRect(0, 0, 22, 768);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 76px Arial';
  ctx.fillText(title, 65, 180, 880);

  ctx.fillStyle = '#bbbbbb';
  ctx.font = '34px Arial';

  const words = description.split(' ');
  let line = '';
  let lineY = 290;

  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > 850) {
      ctx.fillText(line, 65, lineY);
      line = word + ' ';
      lineY += 60;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, 65, lineY);

  const texture = new THREE.CanvasTexture(canvas);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });

  const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(4.5, 3),
    material
  );

  poster.position.set(x, y, z);
  poster.rotation.y = rotationY;
  scene.add(poster);
  return poster;
}

makePoster(
  'HATE SPEECH',
  'Words can hurt. Hate speech creates division, fear and discrimination.',
  0, 3.1, -8.85
);

makePoster(
  'WHAT IS IT?',
  'Language that attacks or demeans people based on identity.',
  -6.85, 3, -3, Math.PI / 2
);

makePoster(
  'THE IMPACT',
  'Words have consequences. They shape the way people see each other.',
  6.85, 3, -3, -Math.PI / 2
);

/* =========================
   EXHIBITION OBJECTS
========================= */

function createPedestal(x, z) {
  const pedestal = createBox(
    1.5, 1.2, 1.5,
    blackMat,
    x, 0.6, z
  );

  const top = createBox(
    1.55, 0.08, 1.55,
    redMat,
    x, 1.25, z
  );

  return { pedestal, top };
}

createPedestal(-3, -1);
createPedestal(0, -1);
createPedestal(3, -1);

// Megaphone display
const megaGroup = new THREE.Group();

const megaBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.5, 1.2, 32),
  new THREE.MeshStandardMaterial({ color: 0xdddddd })
);

megaBody.rotation.x = Math.PI / 2;
megaGroup.add(megaBody);
megaGroup.position.set(-3, 1.7, -1);
scene.add(megaGroup);

/* =========================
   CEILING LIGHT TRACKS
========================= */

for (const z of [-6, 0, 6]) {
  createBox(0.08, 0.08, 12, redMat, 0, 4.85, z);
}

/* =========================
   INTERACTION SYSTEM
========================= */

const interactables = [];

function addInteractable(mesh, title, description) {
  interactables.push({
    mesh,
    title,
    description
  });
}

addInteractable(
  megaBody,
  'THE POWER OF WORDS',
  'คำพูดมีพลังมากกว่าที่เราคิด บางครั้งคำพูดเพียงประโยคเดียวอาจส่งผลต่อความรู้สึกและมุมมองของคนคนหนึ่งได้'
);

addInteractable(
  scene.getObjectById(scene.children.find(
    obj => obj.isMesh && obj.position.x === 0 && obj.position.z === -1
  )?.id),
  'HATE SPEECH',
  'Hate Speech คือการใช้ถ้อยคำเพื่อโจมตี ดูหมิ่น หรือสร้างความเกลียดชังต่อบุคคลหรือกลุ่มคน โดยอาจเกี่ยวข้องกับอัตลักษณ์และความแตกต่าง'
);

const infoBox = document.getElementById('exhibition-info');
const infoTitle = document.getElementById('info-title');
const infoDescription = document.getElementById('info-description');

function showInfo(title, description) {
  infoTitle.textContent = title;
  infoDescription.textContent = description;
  infoBox.style.display = 'flex';
}

function closeInfo() {
  infoBox.style.display = 'none';
}

document.getElementById('close-info').addEventListener('click', closeInfo);
document.getElementById('exit-button').addEventListener('click', closeInfo);

const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

function interact() {
  if (infoBox.style.display === 'flex') return;

  raycaster.setFromCamera(center, camera);

  const hits = raycaster.intersectObjects(
    interactables.map(item => item.mesh).filter(Boolean),
    true
  );

  if (hits.length > 0) {
    const found = interactables.find(item =>
      item.mesh && (
        item.mesh === hits[0].object ||
        item.mesh.children.includes(hits[0].object)
      )
    );

    if (found) showInfo(found.title, found.description);
  }
}

document.getElementById('interact-button').addEventListener('click', interact);

/* =========================
   PLAYER MOVEMENT
========================= */

const keys = {};

let yaw = 0;
let pitch = 0;

const moveSpeed = 4;
const lookSpeed = 0.003;

window.addEventListener('keydown', e => {
  keys[e.code] = true;

  if (e.code === 'KeyE') interact();
  if (e.code === 'Escape') closeInfo();
});

window.addEventListener('keyup', e => {
  keys[e.code] = false;
});

let isLocked = false;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('ui').style.display = 'none';
  document.getElementById('room-label').style.display = 'block';

  if (isTouchDevice) {
    document.getElementById('mobile-controls').style.display = 'block';
  } else {
    document.getElementById('crosshair').style.display = 'block';
    renderer.domElement.requestPointerLock?.();
  }
});

document.addEventListener('pointerlockchange', () => {
  isLocked = document.pointerLockElement === renderer.domElement;
});

document.addEventListener('mousemove', e => {
  if (!isLocked) return;

  yaw -= e.movementX * lookSpeed;
  pitch -= e.movementY * lookSpeed;

  pitch = THREE.MathUtils.clamp(
    pitch,
    -Math.PI / 2.2,
    Math.PI / 2.2
  );
});

/* =========================
   MOBILE TOUCH CONTROLS
========================= */

const joystickZone = document.getElementById('joystick-zone');
const joystickStick = document.getElementById('joystick-stick');
const lookZone = document.getElementById('look-zone');

let joystickTouchId = null;
let lookTouchId = null;

let joystickX = 0;
let joystickY = 0;

let lastLookX = 0;
let lastLookY = 0;

const joystickMax = 38;

function resetJoystick() {
  joystickX = 0;
  joystickY = 0;
  joystickStick.style.transform = 'translate(0px, 0px)';
}

joystickZone.addEventListener('pointerdown', e => {
  if (!isTouchDevice || joystickTouchId !== null) return;

  joystickTouchId = e.pointerId;
  joystickZone.setPointerCapture(e.pointerId);
  updateJoystick(e);
});

function updateJoystick(e) {
  const rect = joystickZone.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let dx = e.clientX - centerX;
  let dy = e.clientY - centerY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > joystickMax) {
    dx = dx / distance * joystickMax;
    dy = dy / distance * joystickMax;
  }

  joystickX = dx / joystickMax;
  joystickY = dy / joystickMax;

  joystickStick.style.transform =
    `translate(${dx}px, ${dy}px)`;
}

joystickZone.addEventListener('pointermove', e => {
  if (e.pointerId !== joystickTouchId) return;
  updateJoystick(e);
});

function releaseJoystick(e) {
  if (e.pointerId !== joystickTouchId) return;
  joystickTouchId = null;
  resetJoystick();
}

joystickZone.addEventListener('pointerup', releaseJoystick);
joystickZone.addEventListener('pointercancel', releaseJoystick);

lookZone.addEventListener('pointerdown', e => {
  if (!isTouchDevice || lookTouchId !== null) return;

  lookTouchId = e.pointerId;
  lastLookX = e.clientX;
  lastLookY = e.clientY;

  lookZone.setPointerCapture(e.pointerId);
});

lookZone.addEventListener('pointermove', e => {
  if (e.pointerId !== lookTouchId) return;

  const dx = e.clientX - lastLookX;
  const dy = e.clientY - lastLookY;

  yaw -= dx * lookSpeed * 1.5;
  pitch -= dy * lookSpeed * 1.5;

  pitch = THREE.MathUtils.clamp(
    pitch,
    -Math.PI / 2.2,
    Math.PI / 2.2
  );

  lastLookX = e.clientX;
  lastLookY = e.clientY;
});

function releaseLook(e) {
  if (e.pointerId !== lookTouchId) return;
  lookTouchId = null;
}

lookZone.addEventListener('pointerup', releaseLook);
lookZone.addEventListener('pointercancel', releaseLook);

/* =========================
   MOVEMENT UPDATE
========================= */

const clock = new THREE.Clock();

function updateMovement(delta) {
  let forward = 0;
  let sideways = 0;

  if (keys['KeyW'] || keys['ArrowUp']) forward += 1;
  if (keys['KeyS'] || keys['ArrowDown']) forward -= 1;
  if (keys['KeyA'] || keys['ArrowLeft']) sideways -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) sideways += 1;

  if (isTouchDevice) {
    forward -= joystickY;
    sideways += joystickX;
  }

  const length = Math.sqrt(forward * forward + sideways * sideways);

  if (length > 1) {
    forward /= length;
    sideways /= length;
  }

  const speed = moveSpeed * delta;

  const direction = new THREE.Vector3(
    -Math.sin(yaw),
    0,
    -Math.cos(yaw)
  );

  const right = new THREE.Vector3(
    Math.cos(yaw),
    0,
    -Math.sin(yaw)
  );

  camera.position.addScaledVector(direction, forward * speed);
  camera.position.addScaledVector(right, sideways * speed);

  // Room boundaries
  camera.position.x = THREE.MathUtils.clamp(
    camera.position.x,
    -6.2,
    6.2
  );

  camera.position.z = THREE.MathUtils.clamp(
    camera.position.z,
    -8.1,
    8.1
  );

  camera.position.y = 1.7;
}

/* =========================
   CAMERA
========================= */

function updateCamera() {
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

/* =========================
   RESPONSIVE
========================= */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

/* =========================
   ANIMATION LOOP
========================= */

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  if (infoBox.style.display !== 'flex') {
    updateMovement(delta);
  }

  updateCamera();

  renderer.render(scene, camera);
}

animate();

/* =========================
   FINISH LOADING
========================= */

document.getElementById('loading').style.display = 'none';
