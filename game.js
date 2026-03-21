(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const rejouerBtn = document.getElementById("rejouer");
  const gameOverText = document.getElementById("gameOverText");
  const distanceDisplay = document.getElementById("distance");
  const menu = document.getElementById("menu");
  const playButton = document.getElementById("playButton");
  const shareBtn = document.getElementById("shareScore");
  const scoreBoard = document.getElementById("scoreBoard");
  const currentScoreSpan = document.getElementById("currentScore");
  const bestScoreSpan = document.getElementById("bestScore");
  const totalScoreSpan = document.getElementById("totalScore");
  const gradeSpan = document.getElementById("grade");

  const menuRocketCanvas = document.getElementById("menuRocket");
  const menuRocketCtx = menuRocketCanvas.getContext("2d");

  const objectifsBtn = document.getElementById("objectifsBtn");
  const objectifList = document.getElementById("objectifList");
  const objectifItems = document.getElementById("objectifItems");
  const rocketItems = document.getElementById("rocketItems");
  const totalDistanceDisplay = document.getElementById("totalDistanceDisplay");
  const closeObjectifs = document.getElementById("closeObjectifs");

  const milestoneMessage = document.getElementById("milestoneMessage");
  const levelFlash = document.getElementById("levelFlash");
  const successBanner = document.getElementById("success-banner");

  const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const toggleMusicBtn = document.getElementById("toggleMusic");
const resetGameBtn = document.getElementById("resetGameBtn");
const closeSettings = document.getElementById("closeSettings");

const backToMenuBtn = document.getElementById("backToMenu");

const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");  
  
  const clickSound = new Audio("click-151673.mp3");
  function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  const levelUpSound = new Audio("LevelUp.mp3");
  levelUpSound.volume = 0.6;
  levelUpSound.preload = "auto";
  levelUpSound.load();

  const starSound = new Audio("starSound.mp3");
starSound.volume = 0.4;
  
  const music = document.getElementById("gameMusic");
  if (music) music.volume = 0.3;

  
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

 
const menuObjectivesBtn = document.getElementById("menuObjectivesBtn");


const wordDisplay = document.getElementById("wordDisplay");
  
const GAME_ZOOM = isMobile ? 0.8 : 1;

// zoom léger quand ça va vite
const dynamicZoom = GAME_ZOOM - Math.min(distance / 10000, 0.1);

ctx.scale(dynamicZoom, dynamicZoom);
menuObjectivesBtn.onclick = () => {

playClick();
updateObjectifDisplay();
objectifList.style.display="flex";

};



  /* -------------------- Storage Keys -------------------- */ 
  const STORAGE_KEYS = {
  BEST_SCORE: "bestScore",
  TOTAL_DISTANCE: "totalDistance",
  TOTAL_STARS: "totalStars",
  TOTAL_GALAXY: "totalGalaxy",
  TOTAL_DESTROYED: "totalDestroyed",
  SELECTED_ROCKET: "selectedRocketKey",
  UNLOCKED_ROCKETS: "unlockedRockets",
  TOTAL_SPECIAL: "totalSpecial",  
};

  /* -------------------- Grades -------------------- */
  const gradeObjectifs = [
    { threshold: 0, label: "Interstellar Recruit" },
    { threshold: 500, label: "Space Adventurer" },
    { threshold: 1000, label: "Meteorite Hunter" },
    { threshold: 1500, label: "Cosmic Explorer" },
    { threshold: 2000, label: "Legendary  Pilot" },
    { threshold: 2500, label: "Stellar Commander" },
    { threshold: 3000, label: "Galactic Hero" },
    { threshold: 3500, label: "Astral Veteran" },
    { threshold: 4000, label: "Space Ace" },
    { threshold: 4500, label: "Star Guardian" },
    { threshold: 5000, label: "Legend of the Universe" }
  ];

  /* -------------------- Rockets -------------------- */
  const rocketDefinitions = [

{ key:"classic", label:"Classic Rocket", file:"rocket2.png", unlock:{type:"distance", value:0} },

{ key:"white", label:"White Rocket", file:"rocket3.png", unlock:{type:"distance", value:500} },

{ key:"steel", label:"Steel Rocket", file:"rocket4.png", unlock:{type:"stars", value:50} },

{ key:"red", label:"Red Rocket", file:"rocket5.png", unlock:{type:"galaxy", value:1} },

{ key:"aqua", label:"Aqua Rocket", file:"rocket6.png", unlock:{type:"stars", value:150} },

{ key:"blue", label:"Blue Rocket", file:"rocket7.png", unlock:{type:"distance", value:10000} },

{ key:"retro", label:"Retro Rocket", file:"rocket8.png", unlock:{type:"galaxy", value:10} },

{ key:"tech", label:"Tech Rocket", file:"rocket9.png", unlock:{type:"destroy", value:200} },

{ key:"orange", label:"Neon Rocket", file:"rocket10.png", unlock:{type:"stars", value:500} },

{ key:"gold", label:"Golden Rocket", file:"rocket11.png", unlock:{type:"run", value:3000} }

];

  function getSavedUnlockedRockets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_ROCKETS);
      const parsed = raw ? JSON.parse(raw) : ["classic"];
      return Array.isArray(parsed) && parsed.length ? parsed : ["classic"];
    } catch {
      return ["classic"];
    }
  }

  function saveUnlockedRockets(list) {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_ROCKETS, JSON.stringify(list));
  }

  function getTotalDistance() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_DISTANCE) || "0", 10);
  }

  function setTotalDistance(value) {
    localStorage.setItem(STORAGE_KEYS.TOTAL_DISTANCE, String(value));
  }

  function getTotalStars() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_STARS) || "0", 10);
}

function setTotalStars(v) {
  localStorage.setItem(STORAGE_KEYS.TOTAL_STARS, v);
}

function getTotalGalaxy() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_GALAXY) || "0", 10);
}

function setTotalGalaxy(v) {
  localStorage.setItem(STORAGE_KEYS.TOTAL_GALAXY, v);
}

function getTotalDestroyed() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_DESTROYED) || "0", 10);
}

function setTotalDestroyed(v) {
  localStorage.setItem(STORAGE_KEYS.TOTAL_DESTROYED, v);
}

function getTotalSpecial() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_SPECIAL) || "0", 10);
}

