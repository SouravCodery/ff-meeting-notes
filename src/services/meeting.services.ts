import { Config } from '../config/config';
import { Meeting } from '../models/meeting.model';

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
    title,
    date,
    participants,
  });

  return await newMeeting.save();
};
