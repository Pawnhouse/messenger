import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismaDB';
import bcrypt from 'bcrypt';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream';

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
            const extensionIndex = picture.name.search(/\.(png|jpg|jpeg)$/)
            if (extensionIndex === -1) {
                return new NextResponse('Wrong picture format', { status: 400 });
            }
            const buffer = Buffer.from(await picture.arrayBuffer())

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true,
            });

            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const cloudinaryStream = cloudinary.uploader.upload_stream(
                    {
                        format: picture.name.slice(extensionIndex + 1),
                        folder: 'profilePicture',
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                Readable.from(buffer).pipe(cloudinaryStream)
            });
            
            await prisma.user.update({
                where: { id: currentUser.id },
                data: { image: result.secure_url }
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
