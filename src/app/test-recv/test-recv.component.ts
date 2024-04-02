import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { OrderService } from '../Services/order.service';
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
import { ApiService } from '../Services/api.service';
import { ImageuploadService } from '../Services/imageupload.service';
import { JsonProperty } from 'json2typescript';

interface ReceiptNumberArrayItem
{
  RcptNmbr:string;
}
interface WeightArrayItem {
  wght: number;
  rcptNmbr: string;
  shptNmbr: string;
  wunit:string;
  ptype:string;
  qnty:number;
  Locn:string;
  GoodDesc:string;
}
interface DimensionArrayItem{
  lngth: number;
  width:number;
  height:number;
  rcptNmbr: string;
  shptNmbr: string;
  dunit:string;
  ptype:string;
  qnty:number;
  Locn:string;
  GoodDesc:string;
}
@Component({
  selector: 'app-test-recv',
  templateUrl: './test-recv.component.html',
  styleUrls: ['./test-recv.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
    ])
  ]
})
export class TestRecvComponent {
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
  dimensionsArray: DimensionArrayItem[] = [];
  weightArray: WeightArrayItem[] = [];
  dimensionSelectedOption:string='' ;
  weightSelectedOption: string = '' ;
  disableDimensionField:boolean = true;
  disableWeightField:boolean = true;
  lenght!:number;;
  width!:number;
  height!:number;
  weight!:number;
  totalPieces:number=0;
  Loc:string[] = [];
  GdDesc: string[] = [];
  disableAddbtn:boolean = true;
  disableWghtAddBtn:boolean = true;
  qty!:number |null;
  totalWeight:number=0;
  totalDimnsn:string=''
  cardDescription:string='';
  indicator:boolean=true;
  pTypeSelected:string='';
  rcptNoCount:number=0;
  rcptCountDim:number=0;
  receiptNumberArray: ReceiptNumberArrayItem[] = [];
  recordToAdd:number=0;
  recordToAddWght:number=0;
  imageCounter!:number;
  @JsonProperty('Qnty', Number) // Use the JsonProperty decorator
  Qnty: number | null = null;
  pieces: any[] = [];
  showLoader=false;
  constructor(private http: HttpClient,private apiService: ApiService,private imageUploadServc:ImageuploadService,private orderService:OrderService, private fb: FormBuilder, private qrCodeService: QrcodeService, private router: Router,private _service:NotificationsService) {
    this.model = new Shipment();
    this.form = this.fb.group({
      file: [''],
    });
    this.imageBytes = null;
    this.imagesArray = [];
    this.dimensionsArray=[];
    this.uploadSub = new Subscription();

   
  }

   generatePieces() {
    if (this.totalPieces !== null) { 
      this.showLoader=true;
      this.pieces = Array.from({ length: this.totalPieces }, (_, index) => ({
        id: index + 1,
        weight: '', 
        length: '', 
        width: '', 
        height: '' ,
        Loc:'',
        GdDesc:''
      }));
    }
    this.showLoader=false;
  }

