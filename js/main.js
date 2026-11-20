
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// =====================================
// ROOM 01 : HATE SPEECH EXHIBITION
// =====================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x242020);
scene.fog = new THREE.Fog(0x242020, 16, 35);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.65, 6.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// =====================================
// MATERIALS
// =====================================

const white = new THREE.MeshStandardMaterial({
  color: 0xd8d3ce,
  roughness: 0.85
});

const black = new THREE.MeshStandardMaterial({
  color: 0x171515,
  roughness: 0.9
});

const red = new THREE.MeshStandardMaterial({
  color: 0x8f2028,
  roughness: 0.8
});

const floorMat = new THREE.MeshStandardMaterial({
  color: 0x77716c,
  roughness: 0.65
});

// =====================================
// LIGHTING
// =====================================

scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const ceilingLight = new THREE.PointLight(
  0xffe8d1,
  90,
  25
);

ceilingLight.position.set(0, 4.5, 0);
scene.add(ceilingLight);

function addSpot(x, z, targetX, targetZ) {
  const light = new THREE.SpotLight(
    0xffead6,
    100,
    14,
    Math.PI / 5,
    0.5
  );

  light.position.set(x, 4.7, z);
  light.target.position.set(targetX, 0, targetZ);

  scene.add(light);
  scene.add(light.target);
}

addSpot(-4, 2, -4, 0);
addSpot(0, 2, 0, -6);
addSpot(4, 2, -2, -5);
addSpot(-3, 2, 5, 0);
addSpot(3, 2, 5, 0);

// =====================================
// ROOM STRUCTURE
// =====================================

function box(w, h, d, x, y, z, material) {
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
box(14, 0.25, 18, 0, -0.13, 0, floorMat);

// Ceiling
box(14, 0.25, 18, 0, 5, 0, white);

// Back wall
box(14, 5, 0.3, 0, 2.5, -9, white);

// Front wall
box(14, 5, 0.3, 0, 2.5, 9, white);

// Left wall
box(0.3, 5, 18, -7, 2.5, 0, white);

// Right wall with opening for future room
box(0.3, 5, 7, 7, 2.5, 5.5, white);
box(0.3, 5, 6, 7, 2.5, -6, white);
box(0.3, 1.5, 5, 7, 4.25, -2, white);

// =====================================
// TEXTURE GENERATOR
// =====================================

function makePoster(title, subtitle, bg, color, detail = '') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 768);

  ctx.fillStyle = color;
  ctx.font = 'bold 76px Arial';
  ctx.fillText(title, 65, 160);

  ctx.fillStyle = '#a42b32';
  ctx.fillRect(65, 195, 250, 9);

  ctx.fillStyle = color;
  ctx.font = '42px Arial';

  const words = subtitle.split('\n');
  words.forEach((line, i) => {
    ctx.fillText(line, 65, 300 + i * 75);
  });

  ctx.font = '28px Arial';
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.75;
  ctx.fillText(detail, 65, 650);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 1,
    side: THREE.DoubleSide
  });
}

// =====================================
// EXHIBITION WALLS
// =====================================

// Main back wall
const mainPoster = new THREE.Mesh(
  new THREE.PlaneGeometry(8.5, 4),
  makePoster(
    'HATE SPEECH',
    'คืออะไร?\n\nทั้งในโลกออนไลน์\nและความเป็นจริง',
    '#e4ded6',
    '#211b1b',
    'EXHIBITION ROOM 01'
  )
);

mainPoster.position.set(0, 2.7, -8.82);
scene.add(mainPoster);

// Left wall
const leftPoster = new THREE.Mesh(
  new THREE.PlaneGeometry(4.5, 3.7),
  makePoster(
    'HATE SPEECH',
    'คือการใช้คำพูด\nที่สร้างความเกลียดชัง\nดูถูก หรือแบ่งแยกผู้อื่น',
    '#171515',
    '#ffffff'
  )
);

leftPoster.rotation.y = Math.PI / 2;
leftPoster.position.set(-6.8, 2.7, 1);
scene.add(leftPoster);

// Right wall
const rightPoster = new THREE.Mesh(
  new THREE.PlaneGeometry(4.5, 3.7),
  makePoster(
    'ผลกระทบ',
    'ทำร้ายจิตใจ\nสร้างความแตกแยก\nกระทบสังคม\nและความเท่าเทียม',
    '#171515',
    '#ffffff'
  )
);

rightPoster.rotation.y = -Math.PI / 2;
rightPoster.position.set(6.8, 2.7, 2);
scene.add(rightPoster);

// Campaign poster
const campaign = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 3),
  makePoster(
    'หยุด Hate Speech',
    'เริ่มได้จากเรา\n\nพูดอย่างเคารพ\nสร้างสังคมที่ดีกว่า',
    '#e4ded6',
    '#8f2028'
  )
);

