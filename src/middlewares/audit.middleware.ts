import type { NextFunction, Request, Response } from "express";
import prisma from "../database/db";

export function audit(action: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.on("finish", async () => {
            const user = (req as any).user;

            if (!user) return;
            if (user.role !== "CSR" && user.role !== "ADMIN") return;
            if (res.statusCode >= 400) return;

            try {
                await prisma.auditLog.create({
                    data: {
                        actorId: user.id,
                        actorRole: user.role,
                        action,
                        entityId: (req.params as any).id ?? null,
                        meta: {
                            path: req.path,
                            method: req.method,
                        },
                    },
                });
            } catch {
                // Do not crash the request because of audit logging.
            }
        });

        next();
    };
}
