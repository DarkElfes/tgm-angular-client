import { Injectable, computed, inject, signal } from '@angular/core';
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import {
    Disposable,
    getHubProxyFactory,
    getReceiverRegister,
} from '../../types/generated/TypedSignalR.Client';
import { Account, Chat, ChatPosition, Message } from '../../types';
import {
    ITgChatingClient,
    ITgChatingHub,
} from '../../types/generated/TypedSignalR.Client/tgm.Api.TgAccounts.Hubs.Chating';
import {
    AccountDTO,
    ChatDTO,
    ChatFolderInfoDTO,
    ChatPositionDTO,
    MessageDTO,
} from '../../types/generated/tgm.Application.TgAccounts.Features.Chating.DTOs';
import { TgServiceState } from '../../types/generated/tgm.Domain.TgAccounts.Enums';
import { ChatingStore } from './chating.store';

@Injectable()
export class ChatingService {
    private readonly _chatingStore = inject(ChatingStore);

    private _connection: HubConnection | null = null;
    private _hubPorxy: ITgChatingHub | null = null;
    private _subscription: Disposable | null = null;

    private readonly _receiver: ITgChatingClient = {
        receiveErrorMessageAsync: async (
            errorMessage: string,
        ): Promise<void> => {
            // throw new Error('Function not implemented.');
            console.error(`Received error: ${errorMessage}`);
        },
        receiveAccountAsync: async (account: AccountDTO): Promise<void> => {
            this._chatingStore.updateAccount(account);
        },
        receiveChatFoldersAsync: async (
            accountId: string,
            chatFolderInfoDTOs: ChatFolderInfoDTO[],
        ): Promise<void> => {
            this._chatingStore.updateChatFolders(accountId, chatFolderInfoDTOs);
        },
        receiveChatAsync: async (
            accountId: string,
            chat: ChatDTO,
        ): Promise<void> => {
            this._chatingStore.updateChat(accountId, chat);
        },
        receiveChatPositionAsync: async (
            accountId: string,
            chatId: number,
            chatPosition: ChatPositionDTO,
        ): Promise<void> => {
            this._chatingStore.updateChatPosition(
                accountId,
                chatId,
                chatPosition,
            );
        },
        receiveChatPhotoAsync: async (
            accoundId: string,
            chatId: number,
            photoData: string,
        ): Promise<void> => {
            this._chatingStore.updateChatPhoto(accoundId, chatId, photoData);
        },
        receiveChatLastMessageAsync: async (
            accountId: string,
            chatId: number,
            lastMessage: MessageDTO,
        ): Promise<void> => {
            this._chatingStore.updateLastMessage(
                accountId,
                chatId,
                lastMessage,
            );
        },
        receiveTgServiceStateAsync: async (
            accountId: string,
            serviceState: TgServiceState,
        ): Promise<void> => {
            this._chatingStore.upadteTgServiceState(accountId, serviceState);
        },

        //Messages
        receiveNewMessagesAsync: async (
            accountId: string,
            chatId: number,
            message: MessageDTO,
        ) => {
            this._chatingStore.updateNewMessage(accountId, chatId, message);
        },
        receiveDeletedMessagesAsync: async (
            accountId: string,
            chatId: number,
            messageIds: number[],
        ) => {
            this._chatingStore.updateDeletedMessages(
                accountId,
                chatId,
                messageIds,
            );
        },
        receiveMessageSendSucceeded: async (
            accountId: string,
            chatId: number,
            oldMessageId: number,
            newMessageId: number,
        ): Promise<void> => {
            this._chatingStore.updateMessageSendSucceeded(
                accountId,
                chatId,
                oldMessageId,
                newMessageId,
            );
        },

        connectionReceiveLoadedMessagesAsync: async (
            accountId: string,
            chatId: number,
            messages: MessageDTO[],
        ) => {
            this._chatingStore.updateLoadedMessages(
                accountId,
                chatId,
                messages,
            );
        },
    };

    async connectAsync() {
        try {
            await this._connection?.stop();

            this._connection = new HubConnectionBuilder()
                .withUrl(
                    `${environment.apiUrl}/${environment.tgChatingHubEndpoint}`,
                )
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();

            this._hubPorxy = getHubProxyFactory('ITgChatingHub').createHubProxy(
                this._connection,
            );

            this._subscription = getReceiverRegister(
                'ITgChatingClient',
            ).register(this._connection, this._receiver);

            await this._connection.start();
            await this._hubPorxy.connectToChatingFlowAsync();

            console.log('Succesfully connected to chating flow');
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
            console.error(
                `Failure disconnect from chating hub: ${e}\n Connection state: ${this._connection?.state ?? 'null'}`,
            );
        }
    }

    async getMessagesAsync(
        accountId: string,
        chatId: number,
        fromMessageId: number,
        limit: number,
    ) {
        await this._hubPorxy?.getMessagesAsync(
            accountId,
            chatId,
            fromMessageId,
            limit,
        );
    }
    async sendMessageAsync(
        accountId: string,
        chatId: number,
        messageContent: string,
    ) {
        await this._hubPorxy?.sendMessageAsync(
            accountId,
            chatId,
            messageContent,
        );
    }
    async deleteMessagesAsync(
        accoundId: string,
        chatId: number,
        messageIds: number[],
        revoke: boolean = false,
    ) {
        await this._hubPorxy?.deleteMessagesAsync(
            accoundId,
            chatId,
            messageIds,
            revoke,
        );
    }

    async responseWithAIAsync(
        accoundId: string,
        chatId: number,
        message: Message,
    ) {
        await this._hubPorxy?.responseWithAIAsync(
            accoundId,
            chatId,
            message as MessageDTO,
        );
    }
}
