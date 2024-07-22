import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const nextPublicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const authToken = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const db = createClient(nextPublicSupabaseUrl, authToken);
const isAlreadyFriend = async function (userId1: string, userId2: string) {
  const { data, error } = await db
    .from("friends")
    .select("*")
    .eq("user_id", userId1)
    .eq("friend_id", userId2);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
const isFriendRequestExist = async function (
  senderUserId1: string,
  receiverUserId2: string
) {
  const { data, error } = await db
    .from("friend_requests")
    .select("*")
    .eq("sender_id", senderUserId1)
    .eq("receiver_id", receiverUserId2);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
export async function sendFriendRequest(senderId: string, receiverId: string) {
  const isFriend = await isAlreadyFriend(senderId, receiverId);

  console.log("isFriend", isFriend);

  if (isFriend.length > 0) {
    return {
      message: "You cannot send friend request to who is already your friend",
      statusCode: 400,
    };
  }

  const isFriendRequestExists = await isFriendRequestExist(
    senderId,
    receiverId
  );

  if (isFriendRequestExists.length > 0) {
    return {
      message: "You already sent a friend request to this user",
      statusCode: 400,
    };
  }

  const { data: senderData, error: error2 } = await db
    .from("users")
    .select("*")
    .eq("id", senderId)
    .single();

  if (error2) {
    throw new Error(error2.message);
  }

  //valid request, send friend request

  pusherServer.trigger(
    toPusherKey(`user:${receiverId}:friend_requests`),
    "friend_requests",
    {
      senderData: senderData,
    }
  );

  pusherServer.trigger(
    toPusherKey(`user:${receiverId}:friend_requests`),
    "new_friend",
    {}
  );

  const { data, error } = await db
    .from("friend_requests")
    .insert([{ sender_id: senderId, receiver_id: receiverId }]);

  if (error) {
    throw new Error(error.message);
  }
  return {
    message: "Friend request successfuly sent!",
    statusCode: 200,
  };
}
