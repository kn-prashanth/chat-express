import FriendRequests from "@/components/FriendRequests";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // Fetch incoming friend requests
  const { data: incomingFriendRequestsData, error } = await db
    .from("friend_requests")
    .select("sender_id")
    .eq("receiver_id", session.user.id)
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching incoming friend requests:", error);
    notFound();
  }

  const incomingFriendRequests = await Promise.all(
    incomingFriendRequestsData.map(async (request) => {
      const { data: senderData, error: senderError } = await db
        .from("users")
        .select("*")
        .eq("id", request.sender_id)
        .single();

      if (senderError) {
        console.error("Error fetching sender data:", senderError);
        return null;
      }

      return senderData;
    })
  );

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Your friend requests</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default Page;
