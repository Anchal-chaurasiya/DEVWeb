import { Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ItemGroupComponent } from './modules/item-group/item-group.component';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { CreateTaxComponent } from './modules/create-tax/create-tax.component';
import { TaxComponent } from './modules/tax/tax.component';
import { CreateItemGroupComponent } from './modules/create-item-group/create-item-group.component';
import { CreateItemComponent } from './modules/create-item/create-item.component';
import { ItemComponent } from './modules/item/item.component';
import { CustomerComponent } from './modules/customer/customer.component';
import { VendorComponent } from './modules/vendor/vendor.component';
import { CreateCustomerComponent } from './modules/create-customer/create-customer.component';
import { CreateVendorComponent } from './modules/create-vendor/create-vendor.component';
import { CreateCompanyComponent } from './modules/create-company/create-company.component';
import { CreatePurchaseOrderComponent } from './transactionmodule/create-purchase-order/create-purchase-order.component';
import { PurchaseOrderComponent } from './transactionmodule/purchase-order/purchase-order.component';
import { ViewPurchaseOrderComponent } from './transactionmodule/view-purchase-order/view-purchase-order.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'item-group', component: ItemGroupComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'create-item-group',component: CreateItemGroupComponent},
  { path: 'create-tax',component: CreateTaxComponent},
  { path: 'create-tax/:taxGuid', component: CreateTaxComponent }, 
  { path: 'create-item-group/:itemGroupGuid', component: CreateItemGroupComponent }, 
  { path: 'tax',component: TaxComponent},
  { path: 'create-item',component: CreateItemComponent},
  { path: 'item',component: ItemComponent},
  { path: 'customer',component: CustomerComponent},
  { path: 'vendor',component: VendorComponent},
  { path: 'create-customer',component: CreateCustomerComponent},
  { path: 'create-item/:itemGuid', component: CreateItemComponent }, 
  { path: 'create-customer/:customerGuid', component: CreateCustomerComponent },  
  { path: 'create-vendor',component: CreateVendorComponent},
  { path: 'create-vendor/:customerGuid',component: CreateVendorComponent}, 
  { path: 'create-company',component: CreateCompanyComponent},
  { path: 'purchase-order',component: PurchaseOrderComponent},
  { path: 'create-purchase-order',component: CreatePurchaseOrderComponent},
  { path: 'view-purchase-order/:purchaseGuid',component: ViewPurchaseOrderComponent},
];