campaign.rotation.y = -Math.PI / 2;
campaign.position.set(6.8, 2.6, -6);
scene.add(campaign);

// =====================================
// DISPLAY PEDESTALS
// =====================================

function createPedestal(x, z, width = 1.3) {
  box(width, 1.15, width, x, 0.58, z, black);

  const top = new THREE.MeshStandardMaterial({
    color: 0x252020,
    roughness: 0.5
  });

  box(width + 0.1, 0.08, width + 0.1, x, 1.2, z, top);

  const artifact = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.8, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.3
    })
  );

  artifact.position.set(x, 1.65, z);
  scene.add(artifact);
}

createPedestal(0, -2, 1.4);
createPedestal(-4.3, -1, 1.1);
createPedestal(4.2, 2, 1.2);

// =====================================
// MEGAPHONE DISPLAY
// =====================================

const megaphone = new THREE.Group();

const horn = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.65, 1.2, 32, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.5,
    roughness: 0.5,
    side: THREE.DoubleSide
  })
);

horn.rotation.z = -Math.PI / 2;
megaphone.add(horn);

const handle = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.65, 0.2),
  black
);

handle.position.set(0, -0.45, 0);
megaphone.add(handle);

megaphone.position.set(-2.5, 2, -8.1);
megaphone.scale.set(1.3, 1.3, 1.3);
scene.add(megaphone);

// =====================================
// CEILING TRACK LIGHTS
// =====================================

const trackMat = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.6
});

box(0.08, 0.08, 15, -4.5, 4.75, 0, trackMat);
box(0.08, 0.08, 15, 0, 4.75, 0, trackMat);
box(0.08, 0.08, 15, 4.5, 4.75, 0, trackMat);

// =====================================
// INTERACTION
// =====================================

const startButton = document.getElementById('start-button');
const ui = document.getElementById('ui');
const crosshair = document.getElementById('crosshair');
const roomName = document.getElementById('room-name');

const keys = {};

let yaw = 0;
let pitch = 0;
let isLocked = false;

startButton.addEventListener('click', () => {
  renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  isLocked = document.pointerLockElement === renderer.domElement;

  ui.style.display = isLocked ? 'none' : 'flex';
  crosshair.style.display = isLocked ? 'block' : 'none';
});

document.addEventListener('mousemove', (e) => {
  if (!isLocked) return;

  yaw -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;

  pitch = Math.max(-1.4, Math.min(1.4, pitch));
});

document.addEventListener('keydown', (e) => {
  keys[e.code] = true;

  if (e.code === 'KeyE') {
    showExhibitionInfo();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// =====================================
// EXHIBITION INFORMATION
// =====================================

function showExhibitionInfo() {
  const info = document.getElementById('exhibition-info');

  if (info) {
    info.style.display =
      info.style.display === 'block' ? 'none' : 'block';
  }
}

const info = document.createElement('div');
info.id = 'exhibition-info';

info.innerHTML = `
  <h2>HATE SPEECH</h2>
  <p>คำพูดที่สร้างความเกลียดชัง
  ดูถูก หรือแบ่งแยกผู้อื่น</p>
  <p>เรียนรู้ผลกระทบของคำพูด
  ทั้งในโลกออนไลน์และชีวิตจริง</p>
  <button id="close-info">ปิด</button>
`;

document.body.appendChild(info);

document.getElementById('close-info').onclick = () => {
  info.style.display = 'none';
};

// =====================================
// MOVEMENT
// =====================================

const clock = new THREE.Clock();

function updateMovement(delta) {
  if (!isLocked) return;

  const speed = 4 * delta;

  const forward = new THREE.Vector3(
    -Math.sin(yaw),
    0,
    -Math.cos(yaw)
  );

  const right = new THREE.Vector3(
    Math.cos(yaw),
    0,
    -Math.sin(yaw)
  );

  const movement = new THREE.Vector3();

  if (keys['KeyW']) movement.add(forward);
  if (keys['KeyS']) movement.sub(forward);
  if (keys['KeyD']) movement.add(right);
  if (keys['KeyA']) movement.sub(right);

  if (movement.length() > 0) {
    movement.normalize().multiplyScalar(speed);
  }

  camera.position.x += movement.x;
  camera.position.z += movement.z;

  // Room boundaries
  camera.position.x = THREE.MathUtils.clamp(
    camera.position.x, -6.2, 6.2
  );

  camera.position.z = THREE.MathUtils.clamp(
    camera.position.z, -8.1, 8.1
  );

  camera.position.y = 1.65;
}

// =====================================
// ANIMATION
// =====================================

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  updateMovement(delta);

  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  renderer.render(scene, camera);
}

animate();

// =====================================
// RESPONSIVE
// =====================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('loading').style.display = 'none';

roomName.textContent = 'ROOM 01 — HATE SPEECH';
