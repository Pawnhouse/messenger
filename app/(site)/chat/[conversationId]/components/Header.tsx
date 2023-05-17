'use client';

import { HiChevronLeft, HiSearch } from 'react-icons/hi'
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Conversation, User } from '@prisma/client';

import Avatar from '@/app/components/Avatar';
import useConversationUsers from '@/app/hooks/useConversationUsers';

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useConversationUsers(conversation)[0];
  const [drawerOpen, setDrawerOpen] = useState(false);


  return (
    <>
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

          <Avatar user={otherUser} />
          <div className='flex flex-col'>
            <div>{conversation.name || otherUser.name}</div>

          </div>
        </div>
        <HiSearch
          size={32}
          onClick={() => setDrawerOpen(true)}
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
