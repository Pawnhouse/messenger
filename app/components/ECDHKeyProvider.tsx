'use client';

import { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateKeyModal from './modal/PrivateKeyModal';
import generateUserKey from '../libs/cryptography/generateUserKey';

const ECDHKeyProvider = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const privatekey = localStorage.getItem('ECDH_Private_Key_' + user.id);
      if (!user.publicKey) {
        generateUserKey(user, router.refresh)
      } else if (!privatekey) {
        setIsOpen(true);
      }
    }
  }, [router, user])

  return (
    <PrivateKeyModal isOpen={isOpen} currentUser={user} onClose={() => setIsOpen(false)} />
  )
}

export default ECDHKeyProvider;