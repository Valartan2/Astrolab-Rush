(() => {

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // ✅ AJOUT ICI
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
  
  function checkOrientation() {

  const rotateMessage = document.getElementById("rotateMessage");

  // 🔥 IMPORTANT : desktop jamais bloqué
  if (!isMobile) {
    rotateMessage.style.display = "none";
    gamePaused = false;
    return;
  }

  // 📱 MOBILE UNIQUEMENT
  if (window.innerWidth > window.innerHeight) {
    rotateMessage.style.display = "flex";
    gamePaused = true;
  } else {
    rotateMessage.style.display = "none";
    gamePaused = false;
  }
}

  function getTutorialKey(mode) {
  if (mode === "endless") return "tutorial_endless_done";
  if (mode === "mission") return "tutorial_mission_done";
  if (mode === "time") return "tutorial_time_done";
    }

function isTutorialDone(mode) {
  return localStorage.getItem(getTutorialKey(mode)) === "true";
}

function setTutorialDone(mode) {
  localStorage.setItem(getTutorialKey(mode), "true");
}
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const rejouerBtn = document.getElementById("rejouer");
  const gameOverText = document.getElementById("gameOverText");
  const distanceDisplay = document.getElementById("distance");
  const menu = document.getElementById("menu");
  const playButton = document.getElementById("playButton");

  const buySound = new Audio("success_bell-6776.mp3");

  const tutorialModal = document.getElementById("tutorialModal");
const tutorialText = document.getElementById("tutorialText");
const tutorialBtn = document.getElementById("tutorialBtn");

  function showTutorial(mode) {

  let text = "";
    
if (mode === "endless") {
 text = `

💻 Press <b>SPACE</b><br>
📱 Tap screen<br><br>
Avoid meteorites ☄️<br>
Go as far as possible<br><br>
🏆 Unlock grades
`;
}
if (mode === "mission") {
  text = `

💻 Press <b>SPACE</b><br>
📱 Tap screen<br><br>
Collect stars ⭐<br>
Complete objectives<br><br>
🚀 Unlock rewards
`;
}

 if (mode === "time") {
  text = `
 
  💻 Press <b>SPACE</b><br>
  📱 Tap screen<br><br>
  Survive as long as possible<br>
  Avoid obstacles ☄️<br><br>
  🏆 Unlock time grades
  `;
}

  const el = document.getElementById("tutorialText");

  if (el) {
    el.innerHTML = text; // 🔥 IMPORTANT
  }

  tutorialModal.style.display = "flex";
}

  // 🔥 MODE SYSTEM
let gameMode = "endless";
  let focusMode = false;


  const shareBtn = document.getElementById("shareScore");
  const scoreBoard = document.getElementById("scoreBoard");
  const currentScoreSpan = document.getElementById("currentScore");
  const bestScoreSpan = document.getElementById("bestScore");
  const totalScoreSpan = document.getElementById("totalScore");
  const gradeSpan = document.getElementById("grade");

  const objectifsBtn = document.getElementById("objectifsBtn");
  const objectifList = document.getElementById("objectifList");
  const objectifItems = document.getElementById("objectifItems");
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

const hitSound = new Audio("error-sound-39539.mp3");
hitSound.volume = 0.4;

// 🔥 AJOUT ICI
let lastStarSoundTime = 0;

function playSound(sound) {
  try {
    const now = performance.now();

    // limite seulement le spam du son étoile
    if (sound === starSound) {
      if (now - lastStarSoundTime < 80) return; // ajuste 60 / 80 / 100
      lastStarSoundTime = now;
    }

    sound.currentTime = 0;
    sound.play().catch(() => {});
  } catch (e) {}
}
  
  const music = document.getElementById("gameMusic");
  if (music) music.volume = 0.3;

  
  

 
const menuObjectivesBtn = document.getElementById("menuObjectivesBtn");


const wordDisplay = document.getElementById("wordDisplay");
  
const GAME_ZOOM = isMobile ? 0.9 : 1;



ctx.scale(GAME_ZOOM, GAME_ZOOM);
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
  TOTAL_BIG_STARS: "totalBigStars",  
};


  /* -------------------- Grades / $BURN Ranks -------------------- */
  const gradeObjectives = [
  { threshold: 0,     label: "Interstellar Recruit" },
  { threshold: 500,   label: "Space Adventurer" },
  { threshold: 1000,  label: "Meteorite Hunter" },
  { threshold: 1500,  label: "Cosmic Explorer" },
  { threshold: 2000,  label: "Legendary Pilot" },
  { threshold: 2500,  label: "Stellar Commander" },
  { threshold: 3500,  label: "Galactic Hero" },
  { threshold: 5000,  label: "Astral Veteran" },
  { threshold: 6500,  label: "Space Ace" },
  { threshold: 8000,  label: "Star Guardian" },
  { threshold: 10000, label: "Legend of the Universe" }
];



  
  function getSavedUnlockedRockets() { return ["classic"]; }
  function saveUnlockedRockets() {}
  function getSelectedRocketKey() { return "classic"; }
  function setSelectedRocketKey() {}

  let selectedRocketKey = "classic";

  /* -------------------- Assets -------------------- */
  const rocketImages = {};
  const classicImg = new Image();
  classicImg.src = "rocket2.png";
  rocketImages["classic"] = classicImg;


  function getTotalDistance() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_DISTANCE) || "0", 10);
  }

  function setTotalDistance(value) {
    localStorage.setItem(STORAGE_KEYS.TOTAL_DISTANCE, String(value));
  }

  function getTotalStars() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_STARS) || "0", 10);
}

  function getTotalBigStars() {
  return parseInt(localStorage.getItem("totalBigStars") || "0", 10);
}

