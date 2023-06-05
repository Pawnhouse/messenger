import getCurrentUser from '../actions/getCurrentUser';
import EmptyState from '../components/EmptyState';
import ProfileForm from './ProfileForm';


export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <>
      <div className='px-3'>
        <div className='
        text-2xl 
        font-bold 
        text-neutral-800 
        py-4
      '>
          Profile
        </div>
        <ProfileForm user={user} />
      </div>
      <div className='hidden flex-grow lg:block'>
        <EmptyState />
      </div>

    </>
  )
}
