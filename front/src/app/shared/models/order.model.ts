import { OrderItem } from "./order-item.model";

export class Order{
    id: number = 0;
    customer: number = 0;
    comment: string = "";
    address: string = "";
    time: number = 0;
    estimated_time: number = 0;
    products: OrderItem[] = [];
    price: number = 0;
}