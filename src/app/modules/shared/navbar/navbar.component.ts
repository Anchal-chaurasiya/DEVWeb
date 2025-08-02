import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from '../../../models/menu.model';
import { MenuService } from '../../../services/menu.service'; // <-- import
import { FormsModule } from '@angular/forms';
import { UserContextService } from '../../../services/usercontext.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isShow = false;
  menuTree: MenuItem[] = [];
  companyName: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private menuService: MenuService, // <-- inject
    public userContextService: UserContextService
  ) {}

  ngOnInit() {

    this.userContextService.companyName$.subscribe(name => {
      this.companyName = name;
    });


    // Subscribe to menu changes from MenuService
    this.menuService.menu$.subscribe(menu => {
      this.menuTree = menu;
    });
    //this.companyName = localStorage.getItem('CompanyName')
    // Load menu from storage if available (for page refresh)
    this.menuService.loadMenuFromStorage();
    
   
  }

  logout() {
    this.userContextService.clearUser();
    this.toast.success("Logout successfully");
    this.router.navigate(['/login']);
  }
}