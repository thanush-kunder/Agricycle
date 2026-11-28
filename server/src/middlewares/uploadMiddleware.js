import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types strictly for crop residue image verification
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

// Storage configuration with sanitized timestamped filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize original file name: remove spaces & non-alphanumeric chars (except extension)
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

// File filter validation
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type '${file.mimetype}'. Only JPEG, PNG, and WebP images are allowed.`
      ),
      false
    );
  }
};

// Multer upload instance for images
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024, // Default 5MB
    files: 5, // Maximum 5 images per upload
  },
});

// Allowed Document Extensions for Chatbot File Analysis
const ALLOWED_DOC_EXTENSIONS = ['.pdf', '.txt', '.csv', '.docx', '.doc', '.xlsx', '.xls', '.json', '.md'];

const documentFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_DOC_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported document format '${ext}'. Supported formats: PDF, TXT, CSV, DOCX, XLSX.`
      ),
      false
    );
  }
};

// Multer upload instance for Chatbot Documents
export const uploadDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
    files: 1,
  },
});

/**
 * Express error handling wrapper for Multer upload errors
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxMb = process.env.MAX_FILE_SIZE_MB || 5;
      return res.status(400).json({
        success: false,
        message: `File size limit exceeded. Maximum allowed size is ${maxMb}MB per image.`,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded. Maximum 5 images allowed per listing.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Error uploading file',
    });
  }
  next();
};
