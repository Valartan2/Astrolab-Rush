(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const rejouerBtn = document.getElementById("rejouer");
  const gameOverText = document.getElementById("gameOverText");
  const distanceDisplay = document.getElementById("distance");
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

  // Variables pour canvas
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

  // Player objet
  const player = {
    x: 150,
    y: height / 2,
    radius: 25,
    velocityY: 0,
    gravityUp: -0.8,
    gravityDown: 0.9,
    maxSpeed: 6,
  };

  // Input
  let pressing = false;
  window.addEventListener("keydown", e => { if (e.code === "Space") pressing = true; });
  window.addEventListener("keyup", e => { if (e.code === "Space") pressing = false; });
  window.addEventListener("touchstart", () => { pressing = true; }, { passive: true });
  window.addEventListener("touchend", () => { pressing = false; }, { passive: true });

  // Meteors / bubbles
  let bubbles = [];
  let frameCount = 0;
  let flamePulse = 0;
  let gameOver = false;
  let distance = 0;
  let startTime = 0;

  const distanceSpeedFactor = 2.5;
  const CONSTANT_SPEED = 20;

  // Background stars
  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.2,
    speed: Math.random() * 0.6 + 0.2,
  }));

  // Création des bulles / météorites
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

  // Collision detection
  function isColliding(c, b) {
    const dx = c.x - b.x;
    const dy = c.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) < c.radius + b.radius;
  }

  // Particles pour explosion
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

  // Dessiner la flamme du moteur
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

  // Dessiner la fusée
  function drawRocket(x, y, radius) {
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(rocketImg, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
  }

  // Dessiner une météorite
  function drawMeteorite(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.drawImage(b.image, -b.radius, -b.radius, b.radius * 2, b.radius * 2);
    ctx.restore();
  }

  // Dessiner le fond et les étoiles
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

  // Reset partie
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
    startTime = performance.now();
    player.y = height / 2;
    player.velocityY = 0;
    player.x = isMobile ? 75 : 150;

    // Cacher les boutons et texte game over
    rejouerBtn.style.display = "none";
    gameOverText.style.display = "none";
    shareBtn.style.display = "none";

    // Afficher la distance au début
    distanceDisplay.textContent = "Distance: 0 m";
    distanceDisplay.style.display = "block";
  }

  // Gestion du bouton Jouer
  playButton.onclick = () => {
    menu.style.display = "none";
    menuCanvas.style.display = "none";
    resetGame();
    requestAnimationFrame(gameLoop);
  };

  // Gestion bouton Rejouer
  rejouerBtn.onclick = () => {
    resetGame();
    requestAnimationFrame(gameLoop);
  };

  // Gestion bouton Partager
  shareBtn.onclick = () => {
    const text = `J'ai fait ${Math.floor(distance)} m dans AstroLab ! Peux-tu faire mieux ? 🚀🎮`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "AstroLab - Mon score", text, url }).catch(console.error);
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    }
  };

  // Boucle de jeu
  function gameLoop(timestamp) {
    if (gameOver) return;

    const elapsed = (timestamp - startTime) / 1000; // secondes
    const baseSpeed = CONSTANT_SPEED;

    // Update player vitesse verticale
    if (pressing) {
      player.velocityY += player.gravityUp;
    } else {
      player.velocityY += player.gravityDown;
    }
    player.velocityY = Math.min(Math.max(player.velocityY, -player.maxSpeed), player.maxSpeed);
    player.y += player.velocityY;

    // Limites verticales
    if (player.y < player.radius) player.y = player.radius;
    if (player.y > height - player.radius) player.y = height - player.radius;

    // Mise à jour distance en fonction du temps + facteur de vitesse
    distance = elapsed * baseSpeed * distanceSpeedFactor;
    distanceDisplay.textContent = "Distance: " + Math.floor(distance) + " m";

    // Ajout de nouvelles bulles/météorites tous les 20 frames (~1/3 sec)
    if (frameCount % 20 === 0) {
      createBubble(baseSpeed * 0.7);
    }

    // Update bulles
    bubbles.forEach((b, index) => {
      b.x -= b.speed;
      b.y += Math.sin(frameCount / 15) * 0.5 * b.direction;

      // Supprimer si hors écran à gauche
      if (b.x + b.radius < 0) bubbles.splice(index, 1);

      // Collision avec joueur
      if (isColliding(player, b)) {
        gameOver = true;
        rejouerBtn.style.display = "block";
        gameOverText.style.display = "block";
        shareBtn.style.display = distance > 0 ? "inline-block" : "none";
        createExplosion(player.x, player.y);
      }
    });

    // Update particules explosion
    particles.forEach((p, index) => {
      p.update();
      if (p.alpha <= 0) particles.splice(index, 1);
    });

    // Dessin
    drawStars();

    // Dessiner la fusée
    drawRocket(player.x, player.y, player.radius);

    // Dessiner la flamme
    if (!gameOver) drawFlame(player.x - player.radius, player.y);

    // Dessiner bulles
    bubbles.forEach(drawMeteorite);

    // Dessiner particules
    particles.forEach(p => p.draw());

    frameCount++;
    flamePulse += 0.1;

    if (!gameOver) {
      requestAnimationFrame(gameLoop);
    }
  }

  // Initialisation menuCanvas (effet étoiles)
  const menuCanvas = document.getElementById("menuStars");
  const menuCtx = menuCanvas.getContext("2d");

  function resizeMenuCanvas() {
    const dpr = window.devicePixelRatio || 1;
    menuCanvas.width = window.innerWidth * dpr;
    menuCanvas.height = window.innerHeight * dpr;
    menuCanvas.style.width = window.innerWidth + "px";
    menuCanvas.style.height = window.innerHeight + "px";
    menuCtx.setTransform(1, 0, 0, 1, 0, 0);
    menuCtx.scale(dpr, dpr);
  }
  window.addEventListener("resize", resizeMenuCanvas);
  resizeMenuCanvas();

  // Étoiles pour menu
  const menuStars = Array.from({ length: 150 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.5 + 0.2,
    speed: Math.random() * 0.6 + 0.2,
  }));

  function drawMenuStars() {
    menuCtx.fillStyle = "#001122";
    menuCtx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
    menuCtx.fillStyle = "white";
    menuStars.forEach(s => {
      menuCtx.beginPath();
      menuCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      menuCtx.fill();
      s.x -= s.speed;
      if (s.x < 0) s.x = window.innerWidth;
    });
    requestAnimationFrame(drawMenuStars);
  }
  drawMenuStars();

  // Initialisation écran menu
  menuCanvas.style.display = "block";
  menu.style.display = "block";
  distanceDisplay.style.display = "none";
  rejouerBtn.style.display = "none";
  gameOverText.style.display = "none";
  shareBtn.style.display = "none";
})();

