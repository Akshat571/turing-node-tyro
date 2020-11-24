const multer = require('multer');
const path = require('path');
const StatusCodes = require('http-status-codes');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            callback(new Error("File type not supported"), false);
        } else {
            callback(null, true);
        }
    }
})