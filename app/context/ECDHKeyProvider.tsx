'use client';

import { User } from '@prisma/client';
import axios from 'axios';
import { createECDH } from 'crypto';
import { useEffect } from 'react';


const ECDHKeyProvider = ({ user }: { user: User | null }) => {
  useEffect(() => {
    if (user) {
      const privatekey = localStorage.getItem('ECDH_Private_Key_' + user.id);
      if (!privatekey) {
        const newKey = createECDH('secp256k1');
        newKey.generateKeys();
        axios.post('/api/public-key', { publicKey: newKey.getPublicKey('base64') }).then(() => {
          localStorage.setItem('ECDH_Private_Key_' + user.id, newKey.getPrivateKey('base64'))
        })
      }
    }
  }, [user])

  return (
    <></>
  );
}

export default ECDHKeyProvider;