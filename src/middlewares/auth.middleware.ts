// Authentication middleware
import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/apiResponse";
import jwt from "jsonwebtoken";


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
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
        req.user = payload;
        return next();
    } catch (error) {
        return sendErrorResponse(res, 401, "Unauthorized", "Unauthorized - Invalid token");
    }
}