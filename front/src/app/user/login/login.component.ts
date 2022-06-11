import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Token } from '../models/token.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)])
  });

  constructor(private service: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
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
