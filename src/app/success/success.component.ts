import { Component,ElementRef,ViewChild  } from '@angular/core';
import { CargoShipmentComponent } from '../cargo-shipment/cargo-shipment.component';
import { ApiService } from '../api.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {

  constructor(private apiService: ApiService,private _service:NotificationsService){
    this.qrCodeContainer = new ElementRef(null);

  }
  @ViewChild('qrCodeContainer', { static: true }) qrCodeContainer: ElementRef;

  ngAfterViewInit(){
    this._service.success(
      'Success',
      'Email Sent Successfully',
      {
        position: ['top', 'right'],
          timeOut: 2000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
      }
  )
}
  get qrCodes(){
    return this.apiService.qrs;
  }
  get rcptNumbers(){
    return this.apiService.rcptNmbrs;
  }

  printQRCode(qrCodeURL: string, receiptNumber: string) {
    const qrCodeWindow = window.open('', '', 'width=600,height=400');    
    if (qrCodeWindow) {
    //  qrCodeWindow.document.write(`<img src="/assets/logo-img.png" alt="QR Code" style="height: 60px; width: 100px;" /><p style="font-size: 60px; text-align: center;"><br>${receiptNumber}</p><img src="${qrCodeURL}" alt="QR Code" />`);
    qrCodeWindow.document.write(`
    <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <img src="/assets/logo-img.png" alt="QR Code" style="height: 60px; width: 100px;" />
      <p style="font-size: 60px;">${receiptNumber}</p>
      <img src="${qrCodeURL}" alt="QR Code" />
    </div>
  `);
  

      qrCodeWindow.document.close();
      qrCodeWindow.print();
    } else {
      console.error("Failed to open a new window for printing.");
    }
  }
  
  }
