import { Directive, input, output } from '@angular/core';

@Directive({
    selector: '[appHotkey]',
    host: {
        '(document:keydown)': 'onKeydown($event)',
    },
})
export class HotkeyDerictive {
    public hotkey = input.required<string>();
    public hotkeyPressed = output();

    protected onKeydown(event: KeyboardEvent) {
        if (!this.hotkey || !this.hotkeyPressed) return;

        const keys = this.hotkey()
            .toLowerCase()
            .split('+')
            .map((k) => k.trim());

        const ctrl = keys.includes('ctrl') ? event.ctrlKey : true;
        const alt = keys.includes('alt') ? event.altKey : true;
        const shift = keys.includes('shift') ? event.shiftKey : true;
        const key =
            keys.find((k) => !['ctrl', 'alt', 'shift'].includes(k)) || '';

        if (ctrl && alt && shift && event.key.toLowerCase() === key) {
            event.preventDefault();
            console.log("emit");
            this.hotkeyPressed.emit();
        }
    }
}
