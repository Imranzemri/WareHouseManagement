import { Component } from '@angular/core';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {
  showCargoMenu: boolean = false;
  isCollapsed = false;

  toggleCargoMenu() {
    this.showCargoMenu = !this.showCargoMenu;
  }
}
