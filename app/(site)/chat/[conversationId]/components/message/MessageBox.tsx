import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/libs/types';
import MessageBody from './MessageBody';

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  conversationKey: Buffer | null;
  setSelectedMessage: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  conversationKey,
  setSelectedMessage
}) => {
  const session = useSession();
  const isOwn = session.data?.user?.email === data?.sender?.email;

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden border-neutral-400 border-[1px] rounded-lg py-2 px-3',
    isOwn ? 'bg-green-100' : 'bg-gray-100'
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body} onClick={isOwn ? setSelectedMessage : () => undefined}>
        <div className={message}>
          <div className='flex items-center gap-1 pb-2'>
            <div className='text-sm text-gray-500'>
              {data.sender.name}
            </div>
            <div className='text-xs text-gray-700'>
              {data.createdAt.toLocaleTimeString()}
            </div>
          </div>
          <MessageBody conversationKey={conversationKey} data={data} />
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
