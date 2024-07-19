import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IOrderForm {
  valid: boolean;
  error: string;
  address: string;
}

export class ModalPaymentForm extends Component<IOrderForm> {
  protected cardPaymentButton: HTMLButtonElement;
  protected cashPaymentButton: HTMLButtonElement;
	protected submitButton: HTMLButtonElement;
  protected formError: HTMLSpanElement;
  protected addressInput: HTMLInputElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.cardPaymentButton = this.container.querySelector<HTMLButtonElement>('[name="card"]');
    this.cashPaymentButton = this.container.querySelector<HTMLButtonElement>('[name="cash"]');
    this.submitButton = this.container.querySelector<HTMLButtonElement>('button[type=submit]');
    this.formError = this.container.querySelector<HTMLSpanElement>('.form__errors');
    this.addressInput = this.container.querySelector<HTMLInputElement>('[name="address"]');

    this.addressInput.addEventListener('input', () => {
      this.events.emit('address:input', {value: this.addressInput.value});
    });

    this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit('paymentform:submit');
		});

    this.cardPaymentButton.addEventListener('click', () => {
      this.toggleClass(this.cardPaymentButton, 'button_alt-active');
      this.toggleClass(this.cashPaymentButton, 'button_alt-active', false);
      this.events.emit('card:selected');
    });

    this.cashPaymentButton.addEventListener('click', () => {
      this.toggleClass(this.cashPaymentButton, 'button_alt-active');
      this.toggleClass(this.cardPaymentButton, 'button_alt-active', false);
      this.events.emit('cash:selected');
    });
  }

  set error(error: string) {
		this.setText(this.formError, error);
	}

  set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

  set address(value: string) {
    this.addressInput.value = value;
  }

  resetPaymentButton(): void {
		this.cardPaymentButton.classList.remove('button_alt-active');
		this.cashPaymentButton.classList.remove('button_alt-active');
	}
}