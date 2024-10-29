import { Mongoose, Types } from 'mongoose';
import { Config } from '../config/config';
import { Meeting } from '../models/meeting.model';
import { generateSummaryAndActionItemsUsingAI } from './bot.services';
import { createTasks } from './task.services';

export const getMeetingsByUserId = async ({
  userId,
  limit = Config.PAGINATION_LIMIT,
  page = Config.DEFAULT_PAGE,
}: {
  userId: string;
  limit: number;
  page: number;
}) => {
  const skip = (page - 1) * limit;

  const [meetings, totalDocuments] = await Promise.all([
    Meeting.find({
      userId,
    })
      .skip(skip)
      .limit(limit)
      .lean(),

    Meeting.countDocuments({ userId }),
  ]);

  const data = {
    data: meetings,
    total: totalDocuments,
    limit,
    page,
  };

  return data;
};

export const createMeeting = async ({
  userId,
  title,
  date,
  participants,
}: {
  userId: string;
  title: string;
  date: Date;
  participants: string[];
}) => {
  const newMeeting = new Meeting({
    userId,
    title,
    date,
    participants,
  });

  return await newMeeting.save();
};

export const getMeetingById = async ({
  userId,
  meetingId,
}: {
  userId: string;
  meetingId: string;
}) => {
  return await Meeting.findOne({ _id: meetingId, userId }).lean();
};

export const updateMeetingTranscript = async ({
  userId,
  meetingId,
  transcript,
}: {
  userId: string;
  meetingId: string;
  transcript: string;
}) => {
  const meeting = await Meeting.findOne({ _id: meetingId, userId });

  if (!meeting) {
    throw new Error('Meeting not found');
  }

  meeting.transcript = transcript;
  return await meeting.save();
};

export const generateSummaryAndActionItems = async ({
  meetingId,
}: {
  meetingId: string;
}) => {
  const meeting = await Meeting.findOne({ _id: meetingId });

  if (!meeting) {
    throw new Error('Meeting not found');
  }

  if (meeting.summary) {
    throw new Error('Summary already generated');
  }

  const summaryAndActionItems = await generateSummaryAndActionItemsUsingAI({
    meetingId: (meeting._id as Types.ObjectId).toString(),
  });

  meeting.summary = summaryAndActionItems.summary;
  meeting.actionItems = summaryAndActionItems.actionItems;

  const tasks = await createTasks({
    meetingId: (meeting._id as Types.ObjectId).toString(),
    userId: meeting.userId,
    actionItems: summaryAndActionItems.actionItems,
  });

  //Making sure tasks are created before saving the meeting
  await meeting.save();

  return {
    meeting,
    tasks,
  };
};

//though the aggregation pipeline runs correctly in atlas it's giving an error here
export const getStats = async () => {
  const [totalMeetings, participants, dayOfWeek] = await Promise.all([
    Meeting.countDocuments(),
    Meeting.aggregate([
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            participants: 1,
          },
      },
      {
        $unwind: {
          path: '$participants',
          includeArrayIndex: 'string',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$participants',
          meetingCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          meetingCount: -1,
        },
      },
    ]),
    Meeting.aggregate([
      {
        $group: {
          _id: {
            $dayOfWeek: '$date',
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  let totalParticipants = 0;

  const topParticipants = participants.map((participant) => {
    totalParticipants += participant.meetingCount;

    return {
      participant: participant._id.toString(),
      meetingCount: participant.meetingCount,
    };
  });

  const stats = {
    generalStats: {
      totalMeetings: totalMeetings,
      averageParticipants: totalParticipants / totalMeetings,
      totalParticipants: totalParticipants,
      shortestMeeting: 15,
      longestMeeting: 120,
      averageDuration: 45.3,
    },
    topParticipants: topParticipants.splice(0, 5),
    meetingsByDayOfWeek: dayOfWeek,
  };

  return stats;
};
