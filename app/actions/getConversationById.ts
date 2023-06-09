import prisma from '@/app/libs/prismaDB';
import getCurrentUser from './getCurrentUser';

const getConversationById = async (
  conversationId: number
) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }
  
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true,
        keys: true,
      },
    });

    return conversation;
  } catch {
    return null;
  }
};

export default getConversationById;
