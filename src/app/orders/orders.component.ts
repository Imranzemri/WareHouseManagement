import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ApiService } from '../api.service';
import { Shipment } from '../Models/shipment';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { QrcodeService } from '../qrcode.service';
import { Route, Router } from '@angular/router';
import { MessageService } from '../messsage.service';
import { NotificationsService } from 'angular2-notifications';
import Swal from 'sweetalert2';
import { Subscription, finalize } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
    ])
  ]
})
export class OrdersComponent {
  requiredFileType:string='';

  fileName = '';
  uploadProgress:number=0;
  uploadSub: Subscription;

  @ViewChild('fileInput') fileInput!: ElementRef;
  model: Shipment = new Shipment();
  form: FormGroup;
  selectedFile: File | undefined;
   imageBytes: ArrayBuffer | string | null;
  uploadedImages: File[] = [];
  qrCodeData: string[] = [];
  errorMessage!: string;
  emptyFields: string[] = [];
  showSpinner: boolean = false;

  validationStatus = {
    clientName: true,
    shipmentNo: true,
    pieces: true,
    dimensions: true,
    weight: true,
    bayLocation: true,
    note: true,
    images: true,
    email: true,
  };
  imagesArray: string[] = [];
  dimensionsArray: string[] = [];
  weightArray: string[] = [];
  dimensionSelectedOption:string='' ;
  weightSelectedOption: string = '' ;
  disableDimensionField:boolean = true;
  disableWeightField:boolean = true;
  lenght!:number;;
  width!:number;
  height!:number;
  weight!:number;
  disableAddbtn:boolean = true;
  disableWghtAddBtn:boolean = true;
  qty!:number |null;
  totalWeight:string='';
  totalDimnsn:string=''

  constructor(private http: HttpClient,private apiService: ApiService, private fb: FormBuilder, private qrCodeService: QrcodeService, private router: Router,private _service:NotificationsService) {
    this.model = new Shipment();
    this.form = this.fb.group({
      file: [''],
    });
    this.imageBytes = null;
    this.imagesArray = [];
    this.dimensionsArray=[];
    this.uploadSub = new Subscription();


  }

  dimensionOptionSelected(option: string) {
    this.dimensionSelectedOption = option;
    this.disableDimensionField = false;
  }
  weightOptionSelected(option: string) {
    this.weightSelectedOption = option;
    this.disableWeightField=false;
  }

  //for adding dimensions
  addDimension(l:any,w:any,h:any) {
    if(l==null || w==null || h==null) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "Please Enter Value", 
      });
      return;
    }
    if(this.dimensionSelectedOption=='cm')
    {
      if(this.model.Length==0 || this.model.Length)
      {
        this.model.Length  +=parseFloat(l);
        
      }
      if(this.model.Width==0 || this.model.Width){
        this.model.Width +=parseFloat(w);
      }
      if(this.model.Height==0 || this.model.Height){
        this.model.Height +=parseFloat(h);
      }
    
    
      this.dimensionsArray.push(`Length=${this.model.Length} Width=${this.model.Width} Height=${this.model.Height}`);
      if(this.model.Qnty==this.dimensionsArray.length)
     {
      this.disableAddbtn=true;
      this.disableDimensionField=true;
     }
     else
     {
      this.disableAddbtn=false;
     }
      this.totalDimnsn= `L=${this.model.Length}  W=${this.model.Width} H=${this.model.Height}`;
      this.lenght=0;
      this.width=0;
      this.height=0;
   
    }
    else if (this.dimensionSelectedOption=='in')
    {
      if(this.model.Length==0 || this.model.Length)
      {
        this.model.Length  +=parseFloat(l);
        
      }
      if(this.model.Width==0 || this.model.Width){
        this.model.Width +=parseFloat(w);
      }
      if(this.model.Height==0 || this.model.Height){
        this.model.Height +=parseFloat(h);
      }
    
    
      this.dimensionsArray.push(`Length=${this.model.Length} Width=${this.model.Width} Height=${this.model.Height}`);
      if(this.model.Qnty==this.dimensionsArray.length)
     {
      this.disableAddbtn=true;
      this.disableDimensionField=true;
     }
     else
     {
      this.disableAddbtn=false;
     }
      this.totalDimnsn= `L=${this.model.Length}  W=${this.model.Width} H=${this.model.Height}`;
      this.lenght=0;
      this.width=0;
      this.height=0;
   
    }
}

