import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../auth.middleware.js';

import * as meetingServices from '../services/meeting.services';
import { Config } from '../config/config.js';

// GET all meetings for user
export const getMeetingsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : Config.PAGINATION_LIMIT;

    const page = req.query.page
      ? parseInt(req.query.page as string)
      : Config.DEFAULT_PAGE;

    const meetings = await meetingServices.getMeetingsByUserId({
      userId,
      limit,
      page,
    });

    res.status(200).json(meetings);
    return;
  } catch (err) {
    return next(err);
  }
};

export const createMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, date, participants } = req.body;
    const userId = (req as AuthenticatedRequest).userId;

    const meetings = await meetingServices.createMeeting({
      userId,
      title,
      date,
      participants,
    });

    res.status(200).json(meetings);
    return;
  } catch (err) {
    return next(err);
  }
};

export const getMeetingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { meetingId } = req.params;

    //using userId as well to make sure the user is authorized to access the meeting
    const meeting = await meetingServices.getMeetingById({
      userId,
      meetingId,
    });

    res.status(200).json(meeting);
    return;
  } catch (err) {
    return next(err);
  }
};

// TODO: implement other endpoints

export const getStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: get statistics from the database
    const stats = {
      generalStats: {
        totalMeetings: 100,
        averageParticipants: 4.75,
        totalParticipants: 475,
        shortestMeeting: 15,
        longestMeeting: 120,
        averageDuration: 45.3,
      },
      topParticipants: [
        { participant: 'John Doe', meetingCount: 20 },
        { participant: 'Jane Smith', meetingCount: 18 },
        { participant: 'Bob Johnson', meetingCount: 15 },
        { participant: 'Alice Brown', meetingCount: 12 },
        { participant: 'Charlie Davis', meetingCount: 10 },
      ],
      meetingsByDayOfWeek: [
        { dayOfWeek: 1, count: 10 },
        { dayOfWeek: 2, count: 22 },
        { dayOfWeek: 3, count: 25 },
        { dayOfWeek: 4, count: 20 },
        { dayOfWeek: 5, count: 18 },
        { dayOfWeek: 6, count: 5 },
        { dayOfWeek: 7, count: 0 },
      ],
    };
    res.json(stats);
    return;
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
