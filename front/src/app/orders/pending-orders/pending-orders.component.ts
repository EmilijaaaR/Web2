import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent implements OnInit {

  orders: Order[] = []

  constructor(private service: OrderService) { 
    service.getPendingOrders().subscribe(
      data => {
        for(let order of data){
          this.orders.push(order);
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
