'use client';

import { useState } from 'react'
import { Conversation, ConversationKey, User } from '@prisma/client';
import Body from './Body';
import Form from './Form';
import { FullMessageType } from '@/app/libs/types';
import Header from './Header';
import SearchBar from './SearchBar';

interface ChatLayoutProps {
    conversation: Conversation & {
        users: User[]
    }
    initialMessages: FullMessageType[];
    publicKey: string | null;
    userId: string;
    conversationPartialKey?: ConversationKey;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ conversation, initialMessages, publicKey, userId, conversationPartialKey }) => {
    const [isSearch, setIsSearch] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    return (
        <div className='flex-grow'>
            <div className='h-full flex flex-col'>
                <Header
                    conversation={conversation}
                    isSearch={isSearch}
                    setIsSearch={setIsSearch}
                    setSearchValue={setSearchValue}
                />
                <Body
                    initialMessages={initialMessages}
                    publicKey={publicKey} userId={userId}
                    conversationPartialKey={conversationPartialKey}
                    conversationId={conversation.id}
                    searchValue={searchValue}
                />
                <div
                    className='
                    py-4 
                    px-4 
                    bg-white 
                    border-t 
                    w-full
                '
                >
                    {
                        isSearch ?
                            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} /> :
                            <Form publicKey={publicKey} userId={userId} conversationPartialKey={conversationPartialKey} />
                    }

                </div>
            </div>
        </div>

    );
}

export default ChatLayout;
