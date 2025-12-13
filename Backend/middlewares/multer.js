import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir); // Save to "uploads/" folder
  },
  filename: function (req, file, callback) {
    // Use unique filename to prevent overwriting
    const uniqueName = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueName);
  },
});

const upload = multer({ storage });
export default upload;
