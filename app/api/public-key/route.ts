import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismaDB';

export async function POST(
    request: Request,
) {
    try {
        const currentUser = await getCurrentUser();
        const { publicKey } = await request.json();

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (typeof publicKey !== 'string') {
            return new NextResponse('Incorrect key', { status: 400 });
        }
        await prisma.user.update({
            data: {publicKey},
            where: {id: currentUser.id}
        });

        return new NextResponse(undefined, {status: 200})
    } catch (error) {
        console.error(error);
        return new NextResponse('Error', { status: 500 });
    }
}