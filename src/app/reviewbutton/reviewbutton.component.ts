import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-reviewbutton',
  templateUrl: './reviewbutton.component.html',
  styleUrls: ['./reviewbutton.component.css']
})
export class ReviewbuttonComponent implements OnInit{
 @Input() rowData :any ="";
 @Output() reviewButtonClick:EventEmitter<any> =new EventEmitter();



constructor(private router: Router, private apiService:ApiService)
{
  
}

ngOnInit(): void {

}





  public navigateToDetails(){
   this.router.navigateByUrl('/recvdetails',{state:{'ShipmentNumber':this.rowData.shpNmbr}});
  }
}
