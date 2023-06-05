'use client';

import { useRef } from 'react';
import MessageBox from './MessageBox';
import { FullMessageType } from '@/app/libs/types';
import useConversationKey from '@/app/hooks/useConversationKey';
import decryptMessages from '@/app/libs/decryptMessages';


interface BodyProps {
  initialMessages: FullMessageType[];
  publicKey: string | null;
  userId: string;
}

const Body: React.FC<BodyProps> = ({ initialMessages = [], publicKey, userId }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = initialMessages;
  const { conversationKey, isLoading } = useConversationKey({ publicKey, userId });
  const decryptedMessages = decryptMessages(isLoading, messages, conversationKey);
  return (
    <div className='flex-1 overflow-y-auto' style={{ background: '#A4DED4' }}>
      <div className='max-w-2xl m-auto'>
        {
        !isLoading &&
        decryptedMessages.map((message, i) => (
          <MessageBox
            isLast={i === decryptedMessages.length - 1}
            key={message.id}
            data={message}
            conversationKey={conversationKey}
          />
        ))}
      </div>

      <div className='pt-24' ref={bottomRef} />
    </div>
  );
}

export default Body;