import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismaDB';
import { checkPayment, getTokenAndUrl } from '@/app/libs/payment';

export async function POST() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const checkout = await getTokenAndUrl(currentUser.name || '')
        if (!checkout) {
            return new NextResponse('Payment error', { status: 500 });
        }
        const { token, redirect_url: redirectUrl } = checkout;
        await prisma.payment.create({
            data: {
                token: token as string,
                status: 'processing',
                user: {
                    connect: {
                        id: currentUser.id
                    }
                }
            }
        })

        return NextResponse.json(redirectUrl)
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal', { status: 500 });
    }
}

export async function GET() {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    let lastPayment = await prisma.payment.findFirst({
        where: { userId: currentUser.id },
        orderBy: { createdAt: 'desc' }
    })

    if (lastPayment?.status === 'processing') {
        const status = await checkPayment(lastPayment.token);
        lastPayment = await prisma.payment.update({ where: { id: lastPayment.id }, data: { status } })
    }
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    if(lastPayment?.status === 'successful' && lastPayment?.createdAt > lastMonth) {
        return NextResponse.json('subscribed')
    }

    return NextResponse.json(lastPayment?.status || 'unsubscribed')
}
