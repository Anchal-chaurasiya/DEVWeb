import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CompanyModelComponent } from '../shared/company-model/company-model.component';
import { CompanyDto } from '../../models/company.model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { UserContextService } from '../../services/usercontext.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,  
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, NavbarComponent, FooterComponent, CompanyModelComponent]
})
export class DashboardComponent implements OnInit {
  showCompanyModal = false;
  companyList: CompanyDto[] = [];
  selectedCompany: CompanyDto | null = null;
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private userContext: UserContextService
  ) {}

  ngOnInit() {
    const _companyGuid = localStorage.getItem('CompanyGuid') || '';
    // Check if a company is already selected
      if (_companyGuid) {
       //this.selectedCompany = this.userContext.selectedCompany;
       this.showCompanyModal = false;
         } else {
          this.fetchCompanies();
         }
  }
      

  fetchCompanies() {
    this.loading = true;
    const reqData = {
      mCompanyGuid: localStorage.getItem('mCompanyGuid') || '',
      companyGuid: localStorage.getItem('mCompanyGuid') || '',
      PageSize: 1,
      PageRecordCount: 10,
      UserId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 0,
      Data: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 0,
    };
    this.apiService.post<CompanyDto[]>('Company/GetCompanyDropdownService', reqData).subscribe({
      next: (companies) => {
        this.loading = false;
        if (companies !== null && companies.length > 0) {
          this.companyList = companies;
          this.showCompanyModal = true;
          this.selectedCompany = null;
        } else {
          this.companyList = [];
          this.toast.warning('No Company records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.warning('Unable to fetch companies');
      }
    });
  }

  onCompanySelect() {
    if (!this.selectedCompany) {
      this.toast.warning('Please select a company');
      return;
    }
    localStorage.setItem('CompanyGuid', this.selectedCompany.companyGuid || '');
    localStorage.setItem("CompanyName", this.selectedCompany.companyName || '');
    this.userContext.setCompany(this.selectedCompany);  
    this.showCompanyModal = false;
    this.toast.success(`Company selected: ${this.selectedCompany.companyName}`);
  }
}