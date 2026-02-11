import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NavMenuComponent } from "./nav-menu/nav-menu.component";


@Component({
  selector: 'app-header',
  imports: [HlmButtonImports, NavMenuComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

}
