import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth'
import prisma from '../../../libs/prismaDB'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth/next'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    isVerifiedEmail: profile.email_verified,
                    firstName: profile.given_name,
                    surname: profile.family_name,
                }
            },
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
                oneTimePassword: { label: 'code', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword || (user.oneTimePassword !== credentials.oneTimePassword && process.env.NEXT_PUBLIC_EMAIL_VERIFICATION === 'verify')) {
                    throw new Error('Invalid credentials');
                }

                await prisma.user.update({
                    data: { oneTimePassword: undefined, isVerifiedEmail: true },
                    where: { id: user.id }
                });
                return user;
            }
        })

    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };