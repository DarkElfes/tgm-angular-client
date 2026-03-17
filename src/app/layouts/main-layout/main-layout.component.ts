import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-main-layout',
    imports: [HeaderComponent, RouterOutlet],
    template: `
        <app-header />
        <main class="flex flex-col min-h-0">
            <router-outlet />
        </main>
    `,
    styles: `
        :host {
            display: grid;
            height: 100vh;
            grid-template-rows: auto 1fr;
        }
    `,
})
export class MainLayoutComponent {}
