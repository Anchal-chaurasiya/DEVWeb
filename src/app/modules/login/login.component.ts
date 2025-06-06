import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoginRequest, LoginResponse } from '../../models/login.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { MenuItem } from '../../models/menu.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})

export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;
  menuTree: MenuItem[] = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService
  ) {}

  onLogin() {
    this.error = '';
    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }

    this.loading = true;
    const loginData: LoginRequest = {
      userName: this.username,
      password: this.password
    };

    this.apiService.post<LoginResponse>('auth/userlogin', loginData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.token != null) {
          this.toast.success('Login Successfully');
          localStorage.setItem('authToken', response.token);
          // Get Menu List 
           const menureqdata={
              CompanyId: 1,  
              PageSize: 1,
              PageRecordCount: 10,
              UserId: 1,
              Data:1
            };
            this.apiService.post<MenuItem[]>('Menu/GetUserMenuListService', menureqdata).subscribe(res => {
              if (res) {
                 const menuTree = this.buildMenuTree(res);
                 localStorage.setItem('userMenu', JSON.stringify(menuTree)); 
              }
            });
          this.router.navigate(['/dashboard']);
        } else {
          this.error = "Something went wrong, please contact the administrator";
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.warning('Invalid username or password');
        console.error('Login error:', error);
      },
    });
  }

  buildMenuTree(flatMenu: MenuItem[]): MenuItem[] {
  const menuMap = new Map<number, MenuItem>();
  const roots: MenuItem[] = [];

  flatMenu.forEach(item => {
    menuMap.set(item.menuId, { ...item, children: [] });
  });

  flatMenu.forEach(item => {
    if (item.parentId === 0) {
      roots.push(menuMap.get(item.menuId)!);
    } else {
      const parent = menuMap.get(item.parentId);
      if (parent) {
        parent.children!.push(menuMap.get(item.menuId)!);
      }
    }
  });
  return roots;
}
}
 