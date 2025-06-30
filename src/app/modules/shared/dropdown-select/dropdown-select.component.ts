import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dropdown-select',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './dropdown-select.component.html',
  styleUrl: './dropdown-select.component.css'
})
export class DropdownSelectComponent implements OnInit {
  @Input() apiUrl!: string; // e.g. 'ItemGroup/GetItemGroupDropdownService'
  @Input() labelKey: string = 'name'; // property to show in dropdown
  @Input() valueKey: string = 'id';   // property to use as value
  @Input() placeholder: string = 'Select';
  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  items: any[] = [];
  searchText: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any[]>(this.apiUrl).subscribe(res => {
      this.items = res;
    });
  }

  onChange(value: any) {
    this.model = value;
    this.modelChange.emit(this.model);
  }

  get filteredItems() {
    return this.items.filter(item =>
      (item?.[this.labelKey] ?? '').toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get mappedItems() {
    return this.filteredItems.map(item => ({
      value: item?.[this.valueKey],
      label: item?.[this.labelKey] ?? ''
    }));
  }
}