import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Shipment } from '../Models/shipment';
import { Route,Router } from '@angular/router';

interface DisplayedItem {
  qnty:number;
  lngth: number;
  width: number;
  height: number;
  dunit:string;
  wght: number;
  wunit:string;
 totalweight:number;
 unit:string;
}
@Component({
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.css']
})
export class ShipmentDetailComponent {
  dataSource: MatTableDataSource<DisplayedItem> = new MatTableDataSource<DisplayedItem>();
  displayedColumns: string[] = ['qnty','lngth', 'width', 'height','dunit', 'wght','wunit','totalweight','unit'];
  shipmentData!: Shipment;

  constructor(private apiservice:ApiService,private router:Router)
  {
    //this.shipmentData=[];
  }
  
  ngAfterViewInit()
  {
   this.shipmentData=this.apiservice.shipmentData;

   const displayedItems: DisplayedItem[] = [];
   this.shipmentData.DimensionCollection.forEach((dimensionItem, index) => {
    if (this.shipmentData.WeightCollection[index]) {
      
     
      //const weight = this.shipmentData.WeightCollection[index].wght
      const twght= this.shipmentData.WeightCollection[index].qnty * this.shipmentData.WeightCollection[index].wght;
      displayedItems.push({
        qnty:this.shipmentData.WeightCollection[index].qnty,
        lngth: dimensionItem.lngth || 0,
        width: dimensionItem.width || 0,
        height: dimensionItem.height || 0,
        dunit: dimensionItem.dunit || '',
        wght: this.shipmentData.WeightCollection[index].wght.valueOf() || 0,
        wunit: this.shipmentData.WeightCollection[index].wunit || '',
        totalweight:twght,
        unit:this.shipmentData.WeightCollection[index].wunit || ''
      });
    }
  });
  this.dataSource.data = displayedItems;
 // this.calculateTotalWeight();
  }
  //total weight calculation
   totalweight(): number {
    return this.dataSource.data.reduce((total, element) => total + element.wght, 0);
  }

  //calculate kg weight 
  totalWghtKgs():{kg:number,lb:number}
  {
    const totalWeights = this.dataSource.data.reduce(
      (totals, element) => {
        if (element.wunit === 'kg') {
          totals.kg += element.wght;
          totals.lb += element.wght * 2.20462; 
        } else if (element.wunit === 'lb') {
          totals.lb += element.wght;
          totals.kg += element.wght / 2.20462; 
        }
        return totals;
      },
      { kg: 0, lb: 0 }
    );
  
    return totalWeights;
  }

  //calculate lb weight
  // totalWghtLbs():number
  // {
  //   const totalkgs= this.dataSource.data.reduce(
  //     (total,element)=>{
  //       if(element.wunit=="lb")
  //       {
  //         total.totalWghtLb +=element.wght;
  //         total.totalWghtKg +=element.wght /2.20462
  //       }
  //       return total;
  //     },

  //   );
  //   return totalkgs.totalWghtKg;
  // }


  
  //navigate to thank you page
  goToThankYouPage() 
  {
    this.router.navigate(['/success']);
  }
}
