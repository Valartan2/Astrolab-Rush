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

  const clickSound = new Audio("click-151673.mp3");
  function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  const levelUpSound = new Audio("LevelUp.mp3");
  levelUpSound.volume = 0.6;
  levelUpSound.preload = "auto";
  levelUpSound.load();

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
    { threshold: 0, label: "Lord of the Multiverse" },
    { threshold: 500, label: "Master of Infinity" },
    { threshold: 1000, label: "Eternal Voyager" },
    { threshold: 1500, label: "Champion of the Cosmos" },
    { threshold: 2000, label: "Supreme Navigator" },
    { threshold: 2500, label: "Celestial Overlord" },
    { threshold: 3000, label: "Galaxy Architect" },
    { threshold: 3500, label: "Legend of the Universe" }
  ];

  /* -------------------- Rockets -------------------- */
  const rocketDefinitions = [
    { key: "classic", label: "Classic Rocket", file: "rocket2.png", unlockAt: 0 },
    { key: "blue", label: "Blue Rocket", file: "rocket3.png", unlockAt: 1000 },
    { key: "red", label: "Red Rocket", file: "rocket4.png", unlockAt: 5000 },
    { key: "plasma", label: "Plasma Rocket", file: "rocket5.png", unlockAt: 25000 },
    { key: "gold", label: "Golden Rocket", file: "rocket6.png", unlockAt: 1000000 }
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
  let particles = [];
  let newlyUnlockedThisRun = [];

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
    if (score >= 3500) return "Legend of the Universe";
    if (score >= 3000) return "Galaxy Architect";
    if (score >= 2500) return "Celestial Overlord";
    if (score >= 2000) return "Supreme Navigator";
    if (score >= 1500) return "Champion of the Cosmos";
    if (score >= 1000) return "Eternal Voyager";
    if (score >= 500) return "Master of Infinity";
    return "Lord of the Multiverse";
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
      li.textContent = `${obj.label} (${formatNumber(obj.threshold)} m)`;
      if (bestScore >= obj.threshold) {
        li.classList.add("objectif-achieved");
      }
      objectifItems.appendChild(li);
    });

    rocketItems.innerHTML = "";
    rocketDefinitions.forEach(rocket => {
      const li = document.createElement("li");
      const unlocked = unlockedRocketKeys.includes(rocket.key);
      const selected = selectedRocketKey === rocket.key;

      li.className = "rocket-item";
      if (unlocked) li.classList.add("rocket-unlocked");
      else li.classList.add("rocket-locked");
      if (selected) li.classList.add("rocket-selected");

      const status = unlocked
        ? (selected ? " — selected" : " — unlocked")
        : ` — locked (${formatNumber(rocket.unlockAt)} m total)`;

      li.textContent = `${rocket.label}${status}`;

      if (unlocked) {
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
          selectedRocketKey = rocket.key;
          setSelectedRocketKey(rocket.key);
          updateObjectifDisplay();
          showSuccessBanner(`🚀 ${rocket.label} selected`);
        });
      }

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

  function isColliding(c, b) {
    const dx = c.x - b.x;
    const dy = c.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < c.radius + b.radius;
  }

  /* -------------------- Particles -------------------- */
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 3 + 2;
      this.color = "orange";
      this.speedX = (Math.random() - 0.5) * 5;
      this.speedY = (Math.random() - 0.5) * 5;
      this.alpha = 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.02;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(x, y));
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
    ctx.drawImage(currentRocket, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawMeteorite(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.drawImage(b.image, -b.radius, -b.radius, b.radius * 2, b.radius * 2);
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
    gradeSpan.textContent = getGrade(score);

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
      player.gravityDown = 1.5;
      player.gravityUp = -1.5;
      player.maxSpeed = 12;
    } else {
      player.gravityDown = 0.9;
      player.gravityUp = -0.8;
      player.maxSpeed = 6;
    }

    nextGradeIndex = 1;
    player.radius = 30;
    bubbles = [];
    particles = [];
    frameCount = 0;
    flamePulse = 0;
    gameOver = false;
    distance = 0;
    startTime = performance.now();
    newlyUnlockedThisRun = [];

    player.y = height / 2;
    player.velocityY = 0;
    player.x = isMobile ? 75 : 150;
    pressing = false;

    [rejouerBtn, gameOverText, shareBtn].forEach(e => e.style.display = "none");
    objectifsBtn.style.display = "none";
    objectifList.style.display = "none";
    scoreBoard.style.display = "none";
    distanceDisplay.style.display = "block";
  }

  /* -------------------- Buttons -------------------- */
  playButton.onclick = () => {
    playClick();

    if (music) {
      music.pause();
      music.currentTime = 0;
      music.play().catch(() => {});
    }

    menu.style.display = "none";
    resetGame();

    const menuCanvas = document.getElementById("menuStars");
    if (menuCanvas) menuCanvas.style.display = "none";

    animationId = requestAnimationFrame(gameLoop);
  };

  rejouerBtn.onclick = () => {
    playClick();

    if (music) {
      music.pause();
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

  /* -------------------- Start Screen -------------------- */
  menu.style.display = "block";
  distanceDisplay.style.display = "none";
  updateObjectifDisplay();

  drawMenuRocket();

  /* -------------------- Main Loop -------------------- */
  function gameLoop(timestamp) {
    drawStars();

    const speedFactor = isMobile ? 0.7 : 1;
    const meteorSpeedFactor = 0.70;
    const speedLevel = Math.floor(distance / 500);
    const baseSpeed = Math.min(CONSTANT_SPEED + speedLevel * 1.5, 40) * speedFactor;
    const spawnRate = 15;
    const maxMeteorites = isMobile ? 40 : 30;

    if (frameCount % spawnRate === 0 && bubbles.length < maxMeteorites && !gameOver) {
      createBubble(baseSpeed * meteorSpeedFactor);
    }

    bubbles.forEach((b, i) => {
      b.x -= b.speed;
      if (b.y > height - b.radius || b.y < b.radius) b.direction *= -1;
      if (b.x + b.radius < 0) bubbles.splice(i, 1);
    });

    if (!gameOver) {
      player.velocityY += pressing ? player.gravityDown : player.gravityUp;
      player.velocityY = Math.max(-player.maxSpeed, Math.min(player.velocityY, player.maxSpeed));
      player.y += player.velocityY;
      player.velocityY *= 0.87;

      if (player.y < player.radius) {
        player.y = player.radius;
        player.velocityY = 0;
      } else if (player.y > height - player.radius) {
        player.y = height - player.radius;
        player.velocityY = 0;
      }

      distance += (baseSpeed / 60) * distanceSpeedFactor;
      distanceDisplay.textContent = `Distance: ${formatNumber(Math.floor(distance))} m`;

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

          afficherTableauScore(distance);

          rejouerBtn.style.display = "block";
          shareBtn.style.display = "block";
          objectifsBtn.style.display = "block";
          break;
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });
    particles = particles.filter(p => p.alpha > 0);

    bubbles.forEach(drawMeteorite);

    if (!gameOver) {
      drawRocket(player.x, player.y, player.radius);
    }

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

  const centerX = size/2;
  const centerY = menuRocketCanvas.height / 2;

  rocketDefinitions.forEach((rocket, i) => {

    const img = rocketImages[rocket.key];

    const offset = (i - rocketScrollIndex) * rocketSpacing;
    const x = centerX + offset;
    const y = centerY;

    if(x < -80 || x > size + 80) return;

    const unlocked = unlockedRocketKeys.includes(rocket.key);

    menuRocketCtx.save();

    if(!unlocked){
      menuRocketCtx.globalAlpha = 0.35;
      menuRocketCtx.filter = "grayscale(100%)";
    }

    menuRocketCtx.drawImage(img, x-35, y-35, 70, 70);

    menuRocketCtx.restore();

  });

}
menuRocketCanvas.addEventListener("click", e => {

  const rect = menuRocketCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;

  const center = rect.width / 2;

 if(x < center){
  rocketScrollIndex--;
} else {
  rocketScrollIndex++;
}

rocketScrollIndex = Math.max(0, Math.min(rocketDefinitions.length - 1, rocketScrollIndex));

const rocket = rocketDefinitions[rocketScrollIndex];

  if(unlockedRocketKeys.includes(rocket.key)){
    selectedRocketKey = rocket.key;
    setSelectedRocketKey(rocket.key);
    showSuccessBanner(`🚀 ${rocket.label} selected`);
  }

  drawMenuRocket();

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
  
})();