function setTotalSpecial(v) {
  localStorage.setItem(STORAGE_KEYS.TOTAL_SPECIAL, v);
}

  function getSelectedRocketKey() {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_ROCKET) || "classic";
  }

  function setSelectedRocketKey(key) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_ROCKET, key);
  }

  let unlockedRocketKeys = getSavedUnlockedRockets();
  let selectedRocketKey = getSelectedRocketKey();

  let rocketScrollIndex = 0
  const rocketSpacing = 220;

  if (!unlockedRocketKeys.includes("classic")) {
    unlockedRocketKeys.unshift("classic");
    saveUnlockedRockets(unlockedRocketKeys);
  }

  if (!unlockedRocketKeys.includes(selectedRocketKey)) {
    selectedRocketKey = "classic";
    setSelectedRocketKey(selectedRocketKey);
  }

  /* -------------------- Assets -------------------- */
  const rocketImages = {};

  rocketDefinitions.forEach(rocket => {

  const img = new Image();

  img.onload = () => {
    drawMenuRocket();
  };

  img.src = rocket.file;

  img.onerror = () => {
    if (rocket.file !== "rocket2.png") {
      img.src = "rocket2.png";
    }
  };

  rocketImages[rocket.key] = img;

});


  const meteoriteImages = [];
  const meteoriteImageSources = [
    "meteorite.png",
    "meteorite2.png",
    "meteorite3.png",
    "meteorite4.png",
    "meteorite5.png",
    "meteorite6.png"
  ];

  meteoriteImageSources.forEach(src => {
    const img = new Image();
    img.src = src;
    meteoriteImages.push(img);
  });

  function getCurrentRocketImage() {
    return rocketImages[selectedRocketKey] || rocketImages.classic;
  }

  function formatNumber(n) {
    return new Intl.NumberFormat("fr-FR").format(n);
  }

  const starImage = new Image();
starImage.src = "star.png";

// 🧲 AIMANT IMAGE
const magnetImage = new Image();
magnetImage.src = "magnet.png";

  const shieldImage = new Image();
shieldImage.src = "shield.png";

  // 🔤 LETTER IMAGES
const letterImages = {
  "G": new Image(),
  "A": new Image(),
  "L": new Image(),

  "X": new Image(),
  "Y": new Image()
};

letterImages["G"].src = "G.png";
letterImages["A"].src = "A.png";
letterImages["L"].src = "L.png";

letterImages["X"].src = "X.png";
letterImages["Y"].src = "Y.png";

  const explosionFrames = [];


for (let i = 1; i <= 8; i++) {
  const img = new Image();
  img.src = `Explosion${i}.png`;
  explosionFrames.push(img);
}

const specialObstacleImages = [];

const specialSources = [
  "Soyouz.png",
  "Ovni.png",
  "Starman.png",
  "ISS.png"
];

specialSources.forEach(src => {
  const img = new Image();
  img.src = src;
  specialObstacleImages.push(img);
});

  const x2Image = new Image();
x2Image.src = "X2.png"; // ton image

  
  /* -------------------- Canvas Resize -------------------- */
  let width, height;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr * GAME_ZOOM, dpr * GAME_ZOOM);
    width = (canvas.width / dpr) / GAME_ZOOM;
height = (canvas.height / dpr) / GAME_ZOOM;

    if (player) {
      player.x = isMobile ? 75 : 150;
    }
  }
  window.addEventListener("resize", resize);

  /* -------------------- Player -------------------- */
  const player = {
    x: 150,
    y: 0,
    radius: 30,
    velocityY: 0,
    gravityUp: -0.8,
    gravityDown: 0.9,
    maxSpeed: 6
  };

  resize();
  player.y = height / 2;

  /* -------------------- Input -------------------- */
  let pressing = false;

  window.addEventListener("keydown", e => {
    if (e.code === "Space") pressing = true;
  });

  window.addEventListener("keyup", e => {
    if (e.code === "Space") pressing = false;
  });

  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    pressing = true;
  }, { passive: false });

  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    pressing = false;
  }, { passive: false });

  canvas.addEventListener("touchcancel", e => {
    e.preventDefault();
    pressing = false;
  }, { passive: false });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
  }, { passive: false });

  /* -------------------- Game State -------------------- */
  let bubbles = [];
  let frameCount = 0;
  let flamePulse = 0;
  let gameOver = false;
  let distance = 0;
  let startTime = 0;
  let nextGradeIndex = 1;
  let animationId = null;
  let particles = [];
  let newlyUnlockedThisRun = [];

  let lastTime = 0;

  let starsCollectibles = [];
  let starScore = 0;

  let magnetActive = false;
  let magnetTimer = 0;
  let magnetDuration = 15000;
  let magnets = [];

  let lastMagnetSpawn = 0;
 

  let shieldActive = false;
let shieldTimer = 0;
let shieldDuration = 15000;
let shields = [];

let shieldRemaining = 0;

  let lastShieldSpawn = 0;


 let meteorDestroyed = 0;

  let specialObstacles = [];

 let lastSpecialSpawn = 0;

let x2s = [];
let lastX2Spawn = 0;

  // 🔤 WORD SYSTEM
const word = ["G", "A", "L", "A", "X", "Y"];
let currentLetterIndex = 0;
let letters = [];

  let lastLetterSpawn = 0;
