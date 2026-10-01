const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer memory storage so Sharp can process the buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type! Only JPG, JPEG, PNG, and WEBP are supported.'),
      false
    );
  }
};

const multerUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter
});

// Middleware to upload single image and resize with Sharp
const processPostImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const timestamp = Date.now();
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    const thumbFilename = `thumb-${timestamp}-${uniqueSuffix}.webp`;
    const detailFilename = `detail-${timestamp}-${uniqueSuffix}.webp`;

    const thumbPath = path.join(uploadsDir, thumbFilename);
    const detailPath = path.join(uploadsDir, detailFilename);

    // 1. Thumbnail: 600x400 fixed size for cards (cover fit)
    await sharp(req.file.buffer)
      .resize(600, 400, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(thumbPath);

    // 2. Detail: max 1200px width (without enlargement, keeping aspect ratio)
    await sharp(req.file.buffer)
      .resize({
        width: 1200,
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(detailPath);

    // Attach processed image paths (served statically via /uploads)
    req.processedImages = {
      thumbnail: `/uploads/${thumbFilename}`,
      detail: `/uploads/${detailFilename}`
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage: multerUpload.single('image'),
  processPostImage
};
