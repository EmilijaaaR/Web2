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
    ingredient: new FormControl('', [Validators.minLength(1), Validators.maxLength(50)]),
    ingredients: new FormControl('', [ Validators.minLength(1), Validators.maxLength(500)]),
    price: new FormControl('0.0', [Validators.required, Validators.minLength(1), Validators.maxLength(30)])
  });

  ingredients: string[] = [];
  currentIngredient: string = "";

  constructor(private service: MealService, private router: Router, private toastr: ToastrService, private eventService: EventService) { }

  addIngredient(){
    this.ingredients.push(this.currentIngredient);
    //this.addMealForm.value['ingredients'] = "  asdasd";
    //this.addMealForm.value['ingredients'] = "";
    this.currentIngredient = ""
  }
  deleteIngredient(index: number){
    this.ingredients.splice(index, 1);
  }

  ngOnInit(): void {
  }
  onSubmit() {
    if(this.addMealForm.valid){
      // send login request
      this.addMealForm.value['ingredients'] = "";
      this.ingredients.forEach(i => {
        this.addMealForm.value['ingredients'] += i + "\n";
      });
      //return;
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
