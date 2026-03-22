(() => {

  /* -------------------- Canvas -------------------- */
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  /* -------------------- UI -------------------- */
  const rejouerBtn = document.getElementById("rejouer");
  const gameOverText = document.getElementById("gameOverText");
  const distanceDisplay = document.getElementById("distance");
  const menu = document.getElementById("menu");
  const playButton = document.getElementById("playButton");

  /* -------------------- MODE -------------------- */
  let focusMode = false;

  const modeSelect = document.getElementById("modeSelect");
  const normalModeBtn = document.getElementById("normalModeBtn");
  const focusModeBtn = document.getElementById("focusModeBtn");

  /* -------------------- SCORE -------------------- */
  const shareBtn = document.getElementById("shareScore");
  const scoreBoard = document.getElementById("scoreBoard");

  const currentScoreSpan = document.getElementById("currentScore");
  const bestScoreSpan = document.getElementById("bestScore");
  const totalScoreSpan = document.getElementById("totalScore");
  const gradeSpan = document.getElementById("grade");

  /* -------------------- MENU ROCKET -------------------- */
  const menuRocketCanvas = document.getElementById("menuRocket");
  const menuRocketCtx = menuRocketCanvas.getContext("2d");

  /* -------------------- OBJECTIFS -------------------- */
  const objectifsBtn = document.getElementById("objectifsBtn");
  const objectifList = document.getElementById("objectifList");
  const objectifItems = document.getElementById("objectifItems");
  const rocketItems = document.getElementById("rocketItems");
  const totalDistanceDisplay = document.getElementById("totalDistanceDisplay");
  const closeObjectifs = document.getElementById("closeObjectifs");

  /* -------------------- FX -------------------- */
  const milestoneMessage = document.getElementById("milestoneMessage");
  const levelFlash = document.getElementById("levelFlash");
  const successBanner = document.getElementById("success-banner");

  /* -------------------- SETTINGS -------------------- */
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsPanel = document.getElementById("settingsPanel");
  const toggleMusicBtn = document.getElementById("toggleMusic");
  const resetGameBtn = document.getElementById("resetGameBtn");
  const closeSettings = document.getElementById("closeSettings");

  /* -------------------- NAV -------------------- */
  const backToMenuBtn = document.getElementById("backToMenu");

  /* -------------------- PROGRESSION -------------------- */
  const progressBar = document.getElementById("progressBar");
  const progressLabel = document.getElementById("progressLabel");

  /* -------------------- AUDIO -------------------- */
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

  /* -------------------- DEVICE -------------------- */
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const menuObjectivesBtn = document.getElementById("menuObjectivesBtn");
  const wordDisplay = document.getElementById("wordDisplay");

  /* -------------------- ZOOM -------------------- */
  const GAME_ZOOM = isMobile ? 0.8 : 1;
  ctx.scale(GAME_ZOOM, GAME_ZOOM);

  menuObjectivesBtn.onclick = () => {
    playClick();
    updateObjectifDisplay();
    objectifList.style.display = "flex";
  };

   /* -------------------- STORAGE -------------------- */
  const STORAGE_KEYS = {
    BEST_SCORE: "bestScore",
    TOTAL_DISTANCE: "totalDistance",
    TOTAL_STARS: "totalStars",
    TOTAL_GALAXY: "totalGalaxy",
    TOTAL_DESTROYED: "totalDestroyed",
    SELECTED_ROCKET: "selectedRocketKey",
    UNLOCKED_ROCKETS: "unlockedRockets",
    TOTAL_SPECIAL: "totalSpecial",
    TOTAL_BIG_STARS: "totalBigStars"
  };

  /* -------------------- GRADES -------------------- */
  const gradeObjectifs = [
    { threshold: 0, label: "Interstellar Recruit" },
    { threshold: 500, label: "Space Adventurer" },
    { threshold: 1000, label: "Meteorite Hunter" },
    { threshold: 1500, label: "Cosmic Explorer" },
    { threshold: 2000, label: "Legendary Pilot" },
    { threshold: 2500, label: "Stellar Commander" },
    { threshold: 3000, label: "Galactic Hero" },
    { threshold: 3500, label: "Astral Veteran" },
    { threshold: 4000, label: "Space Ace" },
    { threshold: 4500, label: "Star Guardian" },
    { threshold: 5000, label: "Legend of the Universe" }
  ];

  /* -------------------- ROCKETS -------------------- */
  const rocketDefinitions = [
    { key: "classic", label: "Classic Rocket", file: "rocket2.png", unlock: { type: "distance", value: 0 } },
    { key: "white", label: "White Rocket", file: "rocket3.png", unlock: { type: "distance", value: 500 } },
    { key: "steel", label: "Steel Rocket", file: "rocket4.png", unlock: { type: "stars", value: 50 } },
    { key: "red", label: "Red Rocket", file: "rocket5.png", unlock: { type: "galaxy", value: 1 } },
    { key: "aqua", label: "Aqua Rocket", file: "rocket6.png", unlock: { type: "stars", value: 150 } },
    { key: "blue", label: "Blue Rocket", file: "rocket7.png", unlock: { type: "distance", value: 10000 } },
    { key: "retro", label: "Retro Rocket", file: "rocket8.png", unlock: { type: "galaxy", value: 10 } },
    { key: "tech", label: "Tech Rocket", file: "rocket9.png", unlock: { type: "destroy", value: 200 } },
    { key: "orange", label: "Neon Rocket", file: "rocket10.png", unlock: { type: "stars", value: 500 } },
    { key: "gold", label: "Golden Rocket", file: "rocket11.png", unlock: { type: "run", value: 3000 } }
  ];
    /* -------------------- LETTER IMAGES -------------------- */

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

  /* -------------------- EXPLOSIONS -------------------- */

  const explosionFrames = [];

  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `Explosion${i}.png`;
    explosionFrames.push(img);
  }

  /* -------------------- SPECIAL OBJECTS -------------------- */

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

  canvas.addEventListener(
    "touchstart",
    e => {
      e.preventDefault();
      pressing = true;
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    e => {
      e.preventDefault();
      pressing = false;
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchcancel",
    e => {
      e.preventDefault();
      pressing = false;
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    e => {
      e.preventDefault();
    },
    { passive: false }
  );

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
  let newlyUnlockedThisRun = [];
  let lastTime = 0;

  let starsCollectibles = [];
  let starScore = 0;
  let bigStarScore = 0;

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

  /* -------------------- WORD SYSTEM -------------------- */

  const word = ["G", "A", "L", "A", "X", "Y"];
  let currentLetterIndex = 0;
  let letters = [];
  let lastLetterSpawn = 0;
  const letterInterval = 10000;

  let galaxyCompletedThisRun = 0;

  let specialDestroyedThisRun = {
    ISS: false,
    Starman: false,
    Soyouz: false,
    Ovni: false
  };

  let meteorToStarActive = false;
  let meteorToStarTimer = 0;
  let meteorToStarDuration = 8000;
  let meteorToStarBonuses = [];
  let lastMeteorToStarSpawn = 0;

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

  /* -------------------- OBJECTIFS DISPLAY -------------------- */

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
      li.classList.add(unlocked ? "rocket-unlocked" : "rocket-locked");

      const status = unlocked
        ? " — unlocked"
        : ` — locked (${formatNumber(obj.threshold)} m)`;

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

      switch (rocket.unlock.type) {
        case "distance":
          progressText = `${formatNumber(totalDistance)} / ${formatNumber(rocket.unlock.value)} m`;
          break;
        case "stars":
          progressText = `${totalStars} / ${rocket.unlock.value} ⭐`;
          break;
        case "galaxy":
          progressText = "Complete GALAXY";
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

      const status = unlocked ? " — unlocked" : ` — ${progressText}`;

      li.textContent = `${rocket.label}${status}`;
      rocketItems.appendChild(li);
    });
  }

  /* -------------------- UNLOCK -------------------- */

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

      switch (rocket.unlock.type) {
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
          unlocked = getBestScore() >= rocket.unlock.value;
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

  /* -------------------- SPECIAL MISSION -------------------- */

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

   /* -------------------- SPAWN -------------------- */

  function createBubble(speed) {
    const base = isMobile ? 15 : 25;
    const extra = isMobile ? 10 : 15;

    const radius = Math.random() * extra + base;
    const y = radius + Math.random() * (height - 2 * radius);

    const image =
      meteoriteImages[Math.floor(Math.random() * meteoriteImages.length)];

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
      size,
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

  function createMeteorToStarBonus(speed) {
    meteorToStarBonuses.push({
      x: width + 40,
      y: Math.random() * (height - 80) + 40,
      size: 28,
      speed: speed * 0.6
    });
  }

  /* -------------------- LETTER -------------------- */

  function createLetter(speed) {
    if (currentLetterIndex >= word.length) return;

    const letter = word[currentLetterIndex];

    letters.push({
      x: width + 50,
      y: Math.random() * (height - 100) + 50,
      size: 35,
      speed: speed * 0.6,
      letter
    });
  }

  /* -------------------- COLLISION -------------------- */

  function isColliding(c, b) {
    const dx = c.x - b.x;
    const dy = c.y - b.y;

    return Math.sqrt(dx * dx + dy * dy) < c.radius + b.radius;
  }

  /* -------------------- SPECIAL OBSTACLE -------------------- */

  function createSpecialObstacle(speed) {
    const index = Math.floor(Math.random() * specialObstacleImages.length);
    const image = specialObstacleImages[index];

    let size;

    if (image.src.includes("ISS")) size = 100;
    else if (image.src.includes("Ovni")) size = 35;
    else if (image.src.includes("Soyouz")) size = 38;
    else if (image.src.includes("Starman")) size = 32;
    else size = 35;

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

  /* -------------------- EXPLOSION CLASS -------------------- */

  class SpriteExplosion {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.frame = 0;
      this.frameDuration = 120;
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

      // halo
      ctx.save();
      ctx.globalAlpha = 0.2 * alpha;
      ctx.fillStyle = "#00ccff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // sprite
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
    particles.push(new SpriteExplosion(x, y));
  }
    /* -------------------- DRAW -------------------- */

  function drawFlame(x, y) {
    const pulse = Math.sin(flamePulse) * 0.5 + 0.5;

    const flameLength = 30 + pulse * 25;
    const flameWidth = 20 + pulse * 10;

    const gradient = ctx.createLinearGradient(x, y, x - flameLength, y);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.3, "orange");
    gradient.addColorStop(0.7, "red");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

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

    ctx.drawImage(
      currentRocket,
      -radius,
      -radius,
      radius * 2,
      radius * 2
    );

    ctx.restore();
  }

  function drawStar(star) {
    if (!starImage.complete) return;

    ctx.drawImage(
      starImage,
      star.x - star.size,
      star.y - star.size,
      star.size * 2,
      star.size * 2
    );
  }

  function drawMeteorite(b) {
    ctx.save();
    ctx.translate(b.x, b.y);

    ctx.drawImage(
      b.image,
      -b.radius,
      -b.radius,
      b.radius * 2,
      b.radius * 2
    );

    ctx.restore();
  }

  function drawSpecialObstacle(o) {
    if (!o.image.complete) return;

    ctx.drawImage(
      o.image,
      o.x - o.size,
      o.y - o.size,
      o.size * 2,
      o.size * 2
    );
  }

  function drawMagnet(m) {
    if (!magnetImage.complete) return;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffd700";

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
    if (!shieldImage.complete) return;

    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffcc";

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
      ctx.arc(
        s.x,
        s.y,
        s.radius + speedLevel * 0.08,
        0,
        Math.PI * 2
      );
      ctx.fill();

      s.x -= s.speed + speedLevel * 0.18;

      if (s.x < 0) {
        s.x = width;
        s.y = Math.random() * height;
      }
    });
  }

  /* -------------------- SCOREBOARD -------------------- */

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

    const totalBigStars = getTotalBigStars() + bigStarScore;
    setTotalBigStars(totalBigStars);

    // 🌌 galaxy
    const totalGalaxy = getTotalGalaxy() + galaxyCompletedThisRun;
    setTotalGalaxy(totalGalaxy);

    // 💥 destroy
    const totalDestroyed = getTotalDestroyed() + meteorDestroyed;
    setTotalDestroyed(totalDestroyed);

    document.getElementById("starsRun").textContent = starScore;
    document.getElementById("starsTotal").textContent = getTotalStars();

    document.getElementById("galaxyRun").textContent = galaxyCompletedThisRun;
    document.getElementById("galaxyTotal").textContent = getTotalGalaxy();

    document.getElementById("specialTotal").textContent = getTotalSpecial();

    newlyUnlockedThisRun = unlockRocketsIfNeeded(newTotal);

    currentScoreSpan.textContent = formatNumber(runScore);
    bestScoreSpan.textContent = formatNumber(bestScore);
    totalScoreSpan.textContent = formatNumber(newTotal);
    gradeSpan.textContent = getGrade(bestScore);

    updateObjectifDisplay();

    scoreBoard.style.display = "block";

    if (newlyUnlockedThisRun.length) {
      const lastUnlocked =
        newlyUnlockedThisRun[newlyUnlockedThisRun.length - 1];

      setTimeout(() => {
        showSuccessBanner(
          `🚀 New rocket unlocked: ${lastUnlocked.label}`
        );
      }, 250);
    }
  }

  /* -------------------- RESET -------------------- */

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
      player.maxSpeed = 13;
    }

    nextGradeIndex = 1;
    player.radius = 30;

    bubbles = [];
    specialObstacles = [];
    particles = [];
    starsCollectibles = [];

    starScore = 0;
    bigStarScore = 0;

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

    [rejouerBtn, gameOverText, shareBtn].forEach(
      e => (e.style.display = "none")
    );

    objectifsBtn.style.display = "none";
    objectifList.style.display = "none";
    scoreBoard.style.display = "none";

    distanceDisplay.style.display = "block";
    backToMenuBtn.style.display = "none";

    progressBar.parentElement.style.display = "block";
    progressLabel.style.display = "block";

    lastSpecialSpawn = 0;

    shields = [];
    shieldActive = false;
    shieldTimer = 0;

    meteorToStarBonuses = [];
    meteorToStarActive = false;
    meteorToStarTimer = 0;

    x2s = [];
  
 }
    /* -------------------- GAME LOOP -------------------- */

  function gameLoop(timestamp) {

    let dt = (timestamp - lastTime) / 16.67;
    dt = Math.min(dt, 1.5);
    lastTime = timestamp;

    /* -------------------- RESET CANVAS -------------------- */

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    ctx.scale(dpr * GAME_ZOOM, dpr * GAME_ZOOM);

    /* -------------------- BACKGROUND -------------------- */

    drawStars();

    /* -------------------- DYING PHASE -------------------- */

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

    /* -------------------- FOCUS MODE -------------------- */

    if (focusMode) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    /* -------------------- SPEED -------------------- */

    const speedFactor = isMobile ? 0.7 : 1;

    const maxDistanceCap = isMobile ? 1000 : 1500;
    const effectiveDistance = Math.min(distance, maxDistanceCap);

    const speedLevel = Math.floor(effectiveDistance / 400);

    const baseSpeed = (11 + speedLevel * 0.8) * speedFactor;
    const cappedSpeed = Math.min(baseSpeed, 26);

    const speedRamp = 1 + (effectiveDistance / 3000);
    const finalSpeed = cappedSpeed * speedRamp;

    /* -------------------- SPAWN -------------------- */

    frameCount += dt;

    if (frameCount >= 25 && bubbles.length < 20 && !gameOver) {
      frameCount = 0;
      createBubble(finalSpeed);
    }

    if (!gameOver && specialObstacles.length === 0 && performance.now() - lastSpecialSpawn > 8000) {
      createSpecialObstacle(finalSpeed);
      lastSpecialSpawn = performance.now();
    }

    if (!focusMode && Math.random() < 0.02 && !gameOver) {
      createStar(finalSpeed);
    }

    /* -------------------- PLAYER -------------------- */

    player.velocityY += (pressing ? player.gravityDown : player.gravityUp) * dt;
    player.velocityY = Math.max(-player.maxSpeed, Math.min(player.velocityY, player.maxSpeed));

    player.y += player.velocityY * dt;
    player.velocityY *= Math.pow(0.87, dt);

    if (player.y < player.radius) {
      player.y = player.radius;
      player.velocityY = 0;
    }

    if (player.y > height - player.radius) {
      player.y = height - player.radius;
      player.velocityY = 0;
    }

    /* -------------------- DISTANCE -------------------- */

    distance += (baseSpeed / 60) * distanceSpeedFactor * dt;

    distanceDisplay.textContent =
      `Distance: ${formatNumber(Math.floor(distance))} m ⭐ ${starScore} 💥 ${meteorDestroyed}`;

    /* -------------------- PROGRESSION BAR -------------------- */

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
    progressLabel.textContent = `Next Grade : ${Math.floor(nextThreshold - distance)} m`;

    /* -------------------- DRAW -------------------- */

    starsCollectibles.forEach(drawStar);
    bubbles.forEach(drawMeteorite);
    specialObstacles.forEach(drawSpecialObstacle);

    drawRocket(player.x, player.y, player.radius);

    /* -------------------- COLLISION -------------------- */

    for (let i = 0; i < bubbles.length; i++) {
      if (isColliding(player, bubbles[i])) {
        isDying = true;
        createExplosion(player.x, player.y);
        pressing = false;
        break;
      }
    }

    /* -------------------- LOOP -------------------- */

    if (!gameOver || particles.length > 0) {
      animationId = requestAnimationFrame(gameLoop);
    }
  }

    /* -------------------- BUTTONS -------------------- */

  playButton.onclick = () => {
    playClick();
    menu.style.display = "none";
    modeSelect.style.display = "block";
  };

  normalModeBtn.onclick = () => {
    playClick();
    focusMode = false;
    startGame();
  };

  focusModeBtn.onclick = () => {
    playClick();
    focusMode = true;
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

    const text = `J'ai fait ${Math.floor(distance)} m dans AstroLab Rush ! 🚀`;
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: "AstroLab Rush",
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

    gameOver = false;
    bubbles = [];
    particles = [];

    gameOverText.style.display = "none";
    scoreBoard.style.display = "none";
    rejouerBtn.style.display = "none";
    shareBtn.style.display = "none";
    objectifsBtn.style.display = "none";
    backToMenuBtn.style.display = "none";

    document.getElementById("topHUD").style.display = "none";

    menu.style.display = "block";

    const menuCanvas = document.getElementById("menuStars");
    if (menuCanvas) menuCanvas.style.display = "block";

    wordDisplay.style.display = "none";
    distanceDisplay.style.display = "none";

    progressBar.parentElement.style.display = "none";
    progressLabel.style.display = "none";

    drawMenuRocket();
  };

  /* -------------------- START GAME -------------------- */

  function startGame() {

    // ✅ FIX IMPORTANT
    document.getElementById("topHUD").style.display = "flex";

    if (music && musicEnabled) {
      music.currentTime = 0;
      music.play().catch(() => {});
    }

    modeSelect.style.display = "none";

    resetGame();

    wordDisplay.style.display = "block";
    distanceDisplay.style.display = "block";

    progressBar.parentElement.style.display = "block";
    progressLabel.style.display = "block";

    const menuCanvas = document.getElementById("menuStars");
    if (menuCanvas) menuCanvas.style.display = "none";

    animationId = requestAnimationFrame(gameLoop);
  }

  /* -------------------- INIT -------------------- */

  menu.style.display = "block";
  distanceDisplay.style.display = "none";

  updateObjectifDisplay();
  drawMenuRocket();

  /* -------------------- MENU STARS -------------------- */

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

  /* -------------------- FIN -------------------- */

})();
  
