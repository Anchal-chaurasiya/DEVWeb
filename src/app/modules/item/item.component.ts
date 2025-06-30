import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { ItemMaster } from '../../models/item.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [CommonModule,NavbarComponent,FooterComponent,RouterModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
loading: boolean = false;
 itemList: ItemMaster[] = [];
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
      mCompanyGuid:localStorage.getItem("mCompanyGuid"),
      PageSize: 1,
      PageRecordCount: 10,
      UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      Data: 1
    };
    this.apiService.post<CommonResDto<ItemMaster[]>>('Item/GetItemListService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.itemList = response.data;
        } else {
          this.itemList = [];
          this.toast.warning('No item group records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to load item records');
        console.error('Error fetching item records:', error);
      }
    }); 
 }
}
