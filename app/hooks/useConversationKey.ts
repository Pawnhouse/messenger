import { useState, useEffect } from 'react';
import { createDecipheriv, createECDH } from 'crypto';
import { ConversationKey } from '@prisma/client';

const useConversationKey = (publicKey: string | null, userId: string, conversationPartialKey?: ConversationKey) => {
  const [conversationKey, setConversationKey] = useState<Buffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const privateKey = localStorage.getItem('ECDH_Private_Key_' + userId);
    if (!privateKey || !publicKey) {
      setIsLoading(false);
      return;
    }
    
    try {
      const keyObj = createECDH('secp256k1');
      keyObj.setPrivateKey(privateKey, 'base64'); 
      const commonKey = keyObj.computeSecret(publicKey, 'base64'); 

      if(conversationPartialKey) {
        const decipher = createDecipheriv('aes-256-cbc', commonKey, Buffer.from(conversationPartialKey.iv, 'base64'));
        let decryptedData = decipher.update(conversationPartialKey.value, 'base64');
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);   
        setConversationKey(decryptedData); 
      } else {
        setConversationKey(commonKey);
      }
    } catch {
      // catch decipher error
    } finally {
      setIsLoading(false);
    }
  }, [conversationPartialKey, publicKey, userId])
  return { conversationKey, isLoading }
};

export default useConversationKey;