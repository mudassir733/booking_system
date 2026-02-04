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
    return {
        getAllRooms
    }
}