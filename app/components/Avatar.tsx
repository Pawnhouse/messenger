import { User } from '@prisma/client';

import Image from 'next/image';
import { HiUserGroup } from 'react-icons/hi';

interface AvatarProps {
    user: User | { image: string | null } | null;
    isGroup?: boolean | null;
}

const Avatar: React.FC<AvatarProps> = ({ user, isGroup }) => {

    return (

        <div className='
            relative
            inline-block 
            rounded-full 
            overflow-hidden
            h-9 
            w-9 
            md:h-11 
            md:w-11
        '>
            {
                isGroup &&
                <HiUserGroup className='h-full w-full text-blue-950' />
            }
            {
                !isGroup &&
                <Image
                    fill
                    sizes='2.75rem'
                    src={user?.image || '/standard.jpg'}
                    alt='Avatar'
                />
            }

        </div>


    );
}

export default Avatar;