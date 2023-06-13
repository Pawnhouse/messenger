import getCurrentUser from '@/app/actions/getCurrentUser';
import getUsers from '@/app/actions/getUsers';
import UserSidebar from './components/UserSidebar';

export default async function SidebarPage() {
    const user = await getCurrentUser();
    const users = await getUsers();
    if (!user) {
        return null;
    }
    return (
        <UserSidebar items={users} currentUser={user} />
    )
}
