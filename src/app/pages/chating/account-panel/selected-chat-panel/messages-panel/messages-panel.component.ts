import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    computed,
    effect,
    inject,
    untracked,
    viewChild,
    ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

import { MessageInputComponent } from './message-input/message-input.component';
import { LoaderAlertComponent } from './loader-alert/loader-alert.component';
import { MessageContextMenuComponent } from './message-context-menu/message-context-menu.component';

import { ChatingService } from '../../../chating.service';
import { AccountPanelStore } from '../../account-panel.store';

@Component({
    selector: 'app-messages-panel',
    imports: [
        DatePipe,
        HlmDropdownMenuImports,
        HlmContextMenuImports,
        HlmSpinnerImports,
        MessageInputComponent,
        LoaderAlertComponent,
        MessageContextMenuComponent,
    ],
    templateUrl: './messages-panel.component.html',
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            min-height: 0;
            height: 100%;
            width: 100%;
            gap: 24px;
            scrollbar-gutter: stable both-edges;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesPanelComponent implements OnDestroy, AfterViewInit {
    protected readonly chatingService = inject(ChatingService);
    protected readonly accountPanelStore = inject(AccountPanelStore);

    protected account = this.accountPanelStore.account;
    protected curChat = this.accountPanelStore.curChat;

    protected messagesList = viewChild<ElementRef>('messagesList');
    protected loader = viewChild<ElementRef>('loader');

    private observer: IntersectionObserver | null = null;

    private oldMessageId = computed(() => {
        const messages = this.curChat()!.messages;
        return messages.at(messages.length - 1)?.id ?? 0;
    });

    constructor() {
        effect(() => {
            const hasMore = this.curChat()!.hasMoreMessagesForLoading;
            const loader = this.loader();

            if (hasMore && loader?.nativeElement) {
                this.setupObserver();
            } else {
                this.observer?.disconnect();
                this.observer = null;
            }
        });
    }

    ngAfterViewInit(): void {
        this.setupObserver();
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.observer = null;
    }

    private setupObserver() {
        var messagesList = this.messagesList();
        var loader = this.loader();

        console.log(messagesList);
        console.log(loader);
        if (!messagesList || !loader) return;

        // Disconnect existing observer before creating new one
        this.observer?.disconnect();

        this.observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    this.loadMoreMessages();
                }
            },
            {
                root: messagesList.nativeElement,
                threshold: 0,
                rootMargin: '200px 0px 0px 0px',
            },
        );

        this.observer.observe(loader.nativeElement);
    }

    private loadMoreMessages() {
        const curChat = this.curChat();
        const oldMessageId = this.oldMessageId();
        const account = untracked(this.account);

        if (curChat && curChat.hasMoreMessagesForLoading) {
            this.chatingService.getMessagesAsync(
                account.id,
                curChat.id,
                oldMessageId,
                50,
            );
        }
    }
}
