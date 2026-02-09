import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes import
import roomsRouter from './routes/rooms.route';
import bookingRouter from './routes/booking.route';
import authRouter from "./routes/auth.route";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/rooms', roomsRouter);
app.use('/api/v1/bookings', bookingRouter);

export default app;
