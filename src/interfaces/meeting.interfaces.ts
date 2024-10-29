import { Document } from 'mongoose';

export interface IMeeting extends Document {
  userId: string;
  title: string;
  date: Date;
  participants: string[];
  transcript: string;
  summary: string;
  actionItems: string[];
}
