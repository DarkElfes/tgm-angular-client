import { Component } from '@angular/core';
import { HlmNavigationMenuImports } from "@spartan-ng/helm/navigation-menu";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-nav-menu',
  imports: [HlmNavigationMenuImports, RouterLink],
  templateUrl: './nav-menu.component.html',
})
export class NavMenuComponent {
  pages: { title: string, href: string }[] = [
    {
      title: "Home",
      href: "/"
    },
    {
      title: "Management",
      href: "/management"
    },
    {
      title: "Chating",
      href: "/chating"
    }
  ]
}
