import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { AccountsTableComponent } from "./components/accounts-table/accounts-table.component";
import { ManagementService } from './management.service';



@Component({
  selector: 'app-management',
  imports: [AccountsTableComponent],
  templateUrl: './management.component.html',
})
export class ManagementComponent implements OnInit, OnDestroy{
  private readonly _managementService = inject(ManagementService);


  async ngOnInit(): Promise<void> {
    await this._managementService.startMonitoringAsync();
  }

  async ngOnDestroy(): Promise<void> {
    await this._managementService.stopMonitoringAsync();
  }
}
