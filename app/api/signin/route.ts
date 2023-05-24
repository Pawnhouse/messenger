import bcrypt from 'bcrypt';

import prisma from '../../libs/prismaDB'
import { NextResponse } from 'next/server';
//import sendOneTimePassword from '../../libs/mail'

export async function POST(
    request: Request
) {
    try {
        const body = await request.json();
        const { email, password } = body;
        if (!email || !password) {
            return new NextResponse('Invalid credentials', { status: 400 });
        }
        const existingUser = await prisma.user.findFirst({ where: { email, isVerifiedEmail: true } });
        if (!existingUser || !existingUser?.hashedPassword) {
            return new NextResponse('Incorrect username or password', { status: 400 });
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            existingUser.hashedPassword
        );
        if (!isCorrectPassword) {
            return new NextResponse('Incorrect username or password', { status: 400 });
        }

        //await sendOneTimePassword(email, existingUser.id);
        return new NextResponse(undefined, { status: 200 });

    } catch (e) {
        return new NextResponse('Internal error', { status: 500 });
    }

}
