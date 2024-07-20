interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    username?: string;
    password_hash?: string;
    created_at?: string;
}

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;  // Use string for timestamps
  }

interface Chat {
    id: string
    messages: Message[]
}

interface FriendRequest {
    id: string
    senderId: string
    receiverId: string
}