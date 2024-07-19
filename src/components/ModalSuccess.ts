import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IModalSuccess {
	price: number;
}

export class ModalSuccess extends Component<IModalSuccess> {
	protected _price: HTMLParagraphElement;
	protected buttonSuccessModal: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._price = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this.buttonSuccessModal = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.buttonSuccessModal.addEventListener('click', () => {
			this.events.emit('modalSuccess:closed');
		});
	}

	set price(price: number) {
		this.setText(this._price, `Списано ${price} синапсов`);
	}
}
