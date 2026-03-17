import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUser } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
    selector: 'app-account-not-selected-empty',
    imports: [HlmIconImports, NgIcon, HlmEmptyImports],
    providers: [provideIcons({ lucideUser })],
    templateUrl: './account-not-selected-empty.component.html',
    host: {
        style: 'display: contents;',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNotSelectedEmptyComponent {}
