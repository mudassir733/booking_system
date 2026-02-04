// Booking validation schemas using Zod
import { z } from 'zod'



export const createBookingSchema = z
    .object({
        roomId: z.number().int().positive(),
        customerName: z.string().min(2),
        customerEmail: z.string().email(),
        customerPhone: z.string().min(8),
        checkIn: z.string().datetime(),
        checkOut: z.string().datetime(),
        totalPrice: z.number().positive(),
        status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
    })
    .refine((data) => new Date(data.checkIn) < new Date(data.checkOut), {
        message: "checkIn must be before checkOut",
        path: ["checkOut"],
    });

// type from the schema
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
