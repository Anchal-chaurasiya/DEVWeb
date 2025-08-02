import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ItemGroup } from '../../models/itemgroup.model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-create-item-group',
  standalone:true,
  imports: [CommonModule,NavbarComponent,FooterComponent,FormsModule,RouterModule],
  templateUrl: './create-item-group.component.html',
  styleUrl: './create-item-group.component.css'
})
export class CreateItemGroupComponent  implements OnInit {
  itemgroup: ItemGroup = { itemGroupName: '', description: "", isActive: true,remarks:"",itemGroupGuid:null };
  itemGroupGuid: string| null = null;
  loading = false;
  isActiveDisabled = true;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.itemGroupGuid = this.route.snapshot.paramMap.get('itemGroupGuid');
    if (this.itemGroupGuid) {
      this.loading = true;
      this.isActiveDisabled = false;
      const getitemgroupreqDto: CommonReqDto<string>= {
        companyGuid: localStorage.getItem("CompanyGuid"),
        mCompanyGuid: localStorage.getItem("mCompanyGuid") || null,
        PageSize: 1,
        PageRecordCount: 1000,
        Data: this.itemGroupGuid,
        UserId: parseInt(localStorage.getItem("userId") || '0', 10),
      }
      this.apiService.post<CommonResDto<ItemGroup>>(`ItemGroup/GetItemGroupService`,getitemgroupreqDto).subscribe({
        next: (response) => {
          this.itemgroup = response.data ;
          this.loading = false;
        },
        error: () => {
          this.toast.warning('Failed to load item group details');
          this.loading = false;
        }
      });
    }
    else{
      this.itemgroup.isActive = true;
      this.isActiveDisabled = true;
    }
  }

  onSubmit() {
  if (!this.itemgroup.itemGroupName || !this.itemgroup.description) {
    this.toast.warning('Please fill all required fields');
    return;
  }
  this.loading = true;
 // Ensure remarks is never null
  if (this.itemgroup.remarks == null) {
    this.itemgroup.remarks = "";
  }
  const reqBody: CommonReqDto<ItemGroup> = {
    companyGuid:localStorage.getItem("CompanyGuid"),
    mCompanyGuid:localStorage.getItem("mCompanyGuid") || null,
    PageSize: 0,
    PageRecordCount: 0,
    Data: this.itemgroup,
    UserId: parseInt(localStorage.getItem("userId") || '0', 10),
  };

  if (this.itemGroupGuid) {
    // Update
    this.apiService.post<CommonResDto<ItemGroup>>('ItemGroup/UpdateItemGroupService', reqBody).subscribe({
      next: (response) => {
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/item-group']);
        } else {
          this.toast.warning(response.message);
          this.loading = false;
        }
      },
      error: () => {
        this.toast.warning('Update failed');
        this.loading = false;
      }
    });
  } else {
    // Create
    this.apiService.post<CommonResDto<ItemGroup>>('ItemGroup/AddItemGroupService', reqBody).subscribe({
      next: (response) => {
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/item-group']);
        } else {
          this.toast.warning(response.message);
          this.loading = false;
        }
      },
      error: () => {
        this.toast.warning('Creation failed');
        this.loading = false;
      }
    });
  }
}
}