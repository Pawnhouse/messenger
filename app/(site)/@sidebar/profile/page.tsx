import getCurrentUser from '@/app/actions/getCurrentUser';
import ProfileForm from './ProfileForm';

export default async function SidebarPage() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }

    return (
        <ProfileForm user={user} />
    )
}
