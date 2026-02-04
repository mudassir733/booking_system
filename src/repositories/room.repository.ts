// Room repository - handles database operations for rooms

import prisma from "../database/db"

export const RoomRepository = () => {
    // fetch all rooms
    const getAllRooms = async () => {
        return await prisma.room.findMany({
            orderBy: {
                roomNumber: 'asc'
            }
        });
    }

    return {
        getAllRooms
    }
}