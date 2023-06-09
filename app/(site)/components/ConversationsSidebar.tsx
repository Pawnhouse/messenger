'use client';

import { Contact, User } from '@prisma/client';
import clsx from 'clsx';

import { useEffect, useState } from 'react';
import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/app/libs/types';
import ConversationItem from './ConversationItem';
import GroupChatModal from '@/app/components/modal/GroupChatModal';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { pusherClient } from '@/app/libs/pusher';

interface ConversationsSidebarProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
  currentUser: User & {
    contacts: Contact[];
  };
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({
  initialItems,
  currentUser,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const { conversationId, isOpen } = useConversation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contactIds = currentUser.contacts?.map(contact => contact.inContactId) || [];

  const contacts = users.filter((user) => {
    return contactIds.includes(user.id)
  })

  useEffect(() => {
    pusherClient.subscribe(currentUser.id); 
    const updateHandler = (conversation: FullConversationType) => {
      conversation.messages.forEach((message) => {
        message.createdAt = new Date(message.createdAt)
      })


      setItems((current) => current.map((currentConversation) => {
        if (currentConversation.id === conversation.id) { 
          return {
            ...currentConversation,
            messages: conversation.messages
          };
        }

        return currentConversation;
      }));
    }
    pusherClient.bind('update_conversation', updateHandler)
    return () => {
      pusherClient.unsubscribe(currentUser.id);
      pusherClient.unbind('update_conversation', updateHandler)
    }
  }, [currentUser.id]);

  return (
    <>
      <GroupChatModal
        users={contacts}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
      />
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
            <div
              onClick={() => setIsModalOpen(true)}
              className='
                rounded-full 
                p-1 
                bg-gray-100 
                text-gray-800 
                cursor-pointer 
                hover:opacity-75 
                transition
              '
            >
              <AiOutlineUsergroupAdd size={24} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationItem
              key={item.id}
              data={item}
              selected={+conversationId === item.id}
              userId={currentUser.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
}

export default ConversationsSidebar;