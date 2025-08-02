import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoginRequest, LoginResponse } from '../../models/login.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { MenuItem } from '../../models/menu.model';
import { MenuService } from '../../services/menu.service';
import { UserContextService } from '../../services/usercontext.service';
import { CompanyDto } from '../../models/company.model';
import { CompanyModelComponent } from '../shared/company-model/company-model.component';
import { CommonReqDto } from '../../models/common.model';

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

  
  loginResponse: LoginResponse | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: ToastService,
    private menuService: MenuService,
    private userContext: UserContextService
  ) {}

  ngonit() {
    this.userContext.clearUser();
  }

  onLogin() {
    this.userContext.clearUser();
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
          localStorage.setItem('mCompanyGuid', response.mCompanyGuid);
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('userName', response.userName);
          //this.userContext.setUser(response.userId, response.userName, response.mCompanyGuid);
          this.fetchMenuDetails();
          if (response.companyCount == 0) {
            this.router.navigate(['/create-company']);
            return;
          }
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

  fetchMenuDetails(){
    const menureqdata: CommonReqDto<number> = {  
            mCompanyGuid: localStorage.getItem('mCompanyGuid') || '',
            companyGuid: localStorage.getItem('mCompanyGuid') || '',
            PageSize: 1,
            PageRecordCount: 1000,
            UserId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 0,
            Data: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 0,
          };

    this.apiService.post<MenuItem[]>('Menu/GetUserMenuListService', menureqdata).subscribe(res => {
      if (res) {
        const menuTree = this.buildMenuTree(res);
        this.menuService.setMenu(menuTree);
      }
      this.router.navigate(['/dashboard']);
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