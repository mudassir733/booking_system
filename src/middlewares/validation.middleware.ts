import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

export function validate(schema: ZodObject<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                issues: result.error.issues,
            });
        }

        return next();
    };
}
