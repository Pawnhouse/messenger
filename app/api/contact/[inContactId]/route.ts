import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismaDB';

interface IParams {
    inContactId?: string;
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

        const inContactId = params.inContactId || '';
        await prisma.contact.deleteMany({ where: { inContactId, contactId: currentUser.id } });

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal', { status: 500 });
    }
}

