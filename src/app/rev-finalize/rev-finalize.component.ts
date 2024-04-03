import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ApiService } from '../Services/api.service';
import { ImageuploadService } from '../Services/imageupload.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
  
  (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  selector: 'app-rev-finalize',
  templateUrl: './rev-finalize.component.html',
  styleUrls: ['./rev-finalize.component.css']
})
export class RevFinalizeComponent implements OnInit{


  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['ShptNmbr','Name','InsrDate','WHFile','CWFile'];
  dataSource = new MatTableDataSource<any>();
  shipmentData: any[];
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 1;
  showSpinner: boolean = false;
  uploadSub: Subscription;
  isLoading=false;
  shpNo:string = '';
  status:any[]=[];
  shpNos:any[]=[];
  shpDetailsForPdf:any[]=[];
  shpDetailsForCSV:any[]=[];
  apiResponseReceived=false;
  constructor(private http: HttpClient,private apiService: ApiService,private imageUploadServc:ImageuploadService,private router: Router){
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
   Swal.showLoading();
    this.apiService.getUpdatedShipments(this.pageIndex,this.pageSize).subscribe(
      (response:any)=>{
        this.shipmentData=response.items;
        this.dataSource.data=this.shipmentData;
        this.totalRecords=response.totalCount;
        this.apiService.sts =[];
        for(const obj of response.items){
             this.status.push(obj.sts);
             this.shpNos.push(obj.shpNmbr);
        }
        //this.dataSource.paginator = this.paginator;
      },
      (error)=>{
        console.log("Api call failed",error);
        Swal.close();
      },
      () => {
        Swal.close();
        //this.isLoading=false;
    }
    );
  }

   getDetailByIdForPdf(shipmentNo:string){
     this.apiService.getShipmentsById(shipmentNo).subscribe(
     (response:any)=>{
      debugger;
      this.transformData(response.items[0]);
      this.totalRecords = response.totalCount;
      console.log('details data '+response.items);
      this.apiResponseReceived = true;
      this.generatePdf();
     });
  }

  getDetailByIdForExcel(shipmentNo:string){
    this.apiService.getShipmentsById(shipmentNo).subscribe(
    (response:any)=>{
     debugger;
     this.transformData(response.items[0]);
     this.totalRecords = response.totalCount;
     console.log('details data '+response.items);
     this.apiResponseReceived = true;
     this.exportToExcel();
    });
 }

 getDetailByIdForCsv(shipmentNo:string){
  this.apiService.getShipmentsById(shipmentNo).subscribe(
  (response:any)=>{
   debugger;
   this.transformCWData(response.items[0]);
   this.totalRecords = response.totalCount;
   console.log('details data '+response.items);
   this.apiResponseReceived = true;
   this.exportToCSV();
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
    this.shpDetailsForPdf = displayedItems;
   
}

transformCWData(data: any) {
  debugger;
  const displayedItems: DisplayedItem[] = [];
  const dimensionCollection: any[] = data.dimensionCollection;
  const weightCollection = data.weightCollection;

  if (dimensionCollection) {
    // Create a map to group items by their dimensions
    const dimensionMap = new Map<string, DisplayedItem>();

    dimensionCollection.forEach((dimensionItem: any, index: number) => {
      // Generate a key for the current dimensions
      const key = `${dimensionItem.lngth}-${dimensionItem.width}-${dimensionItem.height}-${dimensionItem.dUnit}`;

      // Check if an item with the same dimensions exists in the map
      if (dimensionMap.has(key)) {
        // If exists, update weight and packs
        const existingItem = dimensionMap.get(key)!;
        existingItem.wght += weightCollection[index]?.wght || 0;
        existingItem.plt++;
      } else {
        // If not, create a new item and add it to the map
        const newItem: DisplayedItem = {
          plt: 1,
          lngth: dimensionItem.lngth,
          width: dimensionItem.width,
          height: dimensionItem.height,
          dunit: dimensionItem.dUnit,
          wght: weightCollection[index]?.wght || 0,
          wunit: weightCollection[index]?.wUnit || '',
          locn: dimensionItem.locn,
          gooddesc: dimensionItem.goodDesc,
          rcpNumber: dimensionItem.rcptNmbr,
          sts:data.sts
        };
        dimensionMap.set(key, newItem);
      }
    });

    // Convert the map values to an array
    displayedItems.push(...dimensionMap.values());
  }

  this.shpDetailsForCSV = displayedItems;
}


  exportToExcel(): void {


      if(this.apiResponseReceived)
      {
       
         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.shpDetailsForPdf);
         const wb: XLSX.WorkBook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(wb, ws, 'data');
         XLSX.writeFile(wb, 'Finalized Warehouse Data.xlsx');
      }
      else{
        console.error('API response has not been received yet. Unable to export to pdf.');
      }
  }

  // exportToExcel(): void {
  //   if (this.apiResponseReceived) {
  //     const columnNames = ['PLT', 'L', 'W', 'H', 'UD', 'W', 'UW'];
  //     const headerRow = [columnNames];
  //     const dataRows = this.shpDetailsForPdf.map(item =>
  //       columnNames.map(columnName => item.pl)
  //     );
  
  //     const ws: XLSX.WorkSheet = XLSX.utils.book_new();
  //     XLSX.utils.sheet_add_json(ws, headerRow, { origin: 'A1', skipHeader: true });
  //     XLSX.utils.sheet_add_json(ws, dataRows, { origin: 'A2', skipHeader: false });
  
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'data');
  //     XLSX.writeFile(wb, 'Finalized Warehouse Data.xlsx');
  //   } else {
  //     console.error('API response has not been received yet. Unable to export to excel.');
  //   }
  // }

