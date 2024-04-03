import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
  
  // (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface DisplayedItem {
  lngth: number;
  width: number;
  height: number;
  dunit: string;
  wght: number;
  wunit: string;
  locn: string;
  gooddesc: string;
  packs: number;
rcpNumber:string;
}
@Component({
  selector: 'app-finalize-receiving',
  templateUrl: './finalize-receiving.component.html',
  styleUrls: ['./finalize-receiving.component.css']
})
export class FinalizeReceivingComponent implements OnInit  {
  shipmentNo:string = "";
  dataSource: MatTableDataSource<DisplayedItem> = new MatTableDataSource<DisplayedItem>();
  displayedColumns: string[] = ['pks','type','lngth','width','height','dunit','wght','wunit','gooddesc'];
  totalRecords=0;
  rcpNumber:string="";
  gooddescValue:string = "";
  
constructor(private apiService:ApiService, private router: Router)
{
  const navigation = this.router.getCurrentNavigation();
    if(navigation && navigation.extras.state){
       this.shipmentNo = navigation.extras.state['ShipmentNumber'];
    }
}


  ngOnInit() 
  {
   this.getFinalizeDetailById(this.shipmentNo);
  }

  getFinalizeDetailById(shipmentNo:string){
    this.apiService.getShipmentsById(shipmentNo).subscribe(
     (response:any)=>{
     this.transformData(response.items[0]);
      this.totalRecords = response.totalCount
      console.log('details data '+response.items);
     });
  }

  transformData(data: any) {
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
          existingItem.packs++;
        } else {
          // If not, create a new item and add it to the map
          const newItem: DisplayedItem = {
            packs: 1,
            lngth: dimensionItem.lngth,
            width: dimensionItem.width,
            height: dimensionItem.height,
            dunit: dimensionItem.dUnit,
            wght: weightCollection[index]?.wght || 0,
            wunit: weightCollection[index]?.wUnit || '',
            locn: dimensionItem.locn,
            gooddesc: dimensionItem.goodDesc,
            rcpNumber: dimensionItem.rcptNmbr
          };
          dimensionMap.set(key, newItem);
        }
      });
  
      // Convert the map values to an array
      displayedItems.push(...dimensionMap.values());
    }
  
    this.dataSource.data = displayedItems;
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
   this.apiService.updateLocationAndDescription("",this.gooddescValue,this.rcpNumber, this.shipmentNo).subscribe(
     (reponse:any)=>{
     this.gooddescValue = "";
     this.rcpNumber = "";
     this.succesToast();
     });
 }

 exportToExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'data');
  XLSX.writeFile(wb, 'table_data.xlsx');
}

exportToCSV(): void {
  const csv = Papa.unparse(this.dataSource.data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'table_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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



generatePdf() {

  const tableBody = this.dataSource.data.map(item => [item.packs, item.lngth, item.width, item.height, item.wght]);


  const pdfDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 50, 40, 40],
    defaultStyle: {
      columnGap: 10
    },
    header: {
      alignment: 'center',
      text: 'Project: 2023-2024 WINTER CLOTHES',
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
            text: 'Supplier: ROYER',
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
          widths: ['*', '*', '*', '*', '*'],
          body: [
            ['PLT', 'L', 'W', 'H', 'Weight'],
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

  pdfMake.createPdf(pdfDefinition).download('Table.pdf');
}
}
