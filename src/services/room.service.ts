import { RoomRepository } from "../repositories/room.repository"

// Room service - contains business logic for room operations
export const RoomService = () => {
    const getAllRooms = async () => {
        const rooms = await RoomRepository().getAllRooms();
        return rooms;
    }
    return {
        getAllRooms
    }
}