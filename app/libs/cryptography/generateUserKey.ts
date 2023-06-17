import { User } from '@prisma/client';
import axios from 'axios';
import { createECDH } from 'crypto';

export default function generateUserKey(user: User, callback: () => void) {
    const newKey = createECDH('secp256k1');
    newKey.generateKeys();
    axios.post('/api/public-key', { publicKey: newKey.getPublicKey('base64') }).then(() => {
        localStorage.setItem('ECDH_Private_Key_' + user.id, newKey.getPrivateKey('base64'))
        callback();
    })
}