import { IoIosAttach } from 'react-icons/io';
import MessageInput from './message/MessageInput';
import {
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import axios from 'axios';
import useConversation from '@/app/hooks/useConversation';
import Button from '@/app/components/Button';
import useConversationKey from '@/app/hooks/useConversationKey';
import encryptMessage from '@/app/libs/cryptography/encryptMessage';
import { ConversationKey } from '@prisma/client';
import FileInput from './message/FileInput';

const Form = ({ publicKey, userId, conversationPartialKey }: { publicKey: string | null, userId: string, conversationPartialKey?: ConversationKey }) => {
  const { conversationId } = useConversation();
  const { conversationKey, isLoading } = useConversationKey(publicKey, userId, conversationPartialKey);

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
      message: ''
    }
  });

  const fileList = watch('file', []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!data.file && !data.message) {
      return
    }
    data = await encryptMessage(data, conversationKey);
    axios.post('/api/message', {
      ...data,
      conversationId
    }, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(() => {setValue('message', ''); setValue('file', [])});
  }

  const submitDisabled = (!fileList.length && !watch('message')) || isLoading

  return (
    <>
      <form
        id='message-form'
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center gap-2 lg:gap-4 max-w-screen-md mx-auto'
      >
        <label>
          <IoIosAttach size={30} className='text-gray-500' style={{ transform: 'rotate(45deg)' }} />
          <input type='file' hidden {...register('file')} form='message-form' />
        </label>

        {
          fileList.length > 0 ?
            <FileInput name={fileList[0].name} onClose={() => setValue('file', [])} /> :
            <MessageInput
              id='message'
              register={register}
              errors={errors}
              placeholder={fileList?.length ? '' : 'Write a message'}
            />
        }

        <Button round type='submit' disabled={submitDisabled}>Send</Button>

      </form>
    </>

  );
}

export default Form;