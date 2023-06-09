import Header from '../components/Header';
import getConversations from '../actions/getConversations';
import getCurrentUser from '../actions/getCurrentUser';
import MobileFooter from '../components/sidebar/MobileFooter';
import Sidebar from '../components/sidebar/Sidebar';
import ConversationsSidebar from './components/ConversationsSidebar';
import getUsers from '../actions/getUsers';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const conversations = await getConversations();
    const users = await getUsers();
    if (!user) {
        return null;
    }
    return (
        <>
            {/* @ts-expect-error async component*/}
            <Header />
            <main className='flex-grow flex justify-items-stretch h-0'>
                {/* @ts-expect-error async component*/}
                <Sidebar>
                    <ConversationsSidebar initialItems={conversations} users={users} currentUser={user} />
                    {children}
                </Sidebar>
            </main>
            <MobileFooter user={user} />
        </>
    )
}
