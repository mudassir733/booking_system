// Room controller - handles HTTP requests for room operations
import { Request, Response } from "express";
import { RoomService } from "../services/room.service";
import { sendErrorResponse, sendSuccessResponse } from "../utils/apiResponse";


export const RoomController = () => {
    // fetch all rooms
    const getAllRooms = async (req: Request, res: Response) => {
        try {
            const rooms = await RoomService().getAllRooms();
            return sendSuccessResponse(res, 200, rooms, 'Rooms fetched successfully')
        } catch (error: any) {
            return sendErrorResponse(res, 500, 'Internal server error', error.message)
        }
    }

    const getAvailableRooms = async (req: Request, res: Response) => {
        try {
            const { checkIn, checkOut, capacity } = req.query;

            if (!checkIn || !checkOut) {
                return sendErrorResponse(res, 400, 'Bad request', 'CheckIn and CheckOut dates are required')
            }

            const rooms = await RoomService().getAvailableRooms({
                checkIn: new Date(checkIn as string),
                checkOut: new Date(checkOut as string),
                capacity: Number(capacity)
            });
            return sendSuccessResponse(res, 200, rooms, 'Available rooms fetched successfully')
        } catch (error: any) {
            return sendErrorResponse(res, 500, 'Internal server error', error.message)
        }
    }
    return {
        getAllRooms,
        getAvailableRooms
    }
}