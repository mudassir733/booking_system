// Booking repository - handles database operations for bookings
import prisma from '../database/db'

export const BookingRepository = () => {
    const hasOverlappingBooking = async (params: { roomId: number, checkIn: Date, checkOut: Date }) => {

        const { roomId, checkIn, checkOut } = params;
        const overlap = await prisma.booking.findFirst({
            where: {
                roomId,
                checkIn: { lt: checkOut },
                checkOut: { gt: checkIn },
                status: 'CONFIRMED'
            },
            select: { id: true }

        })
        return Boolean(overlap);

    }

    const createBooking = async (params: { roomId: number, customerName: string, customerEmail: string, customerPhone: string, checkIn: Date, checkOut: Date, totalPrice: number, status: string }) => {
        // const { roomId, customerName, customerEmail, customerPhone, checkIn, checkOut, totalPrice, status } = params;
        return await prisma.booking.create({
            data: {
                ...params,
                status: 'CONFIRMED'
            }
        })
    }

    return {
        hasOverlappingBooking,
        createBooking
    }
}