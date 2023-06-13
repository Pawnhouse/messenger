import getConversationById from '@/app/actions/getConversationById';
import getMessages from '@/app/actions/getMessages';
import EmptyState from '@/app/components/EmptyState';
import getCurrentUser from '@/app/actions/getCurrentUser';
import ChatLayout from './components/ChatLayout';

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
        <ChatLayout conversation={conversation} initialMessages={messages} userId={currentUser.id} conversationPartialKey={partialKey} publicKey={publicKey} />
    );
}

export default ChatId;