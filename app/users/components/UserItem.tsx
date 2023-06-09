import axios from 'axios';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

import Avatar from '@/app/components/Avatar';
import { toast } from 'react-hot-toast';
import { AiOutlineUserAdd, AiOutlineUserDelete } from 'react-icons/ai';
import clsx from 'clsx';
import LoadingModal from '@/app/components/modal/LoadingModal';

interface UserBoxProps {
  data: User
  isSearchContact: boolean
  isDelete: boolean
  contactIds: string[]
  setContactIds: (contactIds: string[]) => void
}

const UserItem: React.FC<UserBoxProps> = ({
  data,
  isSearchContact: isNewContact,
  isDelete,
  contactIds,
  setContactIds,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const isClickableState = !isDelete && contactIds.includes(data.id)

  const handleClick = useCallback(() => {
    if (isClickableState) {
      axios.post('/api/conversation', { userId: data.id })
        .then((data) => {
          router.push(`/chat/${data.data.id}`);
        })
    }
  }, [isClickableState, data.id, router]);

  const handleDelete = useCallback(() => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    axios.delete('api/contact/' + data.id)
      .then(() => {
        toast.success('Contact deleted')
        setContactIds(contactIds.filter(id => id !== data.id))
      })
      .catch(() => toast.error('Server error'))
      .finally(() => setIsLoading(false))
  }, [contactIds, data.id, isLoading, setContactIds])

  const handleAdd = useCallback(() => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    axios.post('api/contact', { userId: data.id })
      .then(() => {
        toast.success('Added contact')
        setContactIds([...contactIds, data.id]);
      })
      .catch(() => toast.error('Server error'))
      .finally(() => setIsLoading(false))
  }, [contactIds, data.id, isLoading, setContactIds]);

  return (
    <>
      {
        isLoading &&
        <LoadingModal />
      }
      <div
        onClick={handleClick}
        className={clsx(`
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          rounded-lg
          transition
        `,
          isClickableState && 'hover:bg-neutral-100 cursor-pointer'
        )}
      >
        <Avatar user={data} />
        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <div className='flex justify-between items-center mb-1'>
              <p className='text-sm font-medium text-gray-900'>
                {data.name}
              </p>
            </div>
          </div>
        </div>
        {
          isDelete &&
          <div
            onClick={handleDelete}
            className='
                rounded-full 
                p-1 
                hover:bg-red-100 
                text-red-800 
                cursor-pointer  
                transition
              '
          >
            <AiOutlineUserDelete size={24} />
          </div>
        }
        {
          isNewContact && !contactIds.includes(data.id) &&
          <div
            onClick={handleAdd}
            className='
              rounded-full 
              p-1 
              hover:bg-blue-100 
              text-blue-800 
              cursor-pointer 
              hover:opacity-75 
              transition
            '
          >
            <AiOutlineUserAdd size={24} />
          </div>
        }
      </div>
    </>
  );
}

export default UserItem;