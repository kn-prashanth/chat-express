import { NextApiRequest, NextApiResponse } from 'next';
import { sendFriendRequest } from "@/helpers/psql";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { username: usernameToAdd } = addFriendValidator.parse(body.username);

    console.log("usernameToAdd-->", usernameToAdd);
    
    // Query Supabase directly to get the user by username
    const { data, error } = await db
      .from("users")
      .select("id")
      .eq("username", usernameToAdd)
      .single();

    console.log("username to add data", data);
    if (!data) {
      return new Response("This person does not exist.", { status: 400 });
    }
    
    if (error) {
      throw new Error(error.message);
    }
    const idToAdd = data?.id;

    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    console.log("session---->", session);
    
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }
    const response = await sendFriendRequest(session.user.id, idToAdd, session.user.name || "")
    
    if (response) {
        return new Response(response.message, {status: response.statusCode});
    } else {
        return new Response("Something went wrong!", {status: 400});
    }
    

  } catch (error) {
    if(error instanceof z.ZodError) {
        return new Response("Invalid request payload", {status: 422})
    }
    return new Response("Invalid request", {status: 400})
  }
}

