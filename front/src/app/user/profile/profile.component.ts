import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileImageSrc = "./assets/blank-profile-picture.png";

  updateMode = false;

  setUpdateMode(newMode: boolean){
    this.updateMode = newMode;
    if(newMode){
      this.updateForm.enable();
    }else{
      this.updateForm.disable();
      this.loadUser();
    }
  }

  minDate: Date;
  maxDate: Date;
  birthday!: Date;

  isUpdating = false;

  hide = true;

  updateForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(30)]),
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

  user = new User();

  ngOnInit(): void {
    this.updateForm.disable();// = true;
    this.loadUser();
  }

  loadUser(){
    this.service.getUser().subscribe(
      (data:User) => {
        //console.log(data);
        this.user = data
        this.birthday = new Date(data.birthday);
        console.log(this.birthday);
        this.user.birthday = this.birthday.getMilliseconds();
        this.updateForm.patchValue(data);
        this.updateForm.patchValue({
          'birthday': this.birthday
        })
      },
      error => {

      } 
    )
  }

  onSubmit() {
    if(this.updateForm.valid){
      let userUpdate = this.updateForm.value;
      userUpdate.birthday = this.updateForm.value.birthday.getTime();
      console.log(userUpdate.birthday);
      this.service.updateUser(userUpdate).subscribe(
        data => {
          this.setUpdateMode(false);
          this.toastr.success('User successfully updated.', 'Success');
        },
        error => {
            this.toastr.error(error, 'User updating failed.');
        }
      );
    }
  }
}
