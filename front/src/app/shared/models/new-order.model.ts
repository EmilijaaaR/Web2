import { BasketItem } from "src/app/basket/model/basket-item.model";

export class NewOrder{
    items: BasketItem[] = [];
    address: string = "";
    comment: string = "";
}