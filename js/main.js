
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// ==========================================
// ROOM 01 - HATE SPEECH
// VIRTUAL EXHIBITION
// ==========================================

// SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x242020);
scene.fog = new THREE.Fog(0x242020, 18, 35);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.65, 6.5);
camera.rotation.order = 'YXZ';

// RENDERER

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

document.body.appendChild(renderer.domElement);

// ==========================================
// MATERIALS
// ==========================================

const white = new THREE.MeshStandardMaterial({
  color: 0xd8d3ce,
  roughness: 0.9
});

const black = new THREE.MeshStandardMaterial({
  color: 0x171515,
  roughness: 0.85
});

const red = new THREE.MeshStandardMaterial({
  color: 0x8f2028,
  roughness: 0.8
});

const floorMat = new THREE.MeshStandardMaterial({
  color: 0x77716c,
  roughness: 0.8
});

// ==========================================
// LIGHTING
// ==========================================

scene.add(
  new THREE.AmbientLight(0xffffff, 1.1)
);

const mainLight = new THREE.PointLight(
  0xffe8d1,
  100,
  25
);

mainLight.position.set(0, 4.2, 0);
scene.add(mainLight);

function addSpot(x, z, targetX, targetZ) {
  const light = new THREE.SpotLight(
    0xffead6,
    100,
    15,
    Math.PI / 5,
    0.6
  );

  light.position.set(x, 4.7, z);
  light.target.position.set(targetX, 0, targetZ);

  scene.add(light);
  scene.add(light.target);
}

addSpot(-4, 4, -4, 0);
addSpot(0, 4, 0, -6);
addSpot(4, 4, 3, -4);
addSpot(-3, 4, 4, 0);
addSpot(3, 4, 5, 0);

// ==========================================
// OBJECT CREATION
// ==========================================

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

// ==========================================
// ROOM STRUCTURE
// Room size: 14 x 18
// ==========================================

// FLOOR

box(
  14, 0.25, 18,
  0, -0.13, 0,
  floorMat
);

// CEILING

box(
  14, 0.25, 18,
  0, 5, 0,
  white
);

// BACK WALL

box(
  14, 5, 0.3,
  0, 2.5, -9,
  white
);

// FRONT WALL

box(
  14, 5, 0.3,
  0, 2.5, 9,
  white
);

// LEFT WALL

box(
  0.3, 5, 18,
  -7, 2.5, 0,
  white
);

// RIGHT WALL
// Opening reserved for future Room 02

box(
  0.3, 5, 7,
  7, 2.5, 5.5,
  white
);

box(
  0.3, 5, 6,
  7, 2.5, -6,
  white
);

box(
  0.3, 1.5, 5,
  7, 4.25, -2,
  white
);

// ==========================================
// POSTER GENERATOR
// ==========================================

function makePoster(
  title,
  subtitle,
  background,
  textColor,
  detail = ''
) {
  const canvas = document.createElement('canvas');

  canvas.width = 1024;
  canvas.height = 768;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1024, 768);

  ctx.fillStyle = textColor;
  ctx.font = 'bold 76px Arial';
  ctx.fillText(title, 65, 160);

  ctx.fillStyle = '#a42b32';
  ctx.fillRect(65, 195, 250, 9);

  ctx.fillStyle = textColor;
  ctx.font = '42px Arial';

  const lines = subtitle.split('\n');

  lines.forEach((line, index) => {
    ctx.fillText(line, 65, 300 + index * 75);
  });

  ctx.font = '28px Arial';
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

// ==========================================
// BACK WALL EXHIBITION
// ==========================================

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

// ==========================================
// LEFT WALL EXHIBITION
// ==========================================

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

// ==========================================
// RIGHT WALL EXHIBITION
// ==========================================

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

// CAMPAIGN POSTER

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

// ==========================================
// DISPLAY PEDESTALS
// ==========================================

