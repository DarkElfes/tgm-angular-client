import { Component, computed, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { Account } from '../../../../../types';
import { Column } from '@tanstack/angular-table';

@Component({
    selector: 'app-columns-selector',
    imports: [HlmSelectImports, BrnSelectImports],
    templateUrl: './columns-selector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsSelectorComponent {
    public columns = input.required<Column<Account, unknown>[]>();

    protected selectedColumnNames = computed(() =>
        this.columns()
            .filter((x) => x.getIsVisible())
            .map((x) => x.id),
    );

    protected onValueChanged(values: string[] | string | undefined) {
        this.columns().forEach((x) =>
            values?.includes(x.columnDef.id!)
                ? x.toggleVisibility(true)
                : x.toggleVisibility(false),
        );
    }
}
