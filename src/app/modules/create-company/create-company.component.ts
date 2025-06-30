import { Component } from '@angular/core';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompanyDto } from '../../models/company.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { DropdownDataService } from '../../services/dropdown-select-data.service';
import { State } from '../../models/state.model';
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-create-company',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.css'
})
export class CreateCompanyComponent {
  company: CompanyDto = {} as CompanyDto;
  loading = false;
  companyGuid: string | null = null;
  isActiveDisabled = true;
  loadingcountry = false;
  country: any[] = [];
  constructor(
  private dropdownData: DropdownDataService,
  private route: ActivatedRoute,
  private router: Router,
  private apiService: ApiService, 
  private toast: ToastService 
) {}
ngOnInit() {
    this.loadingcountry = true;
    this.dropdownData.getDropdownData<any>('Country/GetCountryDropdownService').subscribe({
      next: res => {
        this.country = res;
        this.loadingcountry = false;
        this.initVendor();
      },
      error: () => {
        this.loadingcountry = false;
      }
    });
}





 initVendor() {
    this.companyGuid = this.route.snapshot.paramMap.get('companyGuid');
    if (this.companyGuid) {
      this.isActiveDisabled = false;
    } else {
      this.company.isActive= true;
      this.isActiveDisabled = true;
    }
  }

 loadStatesForAddress(company: CompanyDto, keepSelected = false) {
    if (!company.bCountryId) {
      company.states = [];
      if (!keepSelected) company.bStateId = null;
      return;
    }
    const StateReqDto = {
      CompanyId: 1,
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      PageSize: 0,
      PageRecordCount: 0,
      Data: company.bCountryId
    };
    this.dropdownData.getDropdownDataByParam<State>('State/GetStateDropDownService', StateReqDto)
      .subscribe({
        next: (states) => {
          company.states = states.data;
          if (!keepSelected) company.bStateId = null;
          if (keepSelected && company.bStateId) {
            const found = states.data.find(s => Number(s.stateId) === Number(company.bStateId));
            if (!found) company.bStateId = null;
          }
        },
        error: () => {
          company.states = [];
          if (!keepSelected) company.bStateId = null;
          this.toast.error('Failed to load states for selected country');
        }
      });
  }

   loadStatesForAddressS(company: CompanyDto, skeepSelected = false) {
    debugger;
    if (!company.sCountryId) {
      company.sstates = [];
      if (!skeepSelected) company.sStateId = null;
      return;
    }
    const StateReqDto = {
      CompanyId: 1,
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      PageSize: 0,
      PageRecordCount: 0,
      Data: company.sCountryId
    };
    this.dropdownData.getDropdownDataByParam<State>('State/GetStateDropDownService', StateReqDto)
      .subscribe({
        next: (states) => {
          company.sstates = states.data;
          if (!skeepSelected) company.sStateId = null;
          if (skeepSelected && company.sStateId) {
            const found = states.data.find(s => Number(s.stateId) === Number(company.sStateId));
            if (!found) company.sStateId = null;
          }
        },
        error: () => {
          company.sstates = [];
          if (!skeepSelected) company.sStateId = null;
          this.toast.error('Failed to load states for selected country');
        }
      });
  }
  onSubmit() {
  if (!this.company.companyName || !this.company.mobileNo) {
    this.toast.warning('Please fill all required fields');
    return;
  }
  this.loading = true;
  if (this.company.remarks == null) {
    this.company.remarks = "";
  }
  const reqBody: CommonReqDto<CompanyDto> = {
    CompanyId: 1,
    mCompanyGuid:localStorage.getItem("mCompanyGuid") || null,
    PageSize: 0,
    PageRecordCount: 0,
    Data: this.company,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
  };

  if (this.companyGuid) {
    // Update
    this.apiService.post<CommonResDto<CompanyDto>>('Company/UpdateCompanyService', reqBody).subscribe({
      next: (response) => {
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.loading = false;
          this.router.navigate(['/login']);
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
    this.apiService.post<CommonResDto<CompanyDto>>('Company/AddCompanyService', reqBody).subscribe({
      next: (response) => {
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/company']);
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
