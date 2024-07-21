// import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
// import { pusherServer } from '@/lib/pusher'
// import { toPusherKey } from '@/lib/utils'
import { Message, messageValidator } from '@/lib/validations/message'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json()
    const session = await getServerSession(authOptions)

    if (!session) return new Response('Unauthorized', { status: 401 })

    const [userId1, userId2] = chatId.split('--')

    console.log("typeof------------------->");
    console.log("session.user.id:  ", typeof session.user.id);
    console.log("userId1:  ", typeof userId1);
    console.log("userId2:  ", typeof userId2);
    
    
    if (session.user.id != userId1 && session.user.id != userId2) {
      return new Response('Unauthorized', { status: 401 })
    }

    const friendId = session.user.id == userId1 ? userId2 : userId1

    // Retrieve friend list
    const { data: friendList, error: friendListError } = await db
      .from('friends')
      .select('friend_id')
      .eq('user_id', session.user.id);

    if (friendListError || !friendList) {
        return new Response('Unauthorized', { status: 401 })
    }

    const isFriend = friendList.some(friend => friend.friend_id == friendId);

    if (!isFriend) {
        return new Response('Unauthorized', { status: 401 })
    }

    // Retrieve sender information
    const { data: senderData, error: senderError } = await db
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (senderError || !senderData) {
      return new Response('Unauthorized', { status: 401 })
    }


    console.log("Retrieve sender information");
    
    const timestamp = new Date().toString()

    const messageData: Message = {
      senderId: session.user.id,
      text,
      timestamp,
    };
    console.log("notify all connected chat room clients", messageData);
    const message = messageValidator.parse(messageData);

    
    // notify all connected chat room clients


    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming_message', message)

    await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), 'new_message', {
      ...message,
      senderId: senderData.id,
      senderName: senderData.name
    })


    
    // all valid, send the message
    const { error: messageInsertError } = await db
      .from('messages')
      .insert({
        chatId: chatId,
        senderId: message.senderId,
        text: message.text,
        receiverId: friendId,
      });

      console.log("all valid, send the message");
      
    if (messageInsertError) {
      throw new Error(messageInsertError.message);
    }
    return new Response('OK')

  } catch (error) {
    console.log("error----->", error);
    
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}