function createPedestal(x, z, width = 1.3) {

  box(
    width, 1.15, width,
    x, 0.58, z,
    black
  );

  box(
    width + 0.1, 0.08, width + 0.1,
    x, 1.2, z,
    black
  );

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

// ==========================================
// MEGAPHONE DISPLAY
// ==========================================

const megaphone = new THREE.Group();

const horn = new THREE.Mesh(
  new THREE.CylinderGeometry(
    0.12, 0.65, 1.2, 32, 1, true
  ),

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

// ==========================================
// CEILING TRACK LIGHTS
// ==========================================

const trackMat = new THREE.MeshStandardMaterial({
  color: 0x222222,
  metalness: 0.6
});

box(0.08, 0.08, 15, -4.5, 4.75, 0, trackMat);
box(0.08, 0.08, 15, 0, 4.75, 0, trackMat);
box(0.08, 0.08, 15, 4.5, 4.75, 0, trackMat);

// ==========================================
// USER INTERFACE
// ==========================================

const ui = document.getElementById('ui');
const startButton = document.getElementById('start-button');

const crosshair = document.getElementById('crosshair');
const roomLabel = document.getElementById('room-label');

const infoWindow = document.getElementById('exhibition-info');

const mobileControls = document.getElementById('mobile-controls');

const isTouchDevice =
  window.matchMedia('(pointer: coarse)').matches;

let isLocked = false;

let yaw = 0;
let pitch = 0;

const keys = {};

// ==========================================
// START GAME
// ==========================================

function enterExhibition() {

  if (isTouchDevice) {

    isLocked = true;

    ui.style.display = 'none';
    crosshair.style.display = 'block';
    roomLabel.style.display = 'block';

    mobileControls.style.display = 'block';

  } else {

    renderer.domElement.requestPointerLock();

  }
}

startButton.addEventListener('click', enterExhibition);

// ==========================================
// DESKTOP POINTER LOCK
// ==========================================

document.addEventListener('pointerlockchange', () => {

  if (isTouchDevice) return;

  isLocked =
    document.pointerLockElement === renderer.domElement;

  ui.style.display = isLocked ? 'none' : 'flex';

  crosshair.style.display =
    isLocked ? 'block' : 'none';

  roomLabel.style.display =
    isLocked ? 'block' : 'none';

  if (!isLocked) {
    Object.keys(keys).forEach(key => keys[key] = false);
  }

});

// ==========================================
// DESKTOP MOUSE LOOK
// ==========================================

document.addEventListener('mousemove', (e) => {

  if (!isLocked || isTouchDevice) return;

  yaw -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;

  pitch = THREE.MathUtils.clamp(
    pitch, -1.4, 1.4
  );

});

// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener('keydown', (e) => {

  keys[e.code] = true;

  if (e.code === 'KeyE' && isLocked) {
    showExhibitionInfo();
  }

});

document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// ==========================================
// INFORMATION WINDOW
// ==========================================

function showExhibitionInfo() {

  const visible =
    infoWindow.style.display === 'flex';

  infoWindow.style.display =
    visible ? 'none' : 'flex';

}

document.getElementById('close-info')
  .addEventListener('click', () => {

    infoWindow.style.display = 'none';

  });

// ==========================================
// MOBILE CONTROLS
// ==========================================

const joystick = document.getElementById('joystick');
const knob = document.getElementById('joystick-knob');

const lookZone = document.getElementById('look-zone');

let moveX = 0;
let moveY = 0;

let joystickPointer = null;
let lookPointer = null;

let lookX = 0;
let lookY = 0;

// RESET JOYSTICK

function resetJoystick() {

  moveX = 0;
  moveY = 0;

  knob.style.transform =
    'translate(-50%, -50%)';

}

// JOYSTICK START

joystick.addEventListener('pointerdown', (e) => {

  if (!isTouchDevice || !isLocked) return;

  e.preventDefault();

  joystickPointer = e.pointerId;

  joystick.setPointerCapture(e.pointerId);

  updateJoystick(e);

});

// JOYSTICK MOVE

joystick.addEventListener('pointermove', (e) => {

  if (e.pointerId !== joystickPointer) return;

  updateJoystick(e);

});

