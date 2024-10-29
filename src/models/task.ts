import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/task.interfaces';

const taskSchema = new Schema<ITask>({
  meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting' },
  userId: String,
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  dueDate: Date,
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
