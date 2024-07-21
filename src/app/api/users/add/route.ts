import { NextApiRequest, NextApiResponse } from "next";
import { sendFriendRequest } from "@/helpers/psql";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // const { username, fullname, password } = await req.json();
    const body = await req.json();
    const { username, fullname, password } = body;

    // Check if the username already exists
    const { data: existingUser, error: error1 } = await db
      .from("users")
      .select("id")
      .eq("username", username)
      .single();
      
    if(error1 && error1.details != "The result contains 0 rows") {
        throw new Error(error1.message);
    }
    if (existingUser != null) {
        return new Response("Username already exists", { status: 400 }); // Conflict
        // return res.status(409).json({ error: 'Username already exists' }); 
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    

    // Insert the new user
    const { data: newUser, error: insertError } = await db
    .from('users')
    .insert([{ username, name: fullname, password_hash: hashedPassword }]);
    
    if (insertError) {        
        throw new Error(insertError.message);
      }
      return new Response('OK')

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
