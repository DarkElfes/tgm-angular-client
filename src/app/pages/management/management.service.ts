import { Injectable, effect, inject, signal } from "@angular/core";
import { Account } from "../../types";
import { HttpClient } from "@angular/common/http";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Disposable, getHubProxyFactory, getReceiverRegister } from "../../types/generated/TypedSignalR.Client";
import { environment } from "../../../environments/environment";
import { ITgManagementClient, ITgManagementHub } from "../../types/generated/TypedSignalR.Client/tgm.Api.TgAccounts.Hubs.Management";
import { TgServiceState } from "../../types/generated/tgm.Domain.TgAccounts.Enums";

@Injectable({
    providedIn: "root"
})
export class ManagementService {
    private readonly _httpClient = inject(HttpClient);

    private _connection: HubConnection | null = null;
    private _hubPorxy: ITgManagementHub | null = null;
    private _subscription: Disposable | null = null;

    public readonly accounts = signal<Account[]>([]);
    public isLoading = signal<boolean>(true);
    public isLoaded = signal<boolean>(false);
    
    private readonly _receiver: ITgManagementClient = {
        receiveErrorMessageAsync: async (errorMessage: string): Promise<void> => {
            console.error(`Error message from ManagementServiceConnection: ${errorMessage}`);
        },
        receiveTgServiceStateAsync: async (accountId: string, serviceState: TgServiceState): Promise<void> => {
            this.accounts.update(prev => prev.map(a => a.id === accountId ? { ...a, serviceState: serviceState } : a));
        }
    }

    getAccounts() {
        this._httpClient
            .get<Account[]>("/td/accounts")
            .subscribe(accounts => {
                this.accounts.set(accounts);
                this.isLoading.set(false);
                this.isLoaded.set(true);
            })        
    }

    async startMonitoringAsync() {
        try {
            await this._connection?.stop();

            this._connection = new HubConnectionBuilder()
                .withUrl(`${environment.apiUrl}/tdmonitoringhub`)
                .withAutomaticReconnect()
                .build();

            this._hubPorxy = getHubProxyFactory("ITgManagementHub")
                .createHubProxy(this._connection);

            this._subscription = getReceiverRegister("ITgManagementClient")
                .register(this._connection, this._receiver);

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
            console.error(`Failure disconnect from monitoring hub: ${e}\n Connection state: ${this._connection?.state ?? "null"}`)
        }
    }
}