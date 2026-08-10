import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from './error';

const uploadDir = path.join(process.cwd(), 'uploads')

// Crée le dossier upload s'il n'existe pas
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo par fichier
  fileFilter: (_req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Type de fichier non autorisé (JPEG, PNG, PDF uniquement)'));
    }
  },
});