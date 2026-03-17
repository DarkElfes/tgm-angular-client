import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';

import { Message } from '../../../../../../types';

import { ChatingService } from '../../../../chating.service';
import { AccountPanelStore } from '../../../account-panel.store';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBotMessageSquare, lucideTrash } from '@ng-icons/lucide';

import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
    selector: 'app-message-context-menu',
    imports: [HlmDropdownMenuImports, NgIcon, HlmIconImports],
    providers: [provideIcons({
        lucideBotMessageSquare, lucideTrash,
    })],
    templateUrl: './message-context-menu.component.html',
    host: {
        style: 'display: contents',
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageContextMenuComponent {
    private readonly _chatingService = inject(ChatingService);
    private readonly _accountPanelStore = inject(AccountPanelStore);

    public message = input.required<Message>();

    responseWithAI() {
        this._chatingService.responseWithAIAsync(
            this._accountPanelStore.account().id,
            this._accountPanelStore.curChat()!.id,
            this.message(),
        );
    }

    deleteMessage() {
        this._chatingService.deleteMessagesAsync(
            this._accountPanelStore.account().id,
            this._accountPanelStore.curChat()!.id,
            [this.message().id],
            true,
        );
    }
}
