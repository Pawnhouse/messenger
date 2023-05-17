'use client';

import clsx from 'clsx';
import useConversation from '../hooks/useConversation';
import EmptyState from '../components/EmptyState';

export default function App() {
  const { isOpen } = useConversation();

  return (
    <div className={clsx('lg:block flex-grow', isOpen ? 'block' : 'hidden')}>
      <EmptyState />
    </div>
  )
}

