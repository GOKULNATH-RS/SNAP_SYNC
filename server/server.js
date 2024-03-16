const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const callPython = (path1, path2) => {
  return new Promise((resolve, reject) => {
    exec(`python index.py ${path1} ${path2}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(new Error(stderr));
        return;
      }
      console.log("StdOut : ", stdout);
      resolve(stdout);
    });
  });
};

app.get("/", (req, res) => {
  res.send("Images");
});

app.post("/uploadImage", (req, res) => {
  const image = req.body.image;
  console.log("Image ", image);
  res.send("Image Uploaded Successfully");
});

app.delete("/deleteImage", (req, res) => {
  const image = req.body.image;
  console.log("Image ", image);
  res.send("Image Deleted Successfully");
});

app.post("/fetchImages", async (req, res) => {
  const path = req.body.Path;
  try {
    const imagePaths = await callPython(path, "../db");
    console.log("Image Paths ", imagePaths);
    res.status(200).send(imagePaths);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
