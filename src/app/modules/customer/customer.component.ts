import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerVendorResponseDto } from '../../models/customervender.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-customer',
  standalone:true,
  imports: [CommonModule, NavbarComponent, FooterComponent,FormsModule,RouterModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  loading: boolean = false;
 customerlist: CustomerVendorResponseDto[] = [];
 constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loading = true;
    const reqData: CommonReqDto<number>=
    {
      companyGuid:localStorage.getItem("CompanyGuid"),
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      PageSize: 1,
      PageRecordCount: 1000,
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      Data: parseInt(localStorage.getItem("userId") || '0', 10),
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
        this.toast.error('Failed to load customer records');
      }
    }); 
 }
}
