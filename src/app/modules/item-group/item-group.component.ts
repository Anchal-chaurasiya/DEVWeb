import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-group',
  standalone:true,
  imports: [CommonModule, NavbarComponent, FooterComponent,FormsModule],
  templateUrl: './item-group.component.html',
  styleUrl: './item-group.component.css'
})
export class ItemGroupComponent {

}
