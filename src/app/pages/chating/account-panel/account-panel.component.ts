import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    input,
} from '@angular/core';

import { Account } from '../../../types';

import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

import { ChatNotSelectedEmptyComponent } from './selected-chat-panel/chat-not-selected-empty/chat-not-selected-empty.component';
import { StatusCellComponent } from '../../management/components/accounts-table/status-cell/status-cell.component';
import { AccountChatPanelComponent } from './account-chat-panel/account-chat-panel.component';
import { SelectedChatPanelComponent } from './selected-chat-panel/selected-chat-panel.component';

import { ChatingService } from '../chating.service';
import { AccountPanelStore } from './account-panel.store';

@Component({
    selector: 'app-account-panel',
    imports: [
        HlmCardImports,
        HlmEmptyImports,
        StatusCellComponent,
        AccountChatPanelComponent,
        SelectedChatPanelComponent,
    ],
    providers: [AccountPanelStore],
    templateUrl: './account-panel.component.html',
    styles: `
        :host {
            flex-grow: 1;
            display: grid;
            grid-template-rows: auto 1fr;
            grid-template-columns: auto 1fr;
            min-height: 0;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPanelComponent {
    protected chatingService = inject(ChatingService);
    protected accountStore = inject(AccountPanelStore);

    public account = input.required<Account>();
    protected curChat = this.accountStore.selectedChatId;

    protected readonly accountName = computed(() => {
        const account = this.account();

        return `${account.firstName}${account.lastName ? ` ${account.lastName}` : ''}`;
    });

    constructor() {
        effect(() => this.accountStore.updateAccount(this.account()));
    }
}
