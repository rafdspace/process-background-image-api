import express from "express";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";
import removeBackground from "./api/remove-background.js";

const PORT = process.env.PORT || 3040;
const CANVA_APP_ID = process.env.CANVA_APP_ID?.toLowerCase();

const allowlist = [
  `https://app-${CANVA_APP_ID}.canva-apps.com`,
  "http://localhost:3000",
];

if (!CANVA_APP_ID) {
  console.error("Environment variable CANVA_APP_ID is not set or empty");
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowlist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Invalid origin"));
      }
    },
    optionsSuccessStatus: 200,
    methods: "POST",
  })
);
app.use(bodyParser.json()); // Use body-parser middleware

// Endpoint to handle image processing
app.post("/api/remove-background", removeBackground);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
