const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  console.log({ file: req.file.buffer });
  // Send the file back to the client
  //   res.set("Content-Type", req.file.mimetype);
  res.status(200).send(req.file.buffer);
};

export default upload;
