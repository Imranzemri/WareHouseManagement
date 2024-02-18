import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TransferService } from '../Services/transfer.service';
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

interface ReceiptNumberArrayItem
{
  RcptNmbr:string;
}
@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
    ])
  ]
})
export class TransfersComponent {
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
  totalWeight:number=0;
  totalDimnsn:string=''
  counter!:number;
  cardDescription:string='';
  indicator:boolean=true;
  pTypeSelected:string='';
  rcptNoCount:number=0;
  rcptCountDim:number=0;
  totalPieces:number=0;
  receiptNumberArray: ReceiptNumberArrayItem[] = [];
  recordToAdd:number=0;
  recordToAddWght:number=0;
  imageCounter!:number;

  //constructor function
  constructor(private http: HttpClient,private apiService: ApiService,private imageUploadServc:ImageuploadService,private transferService:TransferService, private fb: FormBuilder, private qrCodeService: QrcodeService, private router: Router,private _service:NotificationsService) {
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

  //selecting product type
  pTypeOptionSelected(option: string)
  {
    this.pTypeSelected=option;

    if(this.pTypeSelected =="Identical")
    {
      this.cardDescription="Please Enter Dimension and Weight for all Pieces at Once"
    }
    else
    {
      this.cardDescription=`Please add Dimension, Weight and Picture for Piece no. ${this.counter}`;
    }
  }

  //adding fixtures for individual piece
  addWeightandDimension(len:any,wid:any,hgt:any,wgt:any)
  {
    if(wgt==null || wgt==undefined || wgt=='' || wgt==0) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "Please Enter Weight", 
      });
      return;
    }
    if(len==null || wid==null || hgt==null || len==0 || wid==0 || hgt==0) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: "Please Enter Dimensions", 
      });
      return;
    }

    this.addWeight(wgt);
    this.addDimension(len,wid,hgt);
    if(this.counter==this.model.Qnty)
    {
      this.counter = 0
      this.indicator=false;
      //this.cardDescription="All Infiormation Added."
      this.rcptNoCount=0;
      this.rcptCountDim=0;
    }
    else
    {
      this.counter++;
      this.cardDescription=`Please add Dimension, Weight and Picture for Piece no. ${this.counter}`;

    }
  }

  //for adding dimensions
  addDimension(l:any,w:any,h:any) 
  {
    if(this.dimensionSelectedOption=='cm')
    {
      if(this.pTypeSelected=="Distinct")
      {

          const row:any={
            lngth:parseFloat(l),
            width:parseFloat(w),
            height:parseFloat(h),
            rcptNmbr:this.model.RcptNmbr[this.rcptCountDim].RcptNmbr.toString(),
            shptNmbr:this.model.ShptNmbr,
            dunit:"cm",
            ptype:this.pTypeSelected,
            qnty:1
           }
           this.model.DimensionCollection.push(row);
           this.rcptCountDim++;
           this.recordToAdd++;    
      }
      if(this.pTypeSelected=="Identical")
      {
        var remainingPiece=this.model!.Qnty! -this.recordToAdd;
        const dreceiptNumbers: string[] = [];
        for(var i=0;i<remainingPiece;i++)
        {
          const currentReceiptNumber = this.model.RcptNmbr[this.rcptCountDim].RcptNmbr.toString();
         const row:any={
          lngth:parseFloat(l),
          width:parseFloat(w),
          height:parseFloat(h),
          //rcptNmbr:this.model.RcptNmbr[this.rcptCountDim].RcptNmbr.toString(),
          shptNmbr:this.model.ShptNmbr,
          dunit:"cm",
          ptype:this.pTypeSelected,
          qnty:remainingPiece
         }
         dreceiptNumbers.push(currentReceiptNumber);
         //this.model.DimensionCollection.push(row);
         this.rcptCountDim++;
         this.recordToAdd++;
         this.counter++;
         if(i==remainingPiece-1)
         {
          row.rcptNmbr=dreceiptNumbers.join(', ');
          this.model.DimensionCollection.push(row);
         }
        }
        this.indicator=false;
      }
      //this.dimensionsArray.push(`Length=${this.model.Length} Width=${this.model.Width} Height=${this.model.Height}`);
      if(this.model.Qnty==this.recordToAdd)
     {
      //this.model.Dmnsn=this.model.Length+this.model.Width+this.model.Height;
      this.disableAddbtn=true;
      this.disableDimensionField=true;
      this.rcptCountDim=0;
      this.recordToAdd=0;
     }
     else
     {
      this.disableAddbtn=false;
     }
      //this.totalDimnsn= `L=${this.model.Length}  W=${this.model.Width} H=${this.model.Height}`;
      this.lenght=0;
      this.width=0;
      this.height=0;
   
    }
    else if (this.dimensionSelectedOption=='in')
    {
    if(this.pTypeSelected=="Distinct")
    {
        const row:any={
          lngth:parseFloat(l),
          width:parseFloat(w),
          height:parseFloat(h),
          rcptNmbr:this.model.RcptNmbr[this.rcptCountDim].RcptNmbr.toString(),
          shptNmbr:this.model.ShptNmbr,
          dunit:"in",
          ptype:this.pTypeSelected,
          qnty:1
         }
         this.model.DimensionCollection.push(row);
         this.rcptCountDim++;
         this.recordToAdd++;
      
     
    }
    if(this.pTypeSelected=="Identical")
    {
      var remainingPiece=this.model.Qnty! -this.recordToAdd;
      const dreceiptNumbers:string[]=[];
      for(var i=0;i<remainingPiece;i++)
      {
        const currentReceiptNumber = this.model.RcptNmbr[this.rcptCountDim].RcptNmbr.toString();
       const row:any={
        lngth:parseFloat(l),
        width:parseFloat(w),
        height:parseFloat(h),
        rcptNmbr:this.model.RcptNmbr[this.rcptCountDim].RcptNmbr.toString(),
        shptNmbr:this.model.ShptNmbr,
        dunit:"in",
        ptype:this.pTypeSelected,
        qnty:remainingPiece
       }
       dreceiptNumbers.push(currentReceiptNumber);
       //this.model.DimensionCollection.push(row);
       this.rcptCountDim++;
       this.recordToAdd++;
       this.counter++;
       if(i==remainingPiece-1)
         {
          row.rcptNmbr=dreceiptNumbers.join(', ');
          this.model.DimensionCollection.push(row);
         }
      }
      this.indicator=false;
    }
      //this.dimensionsArray.push(`Length=${this.model.Length} Width=${this.model.Width} Height=${this.model.Height}`);
      if(this.model.Qnty==this.recordToAdd)
     {
     // this.model.Dmnsn=this.model.Length+this.model.Width+this.model.Height;
      this.disableAddbtn=true;
      this.disableDimensionField=true;
      this.rcptCountDim=0;
      this.recordToAdd=0;
     }
     else
     {
      this.disableAddbtn=false;
     }
      //this.totalDimnsn= `L=${this.model.Length}  W=${this.model.Width} H=${this.model.Height}`;
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
//set counter
setCounter()
{
  if(this.model.Qnty ?? 0 >0)
  {
    this.imageCounter=1;
    if(this.pTypeSelected == "Identical")
    {
      this.counter=1;
      this.cardDescription="Please Enter Dimension and Weight for all Pieces at Once"
    }
    else
    {
      this.counter=1;
      this.cardDescription=`Please add Dimension, Weight and Picture for Piece no. ${this.counter}`;
    }
  
  }
  if(this.model.Qnty !=this.counter)
  {
    if(this.pTypeSelected == "Identical")
    {
      this.cardDescription="Please Enter Dimension and Weight for all Pieces at Once"
      this.indicator=true;
    }
    else
    {
      this.cardDescription=`Please add Dimension, Weight and Picture for Piece no. ${this.counter}`;
      this.indicator=true;
    }
   
  }

}

//for adding weight either in kg or lbs
  addWeight(wght:any)
  {
    if(this.weightSelectedOption=="kg")
    { 
      if(this.model.Qnty && this.model.Qnty >0)
      {
        if(wght > 0)
        { 
          if(this.pTypeSelected=="Distinct")
          {
           const row: any = {
                wght: parseFloat(wght),
                rcptNmbr: this.model.RcptNmbr![this.rcptNoCount].RcptNmbr.toString(),
                shptNmbr: this.model.ShptNmbr,
                wunit:"kg",
                ptype:this.pTypeSelected.toString(),
                qnty:1
              };
              this.model.WeightCollection.push(row);
              this.rcptNoCount++;
              this.recordToAddWght++;
              this.totalWeight += parseFloat(wght);
             
          }
          if(this.pTypeSelected=="Identical")
          {
            var remainingPieces=this.model.Qnty-this.recordToAddWght;           
            const dreceiptNumbers:string[]=[];
            for(var i=0; i<remainingPieces;i++)
            {
              const currentReceiptNumber = this.model.RcptNmbr[this.rcptNoCount].RcptNmbr.toString();
              const  row: any = {
                wght: wght,
                //rcptNmbr: this.model.RcptNmbr![this.rcptNoCount].RcptNmbr.toString(),
                shptNmbr: this.model.ShptNmbr,
                wunit:"kg",
                ptype:this.pTypeSelected,
                qnty:remainingPieces
              };
              dreceiptNumbers.push(currentReceiptNumber);
              //this.model.WeightCollection.push(row);
              this.rcptNoCount++;
              this.recordToAddWght++;
              this.totalWeight += parseFloat(wght);
              this.counter++;
              if(i==remainingPieces-1)
              {
                row.rcptNmbr=dreceiptNumbers.join(', ');
                this.model.WeightCollection.push(row);
              }
            }
            this.indicator=false;
          }
        }
        // this.totalWeight=`${this.model.Wght}kg`;
        // this.weight=this.model.Wght;

        if(this.model.Qnty==this.recordToAddWght)
        {
         this.disableWghtAddBtn=true;
         this.disableWeightField=true;
         this.rcptNoCount=0;
         this.recordToAddWght=0;
        }
        else
        {
          this.disableWghtAddBtn=false;
          this.disableWeightField=false;
        }
        ///////////////////////

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
        if(wght >0)
        {
          if(this.pTypeSelected=="Distinct")
          {
            
              const row: any = {
                wght: parseFloat(wght),
                rcptNmbr: this.model.RcptNmbr![this.rcptNoCount].RcptNmbr.toString(),
                shptNmbr: this.model.ShptNmbr,
                wunit:"lb",
                ptype:this.pTypeSelected,
                qnty:1
              };
              this.model.WeightCollection.push(row);
              this.rcptNoCount++;
              this.recordToAddWght++;
              this.totalWeight += parseFloat(wght);
          
          }
          if(this.pTypeSelected=="Identical")
          {
            var remainingPieces=this.model.Qnty-this.recordToAddWght;
            let totalwt:number=0;
            const dreceiptNumbers:string[]=[];
            for(var i=0; i<remainingPieces;i++)
            {
              const currentReceiptNumber = this.model.RcptNmbr[this.rcptNoCount].RcptNmbr.toString();
              totalwt+=parseFloat(wght);
              const row: any = {
                wght: parseFloat(wght),
               // rcptNmbr: this.model.RcptNmbr![this.rcptNoCount].RcptNmbr.toString(),
                shptNmbr: this.model.ShptNmbr,
                wunit:"lb",
                ptype:this.pTypeSelected,
                qnty:remainingPieces
              };
              dreceiptNumbers.push(currentReceiptNumber);
              //this.model.WeightCollection.push(row);
              this.rcptNoCount++;
              this.recordToAddWght++;
              this.totalWeight += parseFloat(wght);
              this.counter++;
              if(i==remainingPieces-1)
              {
                row.rcptNmbr=dreceiptNumbers.join(', ');
                this.model.WeightCollection.push(row);
              }
            }
            this.indicator=false;
          }
        }
        // this.totalWeight=`${this.model.Wght}kg`;
        // this.weight=this.model.Wght;

        if(this.model.Qnty==this.recordToAddWght)
        {
         this.disableWghtAddBtn=true;
         this.disableWeightField=true;
         this.rcptNoCount=0;
         this.recordToAddWght=0;
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
      this.model.Sts="Draft";
      this.convertArrayToJson();
      this.showSpinner = true;
      //set total rcpt nmbers to model array
      this.model.RcptNmbr=[];
      this.model.RcptNmbr=this.receiptNumberArray;
      this.model.Qnty=this.totalPieces;
      Swal.showLoading();
      this.transferService.postFormData(this.model).subscribe(
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
          this.apiService.shipmentData=this.model;
          this.router.navigate(['/shipment-detail']);
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
         this.setCounter();
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
  if(this.pTypeSelected=='')
  {
    Swal.fire({
      icon: 'info',
      title: 'Information',
      text: "Please Select Product Type First", 
    });
    return;
  }
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
  if(this.receiptNumberArray.length >0)
  {
     lastRcptNmbr=this.receiptNumberArray[this.receiptNumberArray.length-1].RcptNmbr;
  }
  Swal.showLoading();
  this.transferService.GenerateReceiptNumbers(qnty,lastRcptNmbr).subscribe(
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
    this.totalPieces +=this.model.Qnty ?? 0;
    this.imagesArray=[];
  }
  );
}


//check for Duplicate Shipment Number 
public checkDuplicateShipment(shpNmbr:string)
{
  this.transferService.checkDuplicateShipmentNumber(shpNmbr).subscribe(
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
