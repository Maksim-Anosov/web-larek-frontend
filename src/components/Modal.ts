import { IEvents } from "./base/events";
import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modal: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected events: IEvents;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.modal = ensureElement<HTMLElement>(".modal__content", this.container);
    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);

    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", () => this.close());
    this.modal.addEventListener('click', (evt) => evt.stopPropagation());
  }

  set content(value: HTMLElement) {
    this.modal.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
    this.events.emit("modal:opened");
    document.addEventListener('keydown', (evt) => this.handleEscape(evt));
  }

  close() {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:closed");
    this.content = null;
    document.removeEventListener('keydown', (evt) => this.handleEscape(evt));
  }

  handleEscape(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  render(data: IModal) {
    super.render(data);
    this.open();
    return this.container;
  }
}