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
import { SPTerm } from '../../models/spterm.model';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, RouterModule, FooterComponent, NgSelectModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent {
  paymentTermTypeList:any[]=[];
  shippmentTermTypeList:any[]=[];
  customer: CustomerVendorRequestDto = {} as CustomerVendorRequestDto;
  loading = false;
  customerGuid: string | null = null;
  activeTab: 'bill' | 'ship' = 'bill';
  country: any[] = [];
  paymentTerms: any[] = [];
  shippingTerms: any[] = [];
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
        this.initCustomer();
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

  initCustomer() {
    this.customerGuid = this.route.snapshot.paramMap.get('customerGuid');
    if (this.customerGuid) {
      this.isEditMode = true;
      this.loadCustomerForEdit(this.customerGuid);
      this.isActiveDisabled = false;
    } else {
      this.customer.isActive= true;
      this.isActiveDisabled = true;
      this.customer.addresses = [
        {addressGuid:null, addressType: '1', addressLine1: '', addressLine2: '',
           city: '',gstn:null, stateId: null, zipCode: '', countryId: null, states: [],
          isActive:true,createdBy:parseInt(localStorage.getItem("userId") || '0', 10),
          createdOn:null,modifiedBy:0, modifiedOn:null,remarks:"",delMark:false },
        {addressGuid:null, addressType: '2', addressLine1: '', addressLine2: '', city: ''
          ,gstn:null, stateId: null, zipCode: '', countryId: null, states: [] ,
        isActive:true,createdBy:parseInt(localStorage.getItem("userId") || '0', 10),
          createdOn:null,modifiedBy:0, modifiedOn:null,remarks:"",delMark:false}
      ];
    }
  }

  loadCustomerForEdit(guid: string) {
    const req : CommonReqDto<string> = 
    {
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      companyGuid: localStorage.getItem("CompanyGuid"),
      PageSize: 1, 
      PageRecordCount: 10,
      UserId: parseInt(localStorage.getItem("userId") || '0', 10), 
      Data: guid 
    };
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
      states: [],
      isActive:true,createdBy:parseInt(localStorage.getItem("userId") || '0', 10),
          createdOn:new Date(),modifiedBy:parseInt(localStorage.getItem("userId") || '0', 10),
           modifiedOn:new Date(),remarks:"",delMark:false
    });
  }
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
    const StateReqDto: CommonReqDto<number> =  {
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      companyGuid:localStorage.getItem("CompanyGuid"),
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      PageSize: 1,
      PageRecordCount: 1000,
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
     this.customer.isActive= true;
    this.customer.gsttype = this.customer.gsttype ?? "";
    this.customer.createdBy=parseInt(localStorage.getItem("userId") || '0', 10);
    this.customer.modifiedBy=parseInt(localStorage.getItem("userId") || '0', 10);
    this.customer.createdOn = new Date();
    this.customer.modifiedOn = new Date();
    this.customer.addresses.map(address=>{
      address.modifiedOn= new Date(),
      address.createdOn= new Date(),
      address.createdBy= parseInt(localStorage.getItem("userId") || '0', 10),
      address.modifiedBy=parseInt(localStorage.getItem("userId") || '0', 10)
    });
    const reqBody:CommonReqDto<CustomerVendorRequestDto> = {
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      companyGuid:localStorage.getItem("CompanyGuid"),
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      PageSize: 1,
      PageRecordCount: 1000,
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
copyBillingToShipping() {
  if (this.sameAsBilling) {
    const billingAddresses = this.customer.addresses.filter(x => x.addressType == "1");

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

    this.customer.addresses = this.customer.addresses.filter(x => x.addressType !== "2");

    const shippingAddresses = billingAddresses.map(bill => ({
      ...JSON.parse(JSON.stringify(bill)), 
      addressType: "2",                   
      addressGuid: null,
      modifiedOn: new Date()
    }));

    this.customer.addresses.push(...shippingAddresses);

    shippingAddresses.forEach(addr => {
      this.loadStatesForAddress(addr, true);
    });
  } else {
    this.customer.addresses = this.customer.addresses.filter(x => x.addressType !== "2");
  }
}

}