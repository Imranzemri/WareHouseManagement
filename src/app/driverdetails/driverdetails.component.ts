import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-driverdetails',
  templateUrl: './driverdetails.component.html',
  styleUrls: ['./driverdetails.component.css']
})
export class DriverdetailsComponent {

  records:any;
  constructor(private apiService: ApiService,){

    this.records=this.apiService.rowdata;
    console.log("records inside driver component",this.records);

  }

}
