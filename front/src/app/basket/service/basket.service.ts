import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Meal } from 'src/app/meals/models/meal.model';
import { BasketItem } from '../model/basket-item.model';
import { Basket } from '../model/basket.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private getBasket(): Basket {
    let basketStr = localStorage.getItem('basket');
    let basket!: Basket;
    if(basketStr === null){
      basket = new Basket();
      localStorage.setItem('basket', JSON.stringify(basket));
    }else{
      basket = JSON.parse(basketStr);
    }
    return basket;
  }

  private BASKET_TAG: string = "basket";

  private _list: BasketItem[] = this.getBasket().items;
  private _observableList: BehaviorSubject<BasketItem[]> = new BehaviorSubject<BasketItem[]>(this.getBasket().items);

  get observableList(): Observable<BasketItem[]> { return this._observableList.asObservable() }

  add(meal: Meal, quantity: number) {
    let alreadyExists = false;
    // check if basket already contains same meal id
    this._list.forEach(item => {
      if(item.mealId === meal.id){
        item.quantity += quantity
        alreadyExists = true;
      }
    });
    if(!alreadyExists){
      let item = new BasketItem();
      item.quantity = quantity;
      item.mealId = meal.id;
      this._list.push(item);
    }

    this._observableList.next(this._list);
    this.save()
  }

  remove(basketItem: BasketItem){
    let item = this._list.filter(item => item.mealId == basketItem.mealId)[0];
    let index = this._list.indexOf(item);
    //console.log(basketItem);
    if(index >= 0){
      this._list.splice(index, 1);
      this._observableList.next(this._list);
      //console.log(this._list);
      this.save()
    }
  }

  clear(){
    localStorage.removeItem(this.BASKET_TAG);
  }

  private save() {
    localStorage.removeItem(this.BASKET_TAG);
    let basket = new Basket();
    basket.items = this._list;
    localStorage.setItem(this.BASKET_TAG, JSON.stringify(basket));
  }

}
