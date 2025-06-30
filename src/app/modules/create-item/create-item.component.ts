import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemMaster } from '../../models/item.model';
import { DropdownSelectComponent } from '../shared/dropdown-select/dropdown-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownDataService } from '../../services/dropdown-select-data.service';
import { CommonReqDto, CommonResDto } from '../../models/common.model';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { Uom } from '../../models/uom.model';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [CommonModule,NavbarComponent,RouterModule,FooterComponent,FormsModule,NgSelectModule],
  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.css'
})
export class CreateItemComponent {
  item: ItemMaster = {} as ItemMaster;
  itemGroups: any[] = [];
  taxes: any[] = [];
  uomes:Uom[] = [];
  loadingItemGroups = false;
  loadingTaxes = false;
  loadingUOM = false;
  itemGuid: string| null = null;
  loading = false;
  isActiveDisabled = true;
constructor(
  private dropdownData: DropdownDataService,
  private route: ActivatedRoute,
  private router: Router,
  private apiService: ApiService, // Assuming you have an ApiService to handle API calls
  private toast: ToastService // Assuming you have a ToastService for notifications
) {}
ngOnInit() {

    // Item Group and Tax Dropdowns
    this.loadingItemGroups = true;
    this.dropdownData.getDropdownData<any>('ItemGroup/GetItemGroupDropdownService').subscribe({
      next: res => {
        this.itemGroups = res;
        this.loadingItemGroups = false;
        this.tryPatchItem(); 
      },
      error: () => {
        this.loadingItemGroups = false;
      }
    });

    this.loadingTaxes = true;
    this.dropdownData.getDropdownData<any>('Tax/GetTaxDropdownService').subscribe({
      next: res => {
        this.taxes = res;
        this.loadingTaxes = false;
        this.tryPatchItem(); 
      },
      error: () => {
        this.loadingTaxes = false;
      }
    });

    this.loadingUOM = true;

     const getuomreqdto={
        CompanyId: 1,  
        mCompanyGuid:localStorage.getItem("mCompanyGuid") || null,
        PageSize: 1,
        PageRecordCount: 10,
        UserId: localStorage.getItem("userId"),
        Data: 1
     }


    this.dropdownData.getDropdownDataByParam<Uom>('UOM/BindUomDropdown', getuomreqdto).subscribe({
        next: (res) => {
          this.loadingUOM = false;
           if (res!== null ) {
            console.log(res);
             this.uomes = res.data;
             this.tryPatchItem(); 
           } 
         },
         error: (error) => {
           this.loadingUOM = false;
           this.toast.error('Failed to load UOM records');
         }
       }); 
     
     this.itemGuid = this.route.snapshot.paramMap.get('itemGuid');
     if(this.itemGuid){
      this.loading = true;
      this.isActiveDisabled = false;
      const getItemReqDto={
         CompanyId: 1,  
        PageSize: 1,
        mCompanyGuid:localStorage.getItem("mCompanyGuid") || null,
        PageRecordCount: 10,
        UserId: localStorage.getItem("userId"),
        Data: this.itemGuid
      }

        this.apiService.post<CommonResDto<ItemMaster>>(`Item/GetItemService`,getItemReqDto).subscribe({
        next: (response) => {
          this.item = response.data ;
          this.tryPatchItem();
          this.loading = false;
        },
        error: () => {
          this.toast.warning('Failed to load item  details');
          this.loading = false;
        }
      });
     }
else{
    this.item.isActive = true;
      this.isActiveDisabled = true;
}


  }


  // Helper to patch itemGroupId/taxId only after dropdowns are loaded
tryPatchItem() {
  if (this.item && this.itemGroups.length && this.taxes.length && this.uomes.length) {
    // Convert to number if needed
    this.item.itemGroupId = this.item.itemGroupId ? Number(this.item.itemGroupId) : null;
    this.item.taxId = this.item.taxId ? Number(this.item.taxId) : null;
    this.item.uomId = this.item.uomId ? Number(this.item.uomId) : null;

    // Check if the value exists in the dropdowns, else set to null
    if (!this.itemGroups.some(g => g.itemGroupId === this.item.itemGroupId)) {
      this.item.itemGroupId = null;
    }
    if (!this.taxes.some(t => t.taxId === this.item.taxId)) {
      this.item.taxId = null;
    }
     if (!this.uomes.some(t => t.uomId === this.item.uomId)) {
      this.item.uomId = null;
    }
  }
}

 onSubmit() {
  if (!this.item.itemCode || !this.item.itemName  || !this.item.itemGroupId || !this.item.uomId) {
    this.toast.warning('Please fill all required fields');
    return;
  }
  this.loading = true;
  if (this.item.remarks == null) {
    this.item.remarks = "";
  }
  const reqBody: CommonReqDto<ItemMaster> = {
    CompanyId: 1,
    mCompanyGuid:localStorage.getItem("mCompanyGuid") || null,
    PageSize: 0,
    PageRecordCount: 0,
    Data: this.item,
    UserId:  parseInt(localStorage.getItem("userId") || '0', 10),
  };

  if (this.itemGuid) {
    // Update
    this.apiService.post<CommonResDto<ItemMaster>>('Item/AddItemService', reqBody).subscribe({
      next: (response) => {
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/item']);
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
    this.apiService.post<CommonResDto<ItemMaster>>('Item/AddItemService', reqBody).subscribe({
      next: (response) => {
        if (response.flag === 1) {
          this.toast.success(response.message);
          this.router.navigate(['/item']);
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
