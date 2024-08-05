import { FormData, File } from "formdata-node";

import fetch from "node-fetch";

const processBackgroundImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image file uploaded.");
    }

    // Create a new FormData instance
    const formData = new FormData();

    // Append the image file using the File constructor
    const file = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype,
    });
    formData.set("image_file", file);

    // Append additional fields
    formData.set("format", req.body.format || "png");
    formData.set("channels", req.body.channels || "");
    formData.set("bg_color", req.body.bg_color || "");
    formData.set("size", req.body.size || "");
    formData.set("crop", req.body.crop || "");
    formData.set("despill", req.body.despill || "");

    const url = "https://sdk.photoroom.com/v1/segment";
    const options = {
      method: "POST",
      headers: {
        Accept: "image/png, application/json",
        "x-api-key": process.env.PHOTOROOM_API_KEY,
        ...formData.headers,
      },
      body: formData,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    // Use arrayBuffer()
    const resultArrayBuffer = await response.arrayBuffer();
    const resultBuffer = Buffer.from(resultArrayBuffer);

    res.set("Content-Type", "image/png");
    res.send(resultBuffer);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default processBackgroundImage;
