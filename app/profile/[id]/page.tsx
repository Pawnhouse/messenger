import EmptyState from '@/app/components/EmptyState';
import getUserById from '@/app/actions/getUserById';

interface IParams {
    userId: string;
}

const UserShowPage = async ({ params }: { params: IParams }) => {
    const user = await getUserById(params.userId);

    if (!user) {
        return (
            <div className='flex-grow'>
                <EmptyState />
            </div>
        )
    }

    return (
        <div className='flex-grow'>
            user info page
        </div>
    );
}

export default UserShowPage;