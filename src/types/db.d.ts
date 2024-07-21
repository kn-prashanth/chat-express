interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    username?: string;
    password_hash?: string;
    created_at?: string;
}

interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: number;  // Use string for timestamps
  }

interface Chat {
    id: string
    messages: Message[]
}

interface FriendRequest {
    id: number
    senderId: number
    receiverId: number
}