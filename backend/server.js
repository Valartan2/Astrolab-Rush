const express = require("express");
const { google } = require("googleapis");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());

const SPREADSHEET_ID = "1iirt-a1JVk5ZgMyw5Nu4BZYWGezjbt1SkQlk7rapyEc";
const MAX_ETOILES = 50000;
const MIN_ETOILES = 1;
const ALLOWED_ORIGIN = "https://valartan2.github.io";

function isValidSolanaAddress(address) {
  return typeof address === "string" &&
    address.length >= 32 &&
    address.length <= 44 &&
    /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
}

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests from this IP" }
});
app.use("/contribute", limiter);

app.post("/contribute", async (req, res) => {
  const { wallet, etoiles } = req.body;

  if (!wallet || !isValidSolanaAddress(wallet)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  const parsedEtoiles = parseInt(etoiles);
  if (!parsedEtoiles || parsedEtoiles < MIN_ETOILES || parsedEtoiles > MAX_ETOILES) {
    return res.status(400).json({ error: `Etoiles must be between ${MIN_ETOILES} and ${MAX_ETOILES}` });
  }

  try {
    const sheets = await getSheets();
    const serverDate = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Feuille 1!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[serverDate, wallet, parsedEtoiles]],
      },
    });

    return res.json({ success: true, etoiles: parsedEtoiles });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AstroBurn backend running on port ${PORT}`));
