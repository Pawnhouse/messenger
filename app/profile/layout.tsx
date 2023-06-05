import Header from '../components/Header';
import getCurrentUser from '../actions/getCurrentUser';
import MobileFooter from '../components/sidebar/MobileFooter';
import Sidebar from '../components/sidebar/Sidebar';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    return (
        <>
            {/* @ts-expect-error async compoent*/}
            <Header />
            <main className='flex-grow flex justify-items-stretch'>
                {/* @ts-expect-error async compoent*/}
                <Sidebar>
                    {children}
                </Sidebar>
            </main>
            <MobileFooter user={user}/>
        </>
    )
}
