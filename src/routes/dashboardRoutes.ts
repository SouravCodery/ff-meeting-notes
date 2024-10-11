import express from 'express';
import { AuthenticatedRequest } from '../auth.middleware.js';
import { Meeting } from '../models/meeting.js';
import { Task } from '../models/task.js';
import { DashboardData } from '../types/dashboard.js';
import mongoose from 'mongoose';

export const router = express.Router();

router.get("/", async (req: AuthenticatedRequest, res) => {
  // TODO: fix this
  // it should be sorted by date, only include upcoming meetings, limit to 5 and only include the _id, title, date, and participantCount fields
  const upcomingMeetings = (await Meeting.find()).map((meeting) => {
    return {
      _id: meeting._id as mongoose.Types.ObjectId,
      title: meeting.title,
      date: meeting.date,
      participantCount: meeting.participants.length,
    };
  });

  const dashboardData: DashboardData = {
    totalMeetings: (await Meeting.find()).length,
    taskSummary: {
      pending: 10,
      inProgress: 5,
      completed: 2,
    },
    upcomingMeetings,
    // TODO: need to lookup meeting title from meeting collection
    overdueTasks: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: "Task 1",
        dueDate: new Date(),
        meetingId: new mongoose.Types.ObjectId(),
        meetingTitle: "Meeting 1",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: "Task 2",
        dueDate: new Date(),
        meetingId: new mongoose.Types.ObjectId(),
        meetingTitle: "Meeting 2",
      },
    ],
  };

  res.json(dashboardData);
});