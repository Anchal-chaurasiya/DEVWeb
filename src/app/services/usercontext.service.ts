import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  userId: number | null = null;
  userName: string | null = null;
  mCompanyGuid: string | null = null;

  setUser(userId: number, userName: string, mCompanyGuid: string) {
    this.userId = userId;
    this.userName = userName;
    this.mCompanyGuid = mCompanyGuid;
  }

  clearUser() {
    this.userId = null;
    this.userName = null;
    this.mCompanyGuid = null;
  }
}