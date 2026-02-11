import { Injectable, inject, signal } from "@angular/core";
import { Account } from "../../types";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: "root"
})
export class ManagementService {
    private _httpClient = inject(HttpClient);

    public readonly accounts = signal<Account[]>([]);

    getAccounts() {
        this._httpClient.get<Account[]>("/td/accounts").subscribe(accounts => {
            this.accounts.set(accounts);
        })
    }

}