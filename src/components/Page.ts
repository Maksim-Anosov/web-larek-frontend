import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
  products: HTMLElement[];
}

export class Page extends Component<IPage> implements IPage {
  protected productsContainer: HTMLElement;
  protected wrapper: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.productsContainer = ensureElement<HTMLElement>('.gallery', this.container);
    this.wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);
    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:changed');
    });
  }

  set products(products: HTMLElement[]) {
    this.productsContainer.replaceChildren(...products);
  }

  set wrapperLocked(value: boolean) {
    value ? this.wrapper.classList.add('page__wrapper_locked') : this.wrapper.classList.remove('page__wrapper_locked');
  }

  set basketCounter(value: number) {
    this.setText(this._basketCounter, value);
  }
}