import { db } from '@/lib/db';

export const getFriendsByUserId = async (userId: string) => {
  try {
    // Fetch friends where the user is either user_id or friend_id
    const { data: friendsAsUser, error: error1 } = await db
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId);

    if (error1) {
      console.error('Error fetching friends as user:', error1);
      throw error1;
    }

    // Combine the friend IDs
    const friendIds = [
      ...friendsAsUser.map((friend) => friend.friend_id),
    ];

    if (friendIds.length === 0) {
      return [];
    }

    // Fetch user details of all friends
    const { data: friends, error: error3 } = await db
      .from('users')
      .select('*')
      .in('id', friendIds);

    if (error3) {
      console.error('Error fetching friend details:', error3);
      throw error3;
    }

    return friends;
  } catch (error) {
    console.error('Error retrieving friends:', error);
    return [];
  }
};
