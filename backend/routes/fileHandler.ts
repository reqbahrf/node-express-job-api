import { Router } from 'express';
import {
  uploadFiles,
  updateFile,
  deleteFile,
  viewFile,
} from '../controllers/fileHandler.js';
import getUploadMiddlewares from '../middleware/upload.js';
const router = Router();

router.post('/upload/:purpose', getUploadMiddlewares, uploadFiles);
router.post('/update', getUploadMiddlewares, updateFile);
router.post('/delete/:id', deleteFile);
router.get('/view/:type/:fileName', viewFile);

export default router;
