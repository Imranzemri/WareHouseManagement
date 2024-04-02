import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-bi-home',
  templateUrl: './bi-home.component.html',
  styleUrls: ['./bi-home.component.css']
})
export class BiHomeComponent  implements OnInit {

constructor
(
  private router: Router,
  private service:ApiService
 )
  { }

  ngOnInit(): void {
    
    let currentEndPoint = location.hash;
    if(this.service.urlEndPoint != undefined) {
      location.reload();
    }
  }


  //   this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
  //     this.router.navigate(['home']);
  // }); 
//this.reloadCurrentRoute();
  // this.router.navigateByUrl('/home').then(() => {

  //   this.router.navigate(['home']);
  //   // setTimeout(() => {
  //   //   this.router.navigate(['home']);
  //   // }, 1000);
  // });
  //window.location.reload();
  

  
}
