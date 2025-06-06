import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ItemGroup } from '../../models/itemgroup.model';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';

@Component({
  selector: 'app-create-item-group',
  standalone:true,
  imports: [CommonModule,NavbarComponent,FooterComponent,FormsModule],
  templateUrl: './create-item-group.component.html',
  styleUrl: './create-item-group.component.css'
})
export class CreateItemGroupComponent  implements OnInit {
  itemGroup: ItemGroup = { ItemGroupName: '',  isActive: true,remarks:"" };
  itemGroupId?: number;
  loading = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.itemGroupId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.itemGroupId) {
      this.loading = true;
      this.apiService.get<ItemGroup>(`Tax/GetTaxById/${this.itemGroupId}`).subscribe({
        next: (data) => {
          this.itemGroup = data;
          this.loading = false;
        },
        error: () => {
          this.toast.warning('Failed to load tax details');
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (!this.itemGroup.ItemGroupName) {
      this.toast.warning('Please fill all required fields');
      return;
    }
    this.loading = true;

    const reqBody: CommonReqDto<ItemGroup> = {
    CompanyId: 1, 
    PageSize: 0,
    PageRecordCount: 0,
    Data: this.itemGroup,
    UserId: 1 
    };

    if (this.itemGroupId) {
      // Update
      this.apiService.put(`ItemGroup/UpdateItemGroup/${this.itemGroupId}`, this.itemGroup).subscribe({
        next: () => {
          this.toast.success('Tax updated successfully');
          this.router.navigate(['/tax-master-list']);
        },
        error: () => {
          this.toast.warning('Update failed');
          this.loading = false;
        }
      });
    } else {
      // Create
      this.apiService.post<CommonResDto<ItemGroup>>('ItemGroup/AddItemGroup', reqBody).subscribe({
        next: (response) => {
          if(response.flag ===1) {  
            this.toast.success(response.message);
            this.router.navigate(['/item-group']);
          }
          else{
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
