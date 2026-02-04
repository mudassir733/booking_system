import { Router } from "express";
import { RoomController } from "../controllers/room.controller";

const roomsRouter = Router();

roomsRouter.get('/all-rooms', RoomController().getAllRooms);
roomsRouter.get('/available-rooms', RoomController().getAvailableRooms);


export default roomsRouter;