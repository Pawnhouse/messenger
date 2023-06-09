import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismaDB';
import fs from 'fs';
import bcrypt from 'bcrypt';

export async function POST(
    request: Request
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await request.formData();
        const picture = formData.get('picture[]') as File | null;

        if (picture) {
            const i = picture.name.search(/\.(png|jpg|jpeg)$/)
            if (i === -1) {
                return new NextResponse('Wrong picture format', { status: 400 });
            }
            currentUser.image = '/profilePicture/' + currentUser.id + picture.name.slice(i);
            fs.writeFileSync('public' + currentUser.image, Buffer.from(await picture.arrayBuffer()))
            await prisma.user.update({
                where: { id: currentUser.id },
                data: { image: currentUser.image }
            })
            return new NextResponse('Picture updated', { status: 200 });
        }
        const newData: {
            [k: string]: FormDataEntryValue | Date | undefined
        } = Object.fromEntries(formData);
        if (newData.password && typeof newData.password === 'string') {
            if (newData.password.length < 8) {
                return new NextResponse(
                    'Password must be at least 8 characters',
                    { status: 400 }
                );
            }
            if (newData.password.search(/[a-zA-Z]/) === -1 || newData.password.search(/\d/) === -1) {
                return new NextResponse(
                    'Password must contain letter and number',
                    { status: 400 }
                );
            }
            newData.hashedPassword = await bcrypt.hash(newData.password, 10);
            return new NextResponse('Password updated', { status: 200 });
        }
        newData.password = undefined;
        newData.passwordRepeat = undefined;

        if (await prisma.user.findFirst({ where: { email: newData.email as string, NOT: { id: currentUser.id } } })) {
            return new NextResponse('Email already exists', { status: 400 });
        }

        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                email: newData.email as string,
                firstName: newData.firstName as string,
                middleName: newData.middleName as string,
                surname: newData.surname as string,
                birthday: new Date(newData.birthday as string),
                username: newData.username as string,
                name: (newData.firstName as string) + ' ' + (newData.surname as string)
            }
        })

        return new NextResponse('Data updated', { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal', { status: 500 });
    }
}