const letterInterval = 10000; // 10 secondes

  let galaxyCompletedThisRun = 0;

  let specialDestroyedThisRun = {
  ISS: false,
  Starman: false,
  Soyouz: false,
  Ovni: false
};
  
  const distanceSpeedFactor = isMobile ? 3.8 : 2.5;
  const CONSTANT_SPEED = 14;

  /* -------------------- Stars Background -------------------- */
  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.2,
    speed: Math.random() * 0.6 + 0.2
  }));

  /* -------------------- Helpers -------------------- */
  function getBestScore() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0", 10);
  }

  function setBestScore(value) {
    localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(value));
  }

  function getGrade(score) {
  let currentGrade = gradeObjectifs[0].label;

  for (let i = 0; i < gradeObjectifs.length; i++) {
    if (score >= gradeObjectifs[i].threshold) {
      currentGrade = gradeObjectifs[i].label;
    } else {
      break;
    }
  }

  return currentGrade;
}

  function showMilestone(text) {
    milestoneMessage.textContent = text;
    requestAnimationFrame(() => {
      milestoneMessage.style.opacity = 1;
    });

    const sound = levelUpSound.cloneNode();
    sound.volume = 0.6;
    sound.play().catch(() => {});

    setTimeout(() => {
      milestoneMessage.style.opacity = 0;
    }, 1500);
  }

  function flashScreen(color = "cyan") {
    levelFlash.style.background = color;
    levelFlash.style.opacity = 0.8;

    setTimeout(() => {
      levelFlash.style.opacity = 0;
    }, 120);
  }

  function showSuccessBanner(text) {
    successBanner.textContent = text;
    successBanner.style.display = "block";
    successBanner.style.opacity = "1";

    setTimeout(() => {
      successBanner.style.display = "none";
    }, 2200);
  }

  function getFlashColor() {
    if (distance < 500) return "cyan";
    if (distance < 1000) return "#b366ff";
    if (distance < 1500) return "#ff6b4a";
    if (distance < 2000) return "#ffffff";
    return "#7df9ff";
  }

  function getSpaceColor() {
    if (distance < 500) return "#001122";
    if (distance < 1000) return "#1a0033";
    if (distance < 1500) return "#330000";
    if (distance < 2000) return "#000000";
    return "#000814";
  }

  function getStarColor() {
    if (distance < 500) return "white";
    if (distance < 1000) return "#d8c4ff";
    if (distance < 1500) return "#ffd0c4";
    if (distance < 2000) return "#dff7ff";
    return "#7df9ff";
  }

  function updateObjectifDisplay() {
    const bestScore = getBestScore();
    const totalDistance = getTotalDistance();
    const totalStars = getTotalStars();
const totalGalaxy = getTotalGalaxy();
const totalSpecial = getTotalSpecial();

const starsEl = document.getElementById("totalStarsDisplay");
if (starsEl) {
  starsEl.textContent = `Total stars: ${totalStars} ⭐`;
}

const galaxyEl = document.getElementById("totalGalaxyDisplay");
if (galaxyEl) {
  galaxyEl.textContent = `Galaxy completed: ${totalGalaxy}`;
}

const specialEl = document.getElementById("totalSpecialDisplay");
if (specialEl) {
  specialEl.textContent = `Special mission: ${totalSpecial} 🛰️`;
}

const distanceEl = document.getElementById("totalDistanceDisplay");
if (distanceEl) {
  distanceEl.textContent = `Total distance: ${formatNumber(totalDistance)} m`;
}

    objectifItems.innerHTML = "";

gradeObjectifs.forEach(obj => {

  const li = document.createElement("li");

  const unlocked = bestScore >= obj.threshold;

  li.className = "rocket-item";

  if(unlocked){
    li.classList.add("rocket-unlocked");
  } else {
    li.classList.add("rocket-locked");
  }

  const status = unlocked ? " — unlocked" : ` — locked (${formatNumber(obj.threshold)} m)`;

  li.textContent = `${obj.label}${status}`;

  objectifItems.appendChild(li);

});

    rocketItems.innerHTML = "";

rocketDefinitions.forEach(rocket => {

  const li = document.createElement("li");

  const unlocked = unlockedRocketKeys.includes(rocket.key);

  li.className = "rocket-item";
  li.classList.add(unlocked ? "rocket-unlocked" : "rocket-locked");

  const totalStars = getTotalStars();
  const totalGalaxy = getTotalGalaxy();
  const totalDestroyed = getTotalDestroyed();
  const totalDistance = getTotalDistance();
  const totalSpecial = getTotalSpecial();

  let progressText = "";

  switch(rocket.unlock.type){

    case "distance":
      progressText = `${formatNumber(totalDistance)} / ${formatNumber(rocket.unlock.value)} m`;
      break;

    case "stars":
      progressText = `${totalStars} / ${rocket.unlock.value} ⭐`;
      break;

    case "galaxy":
  progressText = `Complete GALAXY`;
  break;

    case "destroy":
      progressText = `${totalDestroyed} / ${rocket.unlock.value} 💥`;
      break;

    case "special":
      progressText = `${totalSpecial} / ${rocket.unlock.value} 🛰️`;
      break;

      case "run":
  progressText = `🚀 Reach ${formatNumber(rocket.unlock.value)} m in one run`;
  break;
  }

 const status = unlocked 
  ? " — unlocked" 
  : ` — ${progressText}`;

li.textContent = `${rocket.label}${status}`;

  rocketItems.appendChild(li);

});
  }

  function unlockRocketsIfNeeded() {

  const totalDistance = getTotalDistance();
  const totalStars = getTotalStars();
  const totalGalaxy = getTotalGalaxy();
  const totalDestroyed = getTotalDestroyed();
  const totalSpecial = getTotalSpecial();

  const newUnlocks = [];

  rocketDefinitions.forEach(rocket => {

    if (unlockedRocketKeys.includes(rocket.key)) return;

    let unlocked = false;

    switch(rocket.unlock.type){

      case "distance":
        unlocked = totalDistance >= rocket.unlock.value;
        break;

      case "stars":
        unlocked = totalStars >= rocket.unlock.value;
        break;

      case "galaxy":
        unlocked = totalGalaxy >= rocket.unlock.value;
        break;

      case "destroy":
        unlocked = totalDestroyed >= rocket.unlock.value;
        break;

      case "special":
        unlocked = totalSpecial >= rocket.unlock.value;
        break;

        case "run":
  unlocked = bestScore >= rocket.unlock.value;
  break;
    }

    if (unlocked) {
      unlockedRocketKeys.push(rocket.key);
      newUnlocks.push(rocket);
    }

  });

  if (newUnlocks.length) {
    saveUnlockedRockets(unlockedRocketKeys);
  }

  return newUnlocks;
}

  function checkSpecialMission() {

  if (
    specialDestroyedThisRun.ISS &&
    specialDestroyedThisRun.Starman &&
    specialDestroyedThisRun.Soyouz &&
    specialDestroyedThisRun.Ovni
  ) {

    showSuccessBanner("🛰️ ALL SPECIAL DESTROYED!");

    starScore += 50;

    const total = getTotalSpecial() + 1;
    setTotalSpecial(total);

    specialDestroyedThisRun = {
      ISS: false,
      Starman: false,
      Soyouz: false,
      Ovni: false
    };
  }
}

  /* -------------------- Bubble (Meteorite) -------------------- */
  function createBubble(speed) {
    const base = isMobile ? 15 : 25;
    const extra = isMobile ? 10 : 15;
    const radius = Math.random() * extra + base;
    const y = radius + Math.random() * (height - 2 * radius);
    const image = meteoriteImages[Math.floor(Math.random() * meteoriteImages.length)];

    bubbles.push({
      x: width + radius,
      y,
      radius,
      speed,
      direction: Math.random() < 0.5 ? 1 : -1,
      floatSpeed: 1 + Math.random() * 2,
      image
    });
  }

