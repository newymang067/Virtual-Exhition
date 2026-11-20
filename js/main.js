
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/* =========================================
   HATE SPEECH — ROOM 01
   Gallery-style exhibition
========================================= */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaa5a1);
scene.fog = new THREE.Fog(0xaaa5a1, 25, 55);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 1.7, 8);
camera.rotation.order = 'YXZ';

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

document.body.appendChild(renderer.domElement);

/* =========================================
   MATERIALS
========================================= */

const materials = {
  white: new THREE.MeshStandardMaterial({
    color: 0xe7e3df,
    roughness: 0.85
  }),

  black: new THREE.MeshStandardMaterial({
    color: 0x101010,
    roughness: 0.8
  }),

  floor: new THREE.MeshStandardMaterial({
    color: 0x777471,
    roughness: 0.25,
    metalness: 0.15
  }),

  red: new THREE.MeshStandardMaterial({
    color: 0x8e2025,
    roughness: 0.7
  }),

  glass: new THREE.MeshStandardMaterial({
    color: 0xc9c9c9,
    transparent: true,
    opacity: 0.18,
    roughness: 0.1,
    metalness: 0.1
  }),

  metal: new THREE.MeshStandardMaterial({
    color: 0x252525,
    metalness: 0.7,
    roughness: 0.35
  })
};

/* =========================================
   LIGHTING
========================================= */

scene.add(new THREE.AmbientLight(0xffffff, 1.05));

const ceilingLight = new THREE.DirectionalLight(0xffffff, 1.3);
ceilingLight.position.set(0, 9, 5);
scene.add(ceilingLight);

function addSpotlight(x, z, intensity = 85) {
  const light = new THREE.SpotLight(
    0xfff4e8,
    intensity,
    18,
    Math.PI / 5,
    0.65,
    1
  );

  light.position.set(x, 4.8, z);
  light.target.position.set(x, 0, z);

  scene.add(light);
  scene.add(light.target);
}

addSpotlight(-6, -5, 95);
addSpotlight(-2, -5, 100);
addSpotlight(2, -5, 100);
addSpotlight(6, -5, 95);
addSpotlight(-5, 2, 65);
addSpotlight(5, 2, 65);

/* =========================================
   BASIC BUILDING HELPERS
========================================= */

function box(
  width,
  height,
  depth,
  material,
  x,
  y,
  z,
  castShadow = true
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;

  scene.add(mesh);
  return mesh;
}

function plane(
  width,
  height,
  material,
  x,
  y,
  z,
  rotationY = 0
) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    material
  );

  mesh.position.set(x, y, z);
  mesh.rotation.y = rotationY;
  scene.add(mesh);

  return mesh;
}

/* =========================================
   ROOM STRUCTURE
=========================================

   Room size:
   Width  = 18
   Length = 20
   Height = 5.5

   Front side is open for entrance.
========================================= */

// Floor
box(18, 0.25, 20, materials.floor, 0, -0.125, 0);

// Ceiling
box(18, 0.2, 20, materials.white, 0, 5.5, 0);

// Back wall
box(18, 5.5, 0.25, materials.white, 0, 2.75, -10);

// Left wall
box(0.25, 5.5, 20, materials.white, -9, 2.75, 0);

// Right wall
box(0.25, 5.5, 20, materials.white, 9, 2.75, 0);

// Baseboards
box(0.08, 0.25, 19.8, materials.black, -8.84, 0.12, 0);
box(0.08, 0.25, 19.8, materials.black, 8.84, 0.12, 0);

/* =========================================
   TEXTURE GENERATOR
========================================= */

function createCanvasTexture(draw, width = 1200, height = 900) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  return texture;
}

/* =========================================
   TEXT WRAPPING
========================================= */

function drawWrappedText(
  ctx,
  text,
  x,
  y,
  maxWidth,
  lineHeight
) {
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let line = '';

    for (const word of words) {
      const test = line + word + ' ';

      if (
        ctx.measureText(test).width > maxWidth &&
        line !== ''
      ) {
        ctx.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = test;
      }
    }

    ctx.fillText(line, x, y);
    y += lineHeight;
  }
}

