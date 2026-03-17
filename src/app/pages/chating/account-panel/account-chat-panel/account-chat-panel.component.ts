import { Component, computed, inject, input, output , ChangeDetectionStrategy} from '@angular/core';

import { ChatCardComponent } from './chat-card/chat-card.component';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { Chat, ChatFolderInfo } from '../../../../types';
import { ChatingService } from '../../chating.service';
import { ChatingStore } from '../../chating.store';
import { AccountPanelStore } from '../account-panel.store';

const CHAT_LIST_MAIN = 'chatListMain';

@Component({
    selector: 'app-account-chat-panel',
    imports: [ChatCardComponent, HlmTabsImports],
    templateUrl: './account-chat-panel.component.html',
    styles: `
        :host {
            width: 300px;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            height: 100%;
            min-height: 0;
        }
    `,
    host:{
        class: "border-r p-2"
    },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountChatPanelComponent {
    protected readonly chatingService = inject(ChatingService);
    protected readonly accountPanelStore = inject(AccountPanelStore);

    protected account = this.accountPanelStore.account;
    protected curChat = this.accountPanelStore.curChat;

    protected chatLists = computed(() => {
        return [
        { id: 0, name: CHAT_LIST_MAIN },
        ...(this.account()?.chatFolders ?? []),
    ]
});

    protected readonly CHAT_LIST_MAIN: string = CHAT_LIST_MAIN;

    protected filteredChatsForList(chatList: {
        id: number;
        name: string;
    }): Chat[] {
        let chats: Chat[] = [];
        if (chatList.name === CHAT_LIST_MAIN) {
            chats =
                this.account().chats.filter((c) =>
                    c.positions.some((p) => p.type === chatList.name),
                ) ?? [];
        } else {
            chats =
                this.account().chats.filter((c) =>
                    c.positions.some((p) => p.chatFolderId === chatList.id),
                ) ?? [];
        }
        return chats;
    }

    protected chatSelected(chatId: number | null) {
        this.accountPanelStore.updateSelectedChatId(chatId);
    }
}
