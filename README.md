# web-larek-frontend

[web-larek-frontend]https://github.com/Maksim-Anosov/web-larek-frontend.git

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс Component

Абстрактный базовый класс для всех элементов слоя представления. Имеет метод render, который генерирует или обновляет необходимый компонент разметки, методы для присвоения текстового содержимого, изображения элементу, смены состояния элемента.

### Слой данных

#### Класс ProductsData
Класс отвечает за хранение и работу с данными карточки товара.
- products: IProduct[]; - массив объектов товаров
- preview: string | null; - id товара, выбранного для просмотра в модальном окне
- getProduct(productId: string): IProduct; - получение карточки товара по ее id
- getProducts(): IProduct[] | undefined; - получение массива товаров
- setProducts(products: IProduct[]): void; - установка массива товаров
- setPreview(productId: string): void; - сохранение id товара в preview
- getPreview(): string | null; - получение id товара из preview

#### Класс BasketData 
Класс отвечает за хранение данных в корзине и логику работы с этими данными.
- products: IProduct[]; - массив объектов товаров
- addToBasket(product: IProduct): void; - добавление товара в корзину
- deleteProduct(productId: string): void; - удаление товара из корзины
- clearBasket(): void; - очистка корзины
- getTotalPrice(): number; - стоимость всех товаров в корзине
- getProductsInBasket(): IProduct[]; - получение массива товаров, находящихся в корзине
- getAmountProducts(): number; - получение количества товаров в корзине
- isInBasket(productId: string): boolean; - проверка наличия товара в корзине
- validateTotalPrice(): boolean; - провервка валидации корзины (если в корзине находится только "бесценный" товар, то оформление заказа невозможно)

#### Класс OrderData
Класс отвечает за хранение и работу с данными необходимы для отправки заказа на сервер.
- order: IOrder; - хранит объект данных, необходимых для заказа
- setProducts(products: IProduct[]): void; - добавляет товары в заказ
- setPayment(payment: TPayment): void; - устанавливает способ оплаты
- setEmail(email: string): void; - утсанавливает электронную почту покупателя
- setPhone(phone: string): void; - устанавливает телефон покупателя
- setAddress(address: string): void; - устанавливает адрес покупателя
- setTotalPrice(price: number): void; - устанавливает общую стоимость товаров
- validateOrder(): void; - валидирует форму способа оплаты и адрес
- validateContacts(): void - валидирует форму почты и телефона
- setValid(valid: boolean): void; - сохраняет в поле класса результат условия
- getValid(): boolean; - возвращает поле с результатом условия
- setError(error: string): void; - установить текст ошибки
- getError(): string; - получить текст ошибки
- getOrder(): IOrder; - получить заказ
- clear(): void; - очистить заказ

### Слой отображения

#### Класс Page
Класс  отвечает за отображение главной страницы сервиса. В конструктор класса передается DOM элемент контейнера главной страницы.  
В полях класса находятся все элементы главной страницы. Также класс имеет все методы унаследованные от общего класса component.

Поля класса:
- protected productsContainer: HTMLElement;
- protected wrapper: HTMLElement;
- protected _basketCounter: HTMLElement;
- protected basketButton: HTMLButtonElement;
- protected events: IEvents;

Аксессоры:
- set products(products: HTMLElement[]) - размещает разметку в контейнер
- set wrapperLocked(value: boolean) - блокирует прокрутку
- set basketCounter(value: number) - устанавливает счетчик корзины

#### Класс Basket
Класс предназначен для отображения контента модального окна с корзиной. В конструктор принимает DOM элемент темплейта модального окна и экземпляр класса `EventEmitter`. В конструкторе класса определяются DOM элементы, необходимые для отрисовки корзины, устанавливаются слушатель на кнопку оформления заказа, но только после проверки общей стоимости товаров. Если стоимость товаров равна нулю или имеет "Бесценный" товар, кнопка оформления заказа неактивна.
Класс также имеет методы, наследованные от класса Component.

Поля класса:
- protected _basketProducts: HTMLElement;
- protected buttonCreateOrder: HTMLButtonElement;
- protected _totalPrice: HTMLSpanElement;
- protected _allowOrder: boolean;
- protected events: IEvents;

Аксессоры:
- set basketProducts (products: HTMLElement[]) - устанавливает разметку в контейнер
- set totalPrice(price: number) - устанавливает общую стоимость товаров
- set allowOrder(value: boolean) - переключает кнопку оформления заказа

