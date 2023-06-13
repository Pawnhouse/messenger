import getConversations from '@/app/actions/getConversations';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getUsers from '@/app/actions/getUsers';
import ConversationsSidebar from './components/ConversationsSidebar';

export default async function SidebarPage() {
    const user = await getCurrentUser();
    const conversations = await getConversations();
    const users = await getUsers();
    if (!user) {
        return null;
    }
    return (
        <ConversationsSidebar initialItems={conversations} users={users} currentUser={user} />
    )
}
