import express from 'express';

// Routes import
import roomsRouter from './routes/rooms.route';
import bookingRouter from './routes/booking.route';

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/bookings', bookingRouter);

export default app;
