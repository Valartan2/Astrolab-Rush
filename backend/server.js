const express = require("express");
const { google } = require("googleapis");
const rateLimit = require("express-rate-limit");
const redis = require("redis");

const app = express();
app.use(express.json());

// Config
const SPREADSHEET_ID = "1iirt-a1JVk5ZgMyw5Nu4BZYWGezjbt1SkQlk7rapyEc";
const MAX_SCORE = 5000;
const MIN_SCORE = 1;
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h
const ALLOWED_ORIGIN = "https://valartan2.github.io";

// Redis client
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect();

// Valider adresse Solana
function isValidSolanaAddress(address) {
  return typeof address === "string" &&
    address.length >= 32 &&
    address.length <= 44 &&
    /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
}

// Google Sheets auth
async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

// CORS — restreint à GitHub Pages
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Rate limiting par IP — max 10 requêtes par heure
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests from this IP" }
});
app.use("/burn", limiter);

// Route principale
app.post("/burn", async (req, res) => {
  const { wallet, score } = req.body;

  // Validation wallet
  if (!wallet || !isValidSolanaAddress(wallet)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  // Validation score
  const parsedScore = parseInt(score);
  if (!parsedScore || parsedScore < MIN_SCORE || parsedScore > MAX_SCORE) {
    return res.status(400).json({ error: `Score must be between ${MIN_SCORE} and ${MAX_SCORE}` });
  }

  // Cooldown 24h par wallet via Redis
  const redisKey = `cooldown:${wallet}`;
  const lastBurn = await redisClient.get(redisKey);
  if (lastBurn) {
    const waitMs = COOLDOWN_MS - (Date.now() - parseInt(lastBurn));
    const waitHours = Math.ceil(waitMs / 3600000);
    return res.status(429).json({ error: `Wait ${waitHours}h before submitting again` });
  }

  try {
    const sheets = await getSheets();
    const serverDate = new Date().toISOString(); // date côté serveur, pas client

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Feuille 1!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[serverDate, wallet, parsedScore]],
      },
    });

    // Stocker le cooldown dans Redis (expire après 24h)
    await redisClient.set(redisKey, Date.now().toString(), { EX: 86400 });

    return res.json({ success: true, burned: parsedScore });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AstroBurn backend running on port ${PORT}`));
