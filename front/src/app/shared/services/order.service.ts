import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewOrder } from '../models/new-order.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor( private http: HttpClient) { }

  addOrder(order:NewOrder) :Observable<Order> {
    return this.http.post<Order>(environment.serverUrl + '/orders', order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(environment.serverUrl + "/orders");
  }

  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(environment.serverUrl + "/orders/pending-orders");
  }

  takeDelivery(orderId: number): Observable<Object>{
    return this.http.put<Object>(environment.serverUrl + '/orders/deliver/' + orderId, "");
  }
}
