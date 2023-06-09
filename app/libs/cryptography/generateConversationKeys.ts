import { User } from '@prisma/client';
import { createCipheriv, createECDH, randomBytes } from 'crypto';

export default function generateConversationKeys(users: User[], privateKey: string | null) {
    if (!privateKey) {
        return
    }
    const key = randomBytes(32)
    const iv = randomBytes(16)
    const conversationKeys: {
        value: string;
        receiverId: string;
        iv: string;
    }[] = []

    try {
        users.forEach(user => {
            const keyObj = createECDH('secp256k1'); 
            keyObj.setPrivateKey(Buffer.from(privateKey, 'base64')); 
            const commonKey = keyObj.computeSecret(user.publicKey || '', 'base64'); 

            const cipher = createCipheriv('aes-256-cbc', commonKey, iv);
            let cipherMessage = cipher.update(key);
            cipherMessage = Buffer.concat([cipherMessage, cipher.final()]);
            const ConversationKey = { iv: iv.toString('base64'), receiverId: user.id, value: cipherMessage.toString('base64') }
            conversationKeys.push(ConversationKey)
        });
    } catch (e) { 
        return
    }

    return conversationKeys
}