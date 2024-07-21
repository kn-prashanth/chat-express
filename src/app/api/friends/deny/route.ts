import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const id = body.id;
  
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Delete or update the friend request status to denied
    const { error } = await db
      .from('friend_requests')
      .update({ status: 'denied' })
      .eq('sender_id', id)
      .eq('receiver_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return new Response("Friend request denied", {status: 200});
  } catch (error) {
    return new Response("Something went wrong"+ error, {status: 500});
  }
}
