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
    messages: Message[];
    photoData: Uint8Array;
    positions: ChatPosition[];
}

export type Message = {
    id: string;
    content: string;
    date: number;
    isOutgoing: boolean;
}

export type ChatPosition = {
    chatFolderId? : string,
    type: string,
    order: number,
}