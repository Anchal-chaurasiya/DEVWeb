import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ItemGroupComponent } from './modules/item-group/item-group.component';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { CreateTaxComponent } from './modules/create-tax/create-tax.component';
import { TaxComponent } from './modules/tax/tax.component';
import { CreateItemGroupComponent } from './modules/create-item-group/create-item-group.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'item-group', component: ItemGroupComponent },
  { path: 'change-password', component: ChangePasswordComponent },
   {path: 'create-item-group',component: CreateItemGroupComponent},
   {path: 'create-tax',component: CreateTaxComponent},
   { path: 'create-tax/:taxGuid', component: CreateTaxComponent }, 
   {path: 'tax',component: TaxComponent},
];
