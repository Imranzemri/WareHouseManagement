import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';


@Injectable({
  providedIn: 'root'
})
export class QrcodeService {

  constructor() { }


  generateQRCode(data: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(data, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
  
}
