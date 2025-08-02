import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NavbarComponent } from "../../modules/shared/navbar/navbar.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "../../modules/shared/footer/footer.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { CustomerVendorListAddressReqDto, CustomerVendorListAddressResDto, CustomerVendorListReqDto, CustomerVendorListResDto } from "../../models/customervender.model";
import { DropdownDataService } from "../../services/dropdown-select-data.service";
import { ApiService } from "../../services/api.service";
import { ToastService } from "../../services/toast.service";
import { CommonReqDto, CommonResDto } from "../../models/common.model";
import { PurchaseOrder } from "../../models/purchaseorder.model";
import { ItemDropdownResDto } from "../../models/item.model";
import { UserContextService } from "../../services/usercontext.service";

@Component({
  selector: 'app-create-purchase-order',
  imports: [
    CommonModule,
    NavbarComponent,
    FormsModule,
    RouterModule,
    FooterComponent,
    NgSelectModule
  ],
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css']
})
export class CreatePurchaseOrderComponent {
   purchaseOrder: PurchaseOrder = {} as PurchaseOrder;
   loading=false;
   purchaseGuid: string | null = null;
   loadingItemList=false;
   itemList: any[] = [];
   loadingBillingAddList=false;
   billingAddressList: any[] = [];
   selectedVendor: any = null;
   selectedAddress: any = null;
   loadingVendorList=false;
   vendorList: any[] = [];
   totalPaid=0;totalAmount=0;
   vendorstateId=0;
   vendorstateName='';
   companyStateId: number|null = null;
   companyBAddressName:string|null = null;
   companySAddressname:string|null= null;
   isIntraState: boolean = false;
   vendoraddress?:"";
   billingCompanyAddressList:any[]=[];
  constructor(
    private dropdownData: DropdownDataService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private toast: ToastService,
    public userContextService: UserContextService
  ) {}
  ngOnInit() {
    this.purchaseOrder.purchaseType="";
    this.purchaseOrder.purchaseOrderDetailReqDtos = [];
    this.purchaseOrder.purchaseOrderPaymentReqDtos = [];
     this.userContextService.stateId$.subscribe(stateid => {
      this.companyStateId = stateid;
      console.log("Company State ID:", this.companyStateId);
    });
    this.userContextService.sstateName$.subscribe(sstateName => {
    this.purchaseOrder.placeOfSupply = sstateName ?? "";
      console.log("Company S State Name:", this.purchaseOrder.placeOfSupply);
    });

    this.userContextService.bBillingAddress$.subscribe(BAddressName => {
      this.companyBAddressName = BAddressName;
      console.log("Company Billing Address:", this.companyBAddressName);
    });

    this.userContextService.CShippingAddress$.subscribe(SAddressName=>{
      this.companySAddressname= SAddressName;
      console.log("Company Shiiping Address :", this.companySAddressname);
    })


    this.billingCompanyAddressList.push({
      "addressId":this.companyStateId,
      "address":this.companyBAddressName
    });

    this.purchaseOrder.addressId= this.companyStateId;

    this.GetMaxPurchaseOrderNo();
    this.fetchVendorList();
    this.fetchItemList();
  }

