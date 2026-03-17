import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ManagementService } from '../../../management.service';

import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { QRCodeComponent } from 'angularx-qrcode';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HotkeyDerictive } from '../../../../../directivies/hotkey.directive';

@Component({
    selector: 'app-adding-account-dialog',
    imports: [
        HlmProgressImports,
        HlmDialogImports,
        HlmButtonImports,
        HlmSpinnerImports,
        HlmKbdImports,
        HlmIconImports,
        NgIcon,
        QRCodeComponent,
        HotkeyDerictive,
    ],
    providers: [provideIcons({ lucidePlus })],
    templateUrl: './adding-account-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddingAccountDialogComponent {
    protected readonly managementService = inject(ManagementService);

    protected async onStateChanged(state: BrnDialogState) {
        if (state === 'open') {
            await this.managementService.connectToAddingFlowAsync();
        } else {
            await this.managementService.disconnectFromAddingFlowAsync();
        }
    }
}
