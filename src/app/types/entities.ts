import { TdClientState } from "./enums";

export type Account = {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName?: string;
    clientState: TdClientState;
    chatFolders: ChatFolderInfo[]
    chats: Chat[];
}

export type ChatFolderInfo = {
    id: number;
    name: string;
}

export type Chat = {
    id: string;
    title: string;
    messages: Message[];
    photoData: Uint8Array;
    positions: ChatPosition[]
}

export type Message = {
    id: string;
    content: string;
    date: number;
    isOutgoing: boolean;
}

export type ChatPosition = {
    list: string,
    order: number,
}