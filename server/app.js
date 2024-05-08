import express from "express";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

import dotenv from "dotenv";

dotenv.config();
const app = express();

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://663b67aa98d28041313843d3--cute-klepon-83d77a.netlify.app/"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.get("/", function (req, res) {
  res.send("Node Server is running. Yay!!");
});

app.get("/fetchData", async function (req, res) {
  const doc = new GoogleSpreadsheet(
    "1JqgaUiFTSRuDrRiqA9LL_xynEfwaFSxtlrs0zYwgHWE",
    serviceAccountAuth
  );

  console.log(doc);

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
  const rows = await sheet.getRows();

  res.setHeader("Content-Type", "application/json");

  if (!rows) return res.json({ message: "No data found" }).status(404);
  // Website you wish to allow to connect
  res.status(200).json(rows.map((row) => row._rawData));
  return 0;
});

app.listen(process.env.PORT || 5000);
