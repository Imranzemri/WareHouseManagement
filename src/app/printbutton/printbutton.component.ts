import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { QrcodeService } from '../qrcode.service';
import { Router } from '@angular/router';

interface DisplayedItem {
name:string;
rcpNumber:string;
shpNmbr:string;
qnty:number;
}
@Component({
  selector: 'app-printbutton',
  templateUrl: './printbutton.component.html',
  styleUrls: ['./printbutton.component.css']
})
export class PrintbuttonComponent  {

  @Input() shpData:any = "";
  shipmentData:any[]=[];
  qrCodeData: string[] = [];
  shipNmbr:string = "";

  constructor(private apiService:ApiService, private qrCodeService:QrcodeService,private router:Router){}




getDetailById(){
  this.shipNmbr = this.shpData.shpNmbr;
  this.apiService.getShipmentsById(this.shipNmbr).subscribe(
   (response:any)=>{
   this.transformData(response.items[0]);
   
   this.generateQRCodeData();
    //this.totalRecords = response.totalCount
    //this.shipmentData = response.items;
    console.log('details data '+response.items);
   });
}

transformData(data: any) {
  const displayedItems: DisplayedItem[] = [];
  debugger;
  const dimensionCollection: any[] = data.dimensionCollection;
  if (dimensionCollection) {
      const weightCollection = data.weightCollection;
      dimensionCollection.forEach((dimensionItem: any, index: number) => { 
        debugger;
          const newItem: DisplayedItem = {
              name:data.name, 
              rcpNumber:dimensionItem.rcptNmbr,
              shpNmbr: data.shptNmbr,
              qnty:data.qnty,
          };
          
          displayedItems.push(newItem);
      });
  }
  debugger;
  this.shipmentData = displayedItems;
}


async generateQRCodeData(): Promise<void> {
  debugger;
  if (this.shipmentData !== null) {
    for (let i = 1; i <= this.shipmentData.length; i++) {
      const qrCodeData = `Receipt Number: ${this.shipmentData[i - 1].rcpNumber}\nClient: ${this.shipmentData[i-1].name}\nShipment No: ${this.shipmentData[i-1].shpNmbr}`;
      try {
        const qrCodeUrl = await this.qrCodeService.generateQRCode(qrCodeData);
        this.qrCodeData.push(qrCodeUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
    this.apiService.qrs = this.qrCodeData;
    this.apiService.rcptNmbrs = this.shipmentData;
    this.apiService.shipNum = this.shipmentData[0].shpNmbr;
    this.router.navigate(['/success']);
  }
}

}
