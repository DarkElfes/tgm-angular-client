import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSendHorizontal } from '@ng-icons/lucide';

import { ChatingService } from '../../../../chating.service';
import { AccountPanelStore } from '../../../account-panel.store';

@Component({
    selector: 'app-message-input',
    imports: [
        HlmInputImports,
        HlmButtonImports,
        NgIcon,
        HlmIconImports,
        ReactiveFormsModule,
    ],
    providers: [provideIcons({
        lucideSendHorizontal,
    })],
    templateUrl: './message-input.component.html',
    host: {
        class: "flex gap-2"
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputComponent {
    private chatingService = inject(ChatingService);
    private accountPanelStore = inject(AccountPanelStore);

    protected input = new FormControl('');

    protected sendMessage() {
        if (this.input.value === '') {
            return;
        }

        this.chatingService.sendMessageAsync(
            this.accountPanelStore.account().id,
            this.accountPanelStore.curChat()!.id, // curChat nullability already was checked before this component rendering
            this.input.value!,
        );
        this.input.setValue('');
    }

    protected checkKeyButton(e: KeyboardEvent) {
        const target = e.target;
        if (target instanceof HTMLInputElement && e.key === 'Enter') {
            this.sendMessage();
        }
    }
}
