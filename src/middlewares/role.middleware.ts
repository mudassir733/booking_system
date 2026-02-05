import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "./auth.middleware";
import { sendErrorResponse } from "../utils/apiResponse";

export function requireRole(...allowed: AuthUser["role"][]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as AuthUser | undefined;

        if (!user) {
            return sendErrorResponse(res, 401, "Unauthorized", "Unauthorized");
        }

        if (!allowed.includes(user.role)) {
            return sendErrorResponse(res, 403, "Forbidden", "Forbidden");
        }

        return next();
    };
}
