import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}
interface NewMessage {
  id: number | any
  senderId: number | any
  text: string | any
  timestamp: string | any
}

async function getChatMessages(chatId: string): Promise<NewMessage[]> {
  try {
    const { data, error } = await db
      .from("messages")
      .select("id, senderId, text, timestamp")
      .eq("chatId", chatId)
      .eq('isdeleted', false)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    if (!data) {
      console.log(31);
      
      notFound();
    }
    // const messages = messageArrayValidator.parse(data);
    
    return data;

  } catch (error) {
    console.error("Error fetching messages:", error);
    console.log(39, error);
    notFound();
  }
}

const Page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log(48);
    
    notFound();
  } 

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id != userId1 && user.id != userId2) {
    console.log("userId1--->", typeof userId1);
    console.log("userId2--->", typeof userId2);
    
    console.log(58, typeof user.id);
  
    notFound();
  }

  const chatPartnerId = user.id == userId1 ? userId2 : userId1;
    const { data: chatPartner, error } = await db
    .from('users')
    .select('*')
    .eq('id', chatPartnerId)
    .single();

    if (error) {
      console.error("Error fetching sender data:", error);
      return;
    }

  const initialMessages = await getChatMessages(chatId);
  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
    <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
      <div className='relative flex items-center space-x-4'>
        <div className='relative'>
          <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
            {/* <Image
              fill
              referrerPolicy='no-referrer'
              src=""
              alt={`${chatPartner.name} profile picture`}
              className='rounded-full'
            /> */}
          </div>
        </div>

        <div className='flex flex-col leading-tight'>
          <div className='text-xl flex items-center'>
            <span className='text-gray-700 mr-3 font-semibold'>
              {chatPartner.name}
            </span>
          </div>

          <span className='text-sm text-gray-600'>{chatPartner.username}</span>
        </div>
      </div>
    </div>

    <Messages
      chatId={chatId}
      chatPartner={chatPartner}
      sessionImg=""
      sessionId={session.user.id}
      initialMessages={initialMessages}
    />
    <ChatInput chatId={chatId} chatPartner={chatPartner} />
  </div>
  )
};

export default Page;