/* =========================================
   NEWSPAPER COLLAGE
========================================= */

function createNewspaperTexture(variant = 0) {
  return createCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#e8e5dc';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#222';
    ctx.fillRect(35, 30, w - 70, 8);

    ctx.fillStyle = '#333';
    ctx.font = 'bold 45px serif';

    const headlines = [
      'ข่าวสังคมและความเปลี่ยนแปลง',
      'เสียงจากสังคมออนไลน์',
      'เมื่อถ้อยคำกลายเป็นอาวุธ',
      'พื้นที่ปลอดภัยในโลกออนไลน์'
    ];

    ctx.fillText(headlines[variant % headlines.length], 45, 105);

    ctx.fillStyle = '#777';
    ctx.font = '18px sans-serif';

    for (let i = 0; i < 5; i++) {
      ctx.fillRect(45, 130 + i * 25, 500 + (i % 2) * 80, 5);
    }

    // Simulated newspaper photo
    ctx.fillStyle = '#555';
    ctx.fillRect(45, 290, 500, 350);

    ctx.fillStyle = '#888';
    ctx.fillRect(65, 310, 460, 310);

    // Abstract crowd silhouettes
    for (let i = 0; i < 18; i++) {
      const x = 85 + (i % 9) * 48;
      const y = 500 + Math.sin(i) * 30;

      ctx.fillStyle = i % 2 ? '#333' : '#444';
      ctx.beginPath();
      ctx.arc(x, y, 17, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillRect(x - 15, y + 17, 30, 75);
    }

    // Text columns
    ctx.fillStyle = '#333';

    for (let col = 0; col < 2; col++) {
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(
          600 + col * 270,
          170 + i * 30,
          220 - (i % 3) * 20,
          5
        );
      }
    }

    ctx.font = 'bold 22px serif';
    ctx.fillText('รายงานข่าว', 600, 470);
    ctx.font = '17px serif';

    drawWrappedText(
      ctx,
      'ประเด็นความขัดแย้งและผลกระทบที่เกิดขึ้นในสังคม',
      600,
      515,
      500,
      35
    );
  });
}

function addNewspaper(
  x,
  y,
  z,
  width,
  height,
  rotationY = 0,
  rotationZ = 0,
  variant = 0
) {
  const texture = createNewspaperTexture(variant);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    material
  );

  mesh.position.set(x, y, z);
  mesh.rotation.set(0, rotationY, rotationZ);

  scene.add(mesh);
  return mesh;
}

/* =========================================
   CENTRAL BACK WALL — MAIN EXHIBITION
========================================= */

