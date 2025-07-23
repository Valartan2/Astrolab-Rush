(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const rejouerBtn = document.getElementById("rejouer");
  const gameOverText = document.getElementById("gameOverText");
  const distanceDisplay = document.getElementById("distance");
  const playerNameInput = document.getElementById("playerName");
  const submitScoreBtn = document.getElementById("submitScore");
  const menu = document.getElementById("menu");
  const playButton = document.getElementById("playButton");
  const shareBtn = document.getElementById("shareScore");
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const rocketImg = new Image();
  rocketImg.src = 'rocket.png';

  const meteoriteImages = [];
  const meteoriteImageSources = [
    'meteorite.png',
    'meteorite2.png',
    'meteorite3.png',
    'meteorite4.png',
    'meteorite5.png',
    'meteorite6.png'
  ];

  meteoriteImageSources.forEach(src => {
    const img = new Image();
    img.src = src;
    meteoriteImages.push(img);
  });

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
  }

  window.addEventListener("resize", resize);
  resize();

  const player = {
    x: 150,
    y: height / 2,
    radius: 25,
    velocityY: 0,
    gravityUp: -0.8,
    gravityDown: 0.9,
    maxSpeed: 6,
  };

  let pressing = false;
  window.addEventListener("keydown", e => { if (e.code === "Space") pressing = true; });
  window.addEventListener("keyup", e => { if (e.code === "Space") pressing = false; });
  window.addEventListener("touchstart", () => { pressing = true; }, { passive: true });
  window.addEventListener("touchend", () => { pressing = false; }, { passive: true });

  let bubbles = [];
  let frameCount = 0;
  let flamePulse = 0;
  let gameOver = false;
  let distance = 0;
  let startTime = 0;
  let hasReached1km = false;

  const distanceSpeedFactor = 2.5;
  const CONSTANT_SPEED = 20;

  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.2,
    speed: Math.random() * 0.6 + 0.2,
  }));

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
      image,
    });
  }

  function isColliding(c, b) {
    const dx = c.x - b.x;
    const dy = c.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < c.radius + b.radius;
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = Math.random() * 3 + 2;
      this.color = 'orange';
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

  let particles = [];
  function createExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(x, y));
    }
  }

  function drawFlame(x, y) {
    const pulse = Math.sin(flamePulse) * 0.5 + 0.5;
    const flameLength = 30 + pulse * 25;
    const flameWidth = 20 + pulse * 10;

    const gradient = ctx.createLinearGradient(x, y, x - flameLength, y);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.3, 'orange');
    gradient.addColorStop(0.7, 'red');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

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
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(rocketImg, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawMeteorite(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.drawImage(b.image, -b.radius, -b.radius, b.radius * 2, b.radius * 2);
    ctx.restore();
  }

  function drawStars() {
    ctx.fillStyle = "#001122";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "white";
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      s.x -= s.speed;
      if (s.x < 0) Object.assign(s, { x: width, y: Math.random() * height });
    });
  }

  function resetGame() {
    player.gravityDown = isMobile ? 0.9 : 0.9;
    player.gravityUp = isMobile ? -0.8 : -0.8;
    player.maxSpeed = isMobile ? 6 : 6;
    player.radius = isMobile ? 18 : 25;

    bubbles = [];
    particles = [];
    frameCount = 0;
    gameOver = false;
    distance = 0;
    hasReached1km = false;
    startTime = performance.now();
    player.y = height / 2;
    player.velocityY = 0;
    player.x = isMobile ? 75 : 150;
    [rejouerBtn, gameOverText, highScoreInput, shareBtn].forEach(e => e.style.display = "none");
    playerNameInput.value = "";
  }

  submitScoreBtn.onclick = () => {
    // Désormais, juste cacher l'input score et afficher rejouer + partage
    highScoreInput.style.display = "none";
    rejouerBtn.style.display = "block";
    shareBtn.style.display = "block";
  };

  playButton.onclick = () => {
    menu.style.display = "none";
    resetGame();
    menuCanvas.style.display = "none";
    distanceDisplay.style.display = "block";
    requestAnimationFrame(gameLoop);
  };

  rejouerBtn.onclick = () => {
    resetGame();
    requestAnimationFrame(gameLoop);
  };

  shareBtn.onclick = () => {
    const text = `J'ai fait ${Math.floor(distance)} m dans Astrolab ! Peux-tu faire mieux ? 🚀🎮`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "Ballon Esquive - Mon score", text, url }).catch(console.error);
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    }
  };

  menu.style.display = "block";
  distanceDisplay.style.display = "none";

  function gameLoop(timestamp) {
    drawStars();

    const elapsed = (timestamp - startTime) / 1000;
    const speedFactor = isMobile ? 0.7 : 1;
    const meteorSpeedFactor = 0.70;
    const baseSpeed = CONSTANT_SPEED * speedFactor;
    const spawnRate = isMobile ? 15 : 15;
    const maxMeteorites = isMobile ? 40 : 30;

    if (frameCount % spawnRate === 0 && bubbles.length < maxMeteorites && !gameOver) {
      createBubble(baseSpeed * meteorSpeedFactor);
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          console.log('Service Worker enregistré avec succès:', reg.scope);
        }).catch(err => {
          console.error('Erreur d\'enregistrement du Service Worker:', err);
        });
      });
    }

    bubbles.forEach((b, i) => {
      b.x -= b.speed;
      b.y += b.direction * b.floatSpeed;
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
      distanceDisplay.textContent = `Distance: ${Math.floor(distance)} m`;

      for (let i = 0; i < bubbles.length; i++) {
        if (isColliding(player, bubbles[i])) {
          createExplosion(player.x, player.y);
          gameOver = true;
          gameOverText.style.display = "block";

          if (distance >= 1000) {
            afficherRecompense();
          }

          highScoreInput.style.display = "none";
          rejouerBtn.style.display = "block";
          shareBtn.style.display = "block";
          break;
        }
      }
    }

    particles.forEach((p, i) => {
      p.update();
      if (p.alpha <= 0) particles.splice(i, 1);
    });

    drawRocket(player.x, player.y, player.radius);
    bubbles.forEach(drawMeteorite);
    particles.forEach(p => p.draw());

    flamePulse += 0.1;
    frameCount++;

    if (!gameOver) requestAnimationFrame(gameLoop);
  }
})();
