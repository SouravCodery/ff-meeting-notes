import express from 'express';
import * as meetingController from '../controllers/meeting.controllers.js';

const router = express.Router();

// GET all meetings for user
router.get('/', meetingController.getMeetingsByUserId);
router.post('/', meetingController.createMeeting);
router.get('/:meetingId', meetingController.getMeetingById);
//Ideally it should be patch request
router.put('/:meetingId/transcript', meetingController.updateMeetingTranscript);
router.post(
  '/:meetingId/summarize',
  meetingController.generateSummaryAndActionItems
);
router.get('/stats', meetingController.getStats);

export { router as meetingRoutes };
