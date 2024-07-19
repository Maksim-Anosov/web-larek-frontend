import { IAppApi, IOrder, IProduct, IProductsResponse } from "../types";
import { Api } from "./base/api";

export class AppApi extends Api implements IAppApi {
  readonly cdn: string

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
}

  async getProduct(productId: string): Promise<IProduct> {
    const product = await this.get(`/product/${productId}`) as IProduct;
    return product
  }

  async getProducts(): Promise<IProduct[]> {
    const products = await this.get('/product') as IProductsResponse;
    return products.items.map((item) => {
      item.image = this.cdn + item.image;
      return item;
    })
  }

  async createOrder(data: IOrder): Promise<IOrder> {
    const order = await this.post('/order', data) as IOrder;
    return order
  }
}