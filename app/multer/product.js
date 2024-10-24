const multer = require("multer");
const fs = require("fs");
const config = require("../config");
const { generateFilename } = require("../helpers/utils");
const { AppError } = require("../helpers");

const dir = "uploads/images/products/";

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, dir),
    filename: (_, file, cb) => cb(null, generateFilename(file)),
});

const productUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (_, file, cb) => {
        if (!config.app.files.images.types.includes(file.mimetype)) {
            return cb(new AppError("Invalid file type", "BAD_REQUEST"));
        }
        cb(null, true);
    },
});

module.exports = productUpload;
