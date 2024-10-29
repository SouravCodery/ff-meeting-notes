import { Task } from '../models/task.model';

export const createTasks = async ({
  userId,
  meetingId,
  actionItems,
}: {
  userId: string;
  meetingId: string;
  actionItems: string[];
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const tasks = actionItems.map((actionItem, index) => {
    return new Task({
      meetingId: meetingId,
      userId: userId,
      title: `Task ${index + 1} from ${meetingId}`,
      description: actionItem,
      status: ['pending', 'in-progress', 'completed'][
        Math.floor(Math.random() * 3)
      ],
      dueDate: tomorrow,
    });
  });

  return await Task.insertMany(tasks);
};
