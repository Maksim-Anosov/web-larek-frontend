export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket: boolean;
	basketItemIndex?: number;
}

export interface IProductsData {
	products: IProduct[];
	preview: string | null;
	getProduct(productId: string): IProduct;
	getProducts(): IProduct[] | undefined;
	setProducts(products: IProduct[]): void;
	setPreview(productId: string): void;
	getPreview(): string | null;
	// putInBasket(productId: string): void;
}

export interface IBasketData {
	addToBasket(product: IProduct): void;
	deleteProduct(productId: string): void;
	clearBasket(): void;
	getTotalPrice(): number;
	getProductsInBasket(): IProduct[];
	getAmountProducts(): number;
	isInBasket(productId: string): boolean;
	validateTotalPrice(): boolean;
}

export interface IOrder {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export type TPayment = 'card' | 'cash';

export interface IOrderData {
	setProducts(products: IProduct[]): void;
	setPayment(payment: TPayment): void;
	setEmail(email: string): void;
	setPhone(phone: string): void;
	setAddress(address: string): void;
	setTotalPrice(price: number): void;
	validateOrder(): void;
	validateContacts(): void;
	setValid(valid: boolean): void;
	getValid(): boolean;
	setError(error: string): void;
	getError(): string;
	getOrder(): IOrder;
	clear(): void;
}

export interface IAppApi {
  getProduct(productId: string): Promise<IProduct>;
  getProducts(): Promise<IProduct[]>;
  createOrder(data: IOrder): Promise<IOrder>;
}

export interface IProductsResponse {
	items: IProduct[];
	total: number;
}


// export type TModalFormPayment = Pick<IOrder, 'address' | 'payment'>;
// export type TModalFormContacts = Pick<IOrder, 'email' | 'phone'>;
// export type TModalBasket = Pick<IProduct, 'title' | 'price'>;