function setTotalBigStars(v) {
  localStorage.setItem("totalBigStars", v);
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
  "ISS.png",
  "astro.png"
];

specialSources.forEach(src => {
  const img = new Image();
  img.src = src;
  specialObstacleImages.push(img);
});

  const x2Image = new Image();
x2Image.src = "X2.png"; // ton image

  const meteorToStarImage = new Image();
meteorToStarImage.src = "meteor_star.png";

  
  /* -------------------- Canvas Resize -------------------- */
  let width, height;
  function resize() {
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
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
  let isDying = false;
  let distance = 0;
  let startTime = 0;
  let nextGradeIndex = 1;
  let animationId = null;
  let particles = [];

  let lastTime = 0;

  let starsCollectibles = [];
  let starScore = 0;

  let magnetActive = false;
  let magnetTimer = 0;
  let magnetDuration = 7500;
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
  Ovni: false,
  astro: false
};

  let meteorToStarActive = false;
let meteorToStarTimer = 0;
let meteorToStarDuration = 8000; // 8 secondes


let meteorToStarBonuses = [];
let lastMeteorToStarSpawn = 0;

  let nextMagnetDistance = 300;
let nextShieldDistance = 600;
let nextX2Distance = 900;
let nextMeteorBonusDistance = 1200;
let nextLetterDistance = 500;

  let nextBonusDistance = 250;


  let gamePaused = false;

let lastBonusType = null;

let meteorToStarRemaining = 0;

  let totalMeteorToStar = parseInt(localStorage.getItem("totalMeteorToStar")) || 0;

let hitFlashTimer = 0;

  let tutorialActive = false;
