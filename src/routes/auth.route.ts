import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from "../validation/auth.validation";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), AuthController().register);
authRouter.post("/login", validate(loginSchema), AuthController().login);
authRouter.post("/refresh", validate(refreshSchema), AuthController().refresh);
authRouter.post("/logout", validate(logoutSchema), AuthController().logout);
authRouter.get("/me", authMiddleware, AuthController().me);

export default authRouter;
