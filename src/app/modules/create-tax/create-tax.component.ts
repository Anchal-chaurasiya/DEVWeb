import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { TaxMaster } from '../../models/taxmaster.model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-create-tax',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent,FormsModule,RouterModule],
  templateUrl: './create-tax.component.html',
  styleUrl: './create-tax.component.css'
})
export class CreateTaxComponent implements OnInit {
  tax: TaxMaster = { taxName: '', taxPercentage: 0, isActive: true,remarks:"",taxGuid:null };
  taxGuid: string| null = null;
  loading = false;
  isActiveDisabled = true;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.taxGuid = this.route.snapshot.paramMap.get('taxGuid');
    if (this.taxGuid) {
      this.loading = true;
      this.isActiveDisabled = false;
      const gettaxreqdto= {
        CompanyId: 1,  
        mCompanyGuid:localStorage.getItem("mCompanyGuid"),
        PageSize: 1,
        PageRecordCount: 10,
        UserId: parseInt(localStorage.getItem("userId") || '0', 10),
        Data: this.taxGuid
      }
      this.apiService.post<CommonResDto<TaxMaster>>(`Tax/GetTaxService`,gettaxreqdto).subscribe({
        next: (response) => {
          this.tax = response.data ;
          this.loading = false;
        },
        error: () => {
          this.toast.warning('Failed to load tax details');
          this.loading = false;
        }
      });
    }
    else{
      this.tax.isActive = true;
      this.isActiveDisabled = true;
    }
  }

  onSubmit() {
  if (!this.tax.taxName || !this.tax.taxPercentage) {
    this.toast.warning('Please fill all required fields');
    return;
  }
  this.loading = true;

  const reqBody: CommonReqDto<TaxMaster> = {
    CompanyId: 1,
    mCompanyGuid:localStorage.getItem("mCompanyGuid") || null,
    PageSize: 0,
    PageRecordCount: 0,
    Data: this.tax,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
  };

 

  if (this.taxGuid) {
    // Update
    this.apiService.post<CommonResDto<TaxMaster>>('Tax/UpdateTaxService', reqBody).subscribe({
      next: (response) => {
        console.log(reqBody);
        console.log(response);
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/tax']);
        } else {
          this.toast.warning(response.message);
          this.loading = false;
        }
      },
      error: () => {
        this.toast.warning('Update failed');
        this.loading = false;
      }
    });
  } else {
    // Create
    this.apiService.post<CommonResDto<TaxMaster>>('Tax/AddTaxService', reqBody).subscribe({
      next: (response) => {
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/tax']);
        } else {
          this.toast.warning(response.message);
          this.loading = false;
        }
      },
      error: () => {
        this.toast.warning('Creation failed');
        this.loading = false;
      }
    });
  }
}
}