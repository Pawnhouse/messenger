import clsx from 'clsx';
import EmptyState from '../components/EmptyState';

export default function App() {
  return (
    <div className={clsx('hidden lg:block flex-grow')}>
      <EmptyState />
    </div>
  )
}

