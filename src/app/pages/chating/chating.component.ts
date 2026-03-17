import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    inject,
    viewChild,
} from '@angular/core';
import { ChatingService } from './chating.service';

import { HlmTabsImports, HlmTabsList } from '@spartan-ng/helm/tabs';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

import { AccountPanelComponent } from './account-panel/account-panel.component';
import { ChatingStore } from './chating.store';
import { AccountNotSelectedEmptyComponent } from './account-not-selected-empty/account-not-selected-empty.component';

import { HeaderService } from '../../components/layout/header/header.service';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
    selector: 'app-chating',
    imports: [
        HlmTabsImports,
        HlmAvatarImports,
        AccountPanelComponent,
        AccountNotSelectedEmptyComponent,
        HlmSpinnerImports,
    ],
    templateUrl: './chating.component.html',
    providers: [ChatingStore, ChatingService],
    styles: `
        :host {
            flex-grow: 1;
            display: flex;
            min-height: 0;
        }
    `,
})
export class ChatingComponent implements OnInit, OnDestroy, AfterViewInit {
    protected readonly chatingService = inject(ChatingService);
    protected readonly chatingStore = inject(ChatingStore);
    private readonly _headerService = inject(HeaderService);

    protected tabList = viewChild.required<TemplateRef<unknown>>('tabList');

    protected accounts = this.chatingStore.accounts;

    async ngOnInit(): Promise<void> {
        await this.chatingService.connectAsync();
    }

    ngOnDestroy(): void {
        this.chatingService.disconnectAsync();
        this._headerService.additionalNav.set(null);
    }

    ngAfterViewInit(): void {
        this._headerService.additionalNav.set(this.tabList());
    }
}
