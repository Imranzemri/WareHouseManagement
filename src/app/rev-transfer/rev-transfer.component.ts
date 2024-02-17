import { Component, ViewChild } from '@angular/core';
import { DriverDetail } from '../Models/driver-detail.model';
import { DataSource } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TransferService } from '../Services/transfer.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-rev-transfer',
  templateUrl: './rev-transfer.component.html',
  styleUrls: ['./rev-transfer.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
    ])
  ]
})
export class RevTransferComponent {

  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;
  model:DriverDetail=new DriverDetail();
  displayedColumns: string[] = ['ShptNmbr','Name','RcptNmr','Qnty','TotalKg','TotalLb'];
  dataSource = new MatTableDataSource<any>();
  shipmentData: string[];
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 1;
  showSpinner: boolean = false;
  uploadSub:Subscription;

  constructor(private http: HttpClient,private apiService: TransferService,private router: Router){
    this.shipmentData=[];
    this.uploadSub = new Subscription();

  }


pageChangeEvent(event: PageEvent) {
  this.pageIndex = event.pageIndex + 1;
  this.pageSize = event.pageSize;
  this.getShipments();
}

  ngOnInit(): void {
    this.getShipments();
  }
 
  
  getShipments(){
    this.showSpinner = true;
    // Swal.fire({
    //   title: 'Loading...',
    //   allowOutsideClick: false, 
    //   showConfirmButton: false,  
    // });
    
   Swal.showLoading();
    
    this.apiService.getAllTransfers(this.pageIndex,this.pageSize).subscribe(
      (response:any)=>{
        this.shipmentData=response.items;
        this.dataSource.data=this.shipmentData;
        this.totalRecords=response.totalCount;
        //this.dataSource.paginator = this.paginator;
      },
      (error)=>{
        console.log("Api call failed",error);
      },
      () => {
        Swal.close();
    }
    );
  }

shpNo:any;

