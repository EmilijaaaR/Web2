import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-previous-orders',
  templateUrl: './previous-orders.component.html',
  styleUrls: ['./previous-orders.component.css']
})
export class PreviousOrdersComponent implements OnInit {

  orders: Order[] = []

  constructor(private service: OrderService) { 
    service.getOrders().subscribe(
      data => {
        for(let order of data){
          if(order.estimated_time != null){
            if(Date.now() > (order.estimated_time)){
              this.orders.push(order);
            }
          }
        }
        console.log(data);
      },
      error => {

      }
    )

  }

  ngOnInit(): void {
  }

}
