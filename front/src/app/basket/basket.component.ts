import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MealService } from '../meals/service/meal.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { NewOrder } from '../shared/models/new-order.model';
import { OrderService } from '../shared/services/order.service';
import { BasketItem } from './model/basket-item.model';
import { BasketService } from './service/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  basketItems = this.basketService.observableList;
  items: BasketItem[] = []
  sum = 0;
  isBasketEmpty = true;

  orderForm = new FormGroup({
    address: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70)]),
    comment: new FormControl('', [Validators.maxLength(200)])
  });
  
  constructor(private basketService: BasketService, 
        private mealService: MealService,
        private orderService: OrderService,
        public dialog: MatDialog,
        private toastr: ToastrService, 
        private router: Router
    ) 
    {
    this.basketItems.subscribe(
      data => {
        this.items = data;
        if(data.length > 0){
          this.isBasketEmpty = false;
        }else{
          this.isBasketEmpty = true;
        }
        this.sum = 0;
        data.forEach(item => {
          mealService.getMeal(item.mealId).subscribe(meal => { 
            this.sum += meal.price * item.quantity;
          });
        })
      }
    )
   }
  
  ngOnInit(): void {
  }

  submitOrder(){
    // first show dialog
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Order', description: 'Are you sure that you want to create order?'}
    },);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        // add order
        let newOrder = new NewOrder();
        newOrder.address = this.orderForm.value['address'];
        newOrder.comment = this.orderForm.value['comment'];
        newOrder.items = this.items;
        console.log(newOrder);
        this.orderService.addOrder(newOrder).subscribe(data => {
          this.toastr.success("Order successfully created!");
          console.log(data);
          this.basketService.clear();
          // navigate to current order page
          this.router.navigateByUrl('/current-orders');
        },
        error => {
          console.log(error);
          this.toastr.error("You probably already have a order.","Unable to submit order.");
        }
        );
      }
    });
  }

}
