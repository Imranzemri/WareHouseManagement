import { Component,ViewEncapsulation, Inject, ViewChild } from '@angular/core';


@Component({
  selector: 'app-bi-siderbar',
  templateUrl: './bi-siderbar.component.html',
  styleUrls: ['./bi-siderbar.component.css'],
})
export class BiSiderbarComponent  {

  isHovered: number = 0;
}
