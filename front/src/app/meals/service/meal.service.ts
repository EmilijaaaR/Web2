import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Meal } from '../models/meal.model';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  constructor( private http: HttpClient) { }

  addMeal(meal:Meal) :Observable<Object> {
    return this.http.post<Object>(environment.serverUrl + '/products', meal);
  }

  getMeals(): Observable<Meal[]>{
    return this.http.get<Meal[]>(environment.serverUrl+ '/products');
  }

  getMeal(id: number): Observable<Meal>{
    return this.http.get<Meal>(environment.serverUrl+ '/products/' + id);
  }

  updateMeal(meal: Meal): Observable<Meal> {
    return this.http.put<Meal>(environment.serverUrl + '/products', meal);
  }
}
