import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/layout/header/header.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header />
    <main class="mx-4 flex flex-col gap-2">
      <router-outlet/>
    </main>
  `,
})
export class MainLayoutComponent {

}
