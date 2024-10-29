import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
  meetingId: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
}