let tutorialTimer = 0;

  const distanceSpeedFactor = isMobile ? 3.8 : 2.5;
  const CONSTANT_SPEED = 14;

  /* -------------------- Stars Background -------------------- */
  const stars = Array.from({ length: isMobile ? 60 : 150 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.2,
    speed: Math.random() * 0.6 + 0.2
  }));

  /* -------------------- Helpers -------------------- */

  function getNextGap(min, max) {
  return min + Math.random() * (max - min);
}
  function getBestScore() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0", 10);
  }

  function setBestScore(value) {
    localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(value));
  }

  function getGrade(score) {
  let currentGrade = gradeObjectives[0].label;

  for (let i = 0; i < gradeObjectives.length; i++) {
    if (score >= gradeObjectives[i].threshold) {
      currentGrade = gradeObjectives[i].label;
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
  if (distance < 500) return "#00ccff";
  if (distance < 1000) return "#b366ff";
  if (distance < 1500) return "#ff6b4a";
  if (distance < 2000) return "#ffffff";
  if (distance < 2500) return "#00ffcc";
  if (distance < 3500) return "#ffd700";
  if (distance < 5000) return "#ff00ff";
  if (distance < 6500) return "#00ffff";
  if (distance < 8000) return "#ff3300";
  if (distance < 10000) return "#7df9ff";
  return "#ffffff";
}

  function getSpaceColor() {
  if (distance < 500) return "#001122";
  if (distance < 1000) return "#1a0033";
  if (distance < 1500) return "#330000";
  if (distance < 2000) return "#000000";
  if (distance < 2500) return "#001a1a";
  if (distance < 3500) return "#1a1a00";
  if (distance < 5000) return "#1a001a";
  if (distance < 6500) return "#001f2f";
  if (distance < 8000) return "#2f0000";
  if (distance < 10000) return "#000814";
  return "#000000";
}

 function getStarColor() {
  if (distance < 500) return "white";
  if (distance < 1000) return "#d8c4ff";
  if (distance < 1500) return "#ffd0c4";
  if (distance < 2000) return "#dff7ff";
  if (distance < 2500) return "#00ffcc";
  if (distance < 3500) return "#fff4b3";
  if (distance < 5000) return "#ffb3ff";
  if (distance < 6500) return "#b3ffff";
  if (distance < 8000) return "#ff9999";
  if (distance < 10000) return "#7df9ff";
  return "#ffffff";
}
  function updateObjectifDisplay() {
    const totalDistance = getTotalDistance();
    const bestScore = getBestScore();

    const distanceEl = document.getElementById("totalDistanceDisplay");
    if (distanceEl) {
      distanceEl.textContent = `💀 Total $BURN destroyed: ${formatNumber(totalDistance)}`;
    }

    objectifItems.innerHTML = "";

    gradeObjectives.forEach(obj => {
      const li = document.createElement("li");
      const unlocked = totalDistance >= obj.threshold;
      li.className = "rocket-item";
      li.classList.add(unlocked ? "rocket-unlocked" : "rocket-locked");
      const status = unlocked
        ? " — achieved ✅"
        : ` — locked (${formatNumber(obj.threshold)} $BURN)`;
      li.textContent = `${obj.label}${status}`;
      objectifItems.appendChild(li);
    });
  }

  function unlockRocketsIfNeeded() { return []; }


  function checkSpecialMission() {

  if (
    specialDestroyedThisRun.ISS &&
    specialDestroyedThisRun.Starman &&
    specialDestroyedThisRun.Soyouz &&
    specialDestroyedThisRun.Ovni &&
    specialDestroyedThisRun.asto
    
  ) {

    showSuccessBanner("🛰️ ALL SPECIAL DESTROYED!");

    starScore += 50;

    const total = getTotalSpecial() + 1;
    setTotalSpecial(total);

    specialDestroyedThisRun = {
      ISS: false,
      Starman: false,
      Soyouz: false,
      Ovni: false,
      astro: false
    };
  }
}

  /* -------------------- Bubble (Meteorite) -------------------- */
  function createBubble(speed) {
    const base = isMobile ? 22 : 25;
    const extra = isMobile ? 18 : 15;
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
  starsCollectibles.push({
    x: width + 40,
    y: Math.random() * (height - 80) + 40,
    size: 20,
    speed: speed * 0.8,
    big: false
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

  function createMeteorToStarBonus(speed) {
  meteorToStarBonuses.push({
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
    } else if (image.src.includes("astro")) {
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
  ctx.shadowBlur = isMobile ? 0 : 15;
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
if (particles.length < (isMobile ? 3 : 10)) {
  particles.push(new SpriteExplosion(x, y));
}
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

  // 🔴 FLASH → on teinte directement l'image
  if (hitFlashTimer > 0) {
    ctx.filter = "brightness(1) sepia(1) hue-rotate(-50deg) saturate(8)";
  }

  ctx.drawImage(currentRocket, -radius, -radius, radius * 2, radius * 2);

  // reset filtre
  ctx.filter = "none";

  ctx.restore();
}

  function drawStar(star) {
  if (!starImage.complete) return;

  const scale = star.big ? 1.8 : 1; // 🔥 grosse étoile

  ctx.save();

  if (star.big) {
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ffd700";
  }

  ctx.drawImage(
    starImage,
    star.x - star.size * scale,
    star.y - star.size * scale,
    star.size * 2 * scale,
    star.size * 2 * scale
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

  ctx.shadowBlur = isMobile ? 0 : 15;
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

  ctx.shadowBlur = isMobile ? 0 : 15;
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
  ctx.shadowBlur = isMobile ? 0 : 15;
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
  let bestScore = getBestScore();

  bestScore = Math.max(runScore, bestScore);
  setBestScore(bestScore);

  let newTotal = getTotalDistance();
  newTotal += runScore;
  setTotalDistance(newTotal);

  const totalStars = getTotalStars() + starScore;
  setTotalStars(totalStars);

  const totalGalaxy = getTotalGalaxy() + galaxyCompletedThisRun;
  setTotalGalaxy(totalGalaxy);

  const totalDestroyed = getTotalDestroyed() + meteorDestroyed;
  setTotalDestroyed(totalDestroyed);

  // 🎯 LABELS — $BURN branding
  const label1 = document.getElementById("label1");
  const label2 = document.getElementById("label2");
  const label3 = document.getElementById("label3");
  const label4 = document.getElementById("label4");

  if (label1) label1.textContent = "🔥 $BURN this run:";
  if (label2) label2.textContent = "🏆 Best run:";
  if (label3) label3.textContent = "💀 Total $BURN destroyed:";
  if (label4) label4.textContent = "🎖 Rank:";

  currentScoreSpan.textContent = formatNumber(runScore) + " $BURN";
  bestScoreSpan.textContent = formatNumber(bestScore) + " $BURN";
  totalScoreSpan.textContent = formatNumber(getTotalDistance()) + " $BURN";
  gradeSpan.textContent = getGrade(distance);

  updateObjectifDisplay();
  scoreBoard.style.display = "block";

  // 🔥 BURN DASHBOARD
  afficherBurnDashboard(runScore);

  // scroll to show burn dashboard
  setTimeout(() => {
    scoreBoard.scrollTop = 0;
  }, 50);
}

/* -------------------- Burn Dashboard -------------------- */
function afficherBurnDashboard(sessionBurned) {
  const TOTAL_SUPPLY = 1_000_000_000;

  const prevTotal = parseInt(localStorage.getItem("totalBurnedTokens") || "0");
  const newTotal = prevTotal + sessionBurned;
  localStorage.setItem("totalBurnedTokens", newTotal);

  const burnPercent = Math.min((newTotal / TOTAL_SUPPLY) * 100, 100);

  const sessionEl = document.getElementById("burnSessionValue");
  const burnBarEl = document.getElementById("burnBar");
  const burnTotalEl = document.getElementById("burnTotalBurned");
  const burnShareBtn = document.getElementById("burnShareBtn");
  const burnNowBtn = document.getElementById("burnNowBtn");
  const burnTxStatus = document.getElementById("burnTxStatus");

  if (sessionEl) sessionEl.innerHTML = formatNumber(sessionBurned) + ' <span class="burnUnit">$BURN</span>';
  if (burnTotalEl) burnTotalEl.textContent = formatNumber(newTotal);

  if (burnBarEl) {
    burnBarEl.style.width = "0%";
    setTimeout(() => {
      burnBarEl.style.width = burnPercent.toFixed(4) + "%";
    }, 300);
  }

  // Reset burn now button state
  if (burnNowBtn) {
    burnNowBtn.textContent = "👻 Burn on-chain (Devnet)";
    burnNowBtn.disabled = false;
    burnNowBtn.style.background = "linear-gradient(to bottom, #9945FF, #6a1fc2)";
  }
  if (burnTxStatus) {
    burnTxStatus.style.display = "none";
    burnTxStatus.textContent = "";
  }

  // Notify wallet module of session burn amount
  window._lastSessionBurn = sessionBurned;

  // Show burnNowBtn if wallet already connected
  const burnNowBtn2 = document.getElementById("burnNowBtn");
  if (burnNowBtn2) {
    const provider = window.solana;
    if (provider && provider.isPhantom && provider.isConnected) {
      burnNowBtn2.style.display = "inline-block";
    }
  }

  if (window.setLastSessionBurn) {
    window.setLastSessionBurn(sessionBurned);
  }

  if (burnShareBtn) {
    burnShareBtn.onclick = () => {
      const text = `🔥 I just destroyed ${formatNumber(sessionBurned)} $BURN tokens in one run!\n\nEvery meter = 1 token burned forever 🚀\n\n#AstroBurn #Solana #BURN`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    };
  }
}




  /* -------------------- Reset -------------------- */
  function resetGame() {

    
    
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    // 🧼 RESET GLOBAL CRITIQUE
gameOver = false;
isDying = false;
particles = [];

    if (isMobile) {
  player.gravityDown = 1.9;
  player.gravityUp = -1.7;
  player.maxSpeed = 10;
} else {
  player.gravityDown = 2.2;
  player.gravityUp = -2.2;
  player.maxSpeed = 13;
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
    nextBonusDistance = 250;
    progressBar.style.width = "5%";
    startTime = performance.now();
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
    const burnDash = document.getElementById("burnDashboard");
    if (burnDash) burnDash.style.display = "none";
    distanceDisplay.style.display = "block";
    backToMenuBtn.style.display = "none";
    progressBar.parentElement.style.display = "none";
    progressLabel.style.display = "none";
    lastSpecialSpawn = 0;
    isDying = false;

    nextMagnetDistance = 300;
    nextShieldDistance = 600;
    nextX2Distance = 900;
    nextMeteorBonusDistance = 1200;
    nextLetterDistance = 500;
    nextBonusDistance = 250;
    hitFlashTimer = 0;

    shields = [];
    shieldActive = false;
    shieldTimer = 0;

    meteorToStarBonuses = [];
    meteorToStarActive = false;
    meteorToStarTimer = 0;

    x2s = [];

    specialDestroyedThisRun = {
      ISS: false,
      Starman: false,
      Soyouz: false,
      Ovni: false,
      astro: false
    };
  }
  
  

  /* -------------------- Buttons -------------------- */
tutorialBtn.onclick = () => {
  tutorialModal.style.display = "none";

  if (music && musicEnabled) {
    music.currentTime = 0;
    music.play().catch(() => {});
  }

  setTutorialDone(gameMode);

  const menuCanvas = document.getElementById("menuStars");
  if (menuCanvas) menuCanvas.style.display = "none";

  wordDisplay.style.display = "block";
  distanceDisplay.style.display = "block";
  document.getElementById("topHUD").style.display = "flex";
  document.getElementById("stats").style.display = "none";
  progressBar.parentElement.style.display = "flex";
  progressLabel.style.display = "block";

  animationId = requestAnimationFrame(gameLoop);
};
  
playButton.onclick = () => {
  playClick();
  gameMode = "endless";
  focusMode = true;
  menu.style.display = "none";
  startGame();
};

  rejouerBtn.onclick = () => {
    playClick();

    if (music && musicEnabled) {
      music.currentTime = 0;
      music.play().catch(() => {});
    }

    resetGame();

    document.getElementById("topHUD").style.display = "flex";
    wordDisplay.style.display = "block";
    progressBar.parentElement.style.display = "flex";
    progressLabel.style.display = "block";
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
    const burned = Math.floor(distance);
    const text = `🔥 I just destroyed ${burned.toLocaleString()} $BURN tokens in one run on Astro-Burn!\n\nEvery meter = 1 token burned forever 🚀\n\n#AstroBurn #Solana #BURN`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title: "Astro-Burn", text, url }).catch(() => {});
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
  const burnDashBack = document.getElementById("burnDashboard");
  if (burnDashBack) burnDashBack.style.display = "none";

    document.getElementById("topHUD").style.display = "none"; // ✅ AJOUT ICI

  // remettre menu
  menu.style.display = "block";

  // remettre background menu
  const menuCanvas = document.getElementById("menuStars");
  if (menuCanvas) menuCanvas.style.display = "block";

  wordDisplay.style.display = "none";  
  distanceDisplay.style.display = "none";
  progressBar.parentElement.style.display = "none";
progressLabel.style.display = "none";  

};

 function startGame() {

  resetGame();

  // 🎓 TUTORIAL
  if (!isTutorialDone(gameMode)) {
    showTutorial(gameMode);
    return;
  }

  if (music && musicEnabled) {
    music.currentTime = 0;
    music.play().catch(() => {});
  }

  // 🚀 LANCEMENT
  animationId = requestAnimationFrame(gameLoop);

  const menuCanvas = document.getElementById("menuStars");
  if (menuCanvas) menuCanvas.style.display = "none";

  wordDisplay.style.display = "block";
  distanceDisplay.style.display = "block";

  document.getElementById("topHUD").style.display = "flex";
  document.getElementById("stats").style.display = "none";

  // 🔥 barre de progression
  progressBar.parentElement.style.display = "flex";
  progressLabel.style.display = "block";
}

  /* -------------------- Start Screen -------------------- */
  menu.style.display = "block";
  distanceDisplay.style.display = "none";
  updateObjectifDisplay();

  /* -------------------- Main Loop -------------------- */

const GAME_SETTINGS = {
  endless: {
    mobile: { baseSpeed: 11, accel: 1.10, step: 500, maxDist: 500 },
    desktop: { baseSpeed: 11, accel: 1.1, step: 500, maxDist: 3000 }
  },
  mission: {
    mobile: { baseSpeed: 10, accel: 1, step: 600, maxDist: 3000 },
    desktop: { baseSpeed: 11, accel: 1, step: 500, maxDist: 5000 }
  },
  time: {
    mobile: { baseSpeed: 10, accel: 1.1, step: 500, maxDist: 1000 },
    desktop: { baseSpeed: 11, accel: 1.1, step: 500, maxDist: 4000 }
  }
};

  
 function gameLoop(timestamp) {

  if (gamePaused) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // reset canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  ctx.scale(dpr * GAME_ZOOM, dpr * GAME_ZOOM);

  // delta time
  let dt = (timestamp - lastTime) / 16.67;
  dt = Math.min(dt, isMobile ? 1.2 : 1.5);
  lastTime = timestamp;

  const now = performance.now();

  // tutorial timer
  if (tutorialActive) {
    tutorialTimer -= 16;
    if (tutorialTimer <= 0) {
      tutorialActive = false;
    }
  }

  // background
  drawStars();

   // 🔴 FLASH ROUGE HIT (mobile friendly)
if (hitFlashTimer > 0) {
  ctx.save();
  ctx.globalAlpha = 0.25; // intensité (0.2 à 0.4)
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

  // death phase
  if (isDying) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const e = particles[i];
      e.update();
      e.draw();

      if (e.isDead()) {
        particles.splice(i, 1);
      }
    }

    if (particles.length === 0) {
      isDying = false;
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
    }

    animationId = requestAnimationFrame(gameLoop);
    return;
  }

  // focus mode overlay
  if (focusMode) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // speed settings
  const settings = GAME_SETTINGS["endless"][isMobile ? "mobile" : "desktop"];
  const effectiveDistance = Math.min(distance, settings.maxDist);
  const level = Math.floor(effectiveDistance / settings.step);
  const speedFactor = isMobile ? 0.7 : 0.85;
  const baseSpeed = (settings.baseSpeed + level * settings.accel) * speedFactor;
  const finalSpeed = baseSpeed;

  // perf limits
  const spawnRate = 25;
  const maxMeteorites = isMobile ? 5 : 14;
  const maxStars = isMobile ? 5 : 14;
  const maxBonuses = isMobile ? 2 : 5;

  // meteor spawn
  frameCount += dt;
  if (frameCount >= spawnRate && bubbles.length < maxMeteorites && !gameOver) {
    frameCount = 0;
    createBubble(finalSpeed);
  }

  // special obstacle spawn
  if (
    !gameOver &&
    !isDying &&
    specialObstacles.length === 0 &&
    now - lastSpecialSpawn > 8000
  ) {
    createSpecialObstacle(finalSpeed);
    lastSpecialSpawn = now;
  }

  // stars spawn
  if (!focusMode && !gameOver && starsCollectibles.length < maxStars) {
    if (Math.random() < 0.02) {
      createStar(finalSpeed);
    }
  }

  // letters
  if (!gameOver && !isDying && letters.length === 0 && !focusMode) {
    if (distance > nextLetterDistance) {
      createLetter(finalSpeed);
      nextLetterDistance = distance + getNextGap(400, 900);
    }
  }

  // meteorites
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];

    b.x -= b.speed * Math.min(dt, 1.2);

    const dx = player.x - b.x;
    const dy = player.y - b.y;
    const distSq = dx * dx + dy * dy;
    const hitRadius = player.radius + b.radius;

    // meteor -> star
    if (meteorToStarActive) {
      if (magnetActive) {
        const dist = Math.sqrt(distSq) || 1;
        const magnetSpeed = isMobile
          ? (dist < 80 ? 12 : 6)
          : (dist < 80 ? 20 : 10);

        b.x += (dx / dist) * magnetSpeed;
        b.y += (dy / dist) * magnetSpeed;
      }

      if (distSq < hitRadius * hitRadius) {
        starScore += 5;
        playSound(starSound);
        bubbles.splice(i, 1);
        continue;
      }
    }

    // shield collision
    else if (shieldActive && distSq < hitRadius * hitRadius) {
      createExplosion(b.x, b.y);
      meteorDestroyed++;
      bubbles.splice(i, 1);
      continue;
    }

    // normal collision
    else if (distSq < hitRadius * hitRadius) {
      isDying = true;
      createExplosion(player.x, player.y);
      pressing = false;
      bubbles.splice(i, 1);
      break;
    }

    if (b.y > height - b.radius || b.y < b.radius) {
      b.direction *= -1;
    }

    if (b.x + b.radius < 0) {
      bubbles.splice(i, 1);
    }
  }

  // special obstacles
  for (let i = specialObstacles.length - 1; i >= 0; i--) {
    const o = specialObstacles[i];

    o.x -= o.speed * dt * 0.6;

    const dx = player.x - o.x;
    const dy = player.y - o.y;
    const distSq = dx * dx + dy * dy;
    const shieldHitRadius = player.radius + o.size;
    const normalHitRadius = player.radius + o.size * 0.5;

    if (shieldActive && distSq < shieldHitRadius * shieldHitRadius) {
      const src = o.image.src;

      if (src.includes("ISS")) specialDestroyedThisRun.ISS = true;
      if (src.includes("Starman")) specialDestroyedThisRun.Starman = true;
      if (src.includes("Soyouz")) specialDestroyedThisRun.Soyouz = true;
      if (src.includes("Ovni")) specialDestroyedThisRun.Ovni = true;
      if (src.includes("astro")) specialDestroyedThisRun.astro = true;

      createExplosion(o.x, o.y);
      specialObstacles.splice(i, 1);
      continue;
    }

    if (!shieldActive && distSq < normalHitRadius * normalHitRadius) {
      isDying = true;
      createExplosion(player.x, player.y);
      pressing = false;
      specialObstacles.splice(i, 1);
      break;
    }

    if (o.x < -100) {
      specialObstacles.splice(i, 1);
    }
  }

  // stars movement + collision
  for (let i = starsCollectibles.length - 1; i >= 0; i--) {
    const s = starsCollectibles[i];

    if (magnetActive) {
      const dxMag = player.x - s.x;
      const dyMag = player.y - s.y;
      const distSqMag = dxMag * dxMag + dyMag * dyMag;
      const distMag = Math.sqrt(distSqMag) || 1;

      const magnetSpeed = distMag < 80
        ? (isMobile ? 12 : 20)
        : (isMobile ? 6 : 10);

      s.x += (dxMag / distMag) * magnetSpeed;
      s.y += (dyMag / distMag) * magnetSpeed;
    } else {
      s.x -= s.speed * dt * 0.6;
    }

    const dx = player.x - s.x;
    const dy = player.y - s.y;
    const distSq = dx * dx + dy * dy;
    const hitRadius = player.radius + s.size;

    if (distSq < hitRadius * hitRadius) {
      starScore += 1;
      playSound(starSound);
      starsCollectibles.splice(i, 1);
      continue;
    }

    if (s.x < -50) {
      starsCollectibles.splice(i, 1);
    }
  }

  // magnet bonus
  for (let i = magnets.length - 1; i >= 0; i--) {
    const m = magnets[i];

    m.x -= m.speed * dt * 0.6;

    const dx = player.x - m.x;
    const dy = player.y - m.y;
    const distSq = dx * dx + dy * dy;
    const hitRadius = player.radius + m.size;

    if (distSq < hitRadius * hitRadius) {
      magnetActive = true;
      magnetTimer = now;
      lastMagnetSpawn = now;
      lastShieldSpawn = now;

      showSuccessBanner("🧲 MAGNET!");

      magnets.splice(i, 1);
      continue;
    }

    if (m.x < -50) {
      magnets.splice(i, 1);
    }
  }

  // shield bonus
  for (let i = shields.length - 1; i >= 0; i--) {
    const s = shields[i];

    s.x -= s.speed * dt * 0.6;

    const dx = player.x - s.x;
    const dy = player.y - s.y;
    const distSq = dx * dx + dy * dy;
    const hitRadius = player.radius + s.size;

    if (distSq < hitRadius * hitRadius) {
      shieldActive = true;
      shieldTimer = now;

      showSuccessBanner("🛡️ SHIELD!");

      shields.splice(i, 1);
      continue;
    }

    if (s.x < -50) {
      shields.splice(i, 1);
    }
  }

  // x2 bonus
  for (let i = x2s.length - 1; i >= 0; i--) {
    const b = x2s[i];

    b.x -= b.speed * dt * 0.6;

    const dx = player.x - b.x;
    const dy = player.y - b.y;
    const distSq = dx * dx + dy * dy;
    const hitRadius = player.radius + b.size;

    if (distSq < hitRadius * hitRadius) {
      starScore *= 2;
      showSuccessBanner("💰 x2 COINS!");
      x2s.splice(i, 1);
      continue;
    }

    if (b.x < -50) {
      x2s.splice(i, 1);
    }
  }

  // meteor -> star bonus
  for (let i = meteorToStarBonuses.length - 1; i >= 0; i--) {
    const b = meteorToStarBonuses[i];

    b.x -= b.speed * dt * 0.6;

    const dx = player.x - b.x;
    const dy = player.y - b.y;
    const distSq = dx * dx + dy * dy;
    const hitRadius = player.radius + b.size;

    if (distSq < hitRadius * hitRadius) {
      meteorToStarActive = true;
      meteorToStarTimer = now;

      showSuccessBanner("🌟 METEOR RUSH!");

      meteorToStarBonuses.splice(i, 1);
      continue;
    }

    if (b.x < -50) {
      meteorToStarBonuses.splice(i, 1);
    }
  }

  // letters
  for (let i = letters.length - 1; i >= 0; i--) {
    const l = letters[i];

    l.x -= l.speed * dt;

    const dx = player.x - l.x;
    const dy = player.y - l.y;
    const distSq = dx * dx + dy * dy;
    const hitRadius = player.radius + l.size;

    if (distSq < hitRadius * hitRadius) {
      playSound(starSound);

      currentLetterIndex++;
      letters.splice(i, 1);

      if (currentLetterIndex >= word.length) {
        galaxyCompletedThisRun++;
        currentLetterIndex = 0;

        showSuccessBanner("🌌 GALAXY COMPLETE!");

        shieldActive = true;
        shieldTimer = now;
      }

      continue;
    }

    if (l.x < -50) {
      letters.splice(i, 1);
    }
  }

  // magnet visual
  if (magnetActive) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#00cfff";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // time over — kept as safety but won't trigger in endless
  // player physics + HUD counters
  if (!gameOver && !isDying) {
    document.getElementById("starCount").textContent = starScore;
    document.getElementById("destroyCount").textContent = meteorDestroyed;

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
  }

  // display distance as $BURN
  distanceDisplay.textContent = `🔥 ${formatNumber(Math.floor(distance))} $BURN`;

  // galaxy word
  const displayWord = word.map((letter, index) => {
    return index < currentLetterIndex ? letter : "_";
  }).join(" ");

  wordDisplay.textContent = displayWord;

  const progressText = document.getElementById("progressText");

  // progress bar — rank based
  {
    let currentThreshold = 0;
    let nextThreshold = gradeObjectives[gradeObjectives.length - 1].threshold;

    for (let i = 0; i < gradeObjectives.length; i++) {
      if (distance >= gradeObjectives[i].threshold) {
        currentThreshold = gradeObjectives[i].threshold;
        if (i + 1 < gradeObjectives.length) {
          nextThreshold = gradeObjectives[i + 1].threshold;
        }
      }
    }

    const progress = (distance - currentThreshold) / (nextThreshold - currentThreshold);
    const percent = Math.max(0, Math.min(progress, 1)) * 100;

    progressBar.style.width = percent + "%";
    progressBar.style.background = getFlashColor();
    progressBar.style.boxShadow = percent > 80 ? "0 0 8px white" : "none";

    const remaining = Math.floor(nextThreshold - distance);
    progressLabel.textContent = `Next Rank : ${remaining} $BURN`;
    if (progressText) progressText.textContent = Math.floor(distance) + " / " + nextThreshold;
  }

  // rank milestone flash
  if (
    nextGradeIndex < gradeObjectives.length &&
    distance >= gradeObjectives[nextGradeIndex].threshold
  ) {
    const grade = gradeObjectives[nextGradeIndex];

    distanceDisplay.classList.add("distancePulse");
    setTimeout(() => {
      distanceDisplay.classList.remove("distancePulse");
    }, 400);

    showMilestone(grade.label);
    flashScreen(getFlashColor());

    nextGradeIndex++;
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const e = particles[i];
    e.update();
    e.draw();

    if (e.isDead()) {
      particles.splice(i, 1);
    }
  }

  // bonus timers
  if (magnetActive) {
    if (now - magnetTimer > magnetDuration) {
      magnetActive = false;
    }
  }

  if (meteorToStarActive) {
    meteorToStarRemaining = meteorToStarDuration - (now - meteorToStarTimer);

    if (meteorToStarRemaining <= 0) {
      meteorToStarActive = false;
      meteorToStarRemaining = 0;
      showSuccessBanner("⚠️ RUSH OVER");
    }
  }

  if (shieldActive) {
    shieldRemaining = shieldDuration - (now - shieldTimer);

    if (shieldRemaining <= 0) {
      shieldActive = false;
      shieldRemaining = 0;
      showSuccessBanner("⚠️ SHIELD OFF");
    }
  }

  // draw collectibles
  if (!focusMode) {
    starsCollectibles.forEach(drawStar);
    magnets.forEach(drawMagnet);
  }

  bubbles.forEach(b => {
    if (meteorToStarActive) {
      ctx.drawImage(
        starImage,
        b.x - b.radius,
        b.y - b.radius,
        b.radius * 2,
        b.radius * 2
      );
    } else {
      drawMeteorite(b);
    }
  });

  shields.forEach(drawShield);
  specialObstacles.forEach(drawSpecialObstacle);
  x2s.forEach(drawX2);

  meteorToStarBonuses.forEach(b => {
    if (!meteorToStarImage.complete) return;

    ctx.drawImage(
      meteorToStarImage,
      b.x - b.size,
      b.y - b.size,
      b.size * 2,
      b.size * 2
    );
  });

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

  // shield visual
  if (shieldActive) {
    let alpha = 0.25;

    if (shieldRemaining < 1000) {
      alpha = Math.sin(now / 80) * 0.5 + 0.5;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#00ffcc";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // rocket
  if (!gameOver && !isDying) {
    drawRocket(player.x, player.y, player.radius);
  }

  // meteor rush visual
  if (meteorToStarActive) {
    let alpha = 0.15;

    if (meteorToStarRemaining < 1000) {
      alpha = Math.sin(now / 60) * 0.5 + 0.5;
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffff00";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // shield blinking visual
  if (shieldActive && shieldRemaining < 1000) {
    ctx.save();
    ctx.globalAlpha = Math.sin(now / 50) * 0.5 + 0.5;
    ctx.fillStyle = "#00ffcc";
    ctx.beginPath();
    ctx.arc(player.x, player.y, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  checkSpecialMission();

  frameCount++;
  flamePulse += 0.15;

  if (hitFlashTimer > 0) {
    hitFlashTimer -= 16;
  }

  // tutorial overlay
  if (tutorialActive) {
    ctx.save();

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "black";
    ctx.fillRect(0, height / 2 - 60, width, 120);

    ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "22px Arial";
    ctx.fillText("🔥 Hold to fly • Avoid meteorites", width / 2, height / 2);
    ctx.restore();
  }

  if ((!gameOver && !isDying) || particles.length > 0) {
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
  if (!confirmReset) return;

  localStorage.removeItem(STORAGE_KEYS.BEST_SCORE);
  localStorage.removeItem(STORAGE_KEYS.TOTAL_DISTANCE);
  localStorage.removeItem(STORAGE_KEYS.TOTAL_STARS);
  localStorage.removeItem(STORAGE_KEYS.TOTAL_GALAXY);
  localStorage.removeItem(STORAGE_KEYS.TOTAL_DESTROYED);
  localStorage.removeItem("totalBurnedTokens");
  localStorage.removeItem("tutorial_endless_done");

  location.reload();
};

})();

/* ==================== SOLANA WALLET ==================== */
(() => {
  let walletPublicKey = null;
  let lastSessionBurn = 0;

  const connectBtn = document.getElementById("connectWalletBtn");
  const walletStatus = document.getElementById("walletStatus");
  const burnNowBtn = document.getElementById("burnNowBtn");
  const burnTxStatus = document.getElementById("burnTxStatus");

  // Expose session burn to wallet module
  window.setLastSessionBurn = (amount) => {
    lastSessionBurn = amount;
    if (burnNowBtn) {
      burnNowBtn.style.display = "inline-block";
    }
  };

  // Connect wallet
  if (connectBtn) {
    connectBtn.onclick = async () => {
      try {
        const provider = window.solana;
        if (!provider || !provider.isPhantom) {
          alert("Phantom wallet not found!\n\nInstall it at phantom.app then switch to Devnet in settings.");
          return;
        }

        const resp = await provider.connect();
        walletPublicKey = resp.publicKey.toString();

        connectBtn.textContent = "✅ " + walletPublicKey.slice(0, 4) + "..." + walletPublicKey.slice(-4);
        connectBtn.style.background = "#1a9e1a";

        if (walletStatus) {
          walletStatus.textContent = "Connected on Devnet";
          walletStatus.style.display = "block";
        }

      } catch (e) {
        console.error("Wallet connection failed:", e);
      }
    };
  }

  // Burn on-chain
  if (burnNowBtn) {
    burnNowBtn.onclick = async () => {
      if (!walletPublicKey) {
        alert("Connect your Phantom wallet first!");
        return;
      }

      if (lastSessionBurn <= 0) {
        lastSessionBurn = window._lastSessionBurn || 0;
      }
      if (lastSessionBurn <= 0) {
        alert("No $BURN to send — play a run first!");
        return;
      }

      try {
        burnNowBtn.textContent = "⏳ Sending...";
        burnNowBtn.disabled = true;
        if (burnTxStatus) { burnTxStatus.style.display = "none"; }

        const solanaWeb3 = window.solanaWeb3;
        const connection = new solanaWeb3.Connection(
          solanaWeb3.clusterApiUrl("devnet"),
          "confirmed"
        );

        const fromPubkey = new solanaWeb3.PublicKey(walletPublicKey);

        // Burn address = system program (address nulle Solana)
        // On envoie 0 lamports avec un memo du burn amount — simulation propre
        const transaction = new solanaWeb3.Transaction().add(
          solanaWeb3.SystemProgram.transfer({
            fromPubkey,
            toPubkey: new solanaWeb3.PublicKey("11111111111111111111111111111111"),
            lamports: lastSessionBurn // 1 lamport par $BURN simulé
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        const signed = await window.solana.signAndSendTransaction(transaction);

        if (burnTxStatus) {
          burnTxStatus.style.display = "block";
          burnTxStatus.innerHTML = `✅ ${lastSessionBurn} $BURN burned!<br><a href="https://explorer.solana.com/tx/${signed.signature}?cluster=devnet" target="_blank" style="color:#00ffcc;">View on Explorer ↗</a>`;
        }

        burnNowBtn.textContent = "✅ Burned!";
        burnNowBtn.style.background = "#1a9e1a";

      } catch (e) {
        console.error("Burn failed:", e);
        burnNowBtn.textContent = "❌ Failed — retry";
        burnNowBtn.disabled = false;
        if (burnTxStatus) {
          burnTxStatus.style.display = "block";
          burnTxStatus.textContent = "Error: " + (e.message || "unknown");
        }
      }
    };
  }
})();
