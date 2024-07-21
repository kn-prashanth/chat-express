"use client";

import { db } from "@/lib/db";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:friend_requests`)
    )
    console.log("listening to ", `user:${sessionId}:friend_requests`)

    const friendRequestHandler = async ({ senderData }) => {
      setFriendRequests((prev) =>
        [senderData, ...prev]
      );
      console.log("function got called", senderData)
    }

    pusherClient.bind('friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:riend_requests`)
      )
      pusherClient.unbind('friend_requests', friendRequestHandler)
    }

  }, [sessionId])

  const acceptFriend = async (id: Number) => {
    console.log("accept friend-->", id);
    
    await axios.post("/api/friends/accept", { id: id });

    setFriendRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );

    router.refresh();
  };

  const denyFriend = async (id: Number) => {
    await axios.post("/api/friends/deny", { id: id });

    setFriendRequests((prev) =>
      prev.filter((request) => request.id !== id)
    );

    router.refresh();
  };
  

console.log("friendRequests--->", friendRequests);

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.id} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.name}</p>
            <button
              onClick={() => acceptFriend(request.id)}
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              onClick={() => denyFriend(request.id)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