  fetchVendorList(){
  this.loadingVendorList = true;
  const dropdownreqdto: CommonReqDto<CustomerVendorListReqDto> = {
    companyGuid: localStorage.getItem("CompanyGuid") || null,
    mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
    PageSize: 1,
    PageRecordCount: 1000,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    Data: {
      "CustomerType":"2"
    },
  };
  this.dropdownData.getDropdownDataByParam<any>('Customer/GetCustomerListForDropDownService', dropdownreqdto).subscribe({
    next: res => {
      this.vendorList = res.data;
      this.loadingVendorList = false;
    },
    error: () => {
      this.loadingVendorList = false;
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
        this.purchaseOrder.contactPersonName=this.billingAddressList[0].contactPersonName;
        this.purchaseOrder.contachPersonNo=this.billingAddressList[0].contachPersonNo;
        this.purchaseOrder.contachPersonEmail=this.billingAddressList[0].contachPersonEmail;
        this.vendoraddress = this.billingAddressList.filter(x=> x.addressType==1)[0].address;
        let vendorstateId= this.billingAddressList.filter(x=> x.addressType==1)[0].stateId;
        this.onAddressChange(vendorstateId);
        this.loadingBillingAddList = false;
    },
    error: () => {
      this.loadingBillingAddList = false;
    }
  });
}
onVendorChange(customerGuid: string) {
  const selectedVendor = this.vendorList.find(v => v.customerGuid === customerGuid);
  if (selectedVendor) {
    this.selectedVendor = selectedVendor;
    this.purchaseOrder.vendorId = selectedVendor.customerId;
    this.purchaseOrder.paymentTermId = selectedVendor.paymentTermId;
    this.purchaseOrder.shippingTermId = selectedVendor.shippingTermId;
 
    this.fetchaddressList(selectedVendor.customerGuid);
  }

   
  this.purchaseOrder.purchaseOrderDetailReqDtos = [];
}

onAddressChange(billingAddressId: number) {
  debugger;
  //const selectedaddress = this.billingAddressList.find(v => v.addressId == billingAddressId);
// if (selectedaddress) {
    // this.selectedAddress = selectedaddress;
    // this.vendorstateId= selectedaddress.stateId;
    // this.vendorstateName= selectedaddress.stateName;
    this.isIntraState = (billingAddressId == this.companyStateId)//this.companyStateId);

    console.log(this.vendorstateId);
    console.log(this.vendorstateName);
  //}
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
  debugger;

    if (!this.purchaseOrder.vendorId) {
      this.toast.error("Please select a vendor before adding items.");
      return;
    }
    if (!this.purchaseOrder.addressId) {
      this.toast.error("Please select a billing address before adding items.");
      return;
    }
   const purchaseType= this.purchaseOrder.purchaseType || "";
  if(purchaseType== "")
  {
    this.toast.warning("Please Select purchase type before add");
    return;
  }

    this.purchaseOrder.purchaseOrderDetailReqDtos.push({
      rowId: Date.now() + Math.random(), // Unique row id
      purchaseDetailGuid: null,
      purchaseDetailId: 0,
      purchaseId: 0,
      qty: 1,
      sno: this.purchaseOrder.purchaseOrderDetailReqDtos.length + 1,
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
    debugger;
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
    const item = this.purchaseOrder.purchaseOrderDetailReqDtos[index];
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
    this.purchaseOrder.totalAmount = this.purchaseOrder.purchaseOrderDetailReqDtos.reduce((sum: number, item: any) => sum + (Number(item.totalAmount) || 0), 0);
    this.totalPaid = this.purchaseOrder.purchaseOrderPaymentReqDtos.reduce((sum: number, pay: any) => sum + (Number(pay.amount) || 0), 0);
  }
     addPayment() {
      this.purchaseOrder.purchaseOrderPaymentReqDtos.push({
      purchasePaymentGuid: null,
      purchasePaymentId: 0,
      purchaseId: 0,
      paymentMode: 'Cash',
      amount: 0,
      refrenceNo: ''
    });
  }


   removePayment(index: number) {
    if (this.purchaseOrder.purchaseOrderPaymentReqDtos.length > 1) {
      this.purchaseOrder.purchaseOrderPaymentReqDtos.splice(index, 1);
      this.updateSummary();
    }
  }

   onSubmit() {
    if (!this.purchaseOrder.vendorId) {
      this.toast.error("Please select a vendor.");
      return;
    }
    if (!this.purchaseOrder.addressId) {
      this.toast.error("Please select a billing address.");
      return;
    }
    if (!this.purchaseOrder.contactPersonName) {
      this.toast.error("Please enter a contact person name.");
      return;
    }
     if (!this.purchaseOrder.contachPersonNo) {
      this.toast.error("Please enter a contact person no.");
      return;
    } if (!this.purchaseOrder.contachPersonEmail) {
      this.toast.error("Please enter a contact person email.");
      return;
    }
    if (!this.purchaseOrder.refNo) {
      this.toast.error("Please enter a refrence number.");
      return;
    }
     if (!this.purchaseOrder.purchaseOrderDate) {
      this.toast.error("Please selcet a purchase order Date.");
      return;
    }
       if (!this.purchaseOrder.deliveryDate) {
      this.toast.error("Please selcet a purchase order Date.");
      return;
    }

    if (this.purchaseOrder.purchaseOrderDetailReqDtos.length === 0) {
      this.toast.error("Please add at least one item.");
      return;
    }
    if (this.purchaseOrder.purchaseOrderPaymentReqDtos.length > 0) {
      this.totalPaid = this.purchaseOrder.purchaseOrderPaymentReqDtos.reduce((sum: number, pay: any) => sum + (Number(pay.amount) || 0), 0);
      if (this.totalPaid <= 0) {
        this.toast.error('Total paid amount must be greater than zero');  
        return;
      }
      const dueAmount = this.purchaseOrder.totalAmount - this.totalPaid;
      if (dueAmount < 0) {
        this.toast.error('Total paid amount cannot be greater than total amount');
        return;
      }
    }
      
      this.purchaseOrder.isCancel=false;
      this.purchaseOrder.isActive=true;
      if(this.purchaseOrder.purchaseType=="Service"){
        this.purchaseOrder.purchaseOrderDetailReqDtos.map(x=> x.itemId=-1);
      }
      this.purchaseOrder.createdBy= parseInt(localStorage.getItem("userId") || '0', 10);
      this.purchaseOrder.addressId= parseInt(this.purchaseOrder.addressId?.toString() || '0', 10);
      const reqBody:CommonReqDto<PurchaseOrder> = {
        mCompanyGuid:localStorage.getItem("mCompanyGuid"),
        companyGuid:localStorage.getItem("CompanyGuid"),
        UserId: parseInt(localStorage.getItem("userId") || '0', 10),
        PageSize: 1,
        PageRecordCount: 1000,
        Data: this.purchaseOrder
      };
      this.loading = true;
      const apiUrl = this.purchaseGuid ? 'PurchaseOrder/SavePurchaseOrderService' : 'PurchaseOrder/SavePurchaseOrderService';
      this.apiService.post<any>(apiUrl, reqBody).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.flag === 1) {
            this.toast.success(response.message);
            this.router.navigate(['/purchase-order']);
          } else {
            this.toast.warning(response.message);
          }
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to create purchase order');
        }
      });
    }
  
    GetMaxPurchaseOrderNo(){
        const dropdownreqdto: CommonReqDto<string> = {
            companyGuid: localStorage.getItem("CompanyGuid") || null,
            mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
            PageSize: 1,
            PageRecordCount: 1000,
            UserId: parseInt(localStorage.getItem("userId") || '0', 10),
            Data: "1",
        };
   
      this.apiService.post<CommonResDto<PurchaseOrder>>('PurchaseOrder/MaxPurchaseOrderNoService', dropdownreqdto).subscribe({
        next: res => {
          if (res.flag ===1) {
            this.purchaseOrder.purchaseOrderNo = res.data.purchaseOrderNo;
          } else {
            this.toast.warning(res.message);
          }
        },
        error: () => {
          this.toast.error('Failed to fetch purchase order number');
        }
      });
    }

   onPurchaseTypeChange(item: any): void {
    debugger;

   
    if(this.purchaseOrder.purchaseOrderDetailReqDtos.length!=0){
     const confirmed = confirm("Are you sure you want to change the type?");
       if (confirmed) {
             this.purchaseOrder.purchaseOrderDetailReqDtos=[];
              this.purchaseOrder.purchaseOrderPaymentReqDtos=[];
              this.totalPaid=0;
              this.totalAmount=0;
              this.purchaseOrder.totalAmount=0;
       }
         else{
           
         this.purchaseOrder.purchaseType = item.previousPurchaseType;
         item.purchaseType = null; 
         setTimeout(() => {
      item.purchaseType = item.previousPurchaseType; // Reapply after UI digest
    }, 0);
  }
    
}
    else{
       this.purchaseOrder.purchaseType = item.purchaseType;
    }
    
    }

 onRadioMouseDown(item: any): void {
  debugger;
  // Save current value before change happens
  item.previousPurchaseType = item.purchaseType;
}
}
  
