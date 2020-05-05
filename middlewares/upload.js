const multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("file", file);
        callback(null, "./public/uploads");
    },
    filename: function (req, file, callback) {
        console.log("multer file:", file);
        callback(null, file.originalname);
    }
});
let maxSize = 1000000 * 1000;
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    }
});

module.exports = upload;