function createStar(speed) {
  const size = 20;

  starsCollectibles.push({
    x: width + size + 200,
    y: Math.random() * (height - size * 2) + size,
    size: size,
    speed: speed * 0.8
  });
}
  
  function createMagnet(speed) {
  magnets.push({
    x: width + 40,
    y: Math.random() * (height - 80) + 40,
    size: 25,
    speed: speed * 0.6
  });
}

  function createShield(speed) {
  shields.push({
    x: width + 40,
    y: Math.random() * (height - 80) + 40,
    size: 25,
    speed: speed * 0.6
  });
}

  function createX2(speed) {
  x2s.push({
    x: width + 40,
    y: Math.random() * (height - 80) + 40,
    size: 28,
    speed: speed * 0.6
  });
}

// 🔤 SPAWN LETTER
function createLetter(speed) {
  if (currentLetterIndex >= word.length) return;

  const letter = word[currentLetterIndex];

  letters.push({
    x: width + 50,
    y: Math.random() * (height - 100) + 50,
    size: 35,
    speed: speed * 0.6,
    letter: letter
  });
}
  
  function isColliding(c, b) {
    const dx = c.x - b.x;
    const dy = c.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < c.radius + b.radius;
  }

  function createSpecialObstacle(speed) {

  const index = Math.floor(Math.random() * specialObstacleImages.length);
  const image = specialObstacleImages[index];

  let size;

  // 🎯 taille fixe par type
  if (image.src.includes("ISS")) {
    size = 100;
  } else if (image.src.includes("Ovni")) {
    size = 35;
  } else if (image.src.includes("Soyouz")) {
    size = 38;
  } else if (image.src.includes("Starman")) {
    size = 32;
  } else {
    size = 35;
  }

  let y;
  do {
    y = Math.random() * (height - size * 2) + size;
  } while (Math.abs(y - player.y) < 120);

  specialObstacles.push({
    x: width + size + 200,
    y,
    size,
    speed: speed * 0.9,
    image
  });
}
  /* -------------------- Particles -------------------- */
 
  class SpriteExplosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.frame = 0;

    this.frameDuration = 120; // ms par frame (~1s total)
    this.lastUpdate = performance.now();
  }

  update() {
    const now = performance.now();

    if (now - this.lastUpdate > this.frameDuration) {
      this.frame++;
      this.lastUpdate = now;
    }
  }

  draw() {
  const img = explosionFrames[this.frame];
  if (!img || !img.complete) return;

  const size = 90 + this.frame * 10;
  const alpha = 1 - this.frame / explosionFrames.length;

  // 🌟 HALO
  ctx.save();
  ctx.globalAlpha = 0.2 * alpha;
  ctx.fillStyle = "#00ccff";
  ctx.beginPath();
  ctx.arc(this.x, this.y, size * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 🔥 GLOW
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#00ccff";

  ctx.drawImage(
    img,
    this.x - size / 2,
    this.y - size / 2,
    size,
    size
  );

  ctx.restore();
}

  isDead() {
    return this.frame >= explosionFrames.length;
  }
}

 function createExplosion(x, y) {
  particles.push(new SpriteExplosion(x, y));
}

  /* -------------------- Drawing -------------------- */
  function drawFlame(x, y) {
    const pulse = Math.sin(flamePulse) * 0.5 + 0.5;
    const flameLength = 30 + pulse * 25;
    const flameWidth = 20 + pulse * 10;

    const gradient = ctx.createLinearGradient(x, y, x - flameLength, y);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.3, "orange");
    gradient.addColorStop(0.7, "red");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y - flameWidth / 2);
    ctx.quadraticCurveTo(x - flameLength / 2, y, x - flameLength, y);
    ctx.quadraticCurveTo(x - flameLength / 2, y, x, y + flameWidth / 2);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  function drawRocket(x, y, radius) {
    const currentRocket = getCurrentRocketImage();
  
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(currentRocket, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawStar(star) {
  if (!starImage.complete || starImage.naturalWidth === 0) return;

  ctx.save();
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.globalAlpha = 1;
  ctx.filter = "none";

  ctx.drawImage(
    starImage,
    star.x - star.size,
    star.y - star.size,
    star.size * 2,
    star.size * 2
  );

  ctx.restore();
}



  

  function drawMeteorite(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.drawImage(b.image, -b.radius, -b.radius, b.radius * 2, b.radius * 2);
    ctx.restore();
  }

  function drawSpecialObstacle(o) {
  if (!o.image.complete) return;

  ctx.save();
  ctx.drawImage(
    o.image,
    o.x - o.size,
    o.y - o.size,
    o.size * 2,
    o.size * 2
  );
  ctx.restore();
}

   function drawMagnet(m) {
  if (!magnetImage.complete || magnetImage.naturalWidth === 0) return;

  ctx.save();

  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ffd700"; // glow gold

  ctx.drawImage(
    magnetImage,
    m.x - m.size,
    m.y - m.size,
    m.size * 2,
    m.size * 2
  );

  ctx.restore();
}

 function drawShield(s) {
  if (!shieldImage.complete || shieldImage.naturalWidth === 0) return;

  ctx.save();

  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00ffcc"; // couleur du shield (turquoise)

  ctx.drawImage(
    shieldImage,
    s.x - s.size,
    s.y - s.size,
    s.size * 2,
    s.size * 2
  );

  ctx.restore();
}

function drawX2(b) {
  if (!x2Image.complete) return;

  ctx.save();
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#ffd700";

  ctx.drawImage(
    x2Image,
    b.x - b.size,
    b.y - b.size,
    b.size * 2,
    b.size * 2
  );

  ctx.restore();
}
  
  function drawStars() {
    ctx.fillStyle = getSpaceColor();
    ctx.fillRect(0, 0, width, height);

    const speedLevel = Math.floor(distance / 500);
    ctx.fillStyle = getStarColor();

    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius + speedLevel * 0.08, 0, Math.PI * 2);
      ctx.fill();

      s.x -= s.speed + speedLevel * 0.18;
      if (s.x < 0) {
        s.x = width;
        s.y = Math.random() * height;
      }
    });
  }

  

  /* -------------------- Scoreboard -------------------- */
  function afficherTableauScore(score) {
    const runScore = Math.floor(score);
    const bestScore = Math.max(runScore, getBestScore());
    setBestScore(bestScore);

    const previousTotal = getTotalDistance();
    const newTotal = previousTotal + runScore;
    setTotalDistance(newTotal);

    


    // ⭐ stars
const totalStars = getTotalStars() + starScore;
setTotalStars(totalStars);

// 🔤 galaxy
const totalGalaxy = getTotalGalaxy() + galaxyCompletedThisRun;
setTotalGalaxy(totalGalaxy);

// 💥 destruction
const totalDestroyed = getTotalDestroyed() + meteorDestroyed;
setTotalDestroyed(totalDestroyed);

const starsRunEl = document.getElementById("starsRun");
if (starsRunEl) starsRunEl.textContent = starScore;

const starsTotalEl = document.getElementById("starsTotal");
if (starsTotalEl) starsTotalEl.textContent = getTotalStars();

const galaxyRunEl = document.getElementById("galaxyRun");
if (galaxyRunEl) galaxyRunEl.textContent = galaxyCompletedThisRun;

const galaxyTotalEl = document.getElementById("galaxyTotal");
if (galaxyTotalEl) galaxyTotalEl.textContent = getTotalGalaxy();

const specialTotalEl = document.getElementById("specialTotal");
if (specialTotalEl) specialTotalEl.textContent = getTotalSpecial();

    newlyUnlockedThisRun = unlockRocketsIfNeeded(newTotal);

    currentScoreSpan.textContent = formatNumber(runScore);
    bestScoreSpan.textContent = formatNumber(bestScore);
    totalScoreSpan.textContent = formatNumber(newTotal);
    gradeSpan.textContent = getGrade(bestScore);

    updateObjectifDisplay();
    scoreBoard.style.display = "block";

    if (newlyUnlockedThisRun.length) {
      const lastUnlocked = newlyUnlockedThisRun[newlyUnlockedThisRun.length - 1];
      setTimeout(() => {
        showSuccessBanner(`🚀 New rocket unlocked: ${lastUnlocked.label}`);
      }, 250);
    }
  }




  /* -------------------- Reset -------------------- */
  function resetGame() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

   

    if (isMobile) {
  player.gravityDown = 1.9;
  player.gravityUp = -1.7;
  player.maxSpeed = 10;
} else {
  player.gravityDown = 2.2;
  player.gravityUp = -2.2;
  player.maxSpeed = 11;
}
    nextGradeIndex = 1;
    player.radius = 30;
    bubbles = [];
    specialObstacles = [];
    particles = [];
    starsCollectibles = [];
    starScore = 0;
    magnets = [];
    magnetActive = false;
    frameCount = 0;
    flamePulse = 0;
    gameOver = false;
    distance = 0;
    startTime = performance.now();
    newlyUnlockedThisRun = [];
    lastTime = performance.now();
    player.y = height / 2;
    player.velocityY = 0;
    player.x = isMobile ? 75 : 150;
    pressing = false;
    lastMagnetSpawn = performance.now();
    lastShieldSpawn = performance.now() + 5000;
    meteorDestroyed = 0;
    currentLetterIndex = 0;
    letters = [];
    galaxyCompletedThisRun = 0;
    lastLetterSpawn = performance.now();
    [rejouerBtn, gameOverText, shareBtn].forEach(e => e.style.display = "none");
    objectifsBtn.style.display = "none";
    objectifList.style.display = "none";
    scoreBoard.style.display = "none";
    distanceDisplay.style.display = "block";
    backToMenuBtn.style.display = "none";
    progressBar.parentElement.style.display = "block";
    progressLabel.style.display = "block";
    lastSpecialSpawn = 0;

    x2s = [];
    
  }
  specialDestroyedThisRun = {
  ISS: false,
  Starman: false,
  Soyouz: false,
  Ovni: false
};

  /* -------------------- Buttons -------------------- */
  playButton.onclick = () => {
    playClick();

   document.getElementById("topHUD").style.display = "flex";

    if (music && musicEnabled) {
  music.currentTime = 0;
  music.play().catch(() => {});
}

    menu.style.display = "none";
    resetGame();

    wordDisplay.style.display = "block";
distanceDisplay.style.display = "block";

    progressBar.parentElement.style.display = "block";
progressLabel.style.display = "block";

    const menuCanvas = document.getElementById("menuStars");
    if (menuCanvas) menuCanvas.style.display = "none";

    animationId = requestAnimationFrame(gameLoop);
  };

  rejouerBtn.onclick = () => {
    playClick();

    if (music && musicEnabled) {
  music.currentTime = 0;
  music.play().catch(() => {});
}

    resetGame();
    wordDisplay.style.display = "block";
    animationId = requestAnimationFrame(gameLoop);
  };

  objectifsBtn.onclick = () => {
    playClick();
    updateObjectifDisplay();
    objectifList.style.display = "flex";
  };

  closeObjectifs.onclick = () => {
    playClick();
    objectifList.style.display = "none";
  };

  shareBtn.onclick = () => {
    playClick();
    const text = `J'ai fait ${Math.floor(distance)} m dans AstroLab Rush ! Peux-tu faire mieux ? 🚀🎮`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: "AstroLab Rush - Mon score",
        text,
        url
      }).catch(() => {});
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`,
        "_blank"
      );
    }
  };

  backToMenuBtn.onclick = () => {

  playClick();

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // reset visuel
  gameOver = false;
  bubbles = [];
  particles = [];

  // cacher UI game
  gameOverText.style.display = "none";
  scoreBoard.style.display = "none";
  rejouerBtn.style.display = "none";
  shareBtn.style.display = "none";
  objectifsBtn.style.display = "none";
  backToMenuBtn.style.display = "none";

  // remettre menu
  menu.style.display = "block";

  // remettre background menu
  const menuCanvas = document.getElementById("menuStars");
  if (menuCanvas) menuCanvas.style.display = "block";

  wordDisplay.style.display = "none";  
  distanceDisplay.style.display = "none";
  progressBar.parentElement.style.display = "none";
progressLabel.style.display = "none";  

  drawMenuRocket();

};

  /* -------------------- Start Screen -------------------- */
  menu.style.display = "block";
  distanceDisplay.style.display = "none";
  updateObjectifDisplay();

  drawMenuRocket();

  /* -------------------- Main Loop -------------------- */
  function gameLoop(timestamp) {

  let dt = (timestamp - lastTime) / 16.67; // normalisé à 60fps
  dt = Math.min(dt, 1.5);  
  lastTime = timestamp;
    drawStars();

    const speedFactor = isMobile ? 0.7 : 1;
    const meteorSpeedFactor = 1;

const effectiveDistance = Math.min(distance, 1500);

// 👉 UTILISE effectiveDistance PARTOUT
const speedLevel = Math.floor(effectiveDistance / 400);

// 🚀 démarrage plus lent
const baseSpeed = (11 + speedLevel * 0.8) * speedFactor;

// 🧠 limite propre
const cappedSpeed = Math.min(baseSpeed, 26);

// ⚡ accélération BLOQUÉE à 1500
const speedRamp = 1 + (effectiveDistance / 3000);

const finalSpeed = cappedSpeed * speedRamp;
    const spawnRate = 25;
    const maxMeteorites = isMobile ? 25 : 20;

    frameCount += dt;

if (frameCount >= spawnRate && bubbles.length < maxMeteorites && !gameOver) {
  frameCount = 0;
  createBubble(finalSpeed);
    }

    // 🛰️ SPAWN RARE
if (
  !gameOver &&
  specialObstacles.length === 0 &&
  performance.now() - lastSpecialSpawn > 8000
) {
  createSpecialObstacle(finalSpeed);
  lastSpecialSpawn = performance.now();
}

    if (Math.random() < 0.02 && !gameOver) {
createStar(finalSpeed);
}

if (
  !gameOver &&
  !magnetActive &&
  magnets.length === 0 &&
  performance.now() - lastMagnetSpawn > 12000
) {
  createMagnet(finalSpeed);
  lastMagnetSpawn = performance.now();
}
  if (
  !gameOver &&
  !shieldActive &&
  shields.length === 0 &&
  performance.now() - lastShieldSpawn > 15000
) {
  createShield(finalSpeed);
  lastShieldSpawn = performance.now();
}

    if (
  !gameOver &&
 
  x2s.length === 0 &&
  performance.now() - lastX2Spawn > 20000
) {
  createX2(finalSpeed);
  lastX2Spawn = performance.now();
}

   // 🔤 SPAWN LETTER (toutes les 10s)
if (
  !gameOver &&
  letters.length === 0 &&
  performance.now() - lastLetterSpawn > letterInterval
) {
  createLetter(finalSpeed);
  lastLetterSpawn = performance.now();
} 
    
    for (let i = bubbles.length - 1; i >= 0; i--) {
  const b = bubbles[i];

  b.x -= b.speed * Math.min(dt, 1.2);

  // 🛡️ SHIELD destruction
  const dx = player.x - b.x;
  const dy = player.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (shieldActive && dist < player.radius + 80) {
  createExplosion(b.x, b.y);

  meteorDestroyed++; // ✅ AJOUT

  

  bubbles.splice(i, 1);
  continue;
}

  if (b.y > height - b.radius || b.y < b.radius) {
    b.direction *= -1;
  }

  if (b.x + b.radius < 0) {
    bubbles.splice(i, 1);
  }
}

// 🛰️ SPECIAL OBSTACLES
for (let i = specialObstacles.length - 1; i >= 0; i--) {
  const o = specialObstacles[i];

  o.x -= o.speed * dt* 0.6;

  const dx = player.x - o.x;
  const dy = player.y - o.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 🛡️ shield détruit

  
  if (shieldActive && dist < player.radius + o.size) {
const src = o.image.src;

if (src.includes("ISS")) specialDestroyedThisRun.ISS = true;
if (src.includes("Starman")) specialDestroyedThisRun.Starman = true;
if (src.includes("Soyouz")) specialDestroyedThisRun.Soyouz = true;
if (src.includes("Ovni")) specialDestroyedThisRun.Ovni = true;
    
    createExplosion(o.x, o.y);
    specialObstacles.splice(i, 1);
    continue;
  }

  // 💥 collision

 
  if (!shieldActive && dist < player.radius + o.size * 0.5) {
   
    createExplosion(player.x, player.y);
    gameOver = true;

    wordDisplay.style.display = "none";

    document.getElementById("topHUD").style.display = "none";
    
    if (music) music.pause();
    gameOverText.style.display = "block";
    distanceDisplay.style.display = "none";

    afficherTableauScore(distance);

    rejouerBtn.style.display = "block";
    shareBtn.style.display = "block";
    objectifsBtn.style.display = "block";
    backToMenuBtn.style.display = "block";

    break;
  }

  if (o.x < -100) {
    specialObstacles.splice(i, 1);
  }
}    
    
    // ⭐ étoiles mouvement + collision
for (let i = starsCollectibles.length - 1; i >= 0; i--) {
  const s = starsCollectibles[i];

  if (magnetActive) {
    const dx = player.x - s.x;
    const dy = player.y - s.y;

    s.x += dx * 0.08;
    s.y += dy * 0.08;
  } else {
    s.x -= s.speed * dt * 0.6;
  }


  
  const dx = player.x - s.x;
  const dy = player.y - s.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < player.radius + s.size) {
starScore += 1;

    starSound.currentTime = 0;
    starSound.play().catch(()=>{});

  
    starsCollectibles.splice(i, 1);
    continue;
  }

  if (s.x < -50) {
    starsCollectibles.splice(i, 1);
  }
}

   // 🧲 AIMANT
for (let i = magnets.length - 1; i >= 0; i--) {
  const m = magnets[i];

  m.x -= m.speed * dt * 0.6;

  const dx = player.x - m.x;
  const dy = player.y - m.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < player.radius + m.size) {
    magnetActive = true;
    magnetTimer = performance.now();
    lastMagnetSpawn = performance.now();
    lastShieldSpawn = performance.now();

    showSuccessBanner("🧲 MAGNET!");


    magnets.splice(i, 1);
    continue;
  }

  if (m.x < -50) {
    magnets.splice(i, 1);
  }
}

    // 🛡️ SHIELD
for (let i = shields.length - 1; i >= 0; i--) {
  const s = shields[i];

  s.x -= s.speed * dt * 0.6;

  const dx = player.x - s.x;
  const dy = player.y - s.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < player.radius + s.size) {
    shieldActive = true;
    shieldTimer = performance.now();

    showSuccessBanner("🛡️ SHIELD!");

    shields.splice(i, 1);
    continue;
  }

  if (s.x < -50) {
    shields.splice(i, 1);
  }
}

    // 💰 X2 BONUS
for (let i = x2s.length - 1; i >= 0; i--) {
  const b = x2s[i];

  b.x -= b.speed * dt * 0.6;

  const dx = player.x - b.x;
  const dy = player.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < player.radius + b.size) {
  starScore *= 2;

   
    showSuccessBanner("💰 x2 COINS!");

    x2s.splice(i, 1);
    continue;
  }

  if (b.x < -50) {
    x2s.splice(i, 1);
  }
}

    // 🔤 LETTERS
for (let i = letters.length - 1; i >= 0; i--) {
  const l = letters[i];

  l.x -= l.speed * dt;

  const dx = player.x - l.x;
  const dy = player.y - l.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // 🎯 COLLISION
  if (dist < player.radius + l.size) {

   starSound.currentTime = 0;
starSound.play().catch(()=>{});

    currentLetterIndex++;
    letters.splice(i, 1);

    

    // 🎉 MOT COMPLET
    if (currentLetterIndex >= word.length) {

      galaxyCompletedThisRun++;

      currentLetterIndex = 0;

      showSuccessBanner("🌌 GALAXY COMPLETE!");

      // BONUS (choisis ton style)
      shieldActive = true;
      shieldTimer = performance.now();
    }

    continue;
  }

  if (l.x < -50) {
    letters.splice(i, 1);
  }
}

  if (magnetActive) {
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = "#00cfff";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
      
    if (!gameOver) {

document.getElementById("starCount").textContent = starScore; // 👈 AJOUT
  document.getElementById("destroyCount").textContent = meteorDestroyed; // 👈 AJOUT
      
     player.velocityY += (pressing ? player.gravityDown : player.gravityUp) * dt;
player.velocityY = Math.max(-player.maxSpeed, Math.min(player.velocityY, player.maxSpeed));
player.y += player.velocityY * dt;
player.velocityY *= Math.pow(0.87, dt);

      if (player.y < player.radius) {
        player.y = player.radius;
        player.velocityY = 0;
      } else if (player.y > height - player.radius) {
        player.y = height - player.radius;
        player.velocityY = 0;
      }

      distance += (baseSpeed / 60) * distanceSpeedFactor * dt;
      distanceDisplay.textContent =
  `Distance: ${formatNumber(Math.floor(distance))} m ⭐ ${starScore} 💥 ${meteorDestroyed}`;

     

      const displayWord = word.map((letter, index) => {
  return index < currentLetterIndex ? letter : "_";
}).join(" ");

wordDisplay.textContent = displayWord;

      // 🔥 PROGRESSION VERS PROCHAIN PALIER
let currentThreshold = 0;
let nextThreshold = gradeObjectifs[gradeObjectifs.length - 1].threshold;

for (let i = 0; i < gradeObjectifs.length; i++) {
  if (distance >= gradeObjectifs[i].threshold) {
    currentThreshold = gradeObjectifs[i].threshold;

    if (i + 1 < gradeObjectifs.length) {
      nextThreshold = gradeObjectifs[i + 1].threshold;
    }
  }
}

const progress = (distance - currentThreshold) / (nextThreshold - currentThreshold);
const percent = Math.max(0, Math.min(progress, 1)) * 100;

progressBar.style.width = percent + "%";

// 🔥 BONUS VISUEL
  progressBar.style.boxShadow = percent > 80 ? "0 0 8px white" : "none";      

const remaining = Math.floor(nextThreshold - distance);
progressLabel.textContent = `Next Grade : ${remaining} m`;

progressBar.style.background = getFlashColor();     

const progressText = document.getElementById("progressText");

progressText.textContent =
  Math.floor(distance) + " / " + nextThreshold;      

      if (
        nextGradeIndex < gradeObjectifs.length &&
        distance >= gradeObjectifs[nextGradeIndex].threshold
      ) {
        const grade = gradeObjectifs[nextGradeIndex];

        distanceDisplay.classList.add("distancePulse");
        setTimeout(() => {
          distanceDisplay.classList.remove("distancePulse");
        }, 400);

        showMilestone(grade.label);
        flashScreen(getFlashColor());

        nextGradeIndex++;
      }

      for (let i = 0; i < bubbles.length; i++) {
    
        if (isColliding(player, bubbles[i])) {
          createExplosion(player.x, player.y);
          gameOver = true;
          wordDisplay.style.display = "none";
          
          if (music) music.pause();
          gameOverText.style.display = "block";
          distanceDisplay.style.display = "none";

          progressBar.parentElement.style.display = "none";
progressLabel.style.display = "none";
          
         if (percent > 85) {
  progressBar.style.boxShadow = "0 0 10px white";
} else {
  progressBar.style.boxShadow = "none";
}
afficherTableauScore(distance);

    rejouerBtn.style.display = "block";
    shareBtn.style.display = "block";
    objectifsBtn.style.display = "block";
    backToMenuBtn.style.display = "block";

    break;
       }   
      }
    }

   for (let i = particles.length - 1; i >= 0; i--) {
  const e = particles[i];

  e.update();
  e.draw();

  if (e.isDead()) {
    particles.splice(i, 1);
  }
}

    if (magnetActive) {
  if (performance.now() - magnetTimer > magnetDuration) {
    magnetActive = false;
  }
}

    // 🛡️ UPDATE SHIELD TIMER (MANQUANT)
if (shieldActive) {
  shieldRemaining = shieldDuration - (performance.now() - shieldTimer);

  if (shieldRemaining <= 0) {
    shieldActive = false;
    shieldRemaining = 0;

    showSuccessBanner("⚠️ SHIELD OFF");
  }
}

   

    // ⭐ étoiles
starsCollectibles.forEach(drawStar);
magnets.forEach(drawMagnet);
bubbles.forEach(drawMeteorite);
shields.forEach(drawShield);
specialObstacles.forEach(drawSpecialObstacle);
x2s.forEach(drawX2);    

    // 🔤 DRAW LETTERS
letters.forEach(l => {
  const img = letterImages[l.letter];
  if (!img.complete) return;

  ctx.drawImage(
    img,
    l.x - l.size,
    l.y - l.size,
    l.size * 2,
    l.size * 2
  );
});

    // 🛡️ SHIELD (visuel + clignotement)
if (shieldActive) {

  let alpha = 0.25;

  if (shieldRemaining < 1000) {
    alpha = Math.sin(performance.now() / 80) * 0.5 + 0.5;
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#00ffcc";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

if (!gameOver) {
  drawRocket(player.x, player.y, player.radius);
}
   

    // 🛡️ SHIELD VISUEL (UN SEUL DRAW PROPRE)
if (shieldActive) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#00ffcc";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
    // ⚠️ SHIELD FIN (clignote)
if (shieldActive && shieldRemaining < 1000) {
  ctx.save();
  ctx.globalAlpha = Math.sin(performance.now() / 50) * 0.5 + 0.5;
  ctx.fillStyle = "#00ffcc";
  ctx.beginPath();
  ctx.arc(player.x, player.y, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
    checkSpecialMission();
    frameCount++;
    flamePulse += 0.15;

    if (!gameOver || particles.length > 0) {
  animationId = requestAnimationFrame(gameLoop);
}
  }



  /* -------------------- Menu Stars Background -------------------- */
  const menuCanvas = document.getElementById("menuStars");
  if (menuCanvas) {
    const menuCtx = menuCanvas.getContext("2d");
    let menuStars = [];

    function resizeMenuCanvas() {
      menuCanvas.width = window.innerWidth;
      menuCanvas.height = window.innerHeight;
      menuStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * menuCanvas.width,
        y: Math.random() * menuCanvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2
      }));
    }

    resizeMenuCanvas();
    window.addEventListener("resize", resizeMenuCanvas);

    function animateMenuStars() {
      menuCtx.fillStyle = "#001122";
      menuCtx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
      menuCtx.fillStyle = "white";

      menuStars.forEach(s => {
        s.x -= s.speed;
        if (s.x < 0) s.x = menuCanvas.width;

        menuCtx.beginPath();
        menuCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        menuCtx.fill();
      });

      requestAnimationFrame(animateMenuStars);
    }

    animateMenuStars();
  }
  function drawMenuRocket(){

  if(!menuRocketCanvas) return;

  const size = menuRocketCanvas.clientWidth;

  menuRocketCanvas.width = size;
  menuRocketCanvas.height = 160;

  menuRocketCtx.clearRect(0,0,size,160);

  const rocket = rocketDefinitions[rocketScrollIndex];
  const img = rocketImages[rocket.key];

  const centerX = size/2;
  const centerY = menuRocketCanvas.height/2;

  const unlocked = unlockedRocketKeys.includes(rocket.key);

  menuRocketCtx.save();

  if(!unlocked){
    menuRocketCtx.globalAlpha = 0.35;
    menuRocketCtx.filter = "grayscale(100%)";
  }

  const rocketSize = isMobile ? 80 : 80;

menuRocketCtx.drawImage(
  img,
  centerX - rocketSize / 2,
  centerY - rocketSize / 2,
  rocketSize,
  rocketSize
);

  menuRocketCtx.restore();

}


  

const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");

arrowLeft.onclick = () => {

  rocketScrollIndex = Math.max(0, rocketScrollIndex - 1);

  const rocket = rocketDefinitions[rocketScrollIndex];

  if(unlockedRocketKeys.includes(rocket.key)){
    selectedRocketKey = rocket.key;
    setSelectedRocketKey(rocket.key);
    showSuccessBanner(`🚀 ${rocket.label} selected`);
  }

  drawMenuRocket();
};

arrowRight.onclick = () => {

  rocketScrollIndex = Math.min(rocketDefinitions.length - 1, rocketScrollIndex + 1);

  const rocket = rocketDefinitions[rocketScrollIndex];

  if(unlockedRocketKeys.includes(rocket.key)){
    selectedRocketKey = rocket.key;
    setSelectedRocketKey(rocket.key);
    showSuccessBanner(`🚀 ${rocket.label} selected`);
  }

  drawMenuRocket();
};

settingsBtn.onclick = () => {

  playClick();
  settingsPanel.style.display = "flex";

};

closeSettings.onclick = () => {

  playClick();
  settingsPanel.style.display = "none";

};

let musicEnabled = localStorage.getItem("music") !== "off";

toggleMusicBtn.textContent = musicEnabled ? "Music: ON" : "Music: OFF";

toggleMusicBtn.onclick = () => {

  playClick();

  musicEnabled = !musicEnabled;

  localStorage.setItem("music", musicEnabled ? "on" : "off");

  if (musicEnabled) {
    toggleMusicBtn.textContent = "Music: ON";
    if (music) music.play().catch(()=>{});
  } else {
    toggleMusicBtn.textContent = "Music: OFF";
    if (music) music.pause();
  }

};

 resetGameBtn.onclick = () => {

  playClick();

  const confirmReset = confirm("Reset all progress ?");

  if(!confirmReset) return;

  localStorage.removeItem(STORAGE_KEYS.BEST_SCORE);
  localStorage.removeItem(STORAGE_KEYS.TOTAL_DISTANCE);
  localStorage.removeItem(STORAGE_KEYS.SELECTED_ROCKET);
  localStorage.removeItem(STORAGE_KEYS.UNLOCKED_ROCKETS);
   localStorage.removeItem(STORAGE_KEYS.TOTAL_STARS);
localStorage.removeItem(STORAGE_KEYS.TOTAL_GALAXY);
localStorage.removeItem(STORAGE_KEYS.TOTAL_DESTROYED);
localStorage.removeItem(STORAGE_KEYS.TOTAL_SPECIAL);

  location.reload();

}; 
  
})();
