'use client';

import { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/libs/types';
import { BiCommentError } from 'react-icons/bi';
import { AiFillFile, AiFillFileExclamation } from 'react-icons/ai';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { createDecipheriv } from 'crypto';

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
  conversationKey: Buffer | null;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  data,
  conversationKey
}) => {
  const session = useSession();
  const [picture, setPicture] = useState<string | null>(null);
  const isOwn = session.data?.user?.email === data?.sender?.email;
  const isPicture = data.image && data.image.search(/\.(png|jpg|jpeg)$/) !== -1;

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');
  const message = clsx(
    'text-sm w-fit overflow-hidden border-neutral-400 border-[1px]',
    isOwn ? 'bg-green-100' : 'bg-gray-100',
    data.image && false ? 'rounded-md p-0' : 'rounded-lg py-2 px-3' // image not implemented
  );

  const getFile = useCallback(async () => {
    const res = await axios.get('/api/message', { params: { id: data.id } });
    let fileData = Buffer.from(res.data as string, 'base64');
    if (conversationKey) {
      const decipher = createDecipheriv('aes-256-cbc', conversationKey, Buffer.from(data.iv || '', 'base64'));
      let decryptedData = decipher.update(fileData);
      decryptedData = Buffer.concat([decryptedData, decipher.final()]);
      fileData = decryptedData;
    }

    const file = new File([fileData], data.image || '')
    return file
  }, [conversationKey, data.id, data.image, data.iv])

  const onDownload = async () => {
    try {
      saveAs(await getFile())
    } catch (error) {
      console.error(error)
      data.error = true;
    }
  }

  useEffect(() => {
    if (data.image && data.image.search(/\.(png|jpg|jpeg)$/) !== -1) {
      console.log(data.image);
      getFile().then((file) => {
        setPicture(URL.createObjectURL(file)); console.log('picture')
      }).catch((error) => { console.error(error) });
    }
  }, [data.image, getFile])

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>

        <div className={message}>
          <div className='flex items-center gap-1 pb-2'>
            <div className='text-sm text-gray-500'>
              {data.sender.name}
            </div>
            <div className='text-xs text-gray-700'>
              {data.createdAt.toLocaleTimeString()}
            </div>
          </div>
          {data.image && data.error &&
            <AiFillFileExclamation className='w-6 h-6 text-gray-600' />
          }
          {isPicture && picture && !data.error &&
            <Image
              alt='Image'
              height='288'
              width='288'
              src={picture}
              className='
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
                mb-2
              '
              onLoadingComplete={() => { URL.revokeObjectURL(picture) }}
            />
          }
          {data.image && !data.error &&

            <div className='flex items-center'>
              <AiFillFile className='mr-2 w-6 h-6 text-gray-600 cursor-pointer' onClick={onDownload} />
              <span>{data.image}</span>
            </div>
          }
          {!data.image &&
            <div>{data.error ? (<BiCommentError className='w-6 h-6 text-gray-600' />) : data.body}</div>
          }

        </div>
      </div>
    </div>
  );
}

export default MessageBox;