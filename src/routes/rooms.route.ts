import { Router } from "express";
import { RoomController } from "../controllers/room.controller";
import { publicRateLimit } from "../middlewares/ratelimit.middleware";

const roomsRouter = Router();

roomsRouter.get('/all-rooms', publicRateLimit, RoomController().getAllRooms);
roomsRouter.get('/available-rooms', publicRateLimit, RoomController().getAvailableRooms);


export default roomsRouter;