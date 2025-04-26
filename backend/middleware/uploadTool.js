const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads/tools directory if it doesn't exist
const uploadDir = path.join(__dirname, "..", "public/assets/images/tools");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, and PNG files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
