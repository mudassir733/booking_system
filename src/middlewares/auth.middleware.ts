// Authentication middleware
import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/apiResponse";
import { verifyAccessToken } from "../utils/jwt";


export type AuthUser = {
    id: string;
    role: 'CUSTOMER' | 'CSR' | 'ADMIN';
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
        return sendErrorResponse(res, 401, "Unauthorized", "Unauthorized - Missing or invalid token");
    }

    const token = header.slice("Bearer ".length);

    try {
        const payload = verifyAccessToken(token);
        if (payload.type !== "access") {
            return sendErrorResponse(res, 401, "Unauthorized", "Unauthorized - Invalid token");
        }
        req.user = { id: payload.sub, role: payload.role };
        return next();
    } catch (error) {
        return sendErrorResponse(res, 401, "Unauthorized", "Unauthorized - Invalid token");
    }
}
