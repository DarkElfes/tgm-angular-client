import { Component, Host, ChangeDetectionStrategy } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideListCheck } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

@Component({
    selector: 'app-loader-alert',
    imports: [HlmAlertImports, NgIcon],
    providers: [provideIcons({
        lucideListCheck,
    })],
    templateUrl: './loader-alert.component.html',
    host: {
        class: "px-4 w-fit self-center"
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderAlertComponent { }
