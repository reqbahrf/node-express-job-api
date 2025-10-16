import { Router } from 'express';
import {
  getAllJobPosts,
  createJobPost,
  updateJobPost,
  markAsClosed,
  applyJobPost,
} from '../controllers/jobPost.js';

const router = Router();

router.route('/').get(getAllJobPosts).post(createJobPost);
router.patch('/:id', updateJobPost);
router.patch('/:id/closed', markAsClosed);
router.post('/:id/apply', applyJobPost);

export default router;
