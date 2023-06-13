import { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox';
import { FullMessageType } from '@/app/libs/types';
import useConversationKey from '@/app/hooks/useConversationKey';
import decryptMessages from '@/app/libs/cryptography/decryptMessages';
import MessageModal from './MessageModal';
import { ConversationKey } from '@prisma/client';
import { pusherClient } from '@/app/libs/pusher';
import filterMessages from '@/app/libs/filterMessages';

interface BodyProps {
  initialMessages: FullMessageType[];
  publicKey: string | null;
  userId: string;
  conversationPartialKey?: ConversationKey;
  conversationId: number;
  searchValue: string;
}

const Body: React.FC<BodyProps> = ({ initialMessages = [], publicKey, userId, conversationPartialKey, conversationId, searchValue }) => {
  const [selectedMessage, setSelectMessage] = useState<FullMessageType | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const { conversationKey, isLoading } = useConversationKey(publicKey, userId, conversationPartialKey);
  const decryptedMessages = decryptMessages(isLoading, messages, conversationKey);
  const filteredMessages = filterMessages(decryptedMessages, searchValue);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView();
  }, [isLoading]);

  useEffect(() => {
    pusherClient.subscribe('conversation_' + conversationId)
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      message.createdAt = new Date(message.createdAt)
      setMessages([...messages, message]);
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (updatedMessage: FullMessageType) => {
      updatedMessage.createdAt = new Date(updatedMessage.createdAt)
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === updatedMessage.id) {
          return updatedMessage;
        }
        return currentMessage;
      }))
    };

    const deletedMessageHandler = (deletedMessage: FullMessageType) => {
      setMessages(messages.filter(message => message.id !== deletedMessage.id))
    };

    pusherClient.bind('new_message', messageHandler)
    pusherClient.bind('update_message', updateMessageHandler);
    pusherClient.bind('delete_message', deletedMessageHandler);

    return () => {
      pusherClient.unsubscribe('conversation_' + conversationId)
      pusherClient.unbind('new_message', messageHandler)
      pusherClient.unbind('update_message', updateMessageHandler)
      pusherClient.unbind('delete_message', deletedMessageHandler)
    }
  }, [conversationId, messages])

  return (
    <div className='flex-1 overflow-y-auto' style={{ background: '#A4DED4' }}>
      <div className='max-w-2xl m-auto'>
        <MessageModal
          onClose={() => setSelectMessage(null)}
          message={selectedMessage}
          conversationKey={conversationKey}
        />
        {
          !isLoading &&
          filteredMessages.map((message) => (
            <MessageBox
              key={message.id}
              data={message}
              conversationKey={conversationKey}
              setSelectedMessage={() => setSelectMessage(message)}
            />
          ))}
      </div>

      <div className='pt-12' ref={bottomRef} />
    </div>
  );
}

export default Body;