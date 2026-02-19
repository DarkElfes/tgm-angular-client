import { Component, computed, input } from '@angular/core';
import { HlmBadgeImports  } from "@spartan-ng/helm/badge";
import { TgServiceState } from '../../../../types/generated/tgm.Domain.TgAccounts.Enums';

@Component({
  selector: 'app-status-cell',
  imports: [HlmBadgeImports],
  template: `
  @switch (status()) {
    @case (TgServiceState.Stopped) {
      <span hlmBadge variant="secondary">Stopped</span>
    }
    @case (TgServiceState.Starting) {
      <span hlmBadge variant="secondary" class="bg-yellow-600">Starting</span>
    }
    @case (TgServiceState.Running) {
      <span hlmBadge variant="secondary" class="bg-green-600">Running</span>
    }
    @case (TgServiceState.Stopping) {
      <span hlmBadge variant="secondary">Stopping</span>
    }
    @default {
      <span hlmBadge variant="destructive">Error</span>
    }
  }`,
})
export class StatusCellComponent {
  status = input.required<TgServiceState>();

  protected readonly TgServiceState = TgServiceState;
}