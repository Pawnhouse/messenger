import Image from 'next/image';
import LogOutLink from './LogOutLink';
import clsx from 'clsx';
import getCurrentUser from '../actions/getCurrentUser';
import ECDHKeyProvider from '../context/ECDHKeyProvider';

export default async function Header() {
    const user = await getCurrentUser();

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