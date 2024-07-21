import { z } from "zod";

export const messageValidator = z.object ({
    // id: z.number(),
    senderId: z.number(),
    text: z.string(),
    timestamp: z.string(),
})
export const messageArrayValidator = z.array(messageValidator)

export type Message = z.infer<typeof messageValidator>