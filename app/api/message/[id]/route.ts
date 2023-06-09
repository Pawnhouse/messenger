import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismaDB';
import fs from 'fs';
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
    id?: string;
}

export async function GET(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const id = +(params.id || 0);
        const message = await prisma.message.findFirstOrThrow({ where: { id } });
        const conversationId = message.conversationId;

        if (!await prisma.conversation.findFirst({
            where: {
                id: conversationId, users: { some: { id: currentUser.id } }
            }
        })) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!message.image) {
            return new NextResponse('Not found', { status: 404 });
        }
        const buffer = fs.readFileSync((process.env.UPLOAD_DIRECTORY || 'upload/') + message.image);
        return new NextResponse(buffer.toString('base64'));
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal', { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: IParams }
) {

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const id = +(params.id || 0);

        if (!await prisma.message.findFirst({
            where: {
                id, senderId: currentUser.id
            }
        })) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const { message, iv } = await request.json()
        const updateMessage = await prisma.message.update({
            where: { id }, data: { body: message, image: null, iv },
            include: {
                sender: true,
            },
        })
        await pusherServer.trigger('conversation_' + updateMessage.conversationId, 'update_message', updateMessage);

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal', { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const id = +(params.id || 0);

        const message = await prisma.message.findFirst({
            where: {
                id, senderId: currentUser.id
            }
        })
        if (!message) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        await prisma.message.delete({ where: { id } })

        await pusherServer.trigger('conversation_' + message.conversationId, 'delete_message', message);

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal', { status: 500 });
    }
}