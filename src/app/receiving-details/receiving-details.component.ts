import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Shipment } from '../Models/shipment';
import { ActivatedRoute, Route,Router } from '@angular/router';
import Swal from 'sweetalert2';

interface DisplayedItem {
    lngth: number;
    width: number;
    height: number;
    dunit: string;
    wght: number;
    wunit: string;
    locn: string;
    gooddesc: string;
  plt: number;
  rcpNumber:string;
  sts:string;
}

@Component({
  selector: 'app-receiving-details',
  templateUrl: './receiving-details.component.html',
  styleUrls: ['./receiving-details.component.css']
})
export class ReceivingDetailsComponent implements OnInit {
  dataSource: MatTableDataSource<DisplayedItem> = new MatTableDataSource<DisplayedItem>();
  displayedColumns: string[] = ['shptnmbr','lngth','width','height','dunit','wght','wunit','locn','gooddesc'];
  shipmentNo: string = "";
  totalRecords = 0;
  displayedItems:any[] = [];
  gooddescValue:string = "";
  locnValue:string = "";
  rcpNumber:string = "";
  sts:string = "";
  constructor(private apiservice:ApiService,private router:Router)
  {
    const navigation = this.router.getCurrentNavigation();
    if(navigation && navigation.extras.state){
       this.shipmentNo = navigation.extras.state['ShipmentNumber'];
    }
  }
  ngOnInit(): void {
    this.getDetailById(this.shipmentNo);
  }
  getDetailById(shipmentNo:string){
    this.apiservice.getShipmentsById(shipmentNo).subscribe(
     (response:any)=>{
     this.transformData(response.items[0]);
      this.totalRecords = response.totalCount
      console.log('details data '+response.items);
     });
  }

  transformData(data: any) {
    const displayedItems: DisplayedItem[] = [];
    const dimensionCollection: any[] = data.dimensionCollection;
    if (dimensionCollection) {
        const weightCollection = data.weightCollection;
        dimensionCollection.forEach((dimensionItem: any, index: number) => { 
            const newItem: DisplayedItem = {
                plt: index+1,
                lngth: dimensionItem.lngth,
                width: dimensionItem.width,
                height: dimensionItem.height,
                dunit: dimensionItem.dUnit,
                wght: weightCollection[index]?.wght || 0, 
                wunit: weightCollection[index]?.wUnit || '', 
                locn: dimensionItem.locn,
                gooddesc: dimensionItem.goodDesc,
                rcpNumber:dimensionItem.rcptNmbr,
                sts: data.sts
            };
            
            displayedItems.push(newItem);
        });
    }
    this.dataSource.data = displayedItems;
}


handleLocnInput(event: Event,rcpNumber:string) {
  debugger;
  const inputElement = event.target as HTMLInputElement;
  this.locnValue = inputElement.value;
  this.rcpNumber = rcpNumber;
}

handleGooddescInput(event: Event,rcpNumber:string) {
  debugger;
  const inputElement = event.target as HTMLInputElement; 
  this.gooddescValue = inputElement.value;
  this.rcpNumber = rcpNumber;
}

  //update method
  updateLocationAndDescription()
  {
    this.apiservice.updateLocationAndDescription(this.locnValue, this.gooddescValue,this.rcpNumber,this.shipmentNo).subscribe(
      (reponse:any)=>{
      this.locnValue = "";
      this.gooddescValue = "";
      this.rcpNumber = "";
      this.succesToast();
      setTimeout(() => {
        this.goToReview();
      }, 2000); 
      });
  }

  goToReview(){
    this.router.navigateByUrl('/revrecv');
  }
  openFinalizeData(){
    this.router.navigateByUrl('/finalizerecv',{state:{'ShipmentNumber':this.shipmentNo}});
  }

  async succesToast(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    
    Toast.fire({
      icon: 'success',
      title: 'Updated Uploaded Successfully'
    });
  }
}
