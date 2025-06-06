import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { TaxMaster } from '../../models/taxmaster.model';
import { CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [CommonModule,NavbarComponent,FooterComponent,RouterModule],
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.css',
})
export class TaxComponent {
loading: boolean = false;
 taxList: TaxMaster[] = [];
constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}
 ngOnInit() {
    this.loading = true;
   
    const reqData=
    {
      CompanyId: 1,  
      PageSize: 1,
      PageRecordCount: 10,
      UserId: 1,
      Data: 1
    };
    this.apiService.post<CommonResDto<TaxMaster[]>>('Tax/GetTaxListService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.taxList = response.data;
        } else {
          this.taxList = [];
          this.toast.warning('No tax records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to load tax records');
        console.error('Error fetching tax records:', error);
      }
    }); 
 }
}
