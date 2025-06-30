import { Component } from '@angular/core';
import { CustomerVendorResponseDto } from '../../models/customervender.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { CommonResDto } from '../../models/common.model';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../shared/footer/footer.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor',
imports: [CommonModule, NavbarComponent, FooterComponent,FormsModule,RouterModule],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent {
  loading: boolean = false;
 customerlist: CustomerVendorResponseDto[] = [];
 constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loading = true;
    const reqData=
    {
      CompanyId: 1,  
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      PageSize: 1,
      PageRecordCount: 10,
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      Data: 2
    };
    this.apiService.post<CommonResDto<CustomerVendorResponseDto[]>>('Customer/GetCustomerListService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.customerlist = response.data;
        } else {
          this.customerlist = [];
          this.toast.warning('No customer records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to load vendor records');
      }
    }); 
 }
}
