import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { AccountPanelStore } from '../../account-panel.store';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
    selector: 'app-chat-user-info',
    imports: [HlmAvatarImports],
    templateUrl: './chat-user-info.component.html',
    host: {
        class: 'px-4 py-2 border-b',
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatUserInfoComponent {
    private readonly _accountPanelStore = inject(AccountPanelStore);

    protected readonly curChat = this._accountPanelStore.curChat;

    protected readonly photoSrc = computed(
        () => `data:image/jpeg;base64,${this.curChat()!.photoData}`,
    );
}
