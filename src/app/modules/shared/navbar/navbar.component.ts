import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from '../../../models/menu.model';
import { CommonResDto } from '../../../models/common.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isShow = false;
   constructor(private apiService: ApiService, private router: Router,
    private toast: ToastService
  ) {}  
 menuTree: MenuItem[] = [];
  ngOnInit() {
    const menuStr = localStorage.getItem('userMenu');
    if (menuStr) {
      const menuArr: MenuItem[] = JSON.parse(menuStr);
      this.menuTree = menuArr;
    }
    else{
      this.toast.warning("Menu not found, please login again");
     // this.router.navigate(['/login']);
    }
  }
 

  
  
  logout() {
      localStorage.removeItem('authToken');
      this.toast.success("logout successfully");
      this.router.navigate(['/login']); 
  }


 
}


