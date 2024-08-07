// V2
import express from "express";
import axios from "axios";
import FormData from "form-data";
import cors from "cors";
import "dotenv/config";
import bodyParser from "body-parser";

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
app.post("/api/remove-background", async (req, res) => {
  const { imageUrl } = req.body; // Get the image URL from the request body
  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  try {
    // Step 1: Download the image
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const imageBytes = response.data;

    // Step 2: Call to the Remove Background API
    const form = new FormData();
    form.append("image_file", imageBytes, "image.jpg");
    form.append("size", "medium");

    const uploadResponse = await axios.post(
      "https://sdk.photoroom.com/v1/segment",
      form,
      {
        headers: {
          "x-api-key": process.env.PHOTOROOM_API_KEY, // Use environment variable for the API key
          ...form.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    // Step 3: Send the result image back to the client
    res.set("Content-Type", "image/png");
    res.send(uploadResponse.data);
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).json({ error: "Failed to process image" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
