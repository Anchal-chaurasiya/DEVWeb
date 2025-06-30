import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ItemGroup } from '../../models/itemgroup.model';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-item-group',
  standalone:true,
  imports: [CommonModule, NavbarComponent, FooterComponent,FormsModule,RouterModule],
  templateUrl: './item-group.component.html',
  styleUrl: './item-group.component.css'
})
export class ItemGroupComponent {
loading: boolean = false;
 itemgrouplist: ItemGroup[] = [];
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
    this.apiService.post<CommonResDto<ItemGroup[]>>('ItemGroup/GetItemGroupListService', reqData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data!== null ) {
          this.itemgrouplist = response.data;
        } else {
          this.itemgrouplist = [];
          this.toast.warning('No Item Group records found');
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.error('Failed to load Item group records');
      }
    }); 
 }
}
