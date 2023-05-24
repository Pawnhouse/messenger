import { User } from '@prisma/client';

import Image from 'next/image';

interface AvatarProps {
    user: User | { image: string | null } | null;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {

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
            <Image
                fill
                src={user?.image || '/standard.jpg'}
                alt='Avatar'
            />
        </div>


    );
}

export default Avatar;