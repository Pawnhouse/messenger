import { createDecipheriv } from 'crypto';
import { FullMessageType } from './types';

function decryptMessages(isLoading: boolean, messages: FullMessageType[], conversationKey: Buffer | null): FullMessageType[] {
    let decryptedMessages;
    if (isLoading) {
        decryptedMessages = messages.map(message => ({ ...message, body: '' }));
    } else if (conversationKey) {
        decryptedMessages = messages.map(message => {
            message = { ...message }

            if (!message.iv) {
                return message;
            }
            try {
                let decryptedData;

                if (message.body) {
                    const decipher = createDecipheriv('aes-256-cbc', conversationKey, Buffer.from(message.iv, 'base64'));
                    decryptedData = decipher.update(message.body, 'base64', 'utf-8');
                    decryptedData += decipher.final('utf-8');
                    message.body = decryptedData;
                }
                if (message.iv && message.image) {
                    const decipher = createDecipheriv('aes-256-cbc', conversationKey, Buffer.from(message.iv, 'base64'));console.log('start decoding');
                    decryptedData = decipher.update(message.image, 'hex', 'utf-8'); console.log(123);
                    decryptedData += decipher.final('utf-8');console.log(decryptedData);
                    message.image = decryptedData;
                }
                return message;
            } catch { console.log(message);
                return { ...message, error: true };
            }
        });
    } else {
        decryptedMessages = messages;
    }
    return decryptedMessages;
}

export default decryptMessages