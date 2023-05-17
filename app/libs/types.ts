import {  Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User,
  error?: boolean,
};

export type FullConversationType = Conversation & { 
  users: User[]; 
  messages: FullMessageType[]
};