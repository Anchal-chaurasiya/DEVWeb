import { Component } from '@angular/core';
import { SalesOrderListResponse, SalesOrderPaymentHeaderDto, SalesOrderPaymentReqDto, SalesOrderUpdateDto } from '../../models/salesorder.model';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../modules/shared/navbar/navbar.component';
import { FooterComponent } from '../../modules/shared/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-order',
  imports: [CommonModule,NavbarComponent,FooterComponent,RouterModule,FormsModule],
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css'
})
export class SalesOrderComponent {
 loading: boolean = false;
 salesOrderlist: SalesOrderListResponse[] = [];
 cancelSalesOrder: SalesOrderUpdateDto = {} as SalesOrderUpdateDto;
 paysalesOrder: SalesOrderPaymentReqDto[] = [] ;
 totalPaid: number = 0;
 totalAmount:number=0;
 beforepaidAmount: number = 0;
 dueAmount: number = 0;  
 sellGuid: string = '';
 isViewAll: boolean = false;
 pageSize = 1;
 pageRecordCount = 10;
 totalCount = 0;
 
 constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}
 ngOnInit() {
    this.getsalesOrderData();
 }
    openPaymentModal(sellGuid: string) {
     this.sellGuid = sellGuid; 
     this.totalAmount= this.salesOrderlist.find(po => po.sellGuid === sellGuid)?.totalAmount || 0;
     this.beforepaidAmount = this.salesOrderlist.find(po => po.sellGuid === sellGuid)?.paidAmount || 0;
     this.dueAmount = this.salesOrderlist.find(po => po.sellGuid === sellGuid)?.dueAmount || 0;
    }

    openCancelModel(salesGuid: string) {
      this.cancelSalesOrder.sellGuid = salesGuid;
      this.cancelSalesOrder.cancelRemark = '';
    }
      CancelOrder() {
        if (!this.cancelSalesOrder.cancelRemark) {
          this.toast.error('Please enter a cancellation remark');
          return;
        }
        if (confirm('Are you sure you want to delete this sales order?')) {
          this.loading = true;
          const cancelorderreq: CommonReqDto<SalesOrderUpdateDto> = {
              companyGuid: localStorage.getItem("CompanyGuid"),
              mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
              PageSize: 1,
              PageRecordCount: 1000,
              Data: {
                sellGuid: this.cancelSalesOrder.sellGuid,
                cancelRemark: this.cancelSalesOrder.cancelRemark
              },
              UserId: parseInt(localStorage.getItem("userId") || '0', 10),
          };
          this.apiService.post<CommonResDto<any>>('SellOrder/UpdateSellOrderService', cancelorderreq).subscribe({
            next: (response) => {
              this.loading = false;
              if (response.data) {
                this.toast.success('Sales order deleted successfully');
                window.location.reload();
              } else {
                this.toast.error('Failed to delete sales order');
              }
            },
            error: (error) => {
              this.loading = false;
              this.toast.error('Failed to delete sales order');
            }
          });
        }
      }

addPayment() {
      this.paysalesOrder.push({
      sellPaymentGuid: null,
      sellPaymentId: 0,
      sellId: 0,
      paymentMode: 'Cash',
      amount: 0,
      refrenceNo: ''
    });
  }
       removePayment(index: number) {
    if (this.paysalesOrder.length > 1) {
      this.paysalesOrder.splice(index, 1);
      this.updateSummary();
    }
  }
    updateSummary() {
    this.totalPaid = this.paysalesOrder.reduce((sum: number, pay: any) => sum + (Number(pay.amount) || 0), 0);
  }

  onSubmitPayment(){
    if (this.paysalesOrder.length === 0) {
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

      const reqBody:CommonReqDto<SalesOrderPaymentHeaderDto> = {
        mCompanyGuid:localStorage.getItem("mCompanyGuid"),
        companyGuid:localStorage.getItem("CompanyGuid"),
        UserId: parseInt(localStorage.getItem("userId") || '0', 10),
        PageSize: 1,
        PageRecordCount: 1000,
        Data:  {
          sellGuid:this.sellGuid,
          sellOrderPaymentReqDtos:this.paysalesOrder
        }
      };
      this.loading = true;
      const apiUrl = 'SellOrder/UpdatePaymentSellOrderService';
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
          this.toast.error('Failed to update payment sales order');
        }
      });
  }

   getsalesOrderData(){
    this.loading = true;
    const reqData: CommonReqDto<number>= {
            companyGuid: localStorage.getItem("CompanyGuid"),
            mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
            PageSize:this.isViewAll ? 1  :this.pageSize,
            PageRecordCount: this.isViewAll ? this.totalCount|| 99999:  this.pageRecordCount,
            Data: parseInt(localStorage.getItem("userId") || '0', 10),
            UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    };
  
    this.apiService.post<CommonResDto<SalesOrderListResponse[]>>('SellOrder/GetSellOrderListService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.salesOrderlist = response.data;
          this.pageSize= response.pageSize;
          this.pageRecordCount= response.pageRecordCount;
          this.totalCount= response.totalRecordCount;
        } else {
          this.salesOrderlist = [];
          this.toast.warning('No sales Order records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to sales Order records');
      }
    });
   }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageRecordCount);
  }

  nextPage() {
    if (this.pageSize < this.totalPages) {
      this.pageSize++;
      this.getsalesOrderData();
    }
  }
   prevPage() {
    if (this.pageSize > 1) {
      this.pageSize--;
      this.getsalesOrderData();
    }
  }

  getStartIndex(): number {
  return (this.pageSize - 1) * this.pageRecordCount;
}

getEndIndex(): number {
  const end = this.getStartIndex() + this.pageRecordCount;
  return end > this.totalCount ? this.totalCount : end;
}
viewAll() {
  this.isViewAll = true;
  this.pageSize = 1;
  this.getsalesOrderData();
}
viewLess() {
  this.isViewAll = false;
  this.pageSize = 1;
  this.pageRecordCount=1;
  this.getsalesOrderData();
}
}
 

