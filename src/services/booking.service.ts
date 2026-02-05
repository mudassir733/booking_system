// Booking service - contains business logic for booking operations
import prisma from "../database/db";
import { ApiErrorFactory } from "../utils/errorHandler";
import type { CreateBookingInput } from "../validation/booking.validation";



type CreateBookingInputWithUser = CreateBookingInput & { userId?: string };

export const BookingService = () => {
    const createBooking = async (input: CreateBookingInputWithUser) => {
        const checkIn = new Date(input.checkIn);
        const checkOut = new Date(input.checkOut);

        return await prisma.$transaction(async (tx: any) => {
            const overlap = await tx.booking.findFirst({
                where: {
                    roomId: input.roomId,
                    checkIn: { lt: checkOut },
                    checkOut: { gt: checkIn },
                    status: 'CONFIRMED'
                },
                select: { id: true }
            });

            if (overlap) {
                const error = ApiErrorFactory.conflict('Room is already booked for the selected dates');
                throw error;
            }

            const booking = await tx.booking.create({
                data: {
                    roomId: input.roomId,
                    customerName: input.customerName,
                    customerEmail: input.customerEmail,
                    customerPhone: input.customerPhone,
                    checkIn,
                    checkOut,
                    totalPrice: input.totalPrice,
                    status: input.status,
                    userId: input.userId ?? null
                }
            });
            return booking;
        });

    }

    return {
        createBooking
    }

}
