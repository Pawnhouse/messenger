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
        } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 400 });
        }

        const existingContact = await prisma.contact.findFirst({
            where: {
                contactId: currentUser.id,
                inContactId: userId,
            }
        });

        if (!existingContact) {
            await prisma.contact.create({
                data: {
                    contactId: currentUser.id,
                    inContactId: userId,
                }
            })
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}