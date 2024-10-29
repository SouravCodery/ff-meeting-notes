import mongoose, { Schema } from 'mongoose';
import { IMeeting } from '../interfaces/meeting.interfaces';

const meetingSchema = new Schema<IMeeting>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  participants: [String],
  transcript: String,
  summary: String,
  actionItems: [String],
});

export const Meeting = mongoose.model<IMeeting>('Meeting', meetingSchema);
