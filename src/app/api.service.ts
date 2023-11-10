import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  localUrl="https://localhost:7196/api/Shipment";
  prodUrl="https://pwswarehouse-api.azurewebsites.net/api/Shipment"
  private apiUrl = this.localUrl
   qrs:any;
   rcptNmbrs:any;
   shipNum:any;
   rowdata:any;
  constructor(private http: HttpClient) {}
  postFormData(data: any): Observable<string[]> {
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
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }

  getAllShipments(page:number,pageSize:number): Observable<any[]> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get<any[]>(this.apiUrl,{params}).pipe(catchError(this.handleError));
  }

  
  postDriverDetail(data: any): Observable<string[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<string[]>("https://localhost:7196/api/DriverDetails", data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
