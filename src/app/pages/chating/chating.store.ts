import {
    patchState,
    signalStore,
    type,
    withMethods,
    withState,
} from '@ngrx/signals';
import { Account, Chat, ChatPosition, Message } from '../../types';
import {
    AccountDTO,
    ChatDTO,
    ChatFolderInfoDTO,
    ChatPositionDTO,
    MessageDTO,
} from '../../types/generated/tgm.Application.TgAccounts.Features.Chating.DTOs';
import { TgServiceState } from '../../types/generated/tgm.Domain.TgAccounts.Enums';

type ChatingState = {
    accounts: Account[];
};

const initialState: ChatingState = {
    accounts: [],
};

export const ChatingStore = signalStore(
    withState(initialState),

    withMethods((store) => ({
        updateAccount(account: AccountDTO) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: [
                        ...state.accounts,
                        {
                            id: account.id,
                            firstName: account.firstName,
                            phoneNumber: account.phoneNumber,
                            serviceState: account.serviceState,
                            chatFolders: [],
                            chats: [],
                        },
                    ].sort((a, b) => a.firstName.localeCompare(b.firstName)),
                }),
            );
        },
        updateChatFolders(
            accountId: string,
            chatFolderInfoDtos: ChatFolderInfoDTO[],
        ) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accountId,
                        (a): Account => ({
                            ...a,
                            chatFolders: chatFolderInfoDtos,
                        }),
                    ),
                }),
            );
        },
        updateChat(accoundId: string, chat: ChatDTO) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accoundId,
                        (a): Account => ({
                            ...a,
                            chats: (() => {
                                let chatExist = a.chats.find(
                                    (c) => c.id === chat.id,
                                );

                                if (chatExist) {
                                    console.error(
                                        'Received chat that already exist',
                                    );
                                    return a.chats;
                                }

                                return [
                                    ...a.chats,
                                    {
                                        id: chat.id,
                                        title: chat.title,
                                        lastMessage: chat.lastMessage,
                                        photoData: undefined,
                                        messages: [],
                                        hasMoreMessagesForLoading: true,
                                        positions: chat.positions.map(
                                            (p) =>
                                                ({
                                                    chatFolderId:
                                                        p.list.chatFolderId,
                                                    type: p.list.type,
                                                    order: p.order,
                                                }) as ChatPosition,
                                        ),
                                    } as Chat,
                                ];
                            })(),
                        }),
                    ),
                }),
            );
        },
        updateChatPosition(
            accountId: string,
            chatId: number,
            chatPosition: ChatPositionDTO,
        ) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accountId,
                        (a): Account => ({
                            ...a,
                            chats: updateArrayItemById(
                                a.chats,
                                chatId,
                                (c): Chat => ({
                                    ...c,
                                    positions: (() => {
                                        const index = c.positions.findIndex(
                                            (p) =>
                                                p.type ===
                                                    chatPosition.list.type &&
                                                p.chatFolderId ===
                                                    chatPosition.list
                                                        .chatFolderId,
                                        );

                                        if (index != -1) {
                                            return c.positions.map((p, i) =>
                                                i === index
                                                    ? {
                                                          ...p,
                                                          order: chatPosition.order,
                                                      }
                                                    : p,
                                            );
                                        } else {
                                            return [
                                                ...c.positions,
                                                {
                                                    type: chatPosition.list
                                                        .type,
                                                    chatFolderId:
                                                        chatPosition.list
                                                            .chatFolderId,
                                                    order: chatPosition.order,
                                                },
                                            ];
                                        }
                                    })(),
                                }),
                            ),
                        }),
                    ),
                }),
            );
        },
        updateChatPhoto(accountId: string, chatId: number, photoData: string) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accountId,
                        (a): Account => ({
                            ...a,
                            chats: updateArrayItemById(
                                a.chats,
                                chatId,
                                (c): Chat => ({
                                    ...c,
                                    photoData:
                                        photoData as unknown as Uint8Array,
                                }),
                            ),
                        }),
                    ),
                }),
            );
        },
        updateLastMessage(
            accountId: string,
            chatId: number,
            lastMessage: MessageDTO,
        ) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accountId,
                        (a): Account => ({
                            ...a,
                            chats: updateArrayItemById(
                                a.chats,
                                chatId,
                                (c): Chat => ({
                                    ...c,
                                    lastMessage: lastMessage as Message,
                                }),
                            ),
                        }),
                    ),
                }),
            );
        },
        upadteTgServiceState(accoundId: string, serviceState: TgServiceState) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accoundId,
                        (a): Account => ({
                            ...a,
                            serviceState: serviceState,
                        }),
                    ),
                }),
            );
        },

        // Messages
        updateLoadedMessages(
            accoundId: string,
            chatId: number,
            messages: MessageDTO[],
        ) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accoundId,
                        (a): Account => ({
                            ...a,
                            chats: updateArrayItemById(
                                a.chats,
                                chatId,
                                (c): Chat => ({
                                    ...c,
                                    hasMoreMessagesForLoading:
                                        messages.length !== 0,
                                    messages: (() => {
                                        if (messages.length === 0) {
                                            return c.messages;
                                        }

                                        const notExistMessages =
                                            messages.filter(
                                                (m) =>
                                                    !c.messages.find(
                                                        (cm) => cm.id === m.id,
                                                    ),
                                            );

                                        return [
                                            ...c.messages,
                                            ...(notExistMessages as Message[]),
                                        ];
                                    })(),
                                }),
                            ),
                        }),
                    ),
                }),
            );
        },
        updateNewMessage(
            accoundId: string,
            chatId: number,
            message: MessageDTO,
        ) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accoundId,
                        (a): Account => ({
                            ...a,
                            chats: updateArrayItemById(
                                a.chats,
                                chatId,
                                (c): Chat => ({
                                    ...c,
                                    messages: [
                                        message as Message,
                                        ...c.messages,
                                    ],
                                }),
                            ),
                        }),
                    ),
                }),
            );
        },
        updateMessageSendSucceeded(
            accountId: string,
            chatId: number,
            oldMessageId: number,
            newMessageId: number,
        ) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accountId,
                        (a): Account => ({
                            ...a,
                            chats: updateArrayItemById(
                                a.chats,
                                chatId,
                                (c): Chat => ({
                                    ...c,
                                    messages: updateArrayItemById(
                                        c.messages,
                                        oldMessageId,
                                        (m): Message => ({
                                            ...m,
                                            id: newMessageId,
                                            isPending: false,
                                        }),
                                    ),
                                }),
                            ),
                        }),
                    ),
                }),
            );
        },
        updateDeletedMessages(
            accoundId: string,
            chatId: number,
            messageIds: number[],
        ) {
            patchState(
                store,
                (state: ChatingState): { accounts: Account[] } => ({
                    accounts: updateArrayItemById(
                        state.accounts,
                        accoundId,
                        (a): Account => ({
                            ...a,
                            chats: updateArrayItemById(
                                a.chats,
                                chatId,
                                (c): Chat => ({
                                    ...c,
                                    messages: c.messages.filter(
                                        (m) => !messageIds.includes(m.id),
                                    ),
                                }),
                            ),
                        }),
                    ),
                }),
            );
        },
    })),
);

function updateArrayItem<T>(
    array: T[],
    predicate: (item: T) => boolean,
    update: (item: T) => T,
): T[] {
    return array.map((item) =>
        predicate(item) ? { ...item, ...update(item) } : item,
    );
}

function updateArrayItemById<T extends { id: string | number }>(
    array: T[],
    id: T['id'],
    update: (item: T) => T,
): T[] {
    return updateArrayItem(array, (item) => item.id === id, update);
}
