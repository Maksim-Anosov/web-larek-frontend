import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IOrderForm {
  valid: boolean;
  error: string;
  phone: string;
  email: string;
}

export class ModalContactsForm extends Component<IOrderForm> {
  protected submitButton: HTMLButtonElement;
	protected formError: HTMLSpanElement;
  protected phoneInput: HTMLInputElement;
	protected emailInput: HTMLInputElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.submitButton = this.container.querySelector<HTMLButtonElement>('button[type=submit]');
    this.formError = this.container.querySelector<HTMLSpanElement>('.form__errors');
    this.phoneInput = this.container.querySelector<HTMLInputElement>('[name="phone"]');
    this.emailInput = this.container.querySelector<HTMLInputElement>('[name="email"]');
  
    this.phoneInput.addEventListener('input', () => {
      this.events.emit('phone:input', {value: this.phoneInput.value});
    });

    this.emailInput.addEventListener('input', () => {
      this.events.emit('email:input', {value: this.emailInput.value});
    });
    
    this.container.addEventListener('submit', (evt: Event) => {
      evt.preventDefault();
      this.events.emit('contactsform:submit');
    });
  }

  set error(error: string) {
		this.setText(this.formError, error);
	}

  set valid(value: boolean) {
		this.setDisabled(this.submitButton, !value);
	}

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }
}