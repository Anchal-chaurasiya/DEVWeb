import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../modules/shared/navbar/navbar.component';
import { FooterComponent } from '../../modules/shared/footer/footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderViewResponse } from '../../models/purchaseorder.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-view-purchase-order',
  imports: [CommonModule,NavbarComponent,FooterComponent,RouterModule,FormsModule],
  templateUrl: './view-purchase-order.component.html',
  styleUrl: './view-purchase-order.component.css'
})
export class ViewPurchaseOrderComponent {
   loading: boolean = false;
   viewpurchaseorder: PurchaseOrderViewResponse = {} as PurchaseOrderViewResponse;
   purchaseGuid: string | null = null;
 constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private route: ActivatedRoute,
  ) {}
 ngOnInit() {
    this.purchaseGuid = this.route.snapshot.paramMap.get('purchaseGuid');
    this.loading = true;
    const reqData: CommonReqDto<string>= {
            companyGuid: localStorage.getItem("CompanyGuid"),
            mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
            PageSize: 1,
            PageRecordCount: 1000,
            Data: this.purchaseGuid || "",
            UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    };
  
    this.apiService.post<CommonResDto<PurchaseOrderViewResponse>>('PurchaseOrder/ViewPurchaseOrderService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.viewpurchaseorder = response.data;
        } else {
         
          this.toast.warning('No purchase Order records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to purchase Order records');
      }
    }); 
}
}
