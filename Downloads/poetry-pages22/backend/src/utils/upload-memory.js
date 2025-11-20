const multer = require('multer');

// memory storage so we can stream buffer -> GridFS
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 5 MB max (adjust if needed)
  },
  fileFilter: (req, file, cb) => {
    // accept only image mime types
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = { upload };
