'use client';

import { useState } from 'react';
import { HiChevronLeft, HiSearch } from 'react-icons/hi'
import Link from 'next/link';
import { Conversation, User } from '@prisma/client';

import Avatar from '@/app/components/Avatar';
import useConversationUsers from '@/app/hooks/useConversationUsers';
import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useConversationUsers(conversation)[0];
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <div
        className='
        bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm
      '
      >
        <div className='flex gap-3 items-center'>
          <Link
            href='/'
            className='
            lg:hidden 
            block 
            text-gray-500 
            hover:text-gray-600 
            transition 
            cursor-pointer
          '
          >
            <HiChevronLeft size={32} />
          </Link>
          <div onClick={() => setProfileOpen(true)}>
            <Avatar user={otherUser}  />
          </div>

          <div className='flex flex-col'>
            <div>{conversation.name || otherUser.name}</div>

          </div>
        </div>
        <HiSearch
          size={32}
          className='
          text-gray-500
          cursor-pointer
          hover:text-gray-600
          transition
        '
        />
      </div>
    </>
  );
}

export default Header;
