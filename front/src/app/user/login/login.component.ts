import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SocialLogin } from '../models/social-login.model';
import { Token } from '../models/token.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  subscription?: Subscription

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)])
  });

  constructor(
    private service: UserService,
    private router: Router,
    private toastr: ToastrService, 
    private socialAuthService: SocialAuthService,
    private http: HttpClient
    ) {

     }



  ngOnInit(): void {
    this.subscription = this.socialAuthService.authState.subscribe(user => {
      if(user != null){
        let socialLogin = new SocialLogin();
        socialLogin.id = user.id;
        socialLogin.token = user.authToken;
        this.service.socialLogin(socialLogin).subscribe(
          data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.userData.role);
            this.toastr.success("Login successfully")
            this.router.navigateByUrl('/home');
          }
        );
      }else{
        //this.subscription?.unsubscribe();
      }
    });
  }
  OnDestroy(){
    this.subscription?.unsubscribe();
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  getFacebookData(userId: string, accessToken: string) {
    return this.http.get(`https://graph.facebook.com/${userId}?fields=birthday,hometown&access_token=${accessToken}`, { headers: new HttpHeaders({
      'Content-Type' : 'application/json'
    })})
  }
  
  onSubmit() {
    if(this.loginForm.valid){
      // send login request
      this.service.login(this.loginForm.value).subscribe(
        (data) => {
          console.log(data)
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.userData.role);
          this.toastr.success("Login successfully")
          this.router.navigateByUrl('/home');
        },
        error => {
            console.log(error);
            this.toastr.error(error.error, 'Authentication failed.');
        }
      );
    }
  }
}
