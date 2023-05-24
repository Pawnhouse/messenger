'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import Avatar from '@/app/components/Avatar';
import { FullConversationType } from '@/app/libs/types';
import useConversationUsers from '@/app/hooks/useConversationUsers';

interface ConversationItemProps {
  data: FullConversationType,
  selected?: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  data,
  selected
}) => {
  const otherUser = useConversationUsers(data)[0];
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/chat/${data.id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage?.body
    }

    return 'Started a conversation';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(`
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      <Avatar user={otherUser} />
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <span className='absolute inset-0' aria-hidden='true' />
          <div className='flex justify-between items-center mb-1'>
            <p className='text-md font-medium text-gray-900'>
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className='
                  text-xs 
                  text-gray-400 
                  font-light
                '
              >
                {lastMessage.createdAt.toDateString()}
              </p>
            )}
          </div>
          <p className='
              truncate 
              text-sm
              text-gray-500
          '>
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConversationItem;