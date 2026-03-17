import { Component, effect, inject, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { HlmButtonImports } from '@spartan-ng/helm/button';

import { HeaderService } from './header.service';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HlmCarousel, HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp } from '@ng-icons/lucide';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';
import { HotkeyDerictive } from '../../../directivies/hotkey.directive';

@Component({
    selector: 'app-header',
    imports: [
        HlmButtonImports,
        NavMenuComponent,
        NgTemplateOutlet,
        HlmCarouselImports,
        HlmIconImports,
        NgIcon,
        HlmKbdImports,
        HotkeyDerictive,
    ],
    providers: [provideIcons({ lucideArrowUp, lucideArrowDown })],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    protected headerService = inject(HeaderService);

    protected carousel = viewChild<HlmCarousel>('carousel');

    public prev() {
        this.carousel()?.scrollPrev();
    }

    public next() {
        this.carousel()?.scrollNext();
    }

    constructor() {
        effect(() => {
            const carousel = this.carousel();
            if (carousel && carousel.slideCount() > 1) {
                carousel.scrollNext();
            }
        });
    }
}
