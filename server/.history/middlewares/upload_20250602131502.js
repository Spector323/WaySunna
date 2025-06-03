const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'video/mp4'
    ) {
      callback(null, true);
    } else {
      console.log('Допускаются только файлы формата JPG/JPEG/PNG/MP4');
      callback(new Error('Недопустимый формат файла. Используйте JPG, JPEG, PNG или MP4'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 150 // 50 МБ
  }
});

module.exports = upload;