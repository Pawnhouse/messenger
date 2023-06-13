import getCurrentUser from '../actions/getCurrentUser';
import DesktopSidebar from '../components/sidebar/DesktopSidebar';
import SidebarLayout from '../components/sidebar/SidebarLayout';

export default async function MainLayout(props: {
    children: React.ReactNode
    sidebar: React.ReactNode
}) {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    return (
        <>
            <DesktopSidebar user={user} />
            <SidebarLayout>
                {props.sidebar}
            </SidebarLayout>
            {props.children}
        </>
    )
}
