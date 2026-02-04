// Booking controller - handles HTTP requests for booking operations
import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { createBookingSchema } from "../validation/booking.validation";
import { sendErrorResponse, sendSuccessResponse } from "../utils/apiResponse";
import { ZodError } from "zod";

export const BookingController = () => {
    const createBooking = async (req: Request, res: Response) => {
        try {
            const input = createBookingSchema.parse(req.body);
            const booking = await BookingService().createBooking(input);
            return sendSuccessResponse(res, 201, booking, 'Booking created successfully')
        } catch (error: any) {
            if (error instanceof ZodError) {
                return sendErrorResponse(res, 422, 'Validation error', error.message)
            }
            return sendErrorResponse(res, 500, 'Internal server error', error.message)
        }
    }
    return {
        createBooking
    }
}