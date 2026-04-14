import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "../user-context";
import { BasketMerchandiseViewDto } from "src/modules/shops-platform/basketMerchandise/basketMerchandise-dto/basket-merchandise.view-dto";

export class BasketMerchandiseContextClass {
    public total_number_of_basket_merchandises_in_tests: number = 0;

    public createdBasketMerchandises: (BasketMerchandiseViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdBasketMerchandises = [];
    }
    public async addBasketMerchandiseStateTest({
        numBasketMerchandise,
        addBasketMerchandise
    }: {
        numBasketMerchandise: number;
        addBasketMerchandise: BasketMerchandiseViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 1. Если массив пустой
        if (!this.createdBasketMerchandises.length) {
            this.createdBasketMerchandises = [addBasketMerchandise];
            this.total_number_of_basket_merchandises_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdBasketMerchandises.length > numBasketMerchandise) {
            this.createdBasketMerchandises = this.createdBasketMerchandises.map((product, index) =>
                index === numBasketMerchandise ? addBasketMerchandise : product
            );
            this.total_number_of_basket_merchandises_in_tests++
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdBasketMerchandises = [
            ...this.createdBasketMerchandises,
            ...Array(numBasketMerchandise - this.createdBasketMerchandises.length).fill(null),
            addBasketMerchandise,
        ];
        this.total_number_of_basket_merchandises_in_tests++
    }
    public async deleteBasketMerchandiseStateTest({
        numBasketMerchandise
    }: {
        numBasketMerchandise: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdBasketMerchandises.length > numBasketMerchandise) {
            this.createdBasketMerchandises = this.createdBasketMerchandises.map((user, index) =>
                index === numBasketMerchandise ? null : user
            );
            this.total_number_of_basket_merchandises_in_tests--
            return;
        }
    }
    public async deleteAllBasketMerchandisesStateTest() {
        this.total_number_of_basket_merchandises_in_tests = 0
        this.createdBasketMerchandises = []
    }
}