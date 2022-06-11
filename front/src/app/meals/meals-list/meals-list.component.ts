import { Component, OnInit } from '@angular/core';
import { Meal } from '../models/meal.model';
import { MealService } from '../service/meal.service';
import { refreshSubject, roleGetter } from 'src/app/app.module';
import { RoleGuard } from 'src/app/auth/role.guars';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-meals-list',
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals-list.component.css']
})
export class MealsListComponent implements OnInit {
  isAdmin = roleGetter() == "ADMIN";
  showAddMeal: boolean = false;

  showAddMealComponent(show: boolean){
    this.showAddMeal = show;
  }

  meals!: Meal[];


  constructor(private service: MealService,public eventService: EventService) {
    eventService.isMealAdded.subscribe(
      data => {
        this.loadMeals();
        this.showAddMealComponent(false);
      }
    )
    this.loadMeals()

   }
  loadMeals(){
    this.service.getMeals().subscribe(
      data=>{
        this.meals = data;
        console.log(data);
      },
      error => {
        // handle error
      }
    )
  }

  ngOnInit(): void {
  }

}
