import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent {
  @Output() public sidenavToggle = new EventEmitter();
  constructor() {}
  showCargoMenu: boolean = false;
  isCollapsed = false;

  ngOnInit(): void {

  }

  public onToggleSidenav = () => {

    this.sidenavToggle.emit();

  }

  toggleCargoMenu() {
    this.showCargoMenu = !this.showCargoMenu;
  }
}
