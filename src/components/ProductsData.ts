import { IProductsData, IProduct } from "../types";
import { IEvents } from "./base/events";

export class ProductsData implements IProductsData {
  products: IProduct[];
  preview: string;
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.preview = null;
  }

  getProduct(productId: string): IProduct {
    return this.products.find(product => product.id === productId);
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] | undefined {
    return this.products;
  }

  setPreview(productId: string): void {
    this.preview = productId;
    this.events.emit('preview:changed', this.getProduct(productId));
  }

  getPreview(): string | null {
    return this.preview;
  }
}