import DesktopSidebar from './DesktopSidebar';
import getCurrentUser from '../../actions/getCurrentUser';
import MobileFooter from './MobileFooter';


async function Sidebar({ children }: {
    children: React.ReactNode,
}) {
    const user = await getCurrentUser();
    return (
        <>
            <DesktopSidebar user={user} />
            {children}

        </>


    )
}

export default Sidebar;