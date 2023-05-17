import Header from '../Header';
import getCurrentUser from '../actions/getCurrentUser';
import getUsers from '../actions/getUser';
import MobileFooter from '../components/sidebar/MobileFooter';
import Sidebar from '../components/sidebar/Sidebar';
import UserSidebar from './components/UserSidebar';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    const users = await getUsers();
    return (
        <>
            {/* @ts-expect-error */}
            <Header />
            <main className='flex-grow flex justify-items-stretch'>
                <UserSidebar items={users}/>
                {/* @ts-expect-error */}
                <Sidebar>
                    {children}
                </Sidebar>
            </main>
            <MobileFooter user={user}/>
        </>
    )
}
