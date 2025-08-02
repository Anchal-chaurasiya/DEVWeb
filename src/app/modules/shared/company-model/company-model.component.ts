import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CompanyDto } from '../../../models/company.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-model',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './company-model.component.html',
  styleUrl: './company-model.component.css'
})
export class CompanyModelComponent {
  @Input() showCompanyModal: boolean = false;
  @Input() companyList: CompanyDto[] = [];
  @Input() selectedCompany: CompanyDto | null = null;
  @Output() selectedCompanyChange = new EventEmitter<CompanyDto | null>();
  @Output() companySelected = new EventEmitter<void>();

  onCompanySelect() {
    this.selectedCompanyChange.emit(this.selectedCompany); // update parent
    this.companySelected.emit(); // call parent function
  }
}