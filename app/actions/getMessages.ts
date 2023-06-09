import prisma from '@/app/libs/prismaDB';

const getMessages = async (
  conversationId: number
) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return messages;
  } catch {
    return [];
  }
};

export default getMessages;
