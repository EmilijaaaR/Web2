import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { BasketComponent } from './basket/basket.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MealsListComponent } from './meals/meals-list/meals-list.component';
import { AllOrdersComponent } from './orders/all-orders/all-orders.component';
import { CurrentOrdersComponent } from './orders/current-orders/current-orders.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { PendingOrdersComponent } from './orders/pending-orders/pending-orders.component';
import { PreviousOrdersComponent } from './orders/previous-orders/previous-orders.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { ApplyForDelivererComponent } from './verification/apply-for-deliverer/apply-for-deliverer.component';
import { PendingDeliverersComponent } from './verification/pending-deliverers/pending-deliverers.component';

const routes: Routes = [
  
  {path:'',redirectTo:'/auth/login',pathMatch:'full'},
  {
    path: 'auth',
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  {path:'home',component:DashboardComponent,canActivate:[AuthGuard]},
  {path:'user',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'meals', component: MealsListComponent,canActivate:[AuthGuard]},
  {path:'basket', component: BasketComponent,canActivate:[AuthGuard], data: {roles: ['CUSTOMER']}},
  {path:'previous-orders', component: PreviousOrdersComponent, canActivate:[AuthGuard]},
  {path:'verify-deliverers', component: PendingDeliverersComponent, canActivate:[AuthGuard]},
  {path:'all-orders', component: AllOrdersComponent, canActivate:[AuthGuard], data: {roles: ['ADMIN']}},
  {path:'apply', component: ApplyForDelivererComponent, canActivate:[AuthGuard], data:{roles: ['CUSTOMER']}},
  {path:'pending-orders', component: PendingOrdersComponent, canActivate:[AuthGuard], data:{roles: ['DELIVERER']}},
  {path:'current-orders', component: CurrentOrdersComponent, canActivate:[AuthGuard], data:{roles: ['CUSTOMER','DELIVERER']}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
