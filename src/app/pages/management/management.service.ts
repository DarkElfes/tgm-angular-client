import { Injectable, inject, signal } from '@angular/core';
import { Account } from '../../types';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import {
    Disposable,
    getHubProxyFactory,
    getReceiverRegister,
} from '../../types/generated/TypedSignalR.Client';
import { environment } from '../../../environments/environment';
import {
    ITgManagementClient,
    ITgManagementHub,
} from '../../types/generated/TypedSignalR.Client/tgm.Api.TgAccounts.Hubs.Management';
import { TgServiceState } from '../../types/generated/tgm.Domain.TgAccounts.Enums';

@Injectable({
    providedIn: 'root',
})
export class ManagementService {
    private readonly _httpClient = inject(HttpClient);

    private _connection: HubConnection | null = null;
    private _hubPorxy: ITgManagementHub | null = null;
    private _subscription: Disposable | null = null;

    public readonly accounts = signal<Account[]>([]);
    public readonly isLoading = signal<boolean>(true);
    public readonly isLoaded = signal<boolean>(false);

    public readonly qrData = signal<{
        qrString: string;
        qrExpire: number;
    } | null>(null);
    public readonly isSucessfullyAdded = signal<boolean>(false);
    private intervalId = signal<number | null>(null);

    private readonly _receiver: ITgManagementClient = {
        receiveErrorMessageAsync: async (
            errorMessage: string,
        ): Promise<void> => {
            console.error(
                `Error message from ManagementServiceConnection: ${errorMessage}`,
            );
        },
        receiveTgServiceStateAsync: async (
            accountId: string,
            serviceState: TgServiceState,
        ): Promise<void> => {
            this.accounts.update((prev) =>
                prev.map((a) =>
                    a.id === accountId
                        ? { ...a, serviceState: serviceState }
                        : a,
                ),
            );
        },
        receiveQrStringAsync: async (qrString: string): Promise<void> => {
            console.log("qrstring received");
            this.clearQrInterval();

            this.qrData.set({
                qrString: qrString,
                qrExpire: 29,
            });

            const id = setInterval(() => {
                this.qrData.update((prev) => {
                    if (!prev || prev.qrExpire <= 0) {
                        console.log("interval cleared inside update");
                        this.clearQrInterval(); // зупиняємо, коли дійшли до 0
                        return null; // або { qrString: '', qrExpire: 0 }
                    }

                    return {
                        ...prev,
                        qrExpire: prev.qrExpire - 1, // іммутабельно зменшуємо
                    };
                });
            }, 1000);

            this.intervalId.set(id);
            console.log(`set interval id: ${id}`);
        },
        receiveConfirmSuccessfulSignInAsync: async (
            isSuccess: boolean,
        ): Promise<void> => {
            this.isSucessfullyAdded.set(isSuccess);
        },
    };

    getAccounts() {
        this._httpClient
            .get<Account[]>(`${environment.apiUrl}/tg/accounts`)
            .subscribe((accounts) => {
                this.accounts.set(accounts);
                this.isLoading.set(false);
                this.isLoaded.set(true);
            });
    }

    async startMonitoringAsync() {
        try {
            await this._connection?.stop();

            this._connection = new HubConnectionBuilder()
                .withUrl(`${environment.apiUrl}/${environment.tgManagementHubEndpoint}`)
                .withAutomaticReconnect()
                .build();

            this._hubPorxy = getHubProxyFactory(
                'ITgManagementHub',
            ).createHubProxy(this._connection);

            this._subscription = getReceiverRegister(
                'ITgManagementClient',
            ).register(this._connection, this._receiver);

            await this._connection.start();
            await this._hubPorxy?.connectToManagementFlowAsync();
        } catch (e) {
            console.error(`Failure connect to monitoring hub: ${e}`);
        }
    }

    async stopMonitoringAsync() {
        try {
            await this._connection?.stop();
            this._subscription?.dispose();

            this._connection = this._hubPorxy = this._subscription = null;
        } catch (e) {
            console.error(
                `Failure disconnect from monitoring hub: ${e}\n Connection state: ${this._connection?.state ?? 'null'}`,
            );
        }
    }

    async connectToAddingFlowAsync() {
        await this._hubPorxy?.connectToAddingFlowAsync();
        console.log('connected to adding flow');
    }

    async disconnectFromAddingFlowAsync() {
        await this._hubPorxy?.disconnectFromAddingFlowAsync();
        this.qrData.set(null);
        this.isSucessfullyAdded.set(false);
        this.clearQrInterval();

        console.log('disconnected from adding flow');
    }

    private clearQrInterval() {
        let id = this.intervalId();
        if (id !== null) {
            clearInterval(id);
            console.log(`clear interval id: ${id}`);
            this.intervalId.set(null);
        }
    }
}
