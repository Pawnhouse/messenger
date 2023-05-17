import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';
import { FullConversationType } from '../libs/types';
import { useState, useEffect } from 'react';
import { ECDH, createCipheriv, createECDH, randomBytes } from 'crypto';

const useConversationKey = ({ publicKey, userId }: { publicKey: string | null, userId: string }) => {
    const [conversationKey, setConversationKey] = useState<Buffer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const privateKey = localStorage.getItem('ECDH_Private_Key_' + userId);
      if(!privateKey || !publicKey){
        setIsLoading(false);
        return;
      }
      try {
        const keyObj = createECDH('secp256k1');
        keyObj.setPrivateKey(privateKey, 'base64');
        setConversationKey(keyObj.computeSecret(publicKey, 'base64'));
      } finally {
        setIsLoading(false);
        
      }
    }, [publicKey, userId])
    return {conversationKey, isLoading}
};

export default useConversationKey;