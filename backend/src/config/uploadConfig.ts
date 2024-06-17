// uploadConfig.ts
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const limits = {
    fileSize: 500 * 1024 * 1024, // 500MB
};

const fileFilter = (req: any, file: any, cb: any) => {
    cb(null, true); // Aceitar qualquer tipo de arquivo
};

const upload = multer({
    storage,
    limits,
    fileFilter
});

export default upload;