import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../modules/shared/navbar/navbar.component';
import { FooterComponent } from '../../modules/shared/footer/footer.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalesOrderViewResponse } from '../../models/salesorder.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-view-sales-order',
  imports: [CommonModule,NavbarComponent,FooterComponent,RouterModule,FormsModule],
  templateUrl: './view-sales-order.component.html',
  styleUrl: './view-sales-order.component.css'
})
export class ViewSalesOrderComponent {
  loading: boolean = false;
  viewsalesorder: SalesOrderViewResponse = {} as SalesOrderViewResponse;
  sellGuid: string | null = null;
 constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private route: ActivatedRoute,
  ) {}
 ngOnInit() {
    this.sellGuid = this.route.snapshot.paramMap.get('sellGuid');
    this.loading = true;
    const reqData: CommonReqDto<string>= {
            companyGuid: localStorage.getItem("CompanyGuid"),
            mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
            PageSize: 1,
            PageRecordCount: 1000,
            Data: this.sellGuid || "",
            UserId: parseInt(localStorage.getItem("userId") || '0', 10),
    };
  
    this.apiService.post<CommonResDto<SalesOrderViewResponse>>('SellOrder/ViewSellOrderService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.viewsalesorder = response.data;
        } else {
         
          this.toast.warning('No sales Order records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to sales Order records');
      }
    }); 
}
}
