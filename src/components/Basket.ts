import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IBasket {
	basketProducts: HTMLElement[];
	totalPrice: number;
	allowOrder: boolean;
}

export class Basket extends Component<IBasket> {
	protected _basketProducts: HTMLElement;
	protected buttonCreateOrder: HTMLButtonElement;
	protected _totalPrice: HTMLSpanElement;
	protected _allowOrder: boolean;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.events = events;
		this._basketProducts = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.buttonCreateOrder = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this._totalPrice = ensureElement<HTMLSpanElement>(
			'.basket__price',
			this.container
		);

		this.buttonCreateOrder.addEventListener('click', () => {
			this.events.emit('buttonCreateOrder:clicked');
		});
	}

	set basketProducts (products: HTMLElement[]) {
		this._basketProducts.replaceChildren(...products);
	}

	set totalPrice(price: number) {
		this.setText(this._totalPrice, `${price} синапсов`);
	}

	set allowOrder(value: boolean) {
		this.setDisabled(this.buttonCreateOrder, !value);
	}
}