// Room repository - handles database operations for rooms

import prisma from "../database/db"

export const RoomRepository = () => {
    // fetch all rooms
    const getAllRooms = async () => {
        const [rooms, totalRooms, availableRooms, inServiceRooms] = await prisma.$transaction([
            prisma.room.findMany({
                orderBy: { roomNumber: 'asc' },
            }),
            prisma.room.count(),
            prisma.room.count({
                where: {
                    isAvailable: true,
                    status: "AVAILABLE",
                },
            }),
            prisma.room.count({
                where: {
                    isAvailable: true,
                    status: { in: ["AVAILABLE", "OCCUPIED", "CLEANING"] },
                },
            }),

        ]);

        return {
            rooms,
            stats: {
                totalRooms,
                availableRooms,
                inServiceRooms,
            },
        };
    }

    const getAvailableRooms = async (params: { checkIn: Date, checkOut: Date, capacity: number }) => {
        const { checkIn, checkOut, capacity } = params;
        return await prisma.room.findMany({
            where: {
                ...(capacity ? { capacity: { gte: capacity } } : {}),
                bookings: {
                    none: {
                        checkIn: { lt: checkOut },
                        checkOut: { gt: checkIn },
                        status: "CONFIRMED",
                    },
                },
            },

            orderBy: { roomNumber: 'asc' }

        })
    }

    return {
        getAllRooms,
        getAvailableRooms
    }
}