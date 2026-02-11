import { Component, inject } from '@angular/core';
import { ManagementService } from './management.service';

@Component({
  selector: 'app-management',
  imports: [],
  templateUrl: './management.component.html',
})
export class ManagementComponent {
  readonly managementService = inject(ManagementService);
  
  constructor(){
    this.managementService.getAccounts();
  }
}
