import { Component,OnInit ,Renderer2, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
  ngOnInit(): void {
    // Add the 'active' class to trigger the fading effect
    setTimeout(() => {
      document.querySelector('article')?.classList.add('active');
    }, 0);
  }
  constructor(private _service:NotificationsService){}
  isOpenSideBar:boolean=false;
  toggleSidebar() {
    this.isOpenSideBar = !this.isOpenSideBar;
  }

  // Function to close the sidebar
  closeSidebar() {
    this.isOpenSideBar = false;
  }

  ngAfterViewInit(){
    this._service.info(
      'Welcome',
      '',
      {
        position: ['top', 'right'],
          timeOut: 4000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
      }
  );
//   this._service.success(
//     'Success',
//     'Login Successfully!',
//     {
//       position: ['top', 'right'],
//         timeOut: 2000,
//         showProgressBar: true,
//         pauseOnHover: false,
//         clickToClose: false,
//         maxLength: 10
//     }
// )
this.toast();
}

async toast(){
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    icon: 'success',
    title: 'Signed in successfully'
  });
}
}

 