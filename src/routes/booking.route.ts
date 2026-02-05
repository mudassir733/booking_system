import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { createBookingSchema } from "../validation/booking.validation";
import { audit } from "../middlewares/audit.middleware";

const bookingRouter = Router();

bookingRouter.post('/create-booking', audit("Create Booking"), authMiddleware, validate(createBookingSchema), BookingController().createBooking);

export default bookingRouter;