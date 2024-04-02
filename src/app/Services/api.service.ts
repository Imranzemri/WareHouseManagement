import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Shipment } from '../Models/shipment';




@Injectable({
  providedIn: 'root'
})
export class ApiService {



  localUrl = "https://localhost:44362/api/Shipment";
  prodUrl = "https://pwswarehouseapi.azurewebsites.net/api/Shipment";
  private apiUrl = this.prodUrl;

  urlEndPoint:any;
  qrs: any;
  rcptNmbrs: any;
  shipNum: any;
  rowdata: any;
  sts:any[] =[];
  shipmentData!: Shipment;
  constructor(private http: HttpClient) { }

  //post request for Receiving records
  postFormData(data: Shipment): Observable<string[]> {
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

  //check Dupllicate Sipment Number
  checkDuplicateShipmentNumber(shipmentNumber: string): Observable<any> {
    const params = { shipmentNumber };
    return this.http.get<any>(this.apiUrl + '/CheckDuplicateShipmentNumber', { params })
      .pipe(catchError(this.handleError));
  }





  private handleError(error: any) {
    // You can handle errors as per your application's requirements.
    console.error('An error occurred:', error.error);
    return throwError(error.error);
  }


  //Get request for Receiving
   getAllShipments(page: number, pageSize: number):Observable<any[]>{
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get<any[]>(this.apiUrl+'/GetShipments', { params }).pipe(catchError(this.handleError));
  }


   getShipmentsById(shpNmbr:string):Observable<any[]>{
    const params = { shpNmbr: shpNmbr.toString() };
    return this.http.get<any[]>(this.apiUrl+'/GetShipmentById', { params }).pipe(catchError(this.handleError));
  }

  //Get request for Receiving
  getUpdatedShipments(page: number, pageSize: number): Observable<any[]> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get<any[]>(this.apiUrl+'/GetUpdatedShipments', { params }).pipe(catchError(this.handleError));
  }






  //post request for Receiving Driver details
  postDriverDetail(data: any): Observable<string[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var producurl = "https://pwswarehouseapi.azurewebsites.net/api/Drivers";
    var locurl = "https://localhost:7196/api/Drivers";
    return this.http.post<string[]>(producurl, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLocationAndDescription(locn:string, desc:string, rcpNumber:string, shipmentNo:string):Observable<any[]>
  {
    const data:any= {locn:locn, description:desc, rcptNumber:rcpNumber, shipmentNo:shipmentNo};
    const httpOptions={
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.put<string[]>(this.localUrl+'/UpdateLocationAndDescription', data, httpOptions)
               .pipe(catchError(this.handleError));
  }

  //generate receipt numbvers
  GenerateReceiptNumbers(qnty: number, lastrcpNo: string): Observable<string[]> {
    const url = `${this.apiUrl}/GenerateReceiptNumber?qnty=${qnty}&lastrcpNo=${lastrcpNo}`;

    return this.http.get<string[]>(url)
      .pipe(catchError(this.handleError));
  }
}
