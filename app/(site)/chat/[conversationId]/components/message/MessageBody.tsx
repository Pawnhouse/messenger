import { useEffect, useState, useCallback, MouseEventHandler } from 'react';
import Image from 'next/image';
import { FullMessageType } from '@/app/libs/types';
import { BiCommentError } from 'react-icons/bi';
import { AiFillFile, AiFillFileExclamation } from 'react-icons/ai';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { createDecipheriv } from 'crypto';
import { IoPlayCircleOutline } from 'react-icons/io5';
import VideoModal from './VideoModal';

type MessageFileType = 'image' | 'video' | 'audio' | 'file' | 'text';

interface MessageBodyProps {
    data: FullMessageType;
    conversationKey: Buffer | null;
}

const MessageBody: React.FC<MessageBodyProps> = ({
    data,
    conversationKey,
}) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    let messageFileType: MessageFileType = 'text'
    if (data.image) {
        messageFileType = 'file'
        if (data.image.match(/\.(png|jpg|jpeg)$/)) {
            messageFileType = 'image'
        }
        if (data.image.match(/\.mp4$/)) {
            messageFileType = 'video'
        }
        if (data.image.match(/\.mp3$/)) {
            messageFileType = 'audio'
        }
        if (data.error) {
            messageFileType = 'file'
        }
    }

    const getFile = useCallback(async () => {
        const res = await axios.get('/api/message/' + data.id);
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

    const onDownload: MouseEventHandler<SVGElement> = async (e) => {
        e.stopPropagation()
        try {
            saveAs(await getFile())
        } catch (error) {
            console.error(error)
        }
    }

    const onVideo: MouseEventHandler<SVGElement> = async (e) => {
        e.stopPropagation()
        setIsVideoOpen(true)
        if (fileUrl) {
            return
        }
        try {
            const file = await getFile()
            const fileUrl = URL.createObjectURL(file)
            setFileUrl(fileUrl);
        } catch (error) {
            console.error(error)
            setIsVideoOpen(false)
        }
    }

    const onVideoClose = () => {
        setIsVideoOpen(false)
    }

    useEffect(() => {
        if (!fileUrl && (messageFileType === 'image' || messageFileType === 'audio')) {
            getFile().then((file) => {
                const fileUrl = URL.createObjectURL(file)
                setFileUrl(fileUrl);
            }).catch((error) => { console.error(error) });
        }

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        }
    }, [data.image, fileUrl, getFile, messageFileType])

    return (
        <>
            <VideoModal isOpen={isVideoOpen} url={fileUrl} onClose={onVideoClose} />
            {
                data.image && data.error &&
                <AiFillFileExclamation className='w-6 h-6 text-gray-600' />
            }
            {
                messageFileType === 'image' &&
                <div className='w-[300px] h-[300px] mb-2'>
                    {fileUrl &&
                        <Image
                            alt='Image'
                            width={300}
                            height={300}
                            src={fileUrl}
                            className='object-cover'
                        />
                    }
                </div>
            }

            {
                data.image && !data.error &&
                <div className='flex items-center'>
                    <AiFillFile className='mr-2 w-6 h-6 text-gray-600 cursor-pointer' onClick={onDownload} />
                    {
                        messageFileType === 'video' &&
                        <IoPlayCircleOutline className='mr-2 w-6 h-6 text-gray-600 cursor-pointer' onClick={onVideo} />
                    }
                    <span>{data.image}</span>
                </div>
            }
            {
                !data.image &&
                <div>{data.error ? (<BiCommentError className='w-6 h-6 text-gray-600' />) : data.body}</div>
            }

        </>
    );
}

export default MessageBody;
