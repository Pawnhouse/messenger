import Image from 'next/image';
import LogOutLink from './LogOutLink';
import clsx from 'clsx';
import ECDHKeyProvider from '../context/ECDHKeyProvider';
import { User } from '@prisma/client';

export default function Header({ user }: { user: User | null }) {
    return (
        <header className={clsx(
            'p-1 h-10 bg-gray-200 flex justify-center',
            user ? 'lg:justify-between' : 'lg:justify-start'
        )}>
            <Image alt='logo' height={32} width={40} src='/logo.svg' className='mx-10' priority={true} />
            <ECDHKeyProvider user={user} />

            {
                user &&
                <div className='hidden lg:flex items-center'>
                    Hello, {user.firstName}
                    <LogOutLink />
                </div>
            }
        </header>
    )
}