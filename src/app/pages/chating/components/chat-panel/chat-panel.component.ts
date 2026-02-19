import { Component, computed, input } from '@angular/core';
import { Chat, ChatFolderInfo } from '../../../../types';

import { ChatCardComponent } from "../chat-card/chat-card.component";

import { HlmTabsImports } from "@spartan-ng/helm/tabs";

const CHAT_LIST_FOLDER = "chatListFolder";
export const CHAT_LIST_MAIN = "chatListMain";

@Component({
  selector: 'app-chat-panel',
  imports: [ChatCardComponent, HlmTabsImports],
  templateUrl: './chat-panel.component.html',
})
export class ChatPanelComponent {
  public chats = input.required<Chat[]>();
  public chatFolders = input.required<ChatFolderInfo[]>();

  protected chatLists = computed(() => [{ 'id': -1, "name": "chatListMain" }, ...this.chatFolders() ?? []])
  protected CHAT_LIST_MAIN: string = CHAT_LIST_MAIN;

  filteredChatsForList(chatList: { id: number, name: string }): Chat[] {

    if (chatList.name === CHAT_LIST_MAIN) {
      return this.chats()?.filter(c => c.positions.find(p => p.type === chatList.name))
    }
    else {
      var test = this.chats()?.filter(c => c.positions.find(p => {
        return parseInt(p.chatFolderId ?? "0") === chatList.id
      }
      ))
      return test;
    }
  }
}
