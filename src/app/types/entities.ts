import { TgServiceState } from "./generated/tgm.Domain.TgAccounts.Enums";

export type Account = {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName?: string;
    serviceState: TgServiceState;
    chatFolders: ChatFolderInfo[]
    chats: Chat[];
}

export type ChatFolderInfo = {
    id: number;
    name: string;
}

export type Chat = {
    id: number;
    title: string;
    lastMessage?: Message;
    messages: Message[];
    photoData?: Uint8Array;
    positions: ChatPosition[];
    hasMoreMessagesForLoading: boolean;
}

export type Message = {
    id: number;
    content: string;
    date: number;
    isOutgoing: boolean;
    isPending: boolean;
}

export type ChatPosition = {
    chatFolderId? : number,
    type: string,
    order: number,
}