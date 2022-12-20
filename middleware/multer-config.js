const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  //Où est ce que les fichiers entrant vont être stocker
  destination: (req, file, callback) => {
    callback(null, "images"); //Dans le dossier images
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); //Remplacement des espaces par des underscores
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
