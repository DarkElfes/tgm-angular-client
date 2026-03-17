import {
    Component,
    Signal,
    computed,
    input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { TgServiceState } from '../../../../../types/generated/tgm.Domain.TgAccounts.Enums';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideCircleCheck,
    lucideCircleStop,
    lucideCircleX,
    lucideLoaderCircle,
} from '@ng-icons/lucide';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

type BadgeInfo = {
    text: string;
    iconName?: string;
    isLoading?: boolean;
    classes?: string;
};

@Component({
    selector: 'app-status-cell',
    imports: [HlmBadgeImports, HlmIconImports, NgIcon, HlmSpinnerImports],
    providers: [
        provideIcons({
            lucideCircleStop,
            lucideLoaderCircle,
            lucideCircleCheck,
            lucideBadgeCheck,
            lucideCircleX,
        }),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @let badgeInfo = this.badgeInfo();
        <span
            hlmBadge
            variant="outline"
            class="select-none text-muted-foreground"
        >
            @if (badgeInfo?.isLoading) {
                <hlm-spinner class="text-xs" [class]="badgeInfo.classes" />
            } @else {
                <ng-icon
                    hlmIcon
                    [name]="badgeInfo.iconName"
                    size="xs"
                    [classList]="badgeInfo.classes"
                />
            }
            {{ badgeInfo.text }}
        </span>
    `,
})
export class StatusCellComponent {
    status = input.required<TgServiceState>();

    protected badgeInfo: Signal<BadgeInfo> = computed(() => {
        switch (this.status()) {
            case TgServiceState.Stopped:
                return {
                    text: 'Stopped',
                    iconName: 'lucideCircleStop',
                };
            case TgServiceState.Starting:
                return {
                    text: 'Starting',
                    isLoading: true,
                    classes: 'text-yellow-400',
                };
            case TgServiceState.Running:
                return {
                    text: 'Running',
                    iconName: 'lucideBadgeCheck',
                    classes: 'text-green-400',
                };
            case TgServiceState.Stopping:
                return {
                    text: 'Stopping',
                    isLoading: true,
                    classes: 'text-orange-400',
                };
            default:
                return {
                    text: 'Error',
                    iconName: 'licideCircleX',
                    classes: 'text-red-400',
                };
        }
    });

    protected readonly TgServiceState = TgServiceState;
}
