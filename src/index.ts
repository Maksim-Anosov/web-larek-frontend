import { ModalSuccess } from './components/ModalSuccess';
import { BasketData } from './components/BasketData';
import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { ProductCard } from './components/ProductCard';
import { ProductsData } from './components/ProductsData';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/Basket';
import { ModalPaymentForm } from './components/ModalPaymentForm';
import { OrderData } from './components/OrderData';
import { ModalContactsForm } from './components/ModalContactsForm';

const cardCatalogTamplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const page = new Page(document.body, events);
const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const modalSuccess = new ModalSuccess(cloneTemplate(successTemplate), events);
const paymentForm = new ModalPaymentForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ModalContactsForm(
	cloneTemplate(contactsTemplate),
	events
);

api
	.getProducts()
	.then((res) => {
		productsData.setProducts(res);
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

events.on('initialData:loaded', () => {
	const products = productsData.getProducts().map((product) => {
		const card = new ProductCard(cloneTemplate(cardCatalogTamplate), events);
		return card.render(product);
	});
	page.render({ products });
});

events.on('product:selected', (card: ProductCard) =>
	productsData.setPreview(card.id)
);

events.on('preview:changed', (product: IProduct) => {
	const card = new ProductCard(cloneTemplate(cardPreviewTemplate), events);
	modal.render({ content: card.render(product) });
	card.inBasket = basketData.isInBasket(product.id);
});

events.on('modal:opened', () => {
	page.wrapperLocked = true;
});

events.on('modal:closed', () => {
	page.wrapperLocked = false;
});

events.on('addToBasketButton:clicked', (card: ProductCard) => {
	const product = productsData.getProduct(card.id);
	basketData.addToBasket(product);
	card.inBasket = basketData.isInBasket(product.id);
});

page.basketCounter = basketData.getAmountProducts();
events.on('basketCounter:changed', () => {
	page.basketCounter = basketData.getAmountProducts();
	page.render();
});

events.on('basket:changed', () => {
	const basketProducts = basketData.getProductsInBasket().map((product) => {
		const basketProduct = new ProductCard(
			cloneTemplate(cardBasketTemplate),
			events
		);
		return basketProduct.render({
			title: product.title,
			price: product.price,
			id: product.id,
			basketItemIndex: basketData.getBasketItemIndex(product.id),
		});
	});
	modal.render({
		content: basket.render({
			basketProducts: basketProducts,
			totalPrice: basketData.getTotalPrice(),
			allowOrder:
				!basketData
					.getProductsInBasket()
					.some((product) => product.price == null) &&
				basketData.getProductsInBasket().length > 0,
		}),
	});
});

events.on('deleteFromBasketButton:clicked', (card: ProductCard) => {
	basketData.deleteProduct(card.id);
});

events.on('buttonCreateOrder:clicked', () => {
	modal.render({
		content: paymentForm.render({
			valid: false,
			address: '',
			error: '',
		}),
	});
	paymentForm.resetPaymentButton();
	orderData.clear();
});

events.on('card:selected', () => {
	orderData.setPayment('card');
	orderData.validateOrder();
});

events.on('cash:selected', () => {
	orderData.setPayment('cash');
	orderData.validateOrder();
});

events.on('address:input', (data: { value: string }) => {
	orderData.setAddress(data.value);
	orderData.validateOrder();
});

events.on('paymentFormValid:changed', () => {
	paymentForm.valid = orderData.getValid();
	paymentForm.error = orderData.getError();
});

events.on('paymentform:submit', () => {
	modal.render({
		content: contactsForm.render({
			valid: false,
			email: '',
			phone: '',
			error: '',
		}),
	});
	orderData.setEmail(undefined);
	orderData.setPhone(undefined);
});

events.on('email:input', (data: { value: string }) => {
	orderData.setEmail(data.value);
	orderData.validateContacts();
});

events.on('phone:input', (data: { value: string }) => {
	orderData.setPhone(data.value);
	orderData.validateContacts();
});

events.on('contactsFormValid:changed', () => {
	contactsForm.valid = orderData.getValid();
	contactsForm.error = orderData.getError();
});

events.on('contactsform:submit', () => {
	orderData.setTotalPrice(basketData.getTotalPrice());
	orderData.setProducts(basketData.getProductsInBasket());
	const order = orderData.getOrder();
	api
		.createOrder(order)
		.then(() => {
			events.emit('order:created');
		})
		.catch((error) => {
			console.error(error);
		});
});

events.on('order:created', () => {
	modal.render({
		content: modalSuccess.render({
			price: basketData.getTotalPrice(),
		}),
	});
	basketData.clearBasket();
});

events.on('basket:cleared', () => {
	page.basketCounter = basketData.getAmountProducts();
	page.render();
});

events.on('modalSuccess:closed', () => {
	modal.close();
});
