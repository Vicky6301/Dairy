// middleware/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir); // ✅ Specify destination folder
  },
  filename: function (req, file, callback) {
    // Add timestamp to avoid filename conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos/images
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||   // allow images
      file.mimetype.startsWith('video/')      // allow videos
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});


export default upload;