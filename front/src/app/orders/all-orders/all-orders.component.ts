import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  orders: Order[] = []

  constructor(private service: OrderService) { 
    service.getOrders().subscribe(
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
