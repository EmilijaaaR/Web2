import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { refreshSubject } from 'src/app/app.module';
import { EventService } from 'src/app/shared/services/event.service';
import { MealService } from '../service/meal.service';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css']
})
export class AddMealComponent implements OnInit {
  addMealForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    ingredients: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
    price: new FormControl('0.0', [Validators.required, Validators.minLength(1), Validators.maxLength(30)])
  });

  constructor(private service: MealService, private router: Router, private toastr: ToastrService, private eventService: EventService) { }

  ngOnInit(): void {
  }
  onSubmit() {
    if(this.addMealForm.valid){
      // send login request
      this.service.addMeal(this.addMealForm.value).subscribe(
        (data) => {
          console.log(data)
          this.toastr.success("Meal added succesfulyy")
          this.eventService.isMealAdded.next(true);
          this.router.navigateByUrl('/meals');
        },
        error => {
            console.log(error);
            this.toastr.error(error.error, 'Meal adding failed.');
        }
      );
    }
  }

}