  exportToCSV(): void {

    const columnNames = ['PLT#', 'L', 'W', 'H', 'UD', 'Weight (KGM)', 'UW', 'Location', 'Goods Description', 'Receipt Number', 'Status'];
    const dataWithColumnNames = [...this.shpDetailsForCSV.map(item => {
      debugger;
      return [
        item.plt,
        item.lngth,
        item.width,
        item.height,
        item.dunit,
        item.wght,
        item.wunit,
        item.locn,
        item.goodDesc,
        item.rcpNumber,
        item.sts
      ];
    })];
  
    const csv = Papa.unparse({
      fields: columnNames,
      data: dataWithColumnNames
    });
  
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'Finalized CW Data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  
    
    generatePdf() {

      if(this.apiResponseReceived)
      {
        const tableBody = this.shpDetailsForPdf.map(item => [item.plt, item.lngth, item.width, item.height,item.dunit, item.wght,item.wunit]);
        const pdfDefinition: any = {
          pageSize: 'A4',
          pageMargins: [40, 50, 40, 40],
          defaultStyle: {
            columnGap: 10
          },
          header: {
            alignment: 'center',
            text: 'Project: WARE HOUSE MANAGEMENT- Priority WorldWide',
            style: 'header'
          },
          content: [
            {
              columns: [
                {
                  text: 'P.O.',
                  style: 'subheader'
                },
                {
                  alignment: 'center',
                  text: 'Truck # 55',
                  style: 'subheader'
                },
                {
                  alignment: 'center',
                  text: 'Supplier: zz',
                  style: 'subheader'
                },
                {
                  alignment: 'center',
                  text: 'DATE: 31-1-24',
                  style: 'subheader'
                }
              ]
            },
            {
              block: {
                margin: [0, 60, 0, 0] 
              },
              table: {
                widths: ['*', '*', '*', '*', '*','*','*'],
                body: [
                  ['PLT', 'L', 'W', 'H','UD','W','UW'],
                  ...tableBody
                  // ['1', '48\'', '40"', '86', '169', '27'],
                  // ['2', '84', '174', '28', '3', '85'],
                  // ['22', '87', '259', '23', '87', '238'],
                  // ['23', '87', '238', '24', '85', '243'],
                  // ['24', '85', '243', '25', '83', '202'],
                  // ['25', '83', '202', '6', '87', '27']
                ]
              }
            }
          ],
          styles: {
            header: {
              bold: true,
              fontSize: 14
            },
            subheader: {
              fontSize: 12
            }
          }
        };
      
        pdfMake.createPdf(pdfDefinition).download('Finalized Warehouse Data.pdf');
      }
      else{
        console.error('API response has not been received yet. Unable to export to pdf.');
      }
      }
      
  }


 


