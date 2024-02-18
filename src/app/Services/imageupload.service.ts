import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageuploadService {

   prodUrl="https://pwswarehouseapi.azurewebsites.net/api/UploadImages/UploadImage";
   LocUrl="https://localhost:7196/api/UploadImages/UploadImage";

   private apiUrl=this.prodUrl;
  
   constructor(private http:HttpClient) { }

  public UploadImage(formData:FormData):Observable<HttpEvent<Object>>
  {
   
  return this.http.post(this.apiUrl, formData, {
        reportProgress: true,
        observe: 'events'
    })
    .pipe(
        catchError(this.handleError)
        );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error.error);
    return throwError(error.error);
  }
}