//disable/enable fields and add buttons
enableAddDimBtn()
{
  if (this.model) 
  { 
      this.qty=this.model.Qnty
    if(this.qty ? true : false){
      //for weight fieds and button
      if(this.qty! > this.weightArray.length)
      {
        if(this.weightSelectedOption =='')
        {
          this.disableWeightField=true;
        }
        else
        {
          this.disableWeightField=false;
        }
        this.disableAddbtn=false;
        this.disableWghtAddBtn=false;
      }
      else
      {
        this.disableAddbtn=true;
        this.disableWghtAddBtn=true;
        this.disableWeightField=true;
        this.disableDimensionField=true;
      }
      //for dimensions field and button
      if(this.qty! > this.dimensionsArray.length)
      {
        if(this.dimensionSelectedOption=='')
        {
          this.disableDimensionField=true;
        }
        else{
          this.disableDimensionField=false;
        }
        this.disableAddbtn=false;
        this.disableWghtAddBtn=false;
      }
      else
      {
        this.disableAddbtn=true;
        this.disableWghtAddBtn=true;
        this.disableWeightField=true;
        this.disableDimensionField=true;
      }
    
      
    }
    // else{
    //   this.disableAddbtn=true;
    //   this.disableWghtAddBtn=true;
    //   this.disableWeightField=true;
    // }
  }

}

//for adding weight either in kg or lbs
  addWeight(wght:any)
  {
    if(wght==null || wght==undefined || wght=='') {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "Please Enter Value", 
      });
      return;
    }
    if(this.weightSelectedOption=="kg")
    {
      if(this.model.Qnty && this.model.Qnty >0)
      {
        if(this.model.Wght==0 || this.model.Wght)
        {
          this.model.Wght += parseFloat(wght);
          this.weightArray.push(wght);
        }
        this.totalWeight=`${this.model.Wght}kg`;
        this.weight=0;
        if(this.model.Qnty==this.weightArray.length){
         this.disableWghtAddBtn=true;
         this.disableWeightField=true;
        }
        else
        {
          this.disableWghtAddBtn=false;
          this.disableWeightField=false;
        }
      }
      else
      {
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: "Please Enter Number Of Pieces First", 
        });
        return;
      }
    }
    else if(this.weightSelectedOption=="lb")
    {
      if(this.model.Qnty && this.model.Qnty >0)
      {
        if(this.model.Wght==0 || this.model.Wght)
        {
          this.model.Wght += parseFloat(wght);
          this.weightArray.push(wght);
        }
        this.totalWeight=`${this.model.Wght}kg`;
        this.weight=0;
        if(this.model.Qnty==this.weightArray.length){
         this.disableWghtAddBtn=true;
         this.disableWeightField=true;
        }
        else
        {
          this.disableWghtAddBtn=false;
          this.disableWeightField=false;
        }
      }
      else
      {
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: "Please Enter Number Of Pieces First", 
        });
        return;
      }
    }
    
   
  }
  onSubmit() {
    if (this.validateFormFields()) {
      this.convertArrayToJson();
      this.showSpinner = true;
      Swal.showLoading();
      this.apiService.postFormData(this.model).subscribe(
        (response: string[]) => {
          console.log('Response:', response);
          this.generateQRCodeData(response);
          //Swal.close();
          Swal.fire({
            title: 'Thank You',
            text: 'Form submitted successfully',
            icon: 'success',
            showConfirmButton: false,
            timer: 3000 
          });
          this.router.navigate(['/success']);
        },
        (error) => {
          // Handle the error here
          console.error('Error:', error);
          this.showSpinner = false; 
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error, 
          });
        },
        () => {
          this.showSpinner = false; 
          //Swal.close();
      }
      
      );
    }
    else{
      this.displayError();
    }
  }
  convertArrayToJson() {
   // this.model.Imgs = JSON.stringify(this.imagesArray);
    this.model.Imgs=JSON.stringify(this.imageBytes);
  }
  // Define a function to validate a specific field
  validateField(fieldName: string) {
    switch (fieldName) {
      case 'clientName':
        this.validationStatus.clientName = !!this.model.Name;
        break;
      case 'shipmentNo':
        this.validationStatus.shipmentNo = !!this.model.ShptNmbr;
        break;
      case 'pieces':
         this.enableAddDimBtn();
        this.validationStatus.pieces = !!this.model.Qnty;
        break;
      case 'dimensions':
        this.validationStatus.dimensions = !!this.model.Dmnsn;
        break;
      case 'weight':
        this.validationStatus.weight = !!this.model.Wght;
        break;
      case 'bayLocation':
        this.validationStatus.bayLocation = !!this.model.Locn;
        break;
      case 'note':
        this.validationStatus.note = !!this.model.Note;
        break;
      case 'images':
        this.validationStatus.images = Array.isArray(this.imagesArray) && this.imagesArray.length > 0;
        break;
      case 'email':
        this.validationStatus.email = !!this.model.Rpnt;
        break;
      default:
      // Handle other fields or unknown fields here
    }
  }
  // Define a function to validate all fields
  validateFormFields() {
    this.validateField('clientName');
    this.validateField('shipmentNo');
    this.validateField('pieces');
    this.validateField('dimensions');
    this.validateField('weight');
    this.validateField('bayLocation');
    this.validateField('note');
    this.validateField('images');
    this.validateField('recipients');
    // Check if any field failed validation
    return !Object.values(this.validationStatus).some((status) => !status);
  }
  // onFileChange(event: any) {
  //   // const file = event.target.files[0];
  //   // if (file) {
  //   //   this.form.get('file')?.setValue(file);
  //   //   this.convertToBase64();
  //   //   this.imagesArray.push(file.name);
  //   // }
  //   this.selectedFile=event.target.files[0];
  //   this.convertToBase64();
  // }


  onFileChange(event:any) {
    if(this.model.ShptNmbr==''){
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "Please add Shipment number first", 
      });
      return;
    }
    const file:File = event.target.files[0];
  
    if (file) {
        this.fileName = file.name;
        const formData = new FormData();
        formData.append("thumbnail", file);

        const upload$ = this.http.post("https://localhost:7196/api/Shipment/UploadImage", formData, {
            reportProgress: true,
            observe: 'events'
          //   headers: {
          //     'Content-Type': 'multipart/form-data' // Ensure the proper content type is set
          // }
        })
        .pipe(
            finalize(() => this.reset())
        );
      
        this.uploadSub = upload$.subscribe(event => {
          this.uploadProgress=20;
          if (event.type == HttpEventType.UploadProgress) {
            if (event.total) {
              this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          }
           
          }
        });
        this.imagesArray.push(file.name);
        this.uploadProgress=100;
    }
}

