import { Router } from 'express';
import {
  uploadFiles,
  updateFile,
  deleteFile,
  viewFile,
} from '../controllers/fileHandler.js';
import {
  getUploadMiddlewares,
  getUpdateFileMiddleware,
} from '../middleware/upload.js';
const router = Router();

router.post('/upload/:purpose', getUploadMiddlewares, uploadFiles);
router.put('/update/:id', getUpdateFileMiddleware, updateFile);
router.delete('/delete/:id', deleteFile);
router.get('/view/:id', viewFile);

export default router;