  onRowClick(rowData: any) {
    this.shpNo=rowData.shpNmbr;
    console.log("data is",rowData);
    console.log("ship nmbr is",rowData.shpNmbr);
    this.apiService.rowdata=rowData;
    Swal.showLoading();
    //this.router.navigate(['/Driverdetails']);
    Swal.close();
    Swal.fire({
      title: 'Cargo tendered to Priority Driver ?',
      allowOutsideClick:false,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
      icon: 'question'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
       // Swal.fire('Saved!', '', 'success')
        
       this.openPopupForDriver();

      } else if (result.isDenied) {
        //Swal.fire('Changes are not saved', '', 'info')
        this.openPopupForOutsideVendor();
      }
    });
    
  }

  async openPopupForDriver() {
    
    const { value: formResult, isConfirmed } = await Swal.fire({
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      showCancelButton:true,
      showCloseButton:true,
      title: 'Please Enter Following Details',
      allowOutsideClick:false,
      html: `
      <label for="shptNmbr"><strong>Shipment Number</stronmg></label>
      <input type="text" id="shptNmbr" value="${this.shpNo}" class="swal2-input" readonly>
        <input type="text" id="name" class="swal2-input" placeholder="Enter the Name">
        <select id="email" class="swal2-select">
        <option value="" disabled selected>Select Recipient</option>
        <option value="Accounting@priorityworldwide.com">Accounting@priorityworldwide.com</option>
        <option value="Operations@priorityworldwide.com">Operations@priorityworldwide.com</option>
        <option value="Exports@priorityworldwide.com">Exports@priorityworldwide.com</option>
        <option value="Imports@priorityworldwide.com">Imports@priorityworldwide.com</option>
        <option value="HR@priorityworldwide.com">HR@priorityworldwide.com</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nameInput = document.getElementById('name') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLSelectElement;
        
        if (!nameInput || !emailInput) {
          return 'Form data is incomplete.';
        }
        
        const name = nameInput.value;
        const email = emailInput.value;
        
        if (name === undefined || email === undefined) 
        {
          return Swal.fire('All fields are mandatory!', '', 'error');
        }
        
        return { name, email };
      }
    });
    
    if (isConfirmed) 
    {
     
      if (formResult.name === "" || formResult.email === "")
      { 
        Swal.fire('All fields are mandatory!', '', 'error'); 
      }
      else
      {
        this.model.Type="Driver"
        this.model.Nme=formResult.name;
        this.model.Rpnt=formResult.email;
        this.model.ShptNmbr=this.shpNo;
        this.apiService.postDriverDetail(this.model).subscribe(
          (response:string[])=>{
            console.log("response from driverdetails",response);
            Swal.fire({
              title: 'Thank You',
              text: 'Driver Detail Added Successfully',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000 
            });
          },
          (error)=>{
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: 'Error Occured',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000 
            });
          },
          ()=>{
          //  Swal.close();
          }
        );
      }   
    } 
  }



  async openPopupForOutsideVendor() {
    const { value: formResult, isConfirmed } = await Swal.fire({
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      showCancelButton: true,
      showCloseButton:true,
      title: 'Please Enter The Required Details',
      allowOutsideClick:false,
      html: `
      <label for="shptNmbr"><strong>Shipment Number</stronmg></label>
      <input type="text" id="shptNmbr" value="${this.shpNo}" class="swal2-input" readonly>
        <input type="text" id="carrier" class="swal2-input" placeholder="Carrier Name">
        <input type="text" id="driver" class="swal2-input" placeholder="Driver Name">
        <input type="text" id="licensePlate" class="swal2-input" placeholder="Truck License Plate"><br>
        <label for="driverPhoto"><strong>ID Card</stronmg></label>
        <input type="file" id="driverPhoto" class="swal2-input" placeholder="Driver ID photo" style="max-width:80%;" >
        <select id="email" class="swal2-select">
        <option value="" disabled selected>Select Recipient</option>
          <option value="Accounting@priorityworldwide.com">Accounting@priorityworldwide.com</option>
          <option value="Operations@priorityworldwide.com">Operations@priorityworldwide.com</option>
          <option value="Exports@priorityworldwide.com">Exports@priorityworldwide.com</option>
          <option value="Imports@priorityworldwide.com">Imports@priorityworldwide.com</option>
          <option value="HR@priorityworldwide.com">HR@priorityworldwide.com</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const carrier = document.getElementById('carrier') as HTMLInputElement;
        const driver = document.getElementById('driver') as HTMLInputElement;
        const licensePlate = document.getElementById('licensePlate') as HTMLInputElement;
        const driverPhoto = document.getElementById('driverPhoto') as HTMLInputElement;
        const email = document.getElementById('email') as HTMLInputElement;
    
        if (driverPhoto) 
        {
            const imageFile = driverPhoto.files?.[0]; // Handle null gracefully
            
            if (imageFile) 
            {
                

              const fileName = 'Id'+this.shpNo + '_' + imageFile.name;
              const formData = new FormData();
              formData.append("thumbnail", imageFile,fileName);
              const prodUrl="https://pwswarehouseapi.azurewebsites.net/api/Shipment/UploadImage";
              const LocUrl="https://localhost:7196/api/Shipment/UploadImage";
      
              const upload$ = this.http.post(prodUrl, formData, {
                  reportProgress: true,
                  observe: 'events'
              })
              .pipe(
                  finalize(() =>console.log('uploaded'))
              );
            
              this.uploadSub = upload$.subscribe(event => {
                if (event.type == HttpEventType.UploadProgress) {
                  
                  console.log('uploadeded');
                }
              });


            } else
             {
                console.error('No image file selected');
            }
        } 
        else 
        {
            console.error('Image element not found');
        }
        console.log("car name",driverPhoto.value);
       
        if (carrier.value === undefined || driver.value === undefined || licensePlate.value === undefined || driverPhoto.value === undefined || email.value === undefined) 
        {
         
          return Swal.fire('All fields are mandatory!', '', 'error');
        }
        else{
          return {
            carrier: carrier.value,
            driver: driver.value,
            licensePlate: licensePlate.value,
            driverPhoto: driverPhoto.value, 
            email: email.value,
          };

        }
          
      },
    });
    
    if (isConfirmed) {
      console.log('form res',formResult.driverPhoto);
      if (formResult.carrier === "" || formResult.driver === "" || formResult.licensePlate === "" || formResult.driverPhoto ===""  ||  formResult.email === "") 
      { 
       Swal.fire('All fields are mandatory!', '', 'error');
      // this.openPopupForOutsideVendor();
       //this.toast();
       this.errorToast();
      }
      else
      {
        this.model.Type="Outside Vendor"
        this.model.Carir_Nme=formResult.carrier,
        this.model.Nme=formResult.driver;
        this.model.Lcns_Plt_Nmbr=formResult.licensePlate;
        this.model.Id_Img=formResult.driverPhoto;
        this.model.Rpnt=formResult.email;
        this.model.ShptNmbr=this.shpNo;
        this.apiService.postDriverDetail(this.model).subscribe(
          (response:string[])=>{
            console.log("response from driverdetails",response);
            Swal.fire({
              title: 'Thank You',
              text: 'Driver Detail Added Successfully',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000 
            });
          },
          (error)=>{
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: 'Error Occured',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000 
            });
          },
          ()=>{
          console.log("COmplete api call");
          }
        );     
       }
      
    }
  }

backToShipment()
{
  this.router.navigate(['/receivings']);
}

  async succesToast(){
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
    });
    
    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully'
    });
  }

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
    });
    
    Toast.fire({
      icon: 'error',
      title: 'Error Occured'
    });
  }
}