#### Класс ModalPaymentForm
Класс предназначен для отображения контента модального окна с формой (тип оплаты, адрес). В конструктор принимает DOM элемент темплейта модального окна и экземпляр класса `EventEmitter`.  
В конструкторе класса определяются DOM элементы, необходимые для отрисовки модального окна, также класс имеет метод зачистки выбора кнопки оплаты после закрытия модального окна с оформлением заказа.
Класс также имеет методы, наследованный от класса Component.

Поля класса:
- protected cardPaymentButton: HTMLButtonElement;
- protected cashPaymentButton: HTMLButtonElement;
- protected submitButton: HTMLButtonElement;
- protected formError: HTMLSpanElement;
- protected addressInput: HTMLInputElement;
- protected events: IEvents;

Аксессоры:
- set error(error: string) - устанавливает текст ошибки
- set valid(value: boolean) - переключает кнопку 
- set address(value: string) - устанавливает адресс в поле инпута

Методы:
- resetPaymentButton(): void - уберает стили с кнопок оплаты

#### Класс ModalPaymentForm
Класс предназначен для отображения контента модального окна с формой (тип оплаты, адрес). В конструктор принимает DOM элемент темплейта модального окна и экземпляр класса `EventEmitter`.  
В конструкторе класса определяются DOM элементы, необходимые для отрисовки модального окна.
Класс также имеет методы, наследованный от класса Component.

Поля класса:
- protected submitButton: HTMLButtonElement;
- protected formError: HTMLSpanElement;
- protected phoneInput: HTMLInputElement;
- protected emailInput: HTMLInputElement;
- protected events: IEvents;

Аксессоры:
- set error(error: string) - устанавливает текст ошибки
- set valid(value: boolean) - переключает кнопку
- set phone(value: string) - устанавливает телефон в поле инпута
- set email(value: string) - устанавливает почту в поле инпута

#### Класс ModalSuccess
Класс предназначен для отображения модального окна с надписью успешного оформления заказа и стоимостью заказа. В конструктор принимает DOM элемент темплейта модального окна и экземпляр класса `EventEmitter`.  
В конструкторе класса определяется DOM элемент, необходимый для отображения итоговой стоимости заказа.  
Класс также имеет методы, наследованный от класса Component.

Поля класса:
- _price: HTMLParagraphElement;
- events: IEvents;
- buttonCloseSuccessModal: HTMLButtonElement;

Аксессоры:
- set price(price: number) - устанавливает общую списанную стоимость 

### Слой коммуникации

#### Класс AppApi
Наследует класс Api и предоставляет методы, которые реализуют взаимодействие с сервером.

```
export interface IAppApi {
  getProduct(productId: string): Promise<IProduct>;
  getProducts(): Promise<IProduct[]>;
  createOrder(data: IOrder): Promise<IOrder>;
}

```

## Взаимодействие компонентов

*Список всех событий, которые могут генерироваться в системе:*  

- `initialData: loaded` - получаем данные с сервера при загрузке главной страницы, отрисовываем их с помощью класса отображения Page
- `product: selected` - при клике на карточку передает в модель данных объект карточки, на которую кликнули
- `preview: changed` - передает данные товара из модели в отображение для отрисовки превью переданной карточки
- `addToBasketButton:clicked` - при клике на кнопку "в корзину" передаем данные о том, что пользователь хочет изменить состав корзины
- `basketCounter:changed` - при изменении кол-ва товаров в корзине, передаем информацию отображению и меняем счетчик товаров на главной странице
- `deleteFromBasketButton:clicked` - при клике на кнопку удаления товара в корзине передаем информацию в модель о том, что товар удалили из корзины
- `basket:change` - при изменении кол-ва товаров в корзине перерисовываем отображение корзины
- `buttonCreateOrder:clicked` - при клике на кнопку "оформить заказ" отрисовываем отображение формы с вводом адреса и выбором способа оплаты
- `card:selected` и `cash:selected` - при выборе способа оплаты передаем в модель данные о способе оплаты и валидируем форму
- `paymentFormValid:changed`, `contactsFormValid:changed` - проверяем валидацию формы при ее заполнении пользователем и меняем отображение кнопки "далее"/"оплатить" в зависимости от состояния валидации формы
- `paymentform:submit` - при клике на кнопку оформить отображаем следующую модалку с формами ввода телефона и почты
- `contactsform:submit` - собираем данные по заказу и отправляем их на сервер
- `address:input`, `email:input`, `phone:input` - при вводе данных в инпуты передаем данные в модель и валидируем форму
- `order:created` - при успешной отправке данных на сервер, отрисовываем модалку с успешным оформлением заказа
- `basket:cleared` - очищаем данные из корзины
- `modalSuccess:closed` - закрываем модальное окно успешного заказа