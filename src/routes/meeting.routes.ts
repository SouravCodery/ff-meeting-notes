import express from 'express';
import * as meetingController from '../controllers/meeting.controllers.js';

const router = express.Router();

// GET all meetings for user
router.get('/', meetingController.getMeetingsByUserId);
router.post('/', meetingController.createMeeting);
router.get('/:meetingId', meetingController.getMeetingById);

// TODO: implement other endpoints
// router.get('/stats', meetingController.getStats);

export { router as meetingRoutes };
