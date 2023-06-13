'use client';

import { useState } from 'react';
import { Contact, User } from '@prisma/client';
import UserItem from './UserItem';
import { FcSettings } from 'react-icons/fc';
import { IoClose } from 'react-icons/io5'

interface UserSidebarProps {
  items: User[]
  currentUser: User & {
    contacts: Contact[];
  } | null
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  items,
  currentUser,
}) => {
  const [isDelete, setIsDelete] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const initialContactIds = currentUser?.contacts?.map(contact => contact.inContactId) || [];
  const [contactIds, setContactIds] = useState<string[]>(initialContactIds);

  const userList = items.filter((user) => {
    if (isSearch) {
      const usernameMatch = user.username && ('@' + user.username).search(searchValue) !== -1
      const nameMatch = user.name && user.name.search(searchValue) !== -1
      return usernameMatch || nameMatch
    }
    return contactIds.includes(user.id) || contactIds.includes(user.id)
  })

  const deleteToggle = () => {
    setSearchValue('');
    setIsDelete(!isDelete);
    setIsSearch(false);
  }

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    setIsDelete(false);
    setIsSearch(true);
  }

  return (
      <div className='px-5'>
        <div className='flex justify-between mb-4 pt-4'>
          <div
            className='
              text-2xl 
              font-bold 
              text-neutral-800 
            '
          >
            Contacts
          </div>
          <div
            onClick={deleteToggle}
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
            <FcSettings size={24} />
          </div>
        </div>

        <div className='flex items-center'>
          <div className='relative w-full'>
            <input type='text' id='user-search' value={searchValue} onChange={(e) => onSearchChange(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Search' required />
          </div>
          <div className='p-0.5 ml-2 text-sm font-medium text-white bg-transparent border-0 rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300'>
            {
              !isSearch &&
              <svg aria-hidden='true' className='w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer' onClick={() => onSearchChange('')} fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd'></path></svg>
            }
            {
              isSearch &&
              <IoClose className='w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer' onClick={() => { setSearchValue(''); setIsSearch(false) }} />
            }
            <span className='sr-only'>Search</span>
          </div>
        </div>

        {userList.map((item) => (
          <UserItem
            key={item.id}
            data={item}
            isSearchContact={isSearch}
            isDelete={isDelete}
            setContactIds={setContactIds}
            contactIds={contactIds}
          />
        ))}
      </div>
  );
}

export default UserSidebar;