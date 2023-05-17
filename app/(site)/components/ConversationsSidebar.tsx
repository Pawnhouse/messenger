'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx';

import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/app/libs/types';
import ConversationItem from './ConversationItem';


interface ConversationsSidebarProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({ 
  initialItems, 
  users
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();
  const { conversationId, isOpen } = useConversation();


  return (
    <>
      <aside className={clsx(`
        ml-20
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
            />
          ))}
        </div>
      </aside>
    </>
   );
}
 
export default ConversationsSidebar;