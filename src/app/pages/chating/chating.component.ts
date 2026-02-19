import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ChatingService } from './chating.service';

import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmCardImports } from "@spartan-ng/helm/card";
import { StatusCellComponent } from "../management/components/status-cell/status-cell.component";
import { ChatPanelComponent } from "./components/chat-panel/chat-panel.component";


@Component({
  selector: 'app-chating',
  imports: [HlmTabsImports, HlmAvatarImports, HlmCardImports, StatusCellComponent, ChatPanelComponent],
  templateUrl: './chating.component.html',
})
export class ChatingComponent implements OnInit, OnDestroy {
  public readonly chatingService = inject(ChatingService)
  
  async ngOnInit(): Promise<void> {
    await this.chatingService.connectAsync();
  }

  ngOnDestroy(): void {
    this.chatingService.disconnectAsync();
  }
}
