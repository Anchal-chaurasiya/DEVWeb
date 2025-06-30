import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyDto } from '../../../models/company.model';

@Component({
  selector: 'app-company-model',
  imports: [],
  standalone: true,
  templateUrl: './company-model.component.html',
  styleUrl: './company-model.component.css'
})
export class CompanyModelComponent {
  @Input() showCompanyModal: boolean = false;
  @Input() companyList: CompanyDto[] = [];
  @Input() selectedCompany: CompanyDto | null = null;
  @Output() companySelected = new EventEmitter<CompanyDto>();
  onCompanySelect() {
    if (this.selectedCompany) {
      this.companySelected.emit(this.selectedCompany);
    }
  }
}
