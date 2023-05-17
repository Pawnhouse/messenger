'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/libs/types';
import { BiCommentError } from 'react-icons/bi';

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ 
  data, 
  isLast
}) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);


  const isOwn = session.data?.user?.email === data?.sender?.email;

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden border-neutral-400 border-[1px]', 
    isOwn ? 'bg-green-100' : 'bg-gray-100', 
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );

  return ( 
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className='flex items-center gap-1 '>
          <div className='text-sm text-gray-500'>
            {data.sender.name}
          </div>
          <div className='text-xs text-gray-400'>
            {data.createdAt.toLocaleTimeString()}
          </div>
        </div>
        <div className={message}>
          {data.image ? (
            <Image
              alt='Image'
              height='288'
              width='288'
              onClick={() => setImageModalOpen(true)} 
              src={data.image} 
              className='
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              '
            />
          ) : (
            <div>{data.error? (<BiCommentError/>) :data.body}</div>
          )}
        </div>
      </div>
    </div>
   );
}
 
export default MessageBox;
