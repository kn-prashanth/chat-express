"use client";
import { FC, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { cn, toPusherKey } from "@/lib/utils";
import Image from "next/image";
import { db } from "@/lib/db";
import { Message } from "@/lib/validations/message";
import { pusherClient } from "@/lib/pusher";
import ProfileImage from "./ui/ProfileImage";

interface MessagesProps {
  initialMessages: NewMessage[];
  sessionId: string;
  chatId: string;
  sessionUserName: string;
  chatPartner: User;
}
interface NewMessage {
  id: number | any;
  senderId: number | any;
  text: string | any;
  timestamp: string | any;
}
const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionUserName,
}) => {
  const [messages, setMessages] = useState<NewMessage[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));
    const messageHandler = async (message: Message) => {
      setMessages((prev) => [message, ...prev]);
      console.log("function got called", message);
    };

    pusherClient.bind("incoming_message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming_message", messageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: string) => {
    console.log("timestamp-->", timestamp);

    return format(timestamp, "HH:mm");
  };

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message?.senderId.toString() == sessionId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index]?.senderId;

        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-white-400">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                {/* <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                /> */}
                <div
                  className={
                    isCurrentUser
                      ? "relative right-1 bottom-2 w-8 h-8 text-xs bg-indigo-600 rounded-full text-white"
                      : "relative right-1 bottom-2 w-8 h-8 text-xs bg-gray-200 rounded-full text-gray-900"
                  }
                >
                  <ProfileImage
                    name={isCurrentUser ? sessionUserName : chatPartner.name}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
