import { Component, computed, inject, input } from '@angular/core';
import { Chat } from '../../../../types';
import { HlmItemImports } from "@spartan-ng/helm/item";
import { HlmAvatarImports } from "@spartan-ng/helm/avatar";

@Component({
  selector: 'app-chat-card',
  imports: [HlmItemImports, HlmAvatarImports],
  templateUrl: './chat-card.component.html',
})
export class ChatCardComponent {
  public chat = input<Chat>();
  public isSelected = input<boolean>();

  protected photoData = computed(() => `data:image/jpeg;base64,${this.chat()?.photoData}`);
}