  dimensionOptionSelected(option: string) {
    this.dimensionSelectedOption = option;
    this.disableDimensionField = false;
  }
  weightOptionSelected(option: string) {
    this.weightSelectedOption = option;
    this.disableWeightField=false;
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


  //submit form
  onSubmit() {
    if (!this.validateFormFields()) {
      this.model.Sts="Draft";
      this.convertArrayToJson();
      this.showSpinner = true;
      this.setWeightAndDimension();
      //set total rcpt nmbers to model array
      this.model.RcptNmbr=[];
      this.model.RcptNmbr=this.receiptNumberArray;
      this.model.Qnty=this.totalPieces;
      this.model.InsrBy = 'pwswarehouse.user';
      this.model.UpdtBy = 'pwswarehouse.user';
      //this.model.InsrDate = new Date('2024-03-22 21:57:45.643');
      //this.model.UpdtDate = new Date('2024-03-22 21:57:45.643');
      Swal.showLoading();
      this.apiService.postFormData(this.model).subscribe(
        (response: string[]) => {
          console.log('Response:', response);
          this.generateQRCodeData(response);
          //Swal.close();
          Swal.fire({
            title: 'Thank You',
            text: 'Form submitted successfully! Please go to Review Receiving to review Shipment details.',
            icon: 'success',
            showConfirmButton: true,
            timer: 10000 
          });
          this.apiService.shipmentData=this.model;
         // this.router.navigate(['/shipment-detail']);
          //this.router.navigate(['/success']);

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


  public setWeightAndDimension(){
    for(let i=0; i<this.pieces.length; i++){
      const dimensionItem={
        lngth: this.pieces[i].length,
        width: this.pieces[i].width,
        height: this.pieces[i].height,
        Locn: this.pieces[i].Loc,
        GoodDesc: this.pieces[i].GdDesc,
        dunit:  this.dimensionSelectedOption,
        shptNmbr: this.model.ShptNmbr,
        rcptNmbr: this.receiptNumberArray[i].RcptNmbr,
        ptype: '',
        qnty: 1
      };
      this.model.DimensionCollection.push(dimensionItem);

      const weightItem = {
        wght: this.pieces[i].weight,
        shptNmbr: this.model.ShptNmbr,
        wunit: this.weightSelectedOption,
        Locn: this.pieces[i].Loc,
        GoodDesc: this.pieces[i].GdDesc,
        rcptNmbr: '',
        ptype: '',
        qnty: 1
      };
      this.model.WeightCollection.push(weightItem);
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
        // this.setCounter();
        this.validationStatus.pieces = !!this.model.Qnty;
        break;
      // case 'dimensions':
      //   this.validationStatus.dimensions = !!this.model.Dmnsn;
      //   break;
      // case 'weight':
      //   this.validationStatus.weight = !!this.model.Wght;
      //   break;
      case 'bayLocation':
        this.validationStatus.bayLocation = !!this.model.Locn;
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
    //this.validateField('dimensions');
    //this.validateField('weight');
    this.validateField('bayLocation');
    //this.validateField('images');
    this.validateField('recipients');
    // Check if any field failed validation
    return !Object.values(this.validationStatus).some((status) => !status);
  }


  //on file uploading
  public onFileChange(event:any)
  {
    if(this.model.ShptNmbr=='')
    {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "Please add Shipment number first", 
      });
      return;
    }
    const file:File = event.target.files[0];
  
    if (file) {
        this.fileName = this.model.ShptNmbr + '_' + file.name;
        const formData = new FormData();
        formData.append("thumbnail", file,this.fileName);     
        this.uploadSub = this.imageUploadServc.UploadImage(formData).subscribe(event => {
          this.uploadProgress=20;
          if (event.type == HttpEventType.UploadProgress)
           {
            if (event.total) {
              this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          } 
          }
        },
        () => {
          this.reset();
        },
        () => {
          //  Swal.fire({
          //   icon: 'error',
          //   title: 'Upload Error',
          //   text: "Please Upload Image Again!", 
          // });
          // return;
          console.log('image upload error');
        }
        );
        this.imagesArray.push(this.fileName);
        this.uploadProgress=100;
        if(this.pTypeSelected=="Identical")
        {
          this.imageCounter++;
        }
        
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


  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async generateQRCodeData(response:string[]): Promise<void> {
    
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
       this.apiService.shipNum=this.model.ShptNmbr;
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

//Generate receipt numbers
generateReceiptNumbers(qnty:any)
{
  // if(this.pTypeSelected=='')
  // {
  //   Swal.fire({
  //     icon: 'info',
  //     title: 'Information',
  //     text: "Please Select Product Type First", 
  //   });
  //   return;
  // }
  if(!qnty)
    {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "Please Enter No. of pieces", 
      });
      return;
    }

  this.rcptNoCount=0;
  this.rcptCountDim=0;
  this.recordToAdd=0;
  this.recordToAddWght=0;
  let lastRcptNmbr="null";
  // if(this.receiptNumberArray.length >0)
  // {
  //    lastRcptNmbr = this.receiptNumberArray[this.receiptNumberArray.length-1].RcptNmbr;
  // }
  Swal.showLoading();
  this.apiService.GenerateReceiptNumbers(qnty,lastRcptNmbr).subscribe(
 (response:String[])=>{
console.log(response);
this.model.RcptNmbr=[];
for (let i = 0; i < response.length; i++) {
  let receiptItem: ReceiptNumberArrayItem = {
    RcptNmbr: response[i].toString()
  };
  this.model.RcptNmbr?.push(receiptItem);
  this.receiptNumberArray.push(receiptItem);
}
  },
  () =>
  {
    console.log("error");
  },
  ()=>{
    console.log("success");
    Swal.close();
    this.imagesArray=[];
  }
  );
}



//check for Duplicate Shipment Number 
public checkDuplicateShipment(shpNmbr:string)
{
  this.apiService.checkDuplicateShipmentNumber(shpNmbr).subscribe(
    (response: string)=>{
      console.log(response);
     // this.toast();
    },
    (error)=>{
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "This Shipment Number already exists",
      });
      return;
      console.log(error);
    }
  );
}
}
