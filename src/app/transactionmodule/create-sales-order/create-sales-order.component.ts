import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../modules/shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../modules/shared/footer/footer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SalesOrder } from '../../models/salesorder.model';
import { DropdownDataService } from '../../services/dropdown-select-data.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { UserContextService } from '../../services/usercontext.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';
import { CustomerVendorListAddressReqDto, CustomerVendorListAddressResDto, CustomerVendorListReqDto } from '../../models/customervender.model';

@Component({
  selector: 'app-create-sales-order',
  imports: [
    CommonModule,
    NavbarComponent,
    FormsModule,
    RouterModule,
    FooterComponent,
    NgSelectModule
  ],
  templateUrl: './create-sales-order.component.html',
  styleUrl: './create-sales-order.component.css'
})
export class CreateSalesOrderComponent {
   salesOrder: SalesOrder = {} as SalesOrder;
   loading=false;
   sellGuid: string | null = null;
   loadingItemList=false;
   itemList: any[] = [];
   loadingBillingAddList=false;
   billingAddressList: any[] = [];
   ShipingAddressList: any[] = [];
   selectedCustomer: any = null;
   loadingCustomerList=false;
   customerList: any[] = [];
   totalPaid=0;totalAmount=0;
   customerstateId=0;
   companyStateId: number|null = null;
   isIntraState: boolean = false;
   customeraddress?:"";
  constructor(
    private dropdownData: DropdownDataService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toast: ToastService,
    public userContextService: UserContextService
  ) {}
  ngOnInit() {
    this.salesOrder.sellType="";
    this.salesOrder.sellOrderDetailReqDtos = [];
    this.salesOrder.sellOrderDetailReqDtos = [];
     this.userContextService.stateId$.subscribe(stateid => {
      this.companyStateId = stateid;
    });
    
    this.GetMaxSalesOrderNo();
    this.fetchCustomerList();
    this.fetchItemList();
  }

  fetchCustomerList(){
  this.loadingCustomerList = true;
  const dropdownreqdto: CommonReqDto<CustomerVendorListReqDto> = {
    companyGuid: localStorage.getItem("CompanyGuid") || null,
    mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
    PageSize: 1,
    PageRecordCount: 1000,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    Data: {
      "CustomerType":"1"
    },
  };
  this.dropdownData.getDropdownDataByParam<any>('Customer/GetCustomerListForDropDownService', dropdownreqdto).subscribe({
    next: res => {
      this.customerList = res.data;
      this.loadingCustomerList = false;
    },
    error: () => {
      this.loadingCustomerList = false;
    }
  });
}

 fetchaddressList(CustomerGuid: string) {
  this.loadingBillingAddList = true;
  const dropdownreqdto: CommonReqDto<CustomerVendorListAddressReqDto> = {
    companyGuid: localStorage.getItem("CompanyGuid") || null,
    mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
    PageSize: 1,
    PageRecordCount: 1000,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    Data: {
      customerGuid:CustomerGuid
    },
  };
  this.dropdownData.getDropdownDataByParam<any>('Customer/GetCustomerAddressService', dropdownreqdto).subscribe({
    next: res => {
        this.billingAddressList = res.data.filter((address: CustomerVendorListAddressResDto) => address.addressType == '1');
        this.ShipingAddressList = res.data.filter((address: CustomerVendorListAddressResDto) => address.addressType == '2');
        this.salesOrder.contactPersonName=this.billingAddressList[0].contactPersonName;
        this.salesOrder.contachPersonNo=this.billingAddressList[0].contachPersonNo;
        this.salesOrder.contachPersonEmail=this.billingAddressList[0].contachPersonEmail;
        this.loadingBillingAddList = false;
    },
    error: () => {
      this.loadingBillingAddList = false;
    }
  });
}
onCustomerChange(customerGuid: string) {
  this.billingAddressList= [];
  this.ShipingAddressList=[];
  this.salesOrder.placeOfSupply="";
  this.salesOrder.contachPersonNo="";
  this.salesOrder.contactPersonName="";
  this.salesOrder.contachPersonEmail="";


  const selectedcustomer = this.customerList.find(v => v.customerGuid === customerGuid);
  if (selectedcustomer) {
    this.selectedCustomer = selectedcustomer;
    this.salesOrder.customerId = selectedcustomer.customerId;
    this.salesOrder.paymentTermId = selectedcustomer.paymentTermId;
    this.salesOrder.shippingTermId = selectedcustomer.shippingTermId;
    this.fetchaddressList(selectedcustomer.customerGuid);
  }
  this.salesOrder.sellOrderDetailReqDtos = [];
  this.salesOrder.sellOrderPaymentReqDtos = [];
}

onAddressChange(billingAddressId: number) {
  debugger;
  const selectedaddress = this.billingAddressList.find(v => v.addressId == billingAddressId);
if (selectedaddress) {
    this.customerstateId= selectedaddress.stateId;
    this.isIntraState = (selectedaddress.stateId == this.companyStateId)
  }
}


onShippingAddressChange(shippingAddressId: number) {
  const selectedshippingaddress = this.ShipingAddressList.find(v => v.addressId == shippingAddressId);
  if(selectedshippingaddress){
    this.salesOrder.placeOfSupply= selectedshippingaddress.stateName;
  }
}


fetchItemList() {
  this.loadingItemList = true;
  const dropdownreqdto: CommonReqDto<string> = {
    companyGuid: localStorage.getItem("CompanyGuid") || null,
    mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
    PageSize: 1,
    PageRecordCount: 1000,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    Data: "1",
  };
  this.dropdownData.getDropdownDataByParam<any>('Item/GetItemListForDropdownService', dropdownreqdto).subscribe({
    next: res => {
      this.itemList = res.data;
      this.loadingItemList = false;
    },
    error: () => {
      this.loadingItemList = false;
    }
  });
}


addItem() {

    if (!this.salesOrder.customerId) {
      this.toast.error("Please select a customer before adding items.");
      return;
    }
    if (!this.salesOrder.addressId) {
      this.toast.error("Please select a billing address before adding items.");
      return;
    }

     if (!this.salesOrder.sAddressId) {
      this.toast.error("Please select a shipping address before adding items.");
      return;
    }
   const sellType= this.salesOrder.sellType || "";

    if(sellType== ""){
         this.toast.warning("Please Select sale type before add");
         return;
    }

    this.salesOrder.sellOrderDetailReqDtos.push({
      rowId: Date.now() + Math.random(), 
      sellDetailGuid: null,
      sellDetailId: 0,
      sellId: 0,
      qty: 1,
      sno: this.salesOrder.sellOrderDetailReqDtos.length + 1,
      itemdescription:"",
      itemGuid:null,
      itemId: null,
      price: 0,
      discountPercentage: 0,
      discountAmount: 0,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      totalAmount: 0,
    });
  }

