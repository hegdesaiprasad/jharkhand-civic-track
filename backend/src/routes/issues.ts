import express from 'express';
import {
    getAllIssues,
    getIssueById,
    createIssue,
    updateIssueStatus,
    getAnalytics,
} from '../controllers/issuesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

router.get('/', getAllIssues);
router.get('/analytics', getAnalytics);
router.get('/:id', getIssueById);
router.post('/', createIssue);
router.put('/:id/status', updateIssueStatus);

export default router;
