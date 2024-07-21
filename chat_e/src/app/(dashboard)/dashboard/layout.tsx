import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOption";
import SidebarChatList from "@/components/SidebarChatList";
import SignOutButton from "@/components/SignOutButton";
import { Icon, Icons } from "@/components/icons";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebaroptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const layout = async ({ children }: layoutProps) => {
  const session = await getServerSession(authOptions);
  console.log("session--->", session);

  if (!session) notFound();


  const unseenRequestCount = await (async () =>{
    const userId = session.user.id;
    const { data, error } = await db
      .from("friend_requests")
      .select("*", { count: "exact" })
      .eq("receiver_id", userId)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching unseen friend requests:", error);
    } else {
        return data.length;
    }
  })();

  const friends = await getFriendsByUserId(session.user.id)

  return (
    <div className="w-full flex h-screen">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-x-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600"></Icons.Logo>
        </Link>
        {friends.length > 0 ? <div className="text-xs font-semibold leading-6 text-gray-400">
          Your chats
        </div>: null}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId = {session.user.id} friends = {friends}/>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebaroptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounder-md p-2 text-sm leadin-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4"></Icon>
                        </span>
                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li className="">
                  <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  {/* <Image 
                        fill
                         referrerPolicy="no-referrer"
                         className="rounded-full"
                         src={session.user.image || ''}
                         alt="Your profile picture"
                        /> */}
                  <div className="rounded-full flex ">
                    <Icons.User className="rounded-full h-full w-full p-1"></Icons.User>
                  </div>
                </div>
                <span className="sr-only">Your profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.username}
                  </span>
                </div>
              </div>
              <SignOutButton className="h-full aspect-square" />
            </li>
          </ul>
        </nav>
      </div>
      <aside className="max-h-screen container py-16 md:py-12 w-full">{children}</aside>
    </div>
  );
};

export default layout;
