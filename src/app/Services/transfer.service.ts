import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Shipment } from '../Models/shipment';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  localUrl="https://localhost:7196/api/Transfer";
  prodUrl="https://pwswarehouseapi.azurewebsites.net/api/Transfer"
  private apiUrl = this.prodUrl;
   qrs:any;
   rcptNmbrs:any;
   shipNum:any;
   rowdata:any;
   shipmentData!:Shipment;
  constructor(private http: HttpClient) {}



  public getAllTransfers(page:number,pageSize:number): Observable<any[]> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get<any[]>(this.apiUrl,{params}).pipe(catchError(this.handleError));
  }

 //generate receipt numbers
public GenerateReceiptNumbers(qnty: number,lastrcpNo:string): Observable<string[]> 
 {
   const url = `${this.apiUrl}/GenerateReceiptNumber?qnty=${qnty}&lastrcpNo=${lastrcpNo}`;

   return this.http.get<string[]>(url)
     .pipe(catchError(this.handleError));
 }

 //upload image to the root foler 
//  public UploadImage(formData: FormData)
//  {

//   const LocUrl="https://localhost:7196/api/Transfer/UploadImage";
  
//   return this.http.post(LocUrl, formData, {
//             reportProgress: true,
//             observe: 'events'
//         })
//         .pipe(
//           catchError(this.handleError)
//         );
//  }

 //save transfer shipment data
  public postFormData(data: Shipment): Observable<string[]> 
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<string[]>(this.apiUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: any) {
    // You can handle errors as per your application's requirements.
    console.error('An error occurred:', error.error);
    return throwError(error.error);
  }

  public postDriverDetail(data: any): Observable<string[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var producurl="https://pwswarehouseapi.azurewebsites.net/api/Transfer_Driver";
    var locurl="https://localhost:7196/api/Transfer_Driver";
    return this.http.post<string[]>(producurl, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
