import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) {}
  username: string = '';
  password: string = '';

  submitForm() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    //this.router.navigate(['/welcome']);
    if(this.username=='pwswarehouse.user' && this.password=="Priority1"){
      this.router.navigate(['/test']);
    }
    else{
     this.errorToast();
    }


  }

  //error toast
  async errorToast(){
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
      icon: 'error',
      title: 'Incorrect User name or Password'
    });
  }
}
