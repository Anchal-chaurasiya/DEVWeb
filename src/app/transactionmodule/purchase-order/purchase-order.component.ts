import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../modules/shared/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../modules/shared/footer/footer.component';
import { PurchaseOrderListResponse, PurchaseOrderPaymentHeaderDto, PurchaseOrderPaymentReqDto, PurchaseOrderUpdateDto } from '../../models/purchaseorder.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-order',
  standalone: true,
   imports: [CommonModule,NavbarComponent,FooterComponent,RouterModule,FormsModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.css'
})
export class PurchaseOrderComponent {
 loading: boolean = false;
 purchaseOrderlist: PurchaseOrderListResponse[] = [];
 cancelPurchaseOrder: PurchaseOrderUpdateDto = {} as PurchaseOrderUpdateDto;
 paypurchaseOrder: PurchaseOrderPaymentReqDto[] = [] ;
 totalPaid: number = 0;
 totalAmount:number=0;
 beforepaidAmount: number = 0;
 dueAmount: number = 0;  
 purhaseGuid: string = '';
constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}
 ngOnInit() {
  
    this.loading = true;
    const reqData: CommonReqDto<number>= {
            companyGuid: localStorage.getItem("CompanyGuid"),
            mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
            PageSize: 1,
            PageRecordCount: 1000,
            Data: parseInt(localStorage.getItem("userId") || '0', 10),
            UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    };
  
    this.apiService.post<CommonResDto<PurchaseOrderListResponse[]>>('PurchaseOrder/GetPurchaseOrderListService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.purchaseOrderlist = response.data;
        } else {
          this.purchaseOrderlist = [];
          this.toast.warning('No purchase Order records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to purchase Order records');
      }
    }); 
 }

    openPaymentModal(purchaseGuid: string) {
     this.purhaseGuid = purchaseGuid; 
     this.totalAmount= this.purchaseOrderlist.find(po => po.purchaseGuid === purchaseGuid)?.totalAmount || 0;
     this.beforepaidAmount = this.purchaseOrderlist.find(po => po.purchaseGuid === purchaseGuid)?.paidAmount || 0;
     this.dueAmount = this.purchaseOrderlist.find(po => po.purchaseGuid === purchaseGuid)?.dueAmount || 0;
     //this.router.navigate(['/create-purchase-order', purchaseGuid, 'payment']);  
    }

    openCancelModel(purchaseGuid: string) {
      this.cancelPurchaseOrder.purchaseGuid = purchaseGuid;
      this.cancelPurchaseOrder.cancelRemark = '';
    }
      CancelOrder() {
        if (!this.cancelPurchaseOrder.cancelRemark) {
          this.toast.error('Please enter a cancellation remark');
          return;
        }
        if (confirm('Are you sure you want to delete this purchase order?')) {
          this.loading = true;
          const cancelorderreq: CommonReqDto<PurchaseOrderUpdateDto> = {
              companyGuid: localStorage.getItem("CompanyGuid"),
              mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
              PageSize: 1,
              PageRecordCount: 1000,
              Data: {
                purchaseGuid: this.cancelPurchaseOrder.purchaseGuid,
                cancelRemark: this.cancelPurchaseOrder.cancelRemark
              },
              UserId: parseInt(localStorage.getItem("userId") || '0', 10),
          };
          this.apiService.post<CommonResDto<any>>('PurchaseOrder/UpdatePurchaseOrderService', cancelorderreq).subscribe({
            next: (response) => {
              this.loading = false;
              if (response.data) {
                this.toast.success('Purchase order deleted successfully');
                window.location.reload();
               
                // this.ngOnInit();
              } else {
                this.toast.error('Failed to delete purchase order');
              }
            },
            error: (error) => {
              this.loading = false;
              this.toast.error('Failed to delete purchase order');
            }
          });
        }
      }

addPayment() {
      this.paypurchaseOrder.push({
      purchasePaymentGuid: null,
      purchasePaymentId: 0,
      purchaseId: 0,
      paymentMode: 'Cash',
      amount: 0,
      refrenceNo: ''
    });
  }
       removePayment(index: number) {
    if (this.paypurchaseOrder.length > 1) {
      this.paypurchaseOrder.splice(index, 1);
      this.updateSummary();
    }
  }
    updateSummary() {
    this.totalPaid = this.paypurchaseOrder.reduce((sum: number, pay: any) => sum + (Number(pay.amount) || 0), 0);
  }

  onSubmitPayment(){
    if (this.paypurchaseOrder.length === 0) {
      this.toast.error('Please add at least one payment entry');
      return;
    }
    if (this.totalPaid <= 0) {
      this.toast.error('Total paid amount must be greater than zero');  
      return;
    }
    if (this.totalPaid > this.dueAmount) {
      this.toast.error('Total paid amount cannot be greater than due amount');
      return;
    }

      const reqBody:CommonReqDto<PurchaseOrderPaymentHeaderDto> = {
        mCompanyGuid:localStorage.getItem("mCompanyGuid"),
        companyGuid:localStorage.getItem("CompanyGuid"),
        UserId: parseInt(localStorage.getItem("userId") || '0', 10),
        PageSize: 1,
        PageRecordCount: 1000,
        Data:  {
          purchaseGuid:this.purhaseGuid,
          PurchaseOrderPaymentReqDtos:this.paypurchaseOrder
        }
      };
      this.loading = true;
      const apiUrl = 'PurchaseOrder/UpdatePaymentPurchaseOrderService';
      this.apiService.post<any>(apiUrl, reqBody).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.flag === 1) {
            this.toast.success(response.message);
            window.location.reload();

          } else {
            this.toast.warning(response.message);
          }
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to update payment purchase order');
        }
      });
  }
}
 
