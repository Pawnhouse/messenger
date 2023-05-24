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
import { createCipheriv, randomBytes } from 'crypto';
import useConversationKey from '@/app/hooks/useConversationKey';

const Form = ({ publicKey, userId }: { publicKey: string | null, userId: string }) => {
  const { conversationId } = useConversation();

  const { conversationKey, isLoading } = useConversationKey({ publicKey, userId });

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

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    if(conversationKey) {
      const iv = randomBytes(16);
      const cipher = createCipheriv('aes-256-cbc', conversationKey, iv);
      let cipherMessage = cipher.update(data.message, 'utf-8', 'base64');
      cipherMessage += cipher.final('base64');
      data = { message: cipherMessage, iv: iv.toString('base64') }
    }
    axios.post('/api/message', {
      ...data,
      conversationId
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

      <IoIosAttach size={30} className='text-gray-500' style={{ transform: 'rotate(45deg)' }} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center gap-2 lg:gap-4 w-full'
      >
        <MessageInput
          id='message'
          register={register}
          errors={errors}
          required
          placeholder='Write a message'
        />

        <Button round type='submit' disabled={isLoading}>Send</Button>

      </form>
    </div>
  );
}

export default Form;