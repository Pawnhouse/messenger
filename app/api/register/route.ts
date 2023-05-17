import bcrypt from 'bcrypt';

import prisma from '../../libs/prismaDB'
import { NextResponse } from 'next/server';
import sendOneTimePassword from '../../libs/mail'

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      middleName,
      surname,
      birthday,
      username,
      password
    } = body;
    const birthday_date = birthday === '' || birthday == null ? undefined : new Date(birthday);

    let existingUser = await prisma.user.findFirst({ where: { username, isVerifiedEmail: true } }) ||
      await prisma.user.findFirst({ where: { email, isVerifiedEmail: true } });
    if (existingUser) {
      return new NextResponse('Choose other username', { status: 400 });
    }
    existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return new NextResponse('Choose other email', { status: 400 });
    }
    if (password.length < 8) {
      return new NextResponse('Password must be at least 8 characters', { status: 400 });
    }
    if (password.search(/[a-zA-Z]/) === -1 || password.search(/\d/) === -1) {
      return new NextResponse('Password must contain letter and number', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 14);
    let name = firstName + ' ' + surname;
    name = name.trim().slice(0, 50);
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        middleName,
        surname,
        birthday: birthday_date,
        username,
        hashedPassword,
        name
      }
    });

    // await sendOneTimePassword(email, user.id, 'Email verification');
    return NextResponse.json(user);
  } catch (e) {
    return new NextResponse('Internal error', { status: 500 });
  }

}
