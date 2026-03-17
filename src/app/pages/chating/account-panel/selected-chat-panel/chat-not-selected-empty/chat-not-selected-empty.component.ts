import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageSquare } from '@ng-icons/lucide';

import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIconImports } from "@spartan-ng/helm/icon";

@Component({
  selector: 'app-chat-not-selected-empty',
  imports: [HlmEmptyImports, NgIcon, HlmIconImports],
  providers: [provideIcons({ lucideMessageSquare })],
  templateUrl: './chat-not-selected-empty.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatNotSelectedEmptyComponent { }
