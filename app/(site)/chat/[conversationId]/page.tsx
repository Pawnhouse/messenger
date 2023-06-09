import Header from './components/Header';
import getConversationById from '@/app/actions/getConversationById';
import getMessages from '@/app/actions/getMessages';

import EmptyState from '@/app/components/EmptyState';
import Body from './components/Body';
import Form from './components/Form';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
    conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
    const conversation = await getConversationById(+params.conversationId);
    const messages = await getMessages(+params.conversationId);
    const currentUser = await getCurrentUser();

    if (!conversation || !currentUser) {
        return (
            <div className='flex-grow'>
                <EmptyState />
            </div>
        )
    }
    let { publicKey } = conversation.users.filter((user) => user.id !== currentUser?.id)[0]
    if (conversation.isGroup) {
        publicKey = conversation.publicKey
    }
    const partialKey = conversation.keys.find((key) => key.receiverId === currentUser.id)
    return (
        <div className='flex-grow'>
            <div className='h-full flex flex-col'>
                <Header conversation={conversation} />
                <Body initialMessages={messages} publicKey={publicKey} userId={currentUser.id} conversationPartialKey={partialKey} conversationId={conversation.id} />
                <Form publicKey={publicKey} userId={currentUser.id} conversationPartialKey={partialKey} />
            </div>
        </div>
    );
}

export default ChatId;