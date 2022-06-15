import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MaterialExampleModule } from './material.module';
import {RouterModule} from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UserService } from './user/user.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { NavmenuComponent } from './dashboard/navmenu/navmenu.component';
import {MatListModule} from '@angular/material/list';
import { MealsListComponent } from './meals/meals-list/meals-list.component';
import { MealComponent } from './meals/meal/meal.component';
import { AddMealComponent } from './meals/add-meal/add-meal.component';
import { BasketComponent } from './basket/basket.component';
import { Meal } from './meals/models/meal.model';
import { BasketItem } from './basket/model/basket-item.model';
import { BasketItemComponent } from './basket/basket-item/basket-item.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DialogComponent } from './shared/dialog/dialog.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { PreviousOrdersComponent } from './orders/previous-orders/previous-orders.component';
import { OrderComponent } from './orders/order/order.component';
import { PendingDeliverersComponent } from './verification/pending-deliverers/pending-deliverers.component';
import { PendingUserComponent } from './verification/pending-user/pending-user.component';
import { AllOrdersComponent } from './orders/all-orders/all-orders.component';
import { ApplyForDelivererComponent } from './verification/apply-for-deliverer/apply-for-deliverer.component';
import { PendingOrdersComponent } from './orders/pending-orders/pending-orders.component';
import { CurrentOrdersComponent } from './orders/current-orders/current-orders.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';


export function tokenGetter() {
  return localStorage.getItem("token");
}

export function roleGetter() {
  return localStorage.getItem("role");
}

export var refreshSubject = new BehaviorSubject(false);



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    NavmenuComponent,
    ProfileComponent,
    MealsListComponent,
    MealComponent,
    AddMealComponent,
    BasketComponent,
    BasketItemComponent,
    DialogComponent,
    OrderListComponent,
    PreviousOrdersComponent,
    OrderComponent,
    PendingDeliverersComponent,
    PendingUserComponent,
    AllOrdersComponent,
    ApplyForDelivererComponent,
    PendingOrdersComponent,
    CurrentOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MaterialExampleModule,
    RouterModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains:environment.allowedDomains
      }
    }),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    LayoutModule,
    FormsModule,
    MatListModule,
    SocialLoginModule
  ],
  providers: [
    CookieService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      },
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: FacebookLoginProvider.PROVIDER_ID,
              provider: new FacebookLoginProvider('1258651144966865'),
            },
          ],
          onError: (err) => {
            console.error(err);
          }
        } as SocialAuthServiceConfig,
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
