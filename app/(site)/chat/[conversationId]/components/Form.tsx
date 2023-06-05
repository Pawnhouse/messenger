'use client';

import { IoIosAttach } from 'react-icons/io';
import MessageInput from './MessageInput';
import {
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import axios from 'axios';
import useConversation from '@/app/hooks/useConversation';
import Button from '@/app/components/Button';
import useConversationKey from '@/app/hooks/useConversationKey';
import { useState } from 'react';
import encryptMessage from '@/app/libs/encryptMessage';

const Form = ({ publicKey, userId }: { publicKey: string | null, userId: string }) => {
  const { conversationId } = useConversation();
  const { conversationKey, isLoading } = useConversationKey({ publicKey, userId });
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue('message', '', { shouldValidate: true }); console.log(data);
    setSubmitEnabled(false);
    data = await encryptMessage(data, conversationKey);
    axios.post('/api/message', {
      ...data,
      conversationId
    }, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  return (
    <div
      className='
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      '
    >
      <label>
        <IoIosAttach size={30} className='text-gray-500' style={{ transform: 'rotate(45deg)' }} />
        <input type='file' hidden {...register('file')} form='message-form' />
      </label>


      <form
        id='message-form'
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center gap-2 lg:gap-4 w-full'
      >
        <MessageInput
          id='message'
          register={register}
          errors={errors}
          placeholder='Write a message'
          setSubmitEnabled={empty => setSubmitEnabled(empty && !isLoading)}
        />

        <Button round type='submit' disabled={!submitEnabled && false}>Send</Button>

      </form>
    </div>
  );
}

export default Form;