const mainMuralTexture = createCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = '#e9e5df';
  ctx.fillRect(0, 0, w, h);

  // Subtle paper texture
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;

    ctx.fillStyle = `rgba(80,70,60,${Math.random() * 0.055})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Megaphone illustration
  ctx.save();
  ctx.translate(210, 420);
  ctx.rotate(-0.25);

  ctx.fillStyle = '#292929';
  ctx.beginPath();
  ctx.moveTo(-120, -65);
  ctx.lineTo(220, -190);
  ctx.lineTo(220, 190);
  ctx.lineTo(-120, 65);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#777';
  ctx.beginPath();
  ctx.moveTo(-120, -65);
  ctx.lineTo(220, -190);
  ctx.lineTo(220, 190);
  ctx.lineTo(-120, 65);
  ctx.closePath();
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 12;
  ctx.stroke();

  ctx.fillStyle = '#222';
  ctx.fillRect(-160, -65, 65, 130);
  ctx.fillRect(-90, 65, 55, 190);

  ctx.restore();

  // Red sound marks
  ctx.strokeStyle = '#8e2025';
  ctx.lineWidth = 12;

  ctx.beginPath();
  ctx.moveTo(90, 120);
  ctx.lineTo(170, 50);
  ctx.lineTo(145, 145);
  ctx.lineTo(235, 65);
  ctx.stroke();

  // Main title
  ctx.fillStyle = '#7d1f25';
  ctx.font = 'bold 100px Georgia';
  ctx.fillText('Hate', 470, 300);

  ctx.fillStyle = '#161616';
  ctx.fillText('Speech', 690, 300);

  ctx.fillStyle = '#7d1f25';
  ctx.fillRect(470, 325, 590, 7);

  ctx.fillStyle = '#111';
  ctx.font = 'bold 75px sans-serif';
  ctx.fillText('คืออะไร?', 510, 435);

  ctx.font = '34px sans-serif';
  ctx.fillStyle = '#292929';
  ctx.fillText('ทั้งในโลกออนไลน์ และความเป็นจริง', 500, 505);

  // Bottom details
  ctx.fillStyle = '#555';
  ctx.font = '25px sans-serif';
  ctx.fillText('คำพูดมีพลัง และทุกคำพูดมีผลตามมา', 500, 610);

  ctx.fillStyle = '#8e2025';
  ctx.fillRect(500, 650, 400, 5);
});

const mainMural = new THREE.Mesh(
  new THREE.PlaneGeometry(11.5, 5.2),
  new THREE.MeshBasicMaterial({ map: mainMuralTexture })
);

mainMural.position.set(0, 2.8, -9.82);
scene.add(mainMural);

/* =========================================
   LEFT WALL — HATE SPEECH DEFINITION
========================================= */

const leftPanelTexture = createCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#e8e5df';
  ctx.font = 'bold 90px Georgia';
  ctx.fillText('Hate Speech', 75, 180);

  ctx.fillStyle = '#8e2025';
  ctx.fillRect(75, 215, 700, 8);

  ctx.fillStyle = '#eeeeee';
  ctx.font = '42px sans-serif';

  drawWrappedText(
    ctx,
    'คือ การใช้คำพูด\nที่สร้างความเกลียดชัง\nดูถูก หรือแบ่งแยกผู้อื่น',
    80,
    330,
    850,
    75
  );

  ctx.fillStyle = '#aaaaaa';
  ctx.font = '32px sans-serif';

  drawWrappedText(
    ctx,
    'พบได้ทั้งในโลกออนไลน์\nและความเป็นจริง',
    80,
    670,
    850,
    60
  );

  ctx.fillStyle = '#8e2025';
  ctx.fillRect(75, 825, 8, 120);

  ctx.fillStyle = '#dddddd';
  ctx.font = '32px sans-serif';
  ctx.fillText('●   X   ◎   ♪   ▶', 110, 900);
});

const leftPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4.5, 5.2),
  new THREE.MeshBasicMaterial({ map: leftPanelTexture })
);

leftPanel.position.set(-8.82, 2.8, 0.3);
leftPanel.rotation.y = Math.PI / 2;
scene.add(leftPanel);

/* =========================================
   LEFT WALL — NEWSPAPER COLLAGE
========================================= */

addNewspaper(-8.79, 2.8, -5.9, 2.4, 3.8, Math.PI / 2, 0, 0);
addNewspaper(-8.78, 2.4, -3.4, 2.2, 2.7, Math.PI / 2, 0.03, 1);
addNewspaper(-8.78, 1.2, -7.8, 2.0, 2.2, Math.PI / 2, -0.03, 2);

// Newspaper stand near left wall
box(2.1, 0.12, 0.75, materials.black, -6.8, 0.95, -4.1);
box(0.12, 1.8, 0.12, materials.metal, -7.65, 0.9, -4.1);
box(0.12, 1.8, 0.12, materials.metal, -5.95, 0.9, -4.1);

addNewspaper(-6.8, 1.8, -4.1, 2.1, 1.4, 0, -0.05, 3);

/* =========================================
   RIGHT WALL — IMPACT PANEL
========================================= */

const impactTexture = createCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = '#101010';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#eeeeee';
  ctx.font = 'bold 85px sans-serif';
  ctx.fillText('ผลกระทบ', 75, 160);

  ctx.fillStyle = '#8e2025';
  ctx.fillRect(75, 195, 750, 7);

  const items = [
    ['♡', 'ทำร้ายจิตใจ'],
    ['♟', 'สร้างความแตกแยก'],
    ['⚖', 'กระทบสังคม'],
    ['', 'และความเท่าเทียม']
  ];

  let y = 340;

  for (const [symbol, label] of items) {
    ctx.fillStyle = '#e8e5df';
    ctx.font = '75px sans-serif';
    ctx.fillText(symbol, 90, y);

    ctx.font = '42px sans-serif';
    ctx.fillText(label, 230, y - 8);

    y += 140;
  }
});

const impactPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4.1, 5.2),
  new THREE.MeshBasicMaterial({ map: impactTexture })
);

impactPanel.position.set(8.82, 2.8, -2.1);
impactPanel.rotation.y = -Math.PI / 2;
scene.add(impactPanel);

/* =========================================
   RIGHT WALL — CAMPAIGN PANEL
========================================= */

const campaignTexture = createCanvasTexture((ctx, w, h) => {
  ctx.fillStyle = '#e9e5df';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#8e2025';
  ctx.font = 'bold 75px sans-serif';
  ctx.fillText('หยุด Hate Speech', 65, 160);

  ctx.fillStyle = '#111';
  ctx.font = 'bold 70px sans-serif';
  ctx.fillText('เริ่มได้จากเรา', 65, 270);

  ctx.font = '37px sans-serif';
  ctx.fillText('“พูดอย่างเคารพ', 90, 410);
  ctx.fillText('สร้างสังคมที่ดีกว่าได้”', 90, 470);

  ctx.fillStyle = '#8e2025';
  ctx.fillRect(90, 510, 420, 7);

  // Simplified city illustration
  ctx.fillStyle = '#444';

  const buildings = [
    [30, 700, 90, 220],
    [140, 640, 80, 280],
    [250, 680, 110, 240],
    [390, 610, 100, 310],
    [520, 680, 90, 240],
    [640, 620, 100, 300],
    [770, 690, 90, 230]
  ];

  for (const [x, y, bw, bh] of buildings) {
    ctx.fillRect(x, y, bw, bh);
  }

  ctx.fillStyle = '#222';

  for (let i = 0; i < 22; i++) {
    const x = (i % 11) * 85 + 25;
    const y = 850 + (i % 3) * 15;

    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(x - 13, y + 15, 26, 65);
  }
});

const campaignPanel = new THREE.Mesh(
  new THREE.PlaneGeometry(4.4, 5.2),
  new THREE.MeshBasicMaterial({ map: campaignTexture })
);

campaignPanel.position.set(8.82, 2.8, 4.2);
campaignPanel.rotation.y = -Math.PI / 2;
scene.add(campaignPanel);

/* =========================================
   RIGHT WALL — NEWSPAPER
========================================= */

addNewspaper(8.79, 1.0, -0.1, 2.2, 1.8, -Math.PI / 2, 0.02, 1);

/* =========================================
   DISPLAY PEDESTALS
========================================= */

function createPedestal(x, z, width, depth, height) {
  const base = box(
    width,
    height,
    depth,
    materials.black,
    x,
    height / 2,
    z
  );

  box(
    width + 0.04,
    0.06,
    depth + 0.04,
    materials.black,
    x,
    height + 0.03,
    z
  );

  return base;
}

// Main central pedestal
createPedestal(0, -1.5, 1.65, 1.5, 1.25);

// Left foreground pedestal
createPedestal(-7.9, 5.3, 2.1, 1.5, 0.9);

// Right foreground display table
createPedestal(6.5, 4.5, 3.2, 1.7, 0.9);

/* =========================================
   CENTRAL DISPLAY OBJECT
========================================= */

// Display glass frame
const glass = new THREE.Mesh(
  new THREE.BoxGeometry(1.1, 1.0, 0.85),
  materials.glass
);

glass.position.set(0, 1.9, -1.5);
scene.add(glass);

// Phone / digital exhibit
const phone = new THREE.Group();

const phoneBody = new THREE.Mesh(
  new THREE.BoxGeometry(0.34, 0.62, 0.08),
  materials.black
);

phone.add(phoneBody);

const phoneScreen = new THREE.Mesh(
  new THREE.PlaneGeometry(0.27, 0.5),
  new THREE.MeshBasicMaterial({ color: 0x222222 })
);

phoneScreen.position.z = 0.045;
phone.add(phoneScreen);

phone.position.set(0, 1.72, -1.5);
phone.rotation.x = -0.12;

scene.add(phone);

/* =========================================
   RIGHT DISPLAY TABLE CONTENT
========================================= */

addNewspaper(6.5, 1.45, 4.5, 2.7, 1.2, 0, -0.05, 2);

/* =========================================
   CEILING — TRACK LIGHTING
========================================= */

function createTrack(x, z, width, depth) {
  box(width, 0.08, depth, materials.metal, x, 5.35, z, false);
}

createTrack(0, -6, 16, 0.08);
createTrack(0, 0, 16, 0.08);
createTrack(0, 6, 16, 0.08);
createTrack(-6, 0, 0.08, 14);
createTrack(6, 0, 0.08, 14);

function createCeilingLamp(x, z) {
  const lamp = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.19, 0.35, 16),
    materials.metal
  );

  body.rotation.x = Math.PI / 2;
  lamp.add(body);

  const bulb = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff1d9 })
  );

  bulb.position.z = 0.18;
  lamp.add(bulb);

  lamp.position.set(x, 5.05, z);
  scene.add(lamp);
}

for (const x of [-6, -2, 2, 6]) {
  for (const z of [-6, 0, 6]) {
    createCeilingLamp(x, z);
  }
}

/* =========================================
   INTERACTION SYSTEM
========================================= */

const interactables = [];

function addInteractable(object, title, description) {
  interactables.push({
    object,
    title,
    description
  });
}

addInteractable(
  leftPanel,
  'HATE SPEECH คืออะไร?',
  'Hate Speech คือการใช้ถ้อยคำที่สร้างความเกลียดชัง ดูถูก เหยียดหยาม หรือแบ่งแยกผู้อื่น สามารถพบได้ทั้งในโลกออนไลน์และในชีวิตจริง'
);

addInteractable(
  mainMural,
  'HATE SPEECH คืออะไร?',
  'คำพูดมีพลังมากกว่าที่เราคิด การสื่อสารอย่างไม่ระมัดระวังอาจสร้างความเกลียดชังและความแตกแยกในสังคม'
);

addInteractable(
  impactPanel,
  'ผลกระทบของ Hate Speech',
  'คำพูดสร้างผลกระทบได้หลายด้าน ทั้งความรู้สึกและสภาพจิตใจ ความสัมพันธ์ระหว่างผู้คน ความแตกแยกในสังคม และความเท่าเทียม'
);

addInteractable(
  campaignPanel,
  'หยุด Hate Speech เริ่มได้จากเรา',
  'เราสามารถช่วยสร้างสังคมที่ดีขึ้นได้ด้วยการเคารพความแตกต่าง คิดก่อนพูด และไม่ส่งต่อข้อความที่สร้างความเกลียดชัง'
);

addInteractable(
  phone,
  'DIGITAL EXHIBITION',
  'ตัวอย่างเนื้อหา Hate Speech ในพื้นที่ออนไลน์และผลกระทบที่เกิดขึ้นกับผู้คน'
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

document.getElementById('close-info')
  .addEventListener('click', closeInfo);

document.getElementById('exit-button')
  .addEventListener('click', closeInfo);

const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);

function interact() {
  if (infoBox.style.display === 'flex') return;

  raycaster.setFromCamera(screenCenter, camera);

  const hits = raycaster.intersectObjects(
    interactables.map(item => item.object),
    true
  );

  if (!hits.length) return;

  const hitObject = hits[0].object;

  const found = interactables.find(item => {
    let current = hitObject;

    while (current) {
      if (current === item.object) return true;
      current = current.parent;
    }

    return false;
  });

  if (found) {
    showInfo(found.title, found.description);
  }
}

/* =========================================
   PLAYER MOVEMENT
========================================= */

const keys = {};

let yaw = 0;
let pitch = 0;

const moveSpeed = 4;
const lookSpeed = 0.003;

let isLocked = false;

const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

window.addEventListener('keydown', event => {
  keys[event.code] = true;

  if (event.code === 'KeyE') interact();
  if (event.code === 'Escape') closeInfo();
});

window.addEventListener('keyup', event => {
  keys[event.code] = false;
});

document.getElementById('start-button')
  .addEventListener('click', () => {
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

document.addEventListener('mousemove', event => {
  if (!isLocked) return;

  yaw -= event.movementX * lookSpeed;
  pitch -= event.movementY * lookSpeed;

  pitch = THREE.MathUtils.clamp(
    pitch,
    -Math.PI / 2.2,
    Math.PI / 2.2
  );
});

renderer.domElement.addEventListener('click', () => {
  if (!isTouchDevice && !isLocked &&
      document.getElementById('ui').style.display === 'none') {
    renderer.domElement.requestPointerLock?.();
  }
});

/* =========================================
   MOBILE JOYSTICK
========================================= */

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

function updateJoystick(event) {
  const rect = joystickZone.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let dx = event.clientX - centerX;
  let dy = event.clientY - centerY;

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

joystickZone.addEventListener('pointerdown', event => {
  if (!isTouchDevice || joystickTouchId !== null) return;

  joystickTouchId = event.pointerId;
  joystickZone.setPointerCapture(event.pointerId);
  updateJoystick(event);
});

joystickZone.addEventListener('pointermove', event => {
  if (event.pointerId !== joystickTouchId) return;
  updateJoystick(event);
});

function releaseJoystick(event) {
  if (event.pointerId !== joystickTouchId) return;

  joystickTouchId = null;
  resetJoystick();
}

joystickZone.addEventListener('pointerup', releaseJoystick);
joystickZone.addEventListener('pointercancel', releaseJoystick);

/* =========================================
   MOBILE CAMERA LOOK
========================================= */

lookZone.addEventListener('pointerdown', event => {
  if (!isTouchDevice || lookTouchId !== null) return;

  lookTouchId = event.pointerId;
  lastLookX = event.clientX;
  lastLookY = event.clientY;

  lookZone.setPointerCapture(event.pointerId);
});

lookZone.addEventListener('pointermove', event => {
  if (event.pointerId !== lookTouchId) return;

  const dx = event.clientX - lastLookX;
  const dy = event.clientY - lastLookY;

  yaw -= dx * lookSpeed * 1.5;
  pitch -= dy * lookSpeed * 1.5;

  pitch = THREE.MathUtils.clamp(
    pitch,
    -Math.PI / 2.2,
    Math.PI / 2.2
  );

  lastLookX = event.clientX;
  lastLookY = event.clientY;
});

function releaseLook(event) {
  if (event.pointerId !== lookTouchId) return;
  lookTouchId = null;
}

lookZone.addEventListener('pointerup', releaseLook);
lookZone.addEventListener('pointercancel', releaseLook);

document.getElementById('interact-button')
  .addEventListener('click', interact);

/* =========================================
   MOVEMENT UPDATE
========================================= */

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

  const length = Math.sqrt(
    forward * forward + sideways * sideways
  );

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

  // Room boundary
  camera.position.x = THREE.MathUtils.clamp(
    camera.position.x,
    -8.1,
    8.1
  );

  camera.position.z = THREE.MathUtils.clamp(
    camera.position.z,
    -9.1,
    9.2
  );

  camera.position.y = 1.7;
}

/* =========================================
   CAMERA UPDATE
========================================= */

function updateCamera() {
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

/* =========================================
   RESPONSIVE
========================================= */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

/* =========================================
   ANIMATION
========================================= */

const clock = new THREE.Clock();

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

/* =========================================
   FINISH
========================================= */

document.getElementById('loading').style.display = 'none';
