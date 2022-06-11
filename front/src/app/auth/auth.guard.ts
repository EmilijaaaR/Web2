import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, RouteReuseStrategy } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  roles = ['ADMIN', 'CUSTOMER', 'DELIVERER'];

  constructor(private router: Router, private cookieService:CookieService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('token') != null){
      if (localStorage.getItem('role') != null){ // && next.data['roles'].indexOf(localStorage.getItem('role'))){
        if(this.checkRole(next, localStorage.getItem('role')!)){
          return true;
        }else{
          this.router.navigate(['/home']);
          return false
        }
      }
      else {
        this.router.navigate(['/home']);
        return false;
      }
    }
    else {
      this.router.navigate(['/user/login']);
      return false;
    }
  }

  checkRole(next: ActivatedRouteSnapshot, role: String): boolean{
    if(next.data['roles'] !== undefined && next.data['roles'].length > 0){
      if(next.data['roles'].indexOf(role) !== -1){
        return true;
      }
      return false;
    }else{
      return true;
    }
  }

}
