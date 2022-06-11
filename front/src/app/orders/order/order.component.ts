import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { roleGetter } from 'src/app/app.module';
import { MealService } from 'src/app/meals/service/meal.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { OrderItem } from 'src/app/shared/models/order-item.model';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  order?: Order;
  status: string = ""
  total: number = 0;
  date?: Date;
  timeLeft = -1;
  interval = interval(1000);
  subscription?: Subscription;
  estimated_time?: number;
  role = roleGetter();
  timeDelivered?: Date

  @Input('order') set ord (order: Order){
    this.order = order

    console.log(order.estimated_time);

    if(order.estimated_time > 0){
      this.estimated_time = order.estimated_time;
    }

    this.refresh();

    if(this.estimated_time != null){
      //let estimated_time = this.order!.estimated_time / (1000*1000);
      //this.estimated_time = Date.now() + (10 * 1000);
      if(this.estimated_time! > Date.now()){
        this.subscription = this.interval.subscribe(val => {
          this.timeLeft = Math.round((this.estimated_time! - Date.now()) / 1000);
          this.refresh();
        });
      }
    }
    this.date = new Date(this.order!.time);
  

    for(let orderItem of this.order?.products??[]){
      this.mealService.getMeal(orderItem.product).subscribe(
        data => {
          orderItem.meal = data
          this.total += orderItem.price * orderItem.quantity;
          //console.log(data);
        },
        error => {

        }
      )
    }
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  refresh(){
    if(this.estimated_time == null){
      this.status = "Pending"
    }else{
      //let estimated_time = this.estimated_time! / (1000*1000);
      if(Date.now() > this.estimated_time!){
        this.status = "Delivered"
        this.timeDelivered = new Date(this.estimated_time);
        this.subscription?.unsubscribe();
      }else{
        this.status = "Delivering"
      }
    }
  }

  takeDelivery(){
    // first show dialog
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: 'Order', description: 'Are you sure that you want to deliver order no.' + this.order!.id +'?'}
    },);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.orderService.takeDelivery(this.order!.id).subscribe(data => {
          this.toastr.success("Order successfully taken for delivery!");
          // navigate to current order page
          this.router.navigateByUrl('/current-orders');
        },
        error => {
          this.toastr.error("Unable to submit order.")
        }
        );
      }
    });
    this.orderService.takeDelivery
  }

  getMinutes(time: number){
    return Math.floor(time/60);
  }

  getSeconds(time: number){
    return Math.floor(time%60);
  }

  constructor(
    private mealService: MealService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
    ) {

   }

  ngOnInit(): void {
  }

}