cancelUpload() {
this.uploadSub.unsubscribe();
this.reset();
}

reset() {
this.uploadProgress = 0;
this.uploadSub = new Subscription();

}


  // convertToBase64() {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(this.selectedFile as Blob);
  //   reader.onload = () => {
  //     this.imageBytes = reader.result;
  //   };
  //   reader.onerror = (error) => {
  //     console.log('Error: ', error);
  //   };
  // }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async generateQRCodeData(response:string[]): Promise<void> {
    // const warehouseReceiptNo = 'WR1000'; // Replace with your logic to generate the receipt number
     if (this.model.Qnty !== null) {
       for (let i = 1; i <= this.model.Qnty; i++) {
         const qrCodeData = `Receipt Number: ${response[i-1]}\nClient: ${this.model.Name}\nShipment No: ${this.model.ShptNmbr}`;
         try {
           const qrCodeUrl = await this.qrCodeService.generateQRCode(qrCodeData);
           this.qrCodeData.push(qrCodeUrl);
         } catch (error) {
           console.error('Error generating QR code:', error);
         }
       }
       this.apiService.qrs = this.qrCodeData;
       this.apiService.rcptNmbrs=response;
     }
   }

   ngAfterViewInit(){
    this._service.info(
      'Welcome',
      'Welcome to the Cargo',
      {
        position: ['top', 'right'],
          timeOut: 4000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
      }
  )
}

displayError(){
  this._service.error(
    'Error',
    'All fields are mandatory',
    {
      position: ['top', 'right'],
        timeOut: 4000,
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
    }
)
}
}

