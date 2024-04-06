import multer from 'multer';
import path from 'path';

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 50 * 1024 * 1024 },
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (
            ext != ".jpg" &&
            ext != ".jpeg" &&
            ext != ".webp" &&
            ext != ".png" &&
            ext != ".mp4"
        ) {
            cb(new Error('Unsupported File Type!', false));
            return;
        }
        cb(null, true);
    }
})

export default upload;