function updateJoystick(e) {

  const rect = joystick.getBoundingClientRect();

  let dx =
    e.clientX - (rect.left + rect.width / 2);

  let dy =
    e.clientY - (rect.top + rect.height / 2);

  const maxDistance = 42;

  const distance = Math.hypot(dx, dy);

  if (distance > maxDistance) {

    dx = dx / distance * maxDistance;
    dy = dy / distance * maxDistance;

  }

  moveX = dx / maxDistance;
  moveY = dy / maxDistance;

  knob.style.transform =
    `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

}

// JOYSTICK END

function endJoystick(e) {

  if (e.pointerId !== joystickPointer) return;

  joystickPointer = null;

  resetJoystick();

}

joystick.addEventListener('pointerup', endJoystick);
joystick.addEventListener('pointercancel', endJoystick);

// ==========================================
// TOUCH LOOK
// ==========================================

lookZone.addEventListener('pointerdown', (e) => {

  if (!isTouchDevice || !isLocked) return;

  if (lookPointer !== null) return;

  lookPointer = e.pointerId;

  lookX = e.clientX;
  lookY = e.clientY;

  lookZone.setPointerCapture(e.pointerId);

});

lookZone.addEventListener('pointermove', (e) => {

  if (e.pointerId !== lookPointer) return;

  const dx = e.clientX - lookX;
  const dy = e.clientY - lookY;

  yaw -= dx * 0.005;
  pitch -= dy * 0.005;

  pitch = THREE.MathUtils.clamp(
    pitch, -1.4, 1.4
  );

  lookX = e.clientX;
  lookY = e.clientY;

});

function endLook(e) {

  if (e.pointerId !== lookPointer) return;

  lookPointer = null;

}

lookZone.addEventListener('pointerup', endLook);
lookZone.addEventListener('pointercancel', endLook);

// ==========================================
// MOBILE INTERACTION
// ==========================================

document.getElementById('interact-button')
  .addEventListener('pointerdown', (e) => {

    e.preventDefault();

    if (isLocked) {
      showExhibitionInfo();
    }

  });

// ==========================================
// EXIT
// ==========================================

function exitExhibition() {

  if (isTouchDevice) {

    isLocked = false;

    mobileControls.style.display = 'none';

    resetJoystick();

    lookPointer = null;
    joystickPointer = null;

    infoWindow.style.display = 'none';

    ui.style.display = 'flex';
    crosshair.style.display = 'none';
    roomLabel.style.display = 'none';

  } else {

    document.exitPointerLock();

  }

}

document.getElementById('mobile-exit')
  .addEventListener('click', exitExhibition);

// ==========================================
// MOVEMENT
// ==========================================

const clock = new THREE.Clock();

function updateMovement(delta) {

  if (!isLocked) return;

  if (infoWindow.style.display === 'flex') return;

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

  // KEYBOARD

  if (keys['KeyW']) movement.add(forward);
  if (keys['KeyS']) movement.sub(forward);

  if (keys['KeyD']) movement.add(right);
  if (keys['KeyA']) movement.sub(right);

  // MOBILE JOYSTICK

  movement.addScaledVector(forward, -moveY);
  movement.addScaledVector(right, moveX);

  if (movement.length() > 0) {

    movement.normalize().multiplyScalar(speed);

  }

  camera.position.x += movement.x;
  camera.position.z += movement.z;

  // ROOM BOUNDARIES

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

  camera.position.y = 1.65;

}

// ==========================================
// ANIMATION
// ==========================================

function animate() {

  requestAnimationFrame(animate);

  const delta = Math.min(
    clock.getDelta(),
    0.05
  );

  updateMovement(delta);

  camera.rotation.order = 'YXZ';

  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  renderer.render(scene, camera);

}

animate();

// ==========================================
// RESPONSIVE
// ==========================================

window.addEventListener('resize', () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
  );

});

// ==========================================
// FINISH LOADING
// ==========================================

document.getElementById('loading').style.display = 'none';

