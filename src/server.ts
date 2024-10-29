import express, { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

import { meetingRoutes } from './routes/meeting.routes.js';
import { taskRoutes } from './routes/task.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';

import { authMiddleware } from './auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

await mongoose
  .connect('mongodb://localhost:27017/meetingbot')
  .then((conn) => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MeetingBot API' });
});

app.use('/api/meetings', authMiddleware, meetingRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('Something went wrong', err);

  res.status(500).json({
    message: err?.message ?? 'Internal Server Error',
  });

  return;
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
