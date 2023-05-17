import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { User } from '@prisma/client';
import { FullConversationType } from '../libs/types';

const useConversationUsers = (conversation: FullConversationType | { users: User[] }) => {
  const session = useSession();

  const conversationUsers = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const conversationUsers = conversation.users.filter((user) => user.email !== currentUserEmail);

    return conversationUsers;
  }, [session.data?.user?.email, conversation.users]);

  return conversationUsers;
};

export default useConversationUsers;