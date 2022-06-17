import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Token } from '../models/token.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  minDate: Date;
  maxDate: Date;

  hide = true;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(30)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
    passwordVal: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
    firstname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]),
    birthday: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
  });

  constructor(private service: UserService, private router: Router, private toastr: ToastrService) {
    const currentYear = new Date().getFullYear();
    // maximum 130 years old minimum 15
    this.minDate = new Date(currentYear - 122, 0, 1);
    this.maxDate = new Date(currentYear - 15, 0, 0);
   }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.registerForm.valid){
      // send register request
      if(this.registerForm.value.password !== this.registerForm.value.passwordVal){
        // show error passwords not match
        this.toastr.error("Password and confirm password doesn't match.")
        return;
      }
      let register = this.registerForm.value;
      register.birthday = this.registerForm.value.birthday.getTime();
      this.service.register(this.registerForm.value).subscribe(
        data => {
          this.toastr.success("You are successfully registed.");
          this.router.navigateByUrl("/auth/login");
        },
        error => {
            this.toastr.error(error, 'Registration failed.');
        }
      );
    }
  }

}
