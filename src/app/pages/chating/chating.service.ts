import { Injectable, signal } from "@angular/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { environment } from "../../../environments/environment";
import { Disposable, getHubProxyFactory, getReceiverRegister } from "../../types/generated/TypedSignalR.Client";
import { Account, Chat, ChatPosition } from "../../types";
import { ITgChatingClient, ITgChatingHub } from "../../types/generated/TypedSignalR.Client/tgm.Api.TgAccounts.Hubs.Chating";
import { AccountDTO, ChatDTO, ChatFolderInfoDTO, ChatPositionDTO, MessageDTO } from "../../types/generated/tgm.Application.TgAccounts.DTOs";
import { TgServiceState } from "../../types/generated/tgm.Domain.TgAccounts.Enums";

@Injectable({
    providedIn: "root"
})
export class ChatingService {
    private readonly _chatingHubUrl = "tdclienthub";
    private _connection: HubConnection | null = null;
    private _hubPorxy: ITgChatingHub | null = null;
    private _subscription: Disposable | null = null;

    public readonly accounts = signal<Account[]>([]);

    private readonly _receiver: ITgChatingClient = {
        receiveErrorMessageAsync: function (errorMessage: string): Promise<void> {
            throw new Error("Function not implemented.");
        },
        receiveChatFoldersAsync: async (accountId: string, chatFolderInfoDTO: ChatFolderInfoDTO[]): Promise<void> => {
            this.accounts.update(prev => prev.map(
                a => a.id == accountId
                    ? {
                        ...a,
                        chatFolders: chatFolderInfoDTO
                    }
                    : a
            ));
        },
        receiveChatAsync: async (accountId: string, chat: ChatDTO): Promise<void> => {
            this.accounts.update(prev => prev.map(
                a => a.id === accountId
                    ? {
                        ...a,
                        chats: [
                            ...a.chats ?? [],
                            chat as unknown as Chat
                        ]
                    }
                    : a
            ));
        },
        receiveChatPositionAsync: async (accountId: string, chatId: number, position: ChatPositionDTO): Promise<void> => {
            this.accounts.update(prev => prev.map(
                a => a.id === accountId
                    ? {
                        ...a,
                        chats: a.chats.map(
                            c => c.id === chatId
                                ? {
                                    ...c,
                                    positions: (() => {

                                        const newPositions = [...c.positions];

                                        let existPosition: ChatPosition | undefined;

                                        // 1. Спочатку шукаємо за chatFolderId (якщо є)
                                        if (position.list.chatFolderId !== undefined) {
                                            existPosition = newPositions.find(
                                                p => p.chatFolderId === position.list.chatFolderId
                                            );
                                        }

                                        // 2. Якщо не знайшли або chatFolderId відсутній — шукаємо за type
                                        if (!existPosition) {
                                            existPosition = newPositions.find(
                                                p => p.type === position.list.type
                                            );
                                        }

                                        if (existPosition) {
                                            // оновлюємо існуючу позицію (мерджимо)
                                            const index = newPositions.indexOf(existPosition);
                                            newPositions[index] = {
                                                ...existPosition,
                                                order: position.order, // або логіка для order
                                            };
                                        } else {
                                            // додаємо нову
                                            newPositions.push({
                                                type: position.list.type,
                                                order: position.order,
                                                chatFolderId: position.list.chatFolderId,
                                                // інші обов'язкові поля, якщо треба
                                            } as ChatPosition);
                                        }
                                        return newPositions;
                                    })()
                                }
                                : c
                        )
                    }
                    : a
            ));
        },
        receiveChatPhotoAsync: async (accoundId: string, chatId: number, photoData: string): Promise<void> => {
            this.accounts.update(prev => prev.map(
                a => a.id === accoundId
                    ? {
                        ...a,
                        chats: a.chats.map(
                            c => c.id === chatId
                                ? {
                                    ...c,
                                    photoData: photoData as unknown as Uint8Array
                                }
                                : c
                        )
                    }
                    : a
            ));
        },
        receiveMessagesAsync: function (accountId: string, chatId: number, messages: MessageDTO[]): Promise<void> {
            throw new Error("Function not implemented.");
        },
        receiveTgServiceStateAsync: async (accountId: string, serviceState: TgServiceState): Promise<void> => {
            this.accounts.update(prev => prev.map(a => a.id === accountId ? { ...a, serviceState: serviceState } : a));
        },
        receiveAccountsAsync: function (accounts: AccountDTO[]): Promise<void> {
            throw new Error("Function not implemented.");
        }
    }

    async connectAsync() {
        try {
            await this._connection?.stop();

            this._connection = new HubConnectionBuilder()
                .withUrl(`${environment.apiUrl}/${this._chatingHubUrl}`)
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            this._hubPorxy = getHubProxyFactory("ITgChatingHub")
                .createHubProxy(this._connection);

            this._subscription = getReceiverRegister("ITgChatingClient")
                .register(this._connection, this._receiver);


            await this._connection.start();
            let accounts = await this._hubPorxy.connectToChatingFlowAsync();
            this.accounts.set(accounts as unknown as Account[]);

            console.log("Succesfully connected to chating flow");

        } catch (e) {
            console.error(`Failure connect to chating hub: ${e}`);
        }
    }

    async disconnectAsync() {
        try {
            await this._connection?.stop();
            this._subscription?.dispose();

            this._connection = this._hubPorxy = this._subscription = null;
        } catch (e) {
            console.error(`Failure disconnect from chating hub: ${e}\n Connection state: ${this._connection?.state ?? "null"}`)
        }
    }

}