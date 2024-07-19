import { IBasketData, IProduct } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
  protected products: IProduct[];
  protected totalPrice: number;
  protected totalProducts: number;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.products = [];
    this.totalPrice = 0;
    this.totalProducts = 0;
  }

  addToBasket(product: IProduct): void {
    if (localStorage.length) {
      this.products = JSON.parse(localStorage.getItem('basket'));
      localStorage.setItem('basket', JSON.stringify([...this.products, product]));
    } else {
      localStorage.setItem('basket', JSON.stringify([product]));
    }
    this.events.emit('basketCounter:changed');
  }

  deleteProduct(productId: string): void {
    localStorage.setItem('basket', JSON.stringify(JSON.parse(localStorage.getItem('basket')).filter((item: IProduct) => item.id !== productId)));
    this.events.emit('basket:changed');
    this.events.emit('basketCounter:changed');
  }

  clearBasket(): void {
    this.products = [];
    localStorage.clear();
    this.events.emit('basket:cleared');
  }

  getTotalPrice(): number {
    if (localStorage.length) return JSON.parse(localStorage.getItem('basket')).reduce((total: number, product: IProduct) => total + product.price, 0);
    else return 0;
  }

  getProductsInBasket(): IProduct[] {
    return JSON.parse(localStorage.getItem('basket') || '[]');
  }

  getAmountProducts(): number {
    if (localStorage.length) return JSON.parse(localStorage.getItem('basket')).length;
    else return 0;
  }

  isInBasket(productId: string): boolean {
    return localStorage.getItem('basket')?.includes(productId);
  }

  validateTotalPrice(): boolean {
    const totalPrice = this.getTotalPrice();
		return Boolean(totalPrice);
  }

  getBasketItemIndex(productId: string): number {
    return (this.getProductsInBasket().findIndex((item) => item.id === productId) + 1);
  }
}