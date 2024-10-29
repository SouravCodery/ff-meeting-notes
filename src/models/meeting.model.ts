import mongoose, { Schema } from 'mongoose';
import { IMeeting } from '../interfaces/meeting.interfaces';

const meetingSchema = new Schema<IMeeting>({
  userId: String,
  title: String,
  date: Date,
  participants: [String],
  transcript: String,
  summary: String,
  actionItems: [String],
});

export const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema);
