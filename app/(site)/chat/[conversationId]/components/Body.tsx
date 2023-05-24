'use client';

import { useRef } from 'react';
import MessageBox from './MessageBox';
import { FullMessageType } from '@/app/libs/types';
import useConversationKey from '@/app/hooks/useConversationKey';
import { createDecipheriv } from 'crypto';


interface BodyProps {
  initialMessages: FullMessageType[];
  publicKey: string | null;
  userId: string;
}

const Body: React.FC<BodyProps> = ({ initialMessages = [], publicKey, userId }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = initialMessages;
  const { conversationKey, isLoading } = useConversationKey({ publicKey, userId });

  let decryptedMessages;
  if (isLoading) {
    decryptedMessages = messages.map(message => ({ ...message, body: '' }));
  } else if (conversationKey) {
    decryptedMessages = messages.map(message => { 
      if (!message.iv || !message.body) {
        return message;
      }
      try {
        const decipher = createDecipheriv('aes-256-cbc', conversationKey, Buffer.from(message.iv, 'base64'));
        let decryptedData = decipher.update(message.body, 'base64', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return {...message, body: decryptedData}
      } catch {
        return {...message, error: true};
      }
    });
  } else {
    decryptedMessages = messages;
  }
  return (
    <div className='flex-1 overflow-y-auto' style={{background: '#A4DED4'}}>
      {decryptedMessages.map((message, i) => (
        <MessageBox
          isLast={i === decryptedMessages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className='pt-24' ref={bottomRef} />
    </div>
  );
}

export default Body;