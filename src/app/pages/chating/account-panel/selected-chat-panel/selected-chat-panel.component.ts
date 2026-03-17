import { Component, inject , ChangeDetectionStrategy} from '@angular/core';

import { AccountPanelStore } from '../account-panel.store';

import { ChatNotSelectedEmptyComponent } from './chat-not-selected-empty/chat-not-selected-empty.component';
import { MessagesPanelComponent } from './messages-panel/messages-panel.component';
import { ChatUserInfoComponent } from './chat-user-info/chat-user-info.component';


@Component({
    selector: 'app-selected-chat-panel',
    imports: [ChatNotSelectedEmptyComponent, MessagesPanelComponent, ChatUserInfoComponent],
    templateUrl: './selected-chat-panel.component.html',
    host: {
        class: "flex flex-col"
    },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedChatPanelComponent {
    private readonly _accountPanelStore = inject(AccountPanelStore);

    protected curChat = this._accountPanelStore.curChat;
}
