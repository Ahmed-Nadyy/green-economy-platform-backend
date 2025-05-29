const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload directories exist
const articleDir = "uploads/article";
if (!fs.existsSync(articleDir)) {
  fs.mkdirSync(articleDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      cb(null, articleDir);
    } else if ([".mp4", ".mov"].includes(ext)) {
      cb(null, "uploads/videos");
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
