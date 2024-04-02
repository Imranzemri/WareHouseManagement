import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppLayoutComponent {
  @Output() public sidenavToggle = new EventEmitter();
  constructor(
    private service:ApiService,
    private router:Router
    ) {}
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
  goToDashboard(){
   this.service.urlEndPoint = location.hash;
   this.router.navigate(['home']);
  }
}