  onItemChange(item: any, index: number) {
    const selectedItem = this.itemList.find(x => x.itemGuid === item.itemGuid);
    if (selectedItem) {
       item.itemId= selectedItem.itemId;
      if(this.isIntraState==true){
      item.cgstRate = selectedItem.taxPercentage / 2 || 0;
      item.sgstRate = selectedItem.taxPercentage / 2 || 0;
      item.igstRate = 0;
      }
      else if(this.isIntraState==false){
        item.igstRate = selectedItem.taxPercentage || 0;
        item.cgstRate = 0;
        item.sgstRate = 0;
      }
    } else {
      item.cgstRate = 0;
      item.sgstRate = 0;
      item.igstRate = 0;
    }
    this.updateAmount(index);
  }

updateAmount(index: number) {
    const item = this.salesOrder.sellOrderDetailReqDtos[index];
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    const discountPercent = Number(item.discountPercentage) || 0;
    const cgstRate = Number(item.cgstRate) || 0;
    const sgstRate = Number(item.sgstRate) || 0;
    const igstRate = Number(item.igstRate) || 0;

    item.discountAmount = ((qty * price) * discountPercent) / 100;
    const taxable = (qty * price) - item.discountAmount;
    item.cgstAmount = parseFloat(((taxable * cgstRate) / 100).toFixed(2));
    item.sgstAmount = parseFloat(((taxable * sgstRate) / 100).toFixed(2));
    item.igstAmount = parseFloat(((taxable * igstRate) / 100).toFixed(2));
    item.totalAmount =parseFloat(( taxable + item.cgstAmount + item.sgstAmount + item.igstAmount).toFixed(2));

    this.updateSummary();
  }

  updateSummary() {
    this.salesOrder.totalAmount = this.salesOrder.sellOrderDetailReqDtos.reduce((sum: number, item: any) => sum + (Number(item.totalAmount) || 0), 0);
    this.totalPaid = this.salesOrder.sellOrderPaymentReqDtos.reduce((sum: number, pay: any) => sum + (Number(pay.amount) || 0), 0);
  }
     addPayment() {
      this.salesOrder.sellOrderPaymentReqDtos.push({
      sellPaymentGuid: null,
      sellPaymentId: 0,
      sellId: 0,
      paymentMode: 'Cash',
      amount: 0,
      refrenceNo: ''
    });
  }


   removePayment(index: number) {
    if (this.salesOrder.sellOrderPaymentReqDtos.length > 1) {
      this.salesOrder.sellOrderPaymentReqDtos.splice(index, 1);
      this.updateSummary();
    }
  }

