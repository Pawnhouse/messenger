import { FieldValues } from 'react-hook-form';
import { createCipheriv, randomBytes } from 'crypto';


export default async function encryptMessage(data: FieldValues, conversationKey: Buffer | null) {
    if (conversationKey) {
        const iv = randomBytes(16);
        const file = data.file[0] as File | null
        if (file) {
            let cipher = createCipheriv('aes-256-cbc', conversationKey, iv);
            let cipherName = cipher.update(file.name, 'utf-8', 'hex');
            cipherName += cipher.final('hex');

            const ab = await file.arrayBuffer();
            const buffer = new Buffer(ab.byteLength);
            const view = new Uint8Array(ab);
            for (let i = 0; i < buffer.length; ++i) {
                buffer[i] = view[i];
            }
            cipher = createCipheriv('aes-256-cbc', conversationKey, iv);
            let cipherFile = cipher.update(buffer);
            cipherFile = Buffer.concat([cipherFile, cipher.final()])
            console.log('first buffer: ', cipherFile)
            data = { ...data, file: new File([cipherFile], cipherName), iv: iv.toString('base64') };

        } else {
            const cipher = createCipheriv('aes-256-cbc', conversationKey, iv);
            let cipherMessage = cipher.update(data.message, 'utf-8', 'base64');
            cipherMessage += cipher.final('base64');
            data = { ...data, message: cipherMessage, iv: iv.toString('base64') }
        }
    } console.log(data);
    return data;
}