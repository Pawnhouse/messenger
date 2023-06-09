'use client';

import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import {
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { User } from '@prisma/client';

import Modal from './Modal';
import Button from '../Button';
import { toast } from 'react-hot-toast';
import Input from '../Input';
import Select from '../Select';
import generateConversationKeys from '@/app/libs/cryptography/generateConversationKeys';

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users = [],
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  });

  const members = watch('members');

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const memberIds = data.members.map((member: {value: string}) => member.value);
    memberIds.push(currentUser.id)
    const members = users.filter(user => memberIds.includes(user.id));
    members.push(currentUser);
    const privateKey = localStorage.getItem('ECDH_Private_Key_' + currentUser.id);
    const conversationKeys = generateConversationKeys(members, privateKey)
    
    if (!conversationKeys) {
      toast.error('Client error')
      setIsLoading(false)
      return
    }
    axios.post('/api/conversation', {
      name: data.name,
      isGroup: true,
      conversationKeys,
      memberIds,
    })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch((e) => toast.error(e?.response?.data || 'Server error'))
      .finally(() => setIsLoading(false));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2
              className='
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              '
            >
              Create a group chat
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Create a chat with more than 2 people.
            </p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <Input
                disabled={isLoading}
                label='Name'
                id='name'
                errors={errors}
                required
                register={register}
              />
              <Select
                disabled={isLoading}
                label='Members'
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name || user.username || ''
                }))}
                onChange={(value) => setValue('members', value, {
                  shouldValidate: true
                })}
                value={members}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <Button
            disabled={isLoading}
            onClick={onClose}
            type='button'
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type='submit'>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal;