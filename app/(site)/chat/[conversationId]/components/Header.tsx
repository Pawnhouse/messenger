import { useState } from 'react';
import { HiChevronLeft } from 'react-icons/hi'
import Link from 'next/link';
import { Conversation, User } from '@prisma/client';

import Avatar from '@/app/components/Avatar';
import useConversationUsers from '@/app/hooks/useConversationUsers';
import ProfileDrawer from './ProfileDrawer';
import { useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';

interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
  isSearch: boolean
  setIsSearch: (value: boolean) => void
  setSearchValue: (value: string) => void
}

const Header: React.FC<HeaderProps> = ({ conversation, isSearch, setIsSearch, setSearchValue }) => {
  const otherUser = useConversationUsers(conversation)[0];
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()
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
            href='#'
            onClick={() => router.back()}
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
          <div onClick={() => setProfileOpen(true)} className='cursor-pointer'>
            <Avatar user={otherUser} isGroup={conversation.isGroup} />
          </div>

          <div className='flex flex-col'>
            <div>{conversation.name || otherUser.name}</div>

          </div>
        </div>
        <div className='p-0.5 ml-2 text-sm font-medium text-white bg-transparent border-0 rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300'>
          {
            !isSearch &&
            <svg aria-hidden='true' className='w-7 h-7 text-gray-500 dark:text-gray-400 cursor-pointer' onClick={() => setIsSearch(true)} fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd'></path></svg>
          }
          {
            isSearch &&
            <IoClose className='w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer' onClick={() => { setSearchValue(''); setIsSearch(false) }} />
          }
          <span className='sr-only'>Search</span>
        </div>

      </div>
    </>
  );
}

export default Header;
