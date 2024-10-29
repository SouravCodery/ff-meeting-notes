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

    res.status(201).json(meetings);
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

export const updateMeetingTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { meetingId } = req.params;
    const { transcript } = req.body;

    //using userId as well to make sure the user is authorized to update the meeting transcript
    const meeting = await meetingServices.updateMeetingTranscript({
      userId,
      meetingId,
      transcript,
    });

    res.status(200).json(meeting);
    return;
  } catch (err) {
    return next(err);
  }
};

export const generateSummaryAndActionItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { meetingId } = req.params;

    const meeting = await meetingServices.generateSummaryAndActionItems({
      meetingId,
    });

    res.status(200).json(meeting);
    return;
  } catch (err) {
    return next(err);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await meetingServices.getStats();
    res.json(stats);
    return;
  } catch (err) {
    return next(err);
  }
};
