import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

export const multerConfig = (folder: string) => ({
  storage: diskStorage({
    destination: join('./uploads', folder),
    filename: (req, file, cb) => {
      const uniqueName = randomUUID() + extname(file.originalname);
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
    } else {
      cb(null, true);
    }
  },
});
