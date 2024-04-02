import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finalizebutton',
  templateUrl: './finalizebutton.component.html',
  styleUrls: ['./finalizebutton.component.css']
})
export class FinalizebuttonComponent {
  @Input() rowData :any ="";

constructor(private router:Router)
{

}

  navigateToDetails(){
    this.router.navigateByUrl('/finalizerecv',{state:{'ShipmentNumber':this.rowData.shpNmbr}});
  }
}
