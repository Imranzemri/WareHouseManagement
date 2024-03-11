import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bi-home',
  templateUrl: './bi-home.component.html',
  styleUrls: ['./bi-home.component.css']
})
export class BiHomeComponent  implements OnInit {

constructor(private router: Router){ }


  ngOnInit(): void {

  //   this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
  //     this.router.navigate(['home']);
  // }); 
this.reloadCurrentRoute();
  // this.router.navigateByUrl('/home').then(() => {

  //   this.router.navigate(['home']);
  //   // setTimeout(() => {
  //   //   this.router.navigate(['home']);
  //   // }, 1000);
  // });
 
  }

  reloadCurrentRoute() {
   
    location.reload();
}
  
}
