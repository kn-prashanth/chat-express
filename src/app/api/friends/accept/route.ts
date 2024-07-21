import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    console.log("id--------->", id);
    
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Update friend request status or create a new friendship
    const { error: updateError } = await db
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('sender_id', id)
      .eq('receiver_id', userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // Optionally, add the friendship to a separate table
    const { error: insertError } = await db
      .from('friends')
      .insert([
        { user_id: userId, friend_id: id },
        { user_id: id, friend_id: userId },
      ]);

    if (insertError) {
      throw new Error(insertError.message);
    }
    return new Response("Friend request accepted", {status: 200});
    // return res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    // return res.status(500).json({ error: error });
    return new Response("Something went wrong"+ error, {status: 500});
  }
}
