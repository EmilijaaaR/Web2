import { isNgTemplate } from '@angular/compiler';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meal } from 'src/app/meals/models/meal.model';
import { MealService } from 'src/app/meals/service/meal.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { BasketItem } from '../model/basket-item.model';
import { BasketService } from '../service/basket.service';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.css']
})
export class BasketItemComponent implements OnInit, OnChanges {

  @Input()
  item = new BasketItem();
  meal = new Meal();
  sum = this.item.quantity *  this.meal.price;

  constructor(private mealService: MealService, private basketService: BasketService, public dialog: MatDialog) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.sum = this.meal.price * this.item.quantity;
  }

  ngOnInit(): void {
    this.mealService.getMeal(this.item.mealId).subscribe(
      data => {
        this.meal = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  delete(){
    //open dialog first
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Warning', description: 'Are you sure that you want to delete item?'}
    },);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        console.log("delete");
        this.basketService.remove(this.item); 
      }
    });
  }

}
