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


menuObjectivesBtn.onclick = () => {

playClick();
updateObjectifDisplay();
objectifList.style.display="flex";

};



  /* -------------------- Storage Keys -------------------- */
  const STORAGE_KEYS = {
    BEST_SCORE: "bestScore",
    TOTAL_DISTANCE: "totalDistance",
    SELECTED_ROCKET: "selectedRocketKey",
    UNLOCKED_ROCKETS: "unlockedRockets"
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

{ key:"classic", label:"Classic Rocket", file:"rocket2.png", unlockAt:0 },

{ key:"white", label:"White Rocket", file:"rocket3.png", unlockAt:500 },

{ key:"steel", label:"Steel Rocket", file:"rocket4.png", unlockAt:1000 },

{ key:"red", label:"Red Rocket", file:"rocket5.png", unlockAt:2500 },

{ key:"aqua", label:"Aqua Rocket", file:"rocket6.png", unlockAt:5000 },

{ key:"blue", label:"Blue Rocket", file:"rocket7.png", unlockAt:10000 },

{ key:"retro", label:"Retro Rocket", file:"rocket8.png", unlockAt:20000 },

{ key:"tech", label:"Tech Rocket", file:"rocket9.png", unlockAt:40000 },

{ key:"orange", label:"Neon Rocket", file:"rocket10.png", unlockAt:80000 },

{ key:"gold", label:"Golden Rocket", file:"rocket11.png", unlockAt:150000 }

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


  // 💥 EXPLOSION SPRITE
const explosionFrames = [];

const explosionPaths = [
  "explosion/Explosion1.png",
  "explosion/Explosion2.png",
  "explosion/Explosion3.png",
  "explosion/Explosion4.png",
  "explosion/Explosion3.png",
  "explosion/Explosion2.png",
  "explosion/Explosion1.png"
];

explosionPaths.forEach(path => {
  const img = new Image();
  img.src = path;
  explosionFrames.push(img);
});

  /* -------------------- Canvas Resize -------------------- */
  let width, height;
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    width = canvas.width / dpr;
    height = canvas.height / dpr;

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
  let explosions = [];
  let newlyUnlockedThisRun = [];

  let lastTime = 0;

  let starsCollectibles = [];
  let starScore = 0;

  let magnetActive = false;
  let magnetTimer = 0;
  let magnetDuration = 15000;
  let magnets = [];

  let lastMagnetSpawn = 0;
  let magnetCooldown = 15000; // 15 secondes minimum

  let shieldActive = false;
let shieldTimer = 0;
let shieldDuration = 15000;
let shields = [];

let shieldRemaining = 0;

  let lastShieldSpawn = 0;
let shieldCooldown = 20000;

 let meteorDestroyed = 0;
  
  const distanceSpeedFactor = 2.5;
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

    totalDistanceDisplay.textContent = `Total distance: ${formatNumber(totalDistance)} m`;

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

  if(unlocked){
    li.classList.add("rocket-unlocked");
  } else {
    li.classList.add("rocket-locked");
  }

  const status = unlocked
    ? " — unlocked"
    : ` — locked (${formatNumber(rocket.unlockAt)} m total)`;

  li.textContent = `${rocket.label}${status}`;

  rocketItems.appendChild(li);

});
  }

  function unlockRocketsIfNeeded(totalDistanceAfterRun) {
    const newUnlocks = [];

    rocketDefinitions.forEach(rocket => {
      if (
        totalDistanceAfterRun >= rocket.unlockAt &&
        !unlockedRocketKeys.includes(rocket.key)
      ) {
        unlockedRocketKeys.push(rocket.key);
        newUnlocks.push(rocket);
      }
    });

    if (newUnlocks.length) {
      saveUnlockedRockets(unlockedRocketKeys);
    }

    return newUnlocks;
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
    x: width + size,
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
    speed: speed * 0.8
  });
}

  function createShield(speed) {
  shields.push({
    x: width + 40,
    y: Math.random() * (height - 80) + 40,
    size: 25,
    speed: speed * 0.8
  });
}
  
  function isColliding(c, b) {
    const dx = c.x - b.x;
    const dy = c.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < c.radius + b.radius;
  }

  // 💥 EXPLOSION SYSTEM
