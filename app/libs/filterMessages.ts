import { FullMessageType } from './types';

export default function filterMessages(messages: FullMessageType[], searchValue: string) {
    if (!searchValue) {
        return messages;
    }
    if (searchValue.match(/^@/)) {
        searchValue = searchValue.slice(1)
        return messages.filter(message => message.sender.username === searchValue);
    }
    return messages.filter(message => message.body?.match(searchValue) || message.image?.match(searchValue))
}