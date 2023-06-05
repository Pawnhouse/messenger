import prisma from '@/app/libs/prismaDB';

const getUserById = async (id: string) => {
  try {
    const users = await prisma.user.findFirst({
      where: { id }
    });

    return users;
  } catch {
    return null;
  }
};

export default getUserById;