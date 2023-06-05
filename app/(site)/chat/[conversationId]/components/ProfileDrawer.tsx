'use client';

import { Fragment, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoClose } from 'react-icons/io5'
import { Conversation, User } from '@prisma/client';

import useConversationUsers from '@/app/hooks/useConversationUsers';

import Avatar from '@/app/components/Avatar';
import ConfirmModal from './ConfirmModal';
import ProfileDrawerItem from './ProfileDrawerItem';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[]
  }
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const otherUser = useConversationUsers(data)[0];

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-40' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500'
                  leaveFrom='translate-x-0'
                  leaveTo='translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
                      <div className='px-4 sm:px-6'>
                        <div className='flex items-start justify-end'>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                              onClick={onClose}
                            >
                              <span className='sr-only'>Close panel</span>
                              <IoClose size={24} aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                        <div className='flex flex-col items-center'>
                          <div className='mb-2'>
                            <Avatar user={otherUser} />
                          </div>
                          <div className='mb-4'>
                            {title}
                          </div>
                          <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
                            <dl className='space-y-8 px-4 sm:space-y-6 sm:px-6'>
                              {data.isGroup && (
                                <div>
                                  <dt
                                    className='
                                  text-sm 
                                  font-medium 
                                  text-gray-500 
                                  sm:w-40 
                                  sm:flex-shrink-0
                                '
                                  >
                                    Emails
                                  </dt>
                                  <dd
                                    className='
                                  mt-1 
                                  text-sm 
                                  text-gray-900 
                                  sm:col-span-2
                                '
                                  >
                                    {data.users.map((user) => user.email).join(', ')}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <ProfileDrawerItem name='Username' value={otherUser.username} />
                                  <ProfileDrawerItem name='First name' value={otherUser.firstName} hr />
                                  <ProfileDrawerItem name='Middle name' value={otherUser.middleName} hr />
                                  <ProfileDrawerItem name='Surname' value={otherUser.surname} hr />
                                  <ProfileDrawerItem name='Birthday' value={otherUser.birthday?.toDateString() || '?'} hr/>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default ProfileDrawer;
