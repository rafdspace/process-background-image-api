// New Version
import express from "express";
import cors from "cors";
import multer from "multer";
import "dotenv/config";
import processBackgroundImage from "./api/process-background-image.js";
import uploadTest from "./api/upload.js";

const port = process.env.PORT || 3040;
const CANVA_APP_ID = process.env.CANVA_APP_ID?.toLowerCase();

if (!CANVA_APP_ID) {
  console.error("Environment variable CANVA_APP_ID is not set or empty");
  process.exit(1);
}

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

const allowlist = [
  `https://app-${CANVA_APP_ID}.canva-apps.com`,
  "http://localhost:3000",
];

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

app.use(express.json());

app.post("/api/upload", upload.single("image"), uploadTest);

app.post(
  "/api/process-background-image",
  upload.single("image"),
  processBackgroundImage
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