function createExplosion(x, y) {
  explosions.push({
    x: x,
    y: y,
    frame: 0,
    timer: 0
  });
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

  function drawExplosions() {
  explosions.forEach(e => {
    const img = explosionFrames[e.frame];

    const size = 100;

    ctx.drawImage(
      img,
      e.x - size / 2,
      e.y - size / 2,
      size,
      size
    );
  });
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

  ctx.drawImage(
    shieldImage,
    s.x - s.size,
    s.y - s.size,
    s.size * 2,
    s.size * 2
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
  player.gravityDown = 2.5;
  player.gravityUp = -2.3;
  player.maxSpeed = 13;
} else {
  player.gravityDown = 2.2;
  player.gravityUp = -2.2;
  player.maxSpeed = 11;
}
    nextGradeIndex = 1;
    player.radius = 30;
    bubbles = [];
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
    lastShieldSpawn = performance.now();
    meteorDestroyed = 0;


    [rejouerBtn, gameOverText, shareBtn].forEach(e => e.style.display = "none");
    objectifsBtn.style.display = "none";
    objectifList.style.display = "none";
    scoreBoard.style.display = "none";
    distanceDisplay.style.display = "block";
    backToMenuBtn.style.display = "none";
    progressBar.parentElement.style.display = "block";
    progressLabel.style.display = "block";
  }

  /* -------------------- Buttons -------------------- */
  playButton.onclick = () => {
    playClick();

   

    if (music && musicEnabled) {
  music.currentTime = 0;
  music.play().catch(() => {});
}

    menu.style.display = "none";
    resetGame();

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

    // 💥 UPDATE EXPLOSIONS
for (let i = explosions.length - 1; i >= 0; i--) {
  const e = explosions[i];

  e.timer++;

  if (e.timer > 2) {
    e.frame++;
    e.timer = 0;
  }

  if (e.frame >= explosionFrames.length) {
    explosions.splice(i, 1);
  }
}

    const speedFactor = isMobile ? 0.7 : 1;
    const meteorSpeedFactor = 0.70;
    const speedLevel = Math.floor(distance / 500);
    const baseSpeed = Math.min(CONSTANT_SPEED + speedLevel * 1.2, 28) * speedFactor;
    const spawnRate = 25;
    const maxMeteorites = isMobile ? 25 : 20;

    frameCount += dt;

if (frameCount >= spawnRate && bubbles.length < maxMeteorites && !gameOver) {
  frameCount = 0;
  createBubble(baseSpeed * meteorSpeedFactor);
    }

    if (Math.random() < 0.02 && !gameOver) {
  createStar(baseSpeed);
}

if (
  !gameOver &&
  !magnetActive &&
  magnets.length === 0 &&
  performance.now() - lastMagnetSpawn > magnetCooldown &&
  Math.random() < 0.02
) {
  createMagnet(baseSpeed);
  lastMagnetSpawn = performance.now();
}
  if (
  !gameOver &&
  !shieldActive &&
  shields.length === 0 &&
  performance.now() - lastShieldSpawn > shieldCooldown &&
  Math.random() < 0.02
) {
  createShield(baseSpeed);
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

    
    // ⭐ étoiles mouvement + collision
for (let i = starsCollectibles.length - 1; i >= 0; i--) {
  const s = starsCollectibles[i];

  if (magnetActive) {
    const dx = player.x - s.x;
    const dy = player.y - s.y;

    s.x += dx * 0.08;
    s.y += dy * 0.08;
  } else {
    s.x -= s.speed * dt;
  }


  
  const dx = player.x - s.x;
  const dy = player.y - s.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < player.radius + s.size) {
    starScore += 1;

    starSound.currentTime = 0;
    starSound.play().catch(()=>{});

    showSuccessBanner("⭐ +1");
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

  m.x -= m.speed * dt;

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

  s.x -= s.speed * dt;

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

const remaining = Math.floor(nextThreshold - distance);
progressLabel.textContent = `Next Grade : ${remaining} m`;

progressBar.style.background = getFlashColor();      

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
    
    frameCount++;
    flamePulse += 0.15;

    if (!gameOver || explosions.length > 0) {
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

  menuRocketCtx.drawImage(img, centerX-40, centerY-40, 80, 80);

  menuRocketCtx.restore();

}
menuRocketCanvas.addEventListener("click", () => {

  const rocket = rocketDefinitions[rocketScrollIndex];

  if(unlockedRocketKeys.includes(rocket.key)){
    selectedRocketKey = rocket.key;
    setSelectedRocketKey(rocket.key);
    showSuccessBanner(`🚀 ${rocket.label} selected`);
  }



});

const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");

arrowLeft.onclick = () => {

  rocketScrollIndex = Math.max(0, rocketScrollIndex - 1);

  const rocket = rocketDefinitions[rocketScrollIndex];

  if(unlockedRocketKeys.includes(rocket.key)){
    selectedRocketKey = rocket.key;
    setSelectedRocketKey(rocket.key);
  }

  drawMenuRocket();

};

arrowRight.onclick = () => {

  rocketScrollIndex = Math.min(rocketDefinitions.length - 1, rocketScrollIndex + 1);

  const rocket = rocketDefinitions[rocketScrollIndex];

  if(unlockedRocketKeys.includes(rocket.key)){
    selectedRocketKey = rocket.key;
    setSelectedRocketKey(rocket.key);
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

  location.reload();

}; 
  
})();
