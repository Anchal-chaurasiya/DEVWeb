// ...existing code...
import { Injectable } from '@angular/core';
import { CompanyDto } from '../models/company.model';
import { BehaviorSubject } from 'rxjs';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  userId: number | null = null;
  userName: string | null = null;
  mCompanyGuid: string | null = null;
  selectedCompany: CompanyDto | null = null; // Add this line
  companyName$ = new BehaviorSubject<string | null>(localStorage.getItem('CompanyName'));
  stateId$ = new BehaviorSubject<number | null>(
  localStorage.getItem('BStateId') !== null 
    ? Number(localStorage.getItem('BStateId')) 
    : null
  
);

sstateName$ = new BehaviorSubject<string | null>(
  localStorage.getItem('SStateName') !== null 
    ? localStorage.getItem('SStateName')
    : null
);

bBillingAddress$ = new BehaviorSubject<string | null>(
  localStorage.getItem('BAddress') !== null 
    ? localStorage.getItem('BAddress')
    : null
);

CShippingAddress$ = new BehaviorSubject<string | null>(
  localStorage.getItem('sAddress1') !== null 
    ? localStorage.getItem('sAddress1')
    : null
);

  constructor(private menuService:MenuService){
 }
 
 setUser(userId: number, userName: string, mCompanyGuid: string) {
    this.userId = userId;
    this.userName = userName;
    this.mCompanyGuid = mCompanyGuid;
  }

  setCompany(company: CompanyDto) {
    this.companyName$.next(company.companyName || null);
    this.stateId$.next(company.bStateId);
    this.selectedCompany = company;
    localStorage.setItem('CompanyName', company.companyName || '');
    localStorage.setItem('BStateId', company.bStateId ? company.bStateId.toString() : '');
    localStorage.setItem('SStateName', company.sStateName ? company.sStateName.toString() : '');
    localStorage.setItem('sAddress1', company.sAddress1 ? company.sAddress1.toString() : '');
    localStorage.setItem('BAddress', company.bAddress ? company.bAddress.toString() : '');
    localStorage.setItem('CompanyGuid', company.companyGuid || '');
  }

  clearUser() {
    this.userId = null;
    this.userName = null;
    this.mCompanyGuid = null;
    this.selectedCompany = null; 
    this.companyName$.next(null); 
    this.stateId$.next(null); 
    localStorage.removeItem('authToken');
    localStorage.removeItem('userMenu');
    localStorage.removeItem('CompanyGuid');
    localStorage.removeItem('mCompanyGuid');
    localStorage.removeItem("CompanyName");
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('BStateId');
    localStorage.removeItem('SStateName');
    localStorage.removeItem('BAddress');
    this.menuService.setMenu([]); 
  }
}