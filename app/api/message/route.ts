import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismaDB';
import fs from 'fs';
import { pusherServer } from '@/app/libs/pusher';

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (file) {
      fs.writeFileSync((process.env.UPLOAD_DIRECTORY || 'upload/') + file.name, Buffer.from(await file.arrayBuffer()))
    }
    const message = formData.get('message') as string | null;
    const iv = formData.get('iv') as string | null;
    const conversationId = +(formData.get('conversationId') || 0);

    if (!await prisma.conversation.findFirst({
      where: {
        id: conversationId, users: { some: { id: currentUser.id } }
      }
    })) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const newMessage = await prisma.message.create({
      include: {
        sender: true
      },
      data: {
        body: message,
        image: file?.name,
        iv: iv,
        conversation: {
          connect: { id: conversationId }
        },
        sender: {
          connect: { id: currentUser.id }
        },
      }
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        users: true,
        messages: { orderBy: { createdAt: 'asc' } },
      }
    });
    await pusherServer.trigger('conversation_' + conversationId, 'new_message', newMessage);
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.id, 'update_conversation', {
        id: conversationId,
        messages: updatedConversation.messages
      });
    });

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal', { status: 500 });
  }
}
