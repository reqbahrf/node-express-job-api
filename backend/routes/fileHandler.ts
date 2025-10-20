import { Router } from 'express';
import {
  uploadFiles,
  updateFile,
  deleteFile,
  viewFile,
} from '../controllers/fileHandler.js';
import createUpload from '../middleware/upload.js';
const router = Router();

const upload = createUpload('temp', 'uploads', /\.(pdf|jpg|jpeg|png)$/i);

router.post('/upload', upload.array('files', 3), uploadFiles);
router.post('/update', upload.single('file'), updateFile);
router.post('/delete', deleteFile);
router.get('/view/:type/:fileName', viewFile);
