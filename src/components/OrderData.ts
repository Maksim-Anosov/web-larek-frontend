import { IOrder, IOrderData, IProduct, TPayment } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
	protected order: IOrder = {
		payment: undefined,
		email: undefined,
		phone: undefined,
		address: undefined,
		total: 0,
		items: [],
	};
	protected events: IEvents;
	protected error: string;
	protected valid: boolean;

	constructor(events: IEvents) {
		this.events = events;
	}

	setPayment(payment: TPayment): void {
		this.order.payment = payment;
	}

	setEmail(email: string): void {
		this.order.email = email;
	}

	setPhone(phone: string): void {
		this.order.phone = phone;
	}

	setAddress(address: string): void {
		this.order.address = address;
	}

	setTotalPrice(price: number): void {
		this.order.total = price;
	}

	setError(error: string): void {
		this.error = error;
	}

	setValid(valid: boolean): void {
		this.valid = valid;
	}

	getValid(): boolean {
		return this.valid;
	}

	getOrder(): IOrder {
		return this.order;
	}

	clear(): void {
		this.order = {
			payment: undefined,
			email: undefined,
			phone: undefined,
			address: undefined,
			total: 0,
			items: [],
		};
	}

	setProducts(products: IProduct[]): void {
		this.order.items = products.map((product) => product.id);
	}

	validateOrder(): void {
		this.setValid(!this.order.payment || !this.order.address ? false : true);
		this.setError(!this.getValid() ? 'Необходимо указать адрес и выбрать способ оплаты' : '');
		this.events.emit('paymentFormValid:changed');
	}

	validateContacts(): void {
		this.setValid(!this.order.email.includes('@') || !this.order.phone ? false : true);
		this.setError(!this.getValid() ? 'Проверьте корректность почтового адреса и телефона' : '');
		this.events.emit('contactsFormValid:changed');
	}

	getError(): string {
		return this.error;
	}
}
