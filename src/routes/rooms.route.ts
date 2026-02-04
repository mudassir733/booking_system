import { Router } from "express";
import { RoomController } from "../controllers/room.controller";

const roomsRouter = Router();

roomsRouter.get('/all', RoomController().getAllRooms);

export default roomsRouter;