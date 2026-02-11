import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/layout/header/header.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header />
    <main>
      <router-outlet/>
    </main>
  `,
})
export class MainLayoutComponent {

}
