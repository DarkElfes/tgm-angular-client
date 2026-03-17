import { Component, effect, inject, signal } from '@angular/core';
import { ManagementService } from '../../management.service';
import { Account } from '../../../../types';

import { StatusCellComponent } from './status-cell/status-cell.component';
import {
    ColumnDef,
    FlexRenderDirective,
    VisibilityState,
    createAngularTable,
    flexRenderComponent,
    getCoreRowModel,
} from '@tanstack/angular-table';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { AddingAccountDialogComponent } from './adding-account-dialog/adding-account-dialog.component';
import { ColumnsSelectorComponent } from './columns-selector/columns-selector.component';

const STORAGE_COLUMNS_ITEM: string = 'account-table-columns';

@Component({
    selector: 'app-accounts-table',
    imports: [
        FlexRenderDirective,
        HlmTableImports,
        HlmDropdownMenuImports,
        HlmButtonImports,
        HlmSpinnerImports,
        HlmEmptyImports,
        AddingAccountDialogComponent,
        ColumnsSelectorComponent,
    ],
    templateUrl: './accounts-table.component.html',
})
export class AccountsTableComponent {
    protected readonly managementService = inject(ManagementService);

    private readonly _columnVisibility = signal<VisibilityState>(
        JSON.parse(localStorage.getItem(STORAGE_COLUMNS_ITEM) ?? '{}'),
    );

    constructor() {
        if (!this.managementService.isLoaded()) {
            this.managementService.getAccounts();
        }

        effect(() => {
            localStorage.setItem(
                STORAGE_COLUMNS_ITEM,
                JSON.stringify(this._columnVisibility()),
            );
        });
    }

    protected _table = createAngularTable(() => ({
        data: this.managementService.accounts(),
        columns: this._columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: (updater) => {
            updater instanceof Function
                ? this._columnVisibility.update(updater)
                : this._columnVisibility.set(updater);
        },
        state: {
            columnVisibility: this._columnVisibility(),
        },
    }));

    private _columns: ColumnDef<Account>[] = [
        {
            accessorKey: 'id',
            id: 'id',
            header: 'Id',
        },
        {
            accessorKey: 'phoneNumber',
            id: 'phoneNumber',
            header: 'PhoneNumber',
        },
        {
            accessorKey: 'firstName',
            id: 'firstName',
            header: 'FirstName',
        },
        {
            accessorKey: 'lastName',
            id: 'lastName',
            header: 'LastName',
        },
        {
            accessorKey: 'serviceState',
            id: 'serviceState',
            header: 'ServiceState',
            cell: (context) => {
                return flexRenderComponent(StatusCellComponent, {
                    inputs: {
                        status: context.row.original.serviceState,
                    },
                });
            },
        },
    ];

    protected readonly _hidableColumns = this._table
        .getAllColumns()
        .filter((column) => column.getCanHide());
}
