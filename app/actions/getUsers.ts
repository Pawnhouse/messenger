import prisma from '@/app/libs/prismaDB';
import getSession from './getSession';

const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        NOT: {
          email: session.user.email
        }
      }
    });

    return users;
  } catch {
    return [];
  }
};

export default getUsers;