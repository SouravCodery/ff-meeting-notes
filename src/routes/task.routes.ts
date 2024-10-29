import express from 'express';
import * as taskController from '../controllers/task.controllers';

export const router = express.Router();

router.get('/', taskController.getTasksByUserId);

export { router as taskRoutes };
