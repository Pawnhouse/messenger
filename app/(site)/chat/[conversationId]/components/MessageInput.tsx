'use client';

import { Dispatch, SetStateAction } from 'react';
import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister
} from 'react-hook-form';

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  setSubmitEnabled: Dispatch<SetStateAction<boolean>>
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  placeholder, 
  id, 
  type, 
  required, 
  register, 
  setSubmitEnabled
}) => {
  return (
    <div className='relative w-full'>
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        onChange={e => setSubmitEnabled(!!e.target.value)}
        className='
          text-black
          font-light
          py-2
          px-4
          bg-neutral-100 
          w-full 
          rounded-full
          focus:outline-none
        '
      />
    </div>
   );
}
 
export default MessageInput;