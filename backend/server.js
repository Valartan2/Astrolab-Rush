const express = require("express");
const { google } = require("googleapis");
const app = express();
app.use(express.json());

// Config
const SPREADSHEET_ID = "1iirt-a1JVk5ZgMyw5Nu4BZYWGezjbt1SkQlk7rapyEc";
const MAX_SCORE = 5000;
const MIN_SCORE = 1;
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h

// Mémoire anti-spam (wallet -> dernière soumission)
const lastSubmission = {};

// Valider adresse Solana basique
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

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Route principale
app.post("/burn", async (req, res) => {
  const { wallet, score, date } = req.body;

  // Validations
  if (!wallet || !isValidSolanaAddress(wallet)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  const parsedScore = parseInt(score);
  if (!parsedScore || parsedScore < MIN_SCORE || parsedScore > MAX_SCORE) {
    return res.status(400).json({ error: `Score must be between ${MIN_SCORE} and ${MAX_SCORE}` });
  }

  // Anti-spam : 1 soumission par wallet par 24h
  const now = Date.now();
  if (lastSubmission[wallet] && now - lastSubmission[wallet] < COOLDOWN_MS) {
    const waitHours = Math.ceil((COOLDOWN_MS - (now - lastSubmission[wallet])) / 3600000);
    return res.status(429).json({ error: `Wait ${waitHours}h before submitting again` });
  }

  try {
    const sheets = await getSheets();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Feuille 1!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[date || new Date().toISOString(), wallet, parsedScore]],
      },
    });

    // Mémoriser la soumission
    lastSubmission[wallet] = now;

    return res.json({ success: true, burned: parsedScore });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AstroBurn backend running on port ${PORT}`));