   onSubmit() {
    if (!this.salesOrder.customerId) {
      this.toast.error("Please select a Customer.");
      return;
    }
    if (!this.salesOrder.addressId) {
      this.toast.error("Please select a billing address.");
      return;
    }
    if (!this.salesOrder.sAddressId) {
      this.toast.error("Please select a shipping address.");
      return;
    }
    if (!this.salesOrder.contactPersonName) {
      this.toast.error("Please enter a contact person name.");
      return;
    }
     if (!this.salesOrder.contachPersonNo) {
      this.toast.error("Please enter a contact person no.");
      return;
    } if (!this.salesOrder.contachPersonEmail) {
      this.toast.error("Please enter a contact person email.");
      return;
    }
    if (!this.salesOrder.refNo) {
      this.toast.error("Please enter a refrence number.");
      return;
    }
     if (!this.salesOrder.sellOrderDate) {
      this.toast.error("Please selcet a sale order Date.");
      return;
    }
       if (!this.salesOrder.deliveryDate) {
      this.toast.error("Please selcet a sale order Date.");
      return;
    }

    if (this.salesOrder.sellOrderDetailReqDtos.length === 0) {
      this.toast.error("Please add at least one item.");
      return;
    }
    if (this.salesOrder.sellOrderPaymentReqDtos.length > 0) {
      this.totalPaid = this.salesOrder.sellOrderPaymentReqDtos.reduce((sum: number, pay: any) => sum + (Number(pay.amount) || 0), 0);
      if (this.totalPaid <= 0) {
        this.toast.error('Total paid amount must be greater than zero');  
        return;
      }
      const dueAmount = this.salesOrder.totalAmount - this.totalPaid;
      if (dueAmount < 0) {
        this.toast.error('Total paid amount cannot be greater than total amount');
        return;
      }
    }
      
      this.salesOrder.isCancel=false;
      this.salesOrder.isActive=true;
      if(this.salesOrder.sellType=="Service"){
        this.salesOrder.sellOrderDetailReqDtos.map(x=> x.itemId=-1);
      }
      this.salesOrder.createdBy= parseInt(localStorage.getItem("userId") || '0', 10);
     this.salesOrder.addressId= parseInt(this.salesOrder.addressId?.toString() || '0', 10);
     this.salesOrder.sAddressId= parseInt(this.salesOrder.sAddressId?.toString() || '0', 10);
      const reqBody:CommonReqDto<SalesOrder> = {
        mCompanyGuid:localStorage.getItem("mCompanyGuid"),
        companyGuid:localStorage.getItem("CompanyGuid"),
        UserId: parseInt(localStorage.getItem("userId") || '0', 10),
        PageSize: 1,
        PageRecordCount: 1000,
        Data: this.salesOrder
      };
      this.loading = true;
      const apiUrl = this.sellGuid ? 'SellOrder/SaveSellOrderService' : 'SellOrder/SaveSellOrderService';
      this.apiService.post<any>(apiUrl, reqBody).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.flag === 1) {
            this.toast.success(response.message);
            this.router.navigate(['/sales-order']);
          } else {
            this.toast.warning(response.message);
          }
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to create sales order');
        }
      });
    }
  
    GetMaxSalesOrderNo(){
        const dropdownreqdto: CommonReqDto<string> = {
            companyGuid: localStorage.getItem("CompanyGuid") || null,
            mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
            PageSize: 1,
            PageRecordCount: 1000,
            UserId: parseInt(localStorage.getItem("userId") || '0', 10),
            Data: "1",
        };
   
      this.apiService.post<CommonResDto<SalesOrder>>('SellOrder/MaxSellOrderNoService', dropdownreqdto).subscribe({
        next: res => {
          if (res.flag ===1) {
            this.salesOrder.sellOrderNo = res.data.sellOrderNo;
          } else {
            this.toast.warning(res.message);
          }
        },
        error: () => {
          this.toast.error('Failed to fetch sales order number');
        }
      });
    }

   onSellTypeChange(item: any): void {
    if(this.salesOrder.sellOrderDetailReqDtos.length!=0){
     const confirmed = confirm("Are you sure you want to change the type?");
       if (confirmed) {
             this.salesOrder.sellOrderDetailReqDtos=[];
              this.salesOrder.sellOrderPaymentReqDtos=[];
              this.totalPaid=0;
              this.totalAmount=0;
              this.salesOrder.totalAmount=0;
       }
         else{
           
         this.salesOrder.sellType = item.previousPurchaseType;
         item.sellType = null; 
         setTimeout(() => {
      item.purchaseType = item.previousPurchaseType; 
    }, 0);
  }
}
    else{
       this.salesOrder.sellType = item.sellType;
    }
  }
 onRadioMouseDown(item: any): void {
  debugger;
  item.previousPurchaseType = item.sellType;
 }
}
  

