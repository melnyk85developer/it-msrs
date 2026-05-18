import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "../user-context";
import { BasketViewDto } from "src/modules/shops-platform/basket/basket-dto/basket.view-dto";

export class BasketContextClass {
    public total_number_of_baskets_in_tests: number = 0;

    public createdBaskets: (BasketViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdBaskets = [];
    }
    public async addBasketStateTest({
        numBasket,
        addBasket
    }: {
        numBasket: number;
        addBasket: BasketViewDto;
    }) {
        // console.log('BasketContextClass: addBasketStateTest - numBasket, addBasket 😡 ', numBasket, addBasket)
        // 1. Если массив пустой
        if (!this.createdBaskets.length) {
            this.createdBaskets = [addBasket];
            this.total_number_of_baskets_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdBaskets.length > numBasket) {
            this.createdBaskets = this.createdBaskets.map((shop, index) =>
                index === numBasket ? addBasket : shop
            );
            this.total_number_of_baskets_in_tests++
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdBaskets = [
            ...this.createdBaskets,
            ...Array(numBasket - this.createdBaskets.length).fill(null),
            addBasket,
        ];
        this.total_number_of_baskets_in_tests++
    }
    public async deleteBasketStateTest({
        numBasket
    }: {
        numBasket: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdBaskets.length > numBasket) {
            this.createdBaskets = this.createdBaskets.map((basket, index) =>
                index === numBasket ? null : basket
            );
            this.total_number_of_baskets_in_tests--
            return;
        }
    }
    public async deleteAllShopsStateTest() {
        this.total_number_of_baskets_in_tests--
        this.createdBaskets = []
    }
}