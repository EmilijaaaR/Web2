import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { roleGetter } from 'src/app/app.module';
import { BasketService } from 'src/app/basket/service/basket.service';
import { Meal } from '../models/meal.model';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {

  @Input() 
  meal?: Meal
  role = roleGetter();
  ingredients: String[] = [];

  constructor(private basketService: BasketService, private toastr: ToastrService) { 
  }

  ngOnInit(): void {
    this.meal?.ingredients.split('\n').forEach( i => {
      this.ingredients.push(i);
    })
  }

  addMealToBasker(meal: Meal){
    this.toastr.success('Item ' + meal.name + ' successfully added to basket.')
    this.basketService.add(meal, 1);
  }

}
