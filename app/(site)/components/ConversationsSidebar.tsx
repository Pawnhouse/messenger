'use client';

import { User } from '@prisma/client';
import clsx from 'clsx';

import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/app/libs/types';
import ConversationItem from './ConversationItem';


interface ConversationsSidebarProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
  userId: string;
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({ 
  initialItems,
  userId
}) => {
  const items = initialItems;
  const { conversationId, isOpen } = useConversation();

  return (
    <>
      <aside className={clsx(`
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
        <div className='px-5'>
          <div className='flex justify-between mb-4 pt-4'>
            <div className='text-2xl font-bold text-neutral-800'>
              Messages
            </div>
          </div>
          {items.map((item) => (
            <ConversationItem
              key={item.id}
              data={item}
              selected={+conversationId === item.id}
              userId={userId}
            />
          ))}
        </div>
      </aside>
    </>
   );
}
 
export default ConversationsSidebar;