import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Token } from './models/token.model';
import { RegisterComponent } from './register/register.component';
import { User } from './models/user.model';
import { Verify } from '../shared/models/verify.model';
import { SocialLogin } from './models/social-login.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient) { }

  login(login:FormGroup) :Observable<Token> {
    return this.http.post<Token>(environment.serverUrl + '/auth/login', login);
  }

  register(registration:RegisterComponent) :Observable<Object> {
    return this.http.post<Object>(environment.serverUrl + '/auth/signup', registration);
  }

  getUser(): Observable<User>{
    return this.http.get<User>(environment.serverUrl+ '/auth/user');
  }

  updateUser(user: User): Observable<Object> {
    return this.http.put<Object>(environment.serverUrl + '/auth/user', user);
  }

  verifyUser(verify: Verify): Observable<Object>{
    return this.http.post<Object>(environment.serverUrl + "/auth/verify-deliverer", verify);
  }

  getPendingDeliverers(): Observable<User[]>{
    return this.http.get<User[]>(environment.serverUrl+ '/auth/pending-deliverers');
  }

  applyForDeliverer(): Observable<Object>{
    return this.http.post<Object>(environment.serverUrl + '/auth/apply', '');
  }

  socialLogin(socialLogin: SocialLogin): Observable<Token> {
    return this.http.post<Token>(environment.serverUrl + '/auth/social-login', socialLogin);
  }
}
