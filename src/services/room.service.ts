import { RoomRepository } from "../repositories/room.repository"

// Room service - contains business logic for room operations
export const RoomService = () => {
    const getAllRooms = async () => {
        const rooms = await RoomRepository().getAllRooms();
        return rooms;
    }


    const getAvailableRooms = async (params: { checkIn: Date, checkOut: Date, capacity: number }) => {
        const checkInDate = new Date(params.checkIn);
        const checkOutDate = new Date(params.checkOut);

        if (checkInDate >= checkOutDate) {
            throw new Error('Check-in date must be before check-out date');
        }

        const availableRooms = await RoomRepository().getAvailableRooms({
            checkIn: checkInDate,
            checkOut: checkOutDate,
            capacity: params.capacity
        });

        return availableRooms;
    }
    return {
        getAllRooms,
        getAvailableRooms
    }
}