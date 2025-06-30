import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownDataService } from '../../services/dropdown-select-data.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CustomerVendorRequestDto, CustomerVendorAddress } from '../../models/customervender.model';
import { State } from '../../models/state.model';
import { CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-create-vendor',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, RouterModule, FooterComponent, NgSelectModule],
  templateUrl: './create-vendor.component.html',
  styleUrl: './create-vendor.component.css'
})
export class CreateVendorComponent {
  vendor: CustomerVendorRequestDto = {} as CustomerVendorRequestDto;
  loading = false;
  vendorGuid: string | null = null;
  activeTab: 'bill' | 'ship' = 'bill';
  country: any[] = [];
  loadingcountry = false;
  isActiveDisabled = true;
  constructor(
    private dropdownData: DropdownDataService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
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
    this.vendorGuid = this.route.snapshot.paramMap.get('customerGuid');
    if (this.vendorGuid) {
      this.loadVendorForEdit(this.vendorGuid);
      this.isActiveDisabled = false;
    } else {
      this.vendor.isActive= true;
      this.isActiveDisabled = true;
      this.vendor.addresses = [
        {addressGuid:null, addressType: '1', addressLine1: '', addressLine2: '', city: '', stateId: null, zipCode: '', countryId: null, states: [] },
        {addressGuid:null, addressType: '2', addressLine1: '', addressLine2: '', city: '', stateId: null, zipCode: '', countryId: null, states: [] }
      ];
    }
  }

  loadVendorForEdit(guid: string) {
    debugger;
    const req = { mCompanyGuid:localStorage.getItem("mCompanyGuid"),CompanyId: 1, PageSize: 1, PageRecordCount: 10, UserId: 1, Data: guid };
    this.apiService.post<CommonResDto<CustomerVendorRequestDto>>('Customer/GetCustomerService', req).subscribe({
      next: res => {
        this.vendor = res.data || {} as CustomerVendorRequestDto;
        if (!this.vendor.addresses) this.vendor.addresses = [];
        // For each address, load states for its country and ensure stateId is number
        this.vendor.addresses.forEach(address => {
          address.states = [];
          if (address.countryId) {
            this.loadStatesForAddress(address, true);
          }
          if (address.stateId) {
            address.stateId = Number(address.stateId);
          }
        });
      },
      error: () => { this.toast.error('Failed to load vendor'); }
    });
  }

  addAddress(type: string) {
    if (!this.vendor.addresses) this.vendor.addresses = [];
    this.vendor.addresses.push({
      addressGuid: null,
      addressType: type,
      addressLine1: '',
      addressLine2: '',
      city: '',
      gstn: null,
      stateId: null,
      zipCode: '',
      countryId: null,
      states: []
    });
  }

  removeAddressByType(type: string, index: number) {
    if (!this.vendor.addresses) return;
    const filtered = this.vendor.addresses.filter(a => a.addressType === type);
    if (filtered.length > 1) {
      const idx = this.vendor.addresses.findIndex((a, i) => a.addressType === type && i === index);
      if (idx > -1) this.vendor.addresses.splice(idx, 1);
    } else {
      this.toast.warning('At least one address is required.');
    }
  }

  loadStatesForAddress(address: CustomerVendorAddress, keepSelected = false) {
    if (!address.countryId) {
      address.states = [];
      if (!keepSelected) address.stateId = null;
      return;
    }
    const StateReqDto = {
      CompanyId: 1,
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      PageSize: 0,
      PageRecordCount: 0,
      Data: address.countryId
    };
    this.dropdownData.getDropdownDataByParam<State>('State/GetStateDropDownService', StateReqDto)
      .subscribe({
        next: (states) => {
          address.states = states.data;
          if (!keepSelected) address.stateId = null;
          if (keepSelected && address.stateId) {
            const found = states.data.find(s => Number(s.stateId) === Number(address.stateId));
            if (!found) address.stateId = null;
          }
        },
        error: () => {
          address.states = [];
          if (!keepSelected) address.stateId = null;
          this.toast.error('Failed to load states for selected country');
        }
      });
  }

  get billAddresses() {
    return (this.vendor.addresses ?? []).filter(a => a.addressType === '1');
  }

  get shipAddresses() {
    return (this.vendor.addresses ?? []).filter(a => a.addressType === '2');
  }

  onSubmit() {
    this.vendor.CustomerType="2";
    this.vendor.gstn="";
    const reqBody = {
      CompanyId: 1,
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      PageSize: 0,
      PageRecordCount: 0,
      Data: this.vendor
    };
    this.loading = true;
    const apiUrl = this.vendorGuid ? 'Customer/AddCustomerService' : 'Customer/AddCustomerService';
    this.apiService.post<any>(apiUrl, reqBody).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/vendor']);
        } else {
          this.toast.warning(response.message);
        }
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to save vendor');
      }
    });
  }
}