import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';

import { Chat } from '../../../../../types';

import { HlmItemImports } from "@spartan-ng/helm/item";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";

@Component({
  selector: 'app-chat-card',
  imports: [HlmItemImports, HlmAvatarImports],
  templateUrl: './chat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatCardComponent {
  public chat = input.required<Chat>();

  public isSelected = input.required<boolean>();
  public onSelect = output<number | null>();

  protected photoData = computed(() => `data:image/jpeg;base64,${this.chat()?.photoData}`);

  protected onClickHandle() {
    this.onSelect.emit(this.isSelected() ? null : this.chat().id);
  }
}
