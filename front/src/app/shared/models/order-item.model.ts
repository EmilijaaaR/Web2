import { Meal } from "src/app/meals/models/meal.model";

export class OrderItem{
    id: number = 0;
    quantity: number = 0;
    product: number = 0;
    meal?: Meal;
    price: number = 0;
}