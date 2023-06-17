'use client';

import React, { useCallback, useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import axios from 'axios';
import Modal from '@/app/components/modal/Modal';
import Button from '@/app/components/Button';
import { toast } from 'react-hot-toast';
import { FullMessageType } from '@/app/libs/types';
import Input from '@/app/components/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import encryptMessage from '@/app/libs/cryptography/encryptMessage';

interface ConfirmModalProps {
  message: FullMessageType | null
  conversationKey: Buffer | null;
  onClose: () => void;
}

const MessageModal: React.FC<ConfirmModalProps> = ({
  message,
  conversationKey,
  onClose
}) => {

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>();

  useEffect(() => {
    setValue('newMessage', message?.error ? '' : message?.body)
  }, [setValue, message?.body, message?.error])

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios.delete(`/api/message/${message?.id}`)
      .then(() => {
        onClose();
      })
      .catch(() => toast.error('Server error'))
      .finally(() => setIsLoading(false))
  }, [message?.id, onClose]);

  const onUpdate: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    data = await encryptMessage({ message: data.newMessage }, conversationKey);
    axios.patch(`/api/message/${message?.id}`, data).then(() => {
      onClose();
    })
      .catch(() => toast.error('Server error'))
      .finally(() => setIsLoading(false))
  }

  return (
    <Modal isOpen={!!message} onClose={onClose}>
      <div className='sm:flex sm:items-start'>
        <div className='text-left flex-grow'>
          <Dialog.Title
            as='h3'
            className='text-base font-semibold leading-6 text-gray-900'
          >
            Change message
          </Dialog.Title>
          <div className='mt-2'>
            <Input
              label='New message'
              id='newMessage'
              register={register}
              errors={errors}
            />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onUpdate)} className='mt-5 gap-3 flex flex-row-reverse'>
        <Button
          disabled={isLoading}
          danger
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button
          type='submit'
          disabled={isLoading}
        >
          Update
        </Button>

      </form>
    </Modal>
  )
}

export default MessageModal;
