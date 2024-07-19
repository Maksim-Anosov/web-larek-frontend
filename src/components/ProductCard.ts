import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class ProductCard extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLSpanElement;
	protected _description?: HTMLParagraphElement;
	protected _addToBasketButton: HTMLButtonElement;
	protected _deleteFromBasketButton: HTMLButtonElement;
	protected _category: HTMLSpanElement;
	protected _inBasket: boolean;
	protected _basketItemIndex: HTMLSpanElement;
	protected events: IEvents;
	protected productId: string;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this.events = events;
		this._title = this.container.querySelector('.card__title');
		this._description = this.container.querySelector('.card__text');
		this._image = this.container.querySelector('.card__image');
		this._price = this.container.querySelector('.card__price');
		this._category = this.container.querySelector('.card__category');
		this._addToBasketButton = this.container.querySelector('.card__button');
		this._basketItemIndex = this.container.querySelector('.basket__item-index');
		this._deleteFromBasketButton = this.container.querySelector('.basket__item-delete');

		if (this.container.classList.contains('gallery__item')) {
			this.container.addEventListener('click', () => {
				this.events.emit('product:selected', this);
			});
		}

		if (this._addToBasketButton) {
			this._addToBasketButton.addEventListener('click', () => {
				this.events.emit('addToBasketButton:clicked', this);
			});
		}

		if (this._deleteFromBasketButton) {
			this._deleteFromBasketButton.addEventListener('click', () => {
				this.events.emit('deleteFromBasketButton:clicked', this);
			});
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(description: string) {
		this.setText(this._description, description);
	}

	set image(image: string) {
		this.setImage(this._image, image);
	}

	set category(value: string) {
		this.setText(this._category, value);

		switch (value) {
			case 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			case 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case 'кнопка':
				this._category.classList.add('card__category_button');
				break;
			case 'другое':
				this._category.classList.add('card__category_other');
				break;
		}
	}

	set price(value: number | null) {
		this.setText(this._price, `${value} синапсов`);
		if (!value) this.setText(this._price, 'Бесценно');
	}

	set id(id: string) {
		this.productId = id;
	}
	get id() {
		return this.productId;
	}

	set inBasket(value: boolean) {
		this._inBasket = value;
		if (this._inBasket) {
			this.setDisabled(this._addToBasketButton, true);
			this.setText(this._addToBasketButton, 'Уже в корзине');
		} else {
			this.setText(this._addToBasketButton, 'В корзину');
			this.setDisabled(this._addToBasketButton, false);
		}
	}

	set basketItemIndex(value: number) {
		this.setText(this._basketItemIndex, value);
	}
}