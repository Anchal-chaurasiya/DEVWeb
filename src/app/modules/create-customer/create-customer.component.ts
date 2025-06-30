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
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, RouterModule, FooterComponent, NgSelectModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent {
  customer: CustomerVendorRequestDto = {} as CustomerVendorRequestDto;
  loading = false;
  customerGuid: string | null = null;
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
        this.initCustomer();
      },
      error: () => {
        this.loadingcountry = false;
      }
    });
  }

  initCustomer() {
    this.customerGuid = this.route.snapshot.paramMap.get('customerGuid');
    if (this.customerGuid) {
      this.loadCustomerForEdit(this.customerGuid);
      this.isActiveDisabled = false;
    } else {
      this.customer.isActive= true;
      this.isActiveDisabled = true;
      this.customer.addresses = [
        {addressGuid:null, addressType: '1', addressLine1: '', addressLine2: '', city: '',gstn:null, stateId: null, zipCode: '', countryId: null, states: [] },
        {addressGuid:null, addressType: '2', addressLine1: '', addressLine2: '', city: '',gstn:null, stateId: null, zipCode: '', countryId: null, states: [] }
      ];
    }
  }

  loadCustomerForEdit(guid: string) {
    const req = {mCompanyGuid:localStorage.getItem("mCompanyGuid"), CompanyId: 1, PageSize: 1, PageRecordCount: 10, UserId: parseInt(localStorage.getItem("userId") || '0', 10), Data: guid };
    this.apiService.post<CommonResDto<CustomerVendorRequestDto>>('Customer/GetCustomerService', req).subscribe({
      next: res => {
        this.customer = res.data || {} as CustomerVendorRequestDto;
        if (!this.customer.addresses) this.customer.addresses = [];
        // For each address, load states for its country and ensure stateId is number
        this.customer.addresses.forEach(address => {
          address.states = [];
          if (address.countryId) {
            this.loadStatesForAddress(address, true);
          }
          if (address.stateId) {
            address.stateId = Number(address.stateId);
          }
        });
      },
      error: () => { this.toast.error('Failed to load customer'); }
    });
  }

  addAddress(type: string) {
    if (!this.customer.addresses) this.customer.addresses = [];
    this.customer.addresses.push({
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
    if (!this.customer.addresses) return;
    const filtered = this.customer.addresses.filter(a => a.addressType === type);
    if (filtered.length > 1) {
      const idx = this.customer.addresses.findIndex((a, i) => a.addressType === type && i === index);
      if (idx > -1) this.customer.addresses.splice(idx, 1);
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
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
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
          // If editing, ensure stateId is set and type matches
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
    return (this.customer.addresses ?? []).filter(a => a.addressType === '1');
  }

  get shipAddresses() {
    return (this.customer.addresses ?? []).filter(a => a.addressType === '2');
  }

  onSubmit() {
    this.customer.CustomerType="1";
    this.customer.gstn="";
    const reqBody = {
      CompanyId: 1,
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      PageSize: 0,
      PageRecordCount: 0,
      Data: this.customer
    };
    this.loading = true;
    const apiUrl = this.customerGuid ? 'Customer/AddCustomerService' : 'Customer/AddCustomerService';
    this.apiService.post<any>(apiUrl, reqBody).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/customer']);
        } else {
          this.toast.warning(response.message);
        }
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to save customer');
      }
    });
  }
}