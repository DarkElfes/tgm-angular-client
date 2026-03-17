import { ElementRef, Injectable, TemplateRef, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HeaderService {
    public additionalNav = signal<TemplateRef<unknown> | null>(null);
}
