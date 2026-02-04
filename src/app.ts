import express from 'express';
import roomsRouter from './routes/rooms.route';

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/v1/rooms', roomsRouter);

export default app;
