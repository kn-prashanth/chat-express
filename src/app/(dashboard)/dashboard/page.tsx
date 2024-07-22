import Button from "@/components/ui/Button";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight, Link } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const Page = async ({}) => {
  const session = await getServerSession(authOptions);
  if(!session) notFound();

  // const friends = await getFriendsByUserId(session.user.id)

  // const friendsWithLastMessage = await Promise.all(
  //   friends.map(async (friend) => {
  //     // const [lastMessageRaw] = (await fetchRedis(
  //     //   'zrange',
  //     //   `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
  //     //   -1,
  //     //   -1
  //     // )) as string[]
  //     const chatId = chatHrefConstructor(session.user.id, friend.id);
  //     const { data:lastMessage , error } = await db
  //     .from('messages')
  //     .select('*')
  //     .eq('chatId', chatId)
  //     .order('timestamp', { ascending: false })
  //     .limit(1);
      
  //     if(error) {
  //       console.error("Error fetching data:", error);
  //       return;
  //     }

  //     return {
  //       ...friend,
  //       lastMessage,
  //     }
  //   })
  // )

  // return (
  //   <div className='container py-12'>
  //     <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
  //     {friendsWithLastMessage.length === 0 ? (
  //       <p className='text-sm text-zinc-500'>Nothing to show here...</p>
  //     ) : (
  //       friendsWithLastMessage.map((friend) => (
  //         <div
  //           key={friend.id}
  //           className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
  //           <div className='absolute right-4 inset-y-0 flex items-center'>
  //             <ChevronRight className='h-7 w-7 text-zinc-400' />
  //           </div>

  //           <Link
  //             href={`/dashboard/chat/${chatHrefConstructor(
  //               session.user.id,
  //               friend.id
  //             )}`}
  //             className='relative sm:flex'>
  //             <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
  //               <div className='relative h-6 w-6'>
  //                 {/* <Image
  //                   referrerPolicy='no-referrer'
  //                   className='rounded-full'
  //                   alt={`${friend.name} profile picture`}
  //                   src={friend.image}
  //                   fill
  //                 /> */}
  //               </div>
  //             </div>

  //             <div>
  //               <h4 className='text-lg font-semibold'>{friend.name}</h4>
  //               <p className='mt-1 max-w-md'>
  //                 <span className='text-zinc-400'>
  //                   {friend.lastMessage.senderId === session.user.id
  //                     ? 'You: '
  //                     : ''}
  //                 </span>
  //                 {friend.lastMessage.text}
  //               </p>
  //             </div>
  //           </Link>
  //         </div>
  //       ))
  //     )}
  //   </div>
  // )

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
        Chat Express
      </h1>
      <p className="mt-4 text-gray-600 text-lg ">
        Messages you send will automatically disappear after 24 hours
      </p>
    </div>
  );
};

export default Page;
