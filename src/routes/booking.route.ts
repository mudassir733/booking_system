import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const bookingRouter = Router();

bookingRouter.post('/create-booking', BookingController().createBooking);

export default bookingRouter;