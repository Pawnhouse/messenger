import prisma from '@/app/libs/prismaDB';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        users: {
          some: {id: currentUser.id}
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        keys: true,
      }
    });
    return conversations;
  } catch {
    return [];
  }
};

export default getConversations;