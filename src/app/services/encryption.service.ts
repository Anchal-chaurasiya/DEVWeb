import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private secretKey = 'My$tr0ng@Key!2025'; 

  encrypt(data: any): string {
    const dataString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(dataString, this.secretKey).toString();
  }

  decrypt(cipherText: string): any {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  }
}