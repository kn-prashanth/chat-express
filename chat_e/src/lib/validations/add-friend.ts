import {z} from "zod"

export const addFriendValidator = z.object({
    username: z.string()
})