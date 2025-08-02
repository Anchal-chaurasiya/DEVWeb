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
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-create-vendor',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, RouterModule, FooterComponent, NgSelectModule],
  templateUrl: './create-vendor.component.html',
  styleUrl: './create-vendor.component.css'
})
export class CreateVendorComponent {
  paymentTermTypeList:any[]=[];
  shippmentTermTypeList:any[]=[];
  vendor: CustomerVendorRequestDto = {} as CustomerVendorRequestDto;
  loading = false;
  vendorGuid: string | null = null;
  activeTab: 'bill' | 'ship' = 'bill';
  country: any[] = [];
  loadingcountry = false;
  isActiveDisabled = true;
  loadingPaymentTerm = false;
  loadingShippmentTerm= false;
  sameAsBilling = false;
  billingAddress:any;
  isEditMode: boolean = false;
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

    this.loadingPaymentTerm = true;
    
    const paymenttermreqdto: CommonReqDto<number> = {
    companyGuid: localStorage.getItem("CompanyGuid") || null,
    mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
    PageSize: 1,
    PageRecordCount: 1000,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    Data: 2,
  };

    this.dropdownData.getDropdownDataByParam<any>('SPTerm/GetSPTermListService',paymenttermreqdto).subscribe({
      next: res => {
        this.paymentTermTypeList = res.data;
        this.loadingPaymentTerm = false;
      },
      error: () => {
        this.loadingPaymentTerm = false;
      }
    });

     this.loadingShippmentTerm = true;
    
    const shippmenttermreqdto: CommonReqDto<number> = {
    companyGuid: localStorage.getItem("CompanyGuid") || null,
    mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
    PageSize: 1,
    PageRecordCount: 1000,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    Data: 1,
  };

    this.dropdownData.getDropdownDataByParam<any>('SPTerm/GetSPTermListService',shippmenttermreqdto).subscribe({
      next: res => {
        this.shippmentTermTypeList = res.data;
        this.loadingShippmentTerm = false;
      },
      error: () => {
        this.loadingShippmentTerm = false;
      }
    });

  }

  

  initVendor() {
    this.vendorGuid = this.route.snapshot.paramMap.get('customerGuid');
    if (this.vendorGuid) {
      this.isEditMode = true;
      this.loadVendorForEdit(this.vendorGuid);
      this.isActiveDisabled = false;
    } else {
      this.vendor.isActive= true;
      this.isActiveDisabled = true;
      this.vendor.addresses = [
        {addressGuid:null, addressType: '1', addressLine1: '', addressLine2: '', city: '',
           stateId: null, zipCode: '', countryId: null, 
           states: [],isActive:true,createdBy:parseInt(localStorage.getItem("userId") || '0', 10),
          createdOn:null,modifiedBy:0, modifiedOn:null,remarks:"",delMark:false},
        {addressGuid:null, addressType: '2', addressLine1: '', addressLine2: '',
           city: '', stateId: null, zipCode: '', countryId: null, states: [],
          isActive:true,createdBy:parseInt(localStorage.getItem("userId") || '0', 10),
          createdOn:null,modifiedBy:0, modifiedOn:null,remarks:"",delMark:false }
      ];
    }
  }

  loadVendorForEdit(guid: string) {
    debugger;
    const req : CommonReqDto<string> = 
    {
       mCompanyGuid:localStorage.getItem("mCompanyGuid"),
       companyGuid:localStorage.getItem("CompanyGuid"),
       PageSize: 1,
       PageRecordCount: 10,
       UserId: parseInt(localStorage.getItem("userId") || '0', 10),
       Data: guid 
    };
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
    let isvalid = false;
    if(type=="1"){
      const lastbillAddress = this.billAddresses?.[this.billAddresses.length - 1];
      if(lastbillAddress){
        if(!lastbillAddress.addressLine1 || !lastbillAddress.countryId
          || !lastbillAddress.stateId || !lastbillAddress.gstn
        ){
          this.toast.warning("Please fill all required fields in the last address row before adding a new one ");
          
        }
         else{
        isvalid=true;
      }
      }
     
    }

    else if(type=="2"){
       const lastbillAddress = this.billAddresses?.[this.billAddresses.length - 1];
      if(lastbillAddress){
        if(!lastbillAddress.addressLine1 || !lastbillAddress.countryId
          || !lastbillAddress.stateId || !lastbillAddress.gstn
        ){
          this.toast.warning("Please fill all required fields in the last address row before adding a new one ");
        }
         else{
        isvalid=true;
      }
      }
     
    }
     if(isvalid==true){
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
      states: [],
      isActive:true,createdBy:parseInt(localStorage.getItem("userId") || '0', 10),
          createdOn:new Date(),modifiedBy:0, modifiedOn:new Date(),remarks:"",delMark:false
    });
  }
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
    const StateReqDto : CommonReqDto<number> = {
       mCompanyGuid:localStorage.getItem("mCompanyGuid"),
       companyGuid:localStorage.getItem("CompanyGuid"),
       PageSize: 1,
       PageRecordCount: 10,
       UserId: parseInt(localStorage.getItem("userId") || '0', 10),
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
    debugger;
    this.vendor.CustomerType="2";
    this.vendor.gstn="";
    this.vendor.isActive= true;
    this.vendor.gsttype = this.vendor.gsttype ?? "";
    this.vendor.createdBy=parseInt(localStorage.getItem("userId") || '0', 10);
    this.vendor.modifiedBy=parseInt(localStorage.getItem("userId") || '0', 10);
    this.vendor.createdOn = new Date();
    this.vendor.modifiedOn = new Date();
    this.vendor.addresses.map(address=>{
      address.modifiedOn= new Date(),
      address.createdOn= new Date(),
      address.createdBy= parseInt(localStorage.getItem("userId") || '0', 10),
      address.modifiedBy=parseInt(localStorage.getItem("userId") || '0', 10)
    });
    const reqBody : CommonReqDto<CustomerVendorRequestDto> = {
       mCompanyGuid:localStorage.getItem("mCompanyGuid"),
       companyGuid:localStorage.getItem("CompanyGuid"),
       PageSize: 1,
       PageRecordCount: 10,
       UserId: parseInt(localStorage.getItem("userId") || '0', 10),
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

  copyBillingToShipping() {
  if (this.sameAsBilling) {
    const billingAddresses = this.vendor.addresses.filter(x => x.addressType == "1");

    if (billingAddresses.length === 0) {
      this.toast.warning("Please fill at least one billing address before copying.");
      this.sameAsBilling = false;
      return;
    }

    const hasEmpty = billingAddresses.some(x => !x.addressLine1 || x.addressLine1.trim() === '');
    if (hasEmpty) {
      this.toast.warning("All billing addresses must have addressLine1 filled.");
      this.sameAsBilling = false;
      return;
    }

    this.vendor.addresses = this.vendor.addresses.filter(x => x.addressType !== "2");

    const shippingAddresses = billingAddresses.map(bill => ({
      ...JSON.parse(JSON.stringify(bill)), 
      addressType: "2",                   
      addressGuid: null,
      modifiedOn: new Date()
    }));

    this.vendor.addresses.push(...shippingAddresses);

    shippingAddresses.forEach(addr => {
      this.loadStatesForAddress(addr, true);
    });
  } else {
    this.vendor.addresses = this.vendor.addresses.filter(x => x.addressType !== "2");
  }
}
}