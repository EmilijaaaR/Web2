import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    roles: String[] = ['ADMIN', 'CUSTOMER', 'DELIVERER'];

    constructor(private router: Router, private cookieService:CookieService) {
    
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (localStorage.getItem('role') != null)
            return true;
        else {
            this.router.navigate(['/home']);
            return false;
        }

    }
}
