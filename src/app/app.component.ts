import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div>
      <app-header/>
      <router-outlet/>
    </div>
  `,
})
export class AppComponent {
  title = 'angular-cleent';
}
