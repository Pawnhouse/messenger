import Header from '../components/Header';
import getCurrentUser from '../actions/getCurrentUser';
import getUsers from '../actions/getUsers';
import MobileFooter from '../components/sidebar/MobileFooter';
import Sidebar from '../components/sidebar/Sidebar';
import UserSidebar from './components/UserSidebar';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const users = await getUsers();
    return (
        <>
            {/* @ts-expect-error async compoent*/}
            <Header />
            <main className='flex-grow flex justify-items-stretch'>
                {/* @ts-expect-error async compoent*/}
                <Sidebar>
                    <UserSidebar items={users} currentUser={user} />
                    {children}
                </Sidebar>
            </main>
            <MobileFooter user={user} />
        </>
    )
}
