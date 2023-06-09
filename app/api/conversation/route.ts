import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismaDB';

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
      isGroup,
      memberIds,
      name,
      conversationKeys
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 400 });
    }

    if (isGroup && (!memberIds || memberIds.length < 3 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: memberIds.map((id: string) => ({ id }))
          },
          keys: {
            create: conversationKeys
          },
          publicKey: currentUser.publicKey
        },
        include: {
          users: true,
          keys: true,
        }
      });

      return NextResponse.json(newConversation);
    }
    const existingConversations = await prisma.conversation.findMany({
      where: {
        users: {
          every: {
            id: {
              in: [currentUser.id, userId]
            }
          }
        }
      }
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    });

    return NextResponse.json(newConversation)
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}