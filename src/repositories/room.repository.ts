// Room repository - handles database operations for rooms

import prisma from "../database/db"

export const RoomRepository = () => {
    const mapRoomOverview = (room: any) => ({
        id: room.id,
        roomNumber: room.roomNumber,
        type: room.type,
        floor: room.floor ? String(room.floor) : "N/A",
        capacity: room.capacity,
        pricePerNight: room.pricePerNight,
        status: room.status,
        amenities: room.amenities,
        isAvailable: room.isAvailable,
        lastCleaned: room.lastCleanedAt ?? null,
        nextCheckIn: room.bookings?.[0]?.checkIn ?? null,
    });

    // fetch all rooms
    const getAllRooms = async () => {
        const now = new Date();
        const [rooms, totalRooms, availableRooms, inServiceRooms] = await prisma.$transaction([
            prisma.room.findMany({
                select: {
                    id: true,
                    roomNumber: true,
                    type: true,
                    capacity: true,
                    pricePerNight: true,
                    floor: true,
                    status: true,
                    amenities: true,
                    isAvailable: true,
                    lastCleanedAt: true,
                    bookings: {
                        where: {
                            checkIn: { gt: now },
                            status: "CONFIRMED",
                        },
                        orderBy: { checkIn: "asc" },
                        take: 1,
                        select: { checkIn: true },
                    },
                },
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
            rooms: rooms.map(mapRoomOverview),
            stats: {
                totalRooms,
                availableRooms,
                inServiceRooms,
            },
        };
    }

    const getAvailableRooms = async (params: { checkIn: Date, checkOut: Date, capacity: number }) => {
        const { checkIn, checkOut, capacity } = params;
        const now = new Date();
        const rooms = await prisma.room.findMany({
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
            select: {
                id: true,
                roomNumber: true,
                type: true,
                capacity: true,
                pricePerNight: true,
                floor: true,
                status: true,
                amenities: true,
                isAvailable: true,
                lastCleanedAt: true,
                bookings: {
                    where: {
                        checkIn: { gt: now },
                        status: "CONFIRMED",
                    },
                    orderBy: { checkIn: "asc" },
                    take: 1,
                    select: { checkIn: true },
                },
            },
            orderBy: { roomNumber: 'asc' }

        })
        return rooms.map(mapRoomOverview);
    }

    return {
        getAllRooms,
        getAvailableRooms
    }
}
