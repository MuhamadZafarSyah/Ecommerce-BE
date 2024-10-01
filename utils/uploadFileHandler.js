import multer from "multer";
import path from "path";

const FILE_TYPE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFormat = FILE_TYPE[file.mimetype];
    let uploadError = new Error("Invalid Image Type");

    if (isValidFormat) {
      uploadError = null;
    }

    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFile = `${Date.now()}${path.extname(file.originalname)}`;

    cb(null, file.fieldname + "-" + uniqueFile);
  },
});

export const upload = multer({ storage: storage });
