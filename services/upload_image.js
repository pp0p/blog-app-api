const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./images/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg and jpeg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
}).single("photo");
module.exports = upload;
