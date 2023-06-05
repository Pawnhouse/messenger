'use client';

import { User } from '@prisma/client';
import UserItem from './UserItem';

interface UserSidebarProps {
  items: User[] | { id: string, name: string, image: string | null }[]
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  items,
}) => {
  return (
    <aside
      className='
        w-full
        lg:w-80 
        overflow-y-auto 
        border-r 
        border-gray-200
      '
    >
      <div className='px-5'>
        <div className='flex-col'>
          <div
            className='
              text-2xl 
              font-bold 
              text-neutral-800 
              py-4
            '
          >
            Contacts
          </div>
        </div>

        <form className='flex items-center'>
          <div className='relative w-full'>
            <input type='text' id='simple-search' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Search' required />
          </div>
          <button type='submit' className='p-0.5 ml-2 text-sm font-medium text-white bg-transparent border-0 rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300'>
            <svg aria-hidden='true' className='w-6 h-6 text-gray-500 dark:text-gray-400' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clip-rule='evenodd'></path></svg>
            <span className='sr-only'>Search</span>
          </button>
        </form>

        {items.map((item) => (
          <UserItem
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </aside>
  );
}

export default UserSidebar;