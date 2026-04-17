import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "../user-context";
import { MyShopsViewDto } from "src/modules/shops-platform/shops/shops-dto/shops-view-dto";

export class ShopsContextClass {
    public correctShopNames: string[];
    public correctShopDescriptions: string[];
    public correctWebsiteUrls: string[];
    public total_number_of_shops_in_tests: number = 0;

    public createdShops: (MyShopsViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdShops = [];

        this.correctShopNames = [
            `ATB (${this.users.correctUserNames[0]}) 1`,
            `FENIX (${this.users.correctUserNames[1]})`,
            `АВТОЗАПЧАСТИ (${this.users.correctUserNames[2]}) Гендель`,
            `РЫБАЛКА (${this.users.correctUserNames[3]}), ОХОТА.`,
            `АВТОМАРКЕТ (${this.users.correctUserNames[1]}).`,
        ]
        this.correctShopDescriptions = [
            `Продукты Круглосуточно!`,
            `Запчасти на твой компьютер тут!`,
            `Продукты на каждый день`,
            `Мясные радости`,
            `Алколголь, Табак`,
            `Широкий выбор качественных запчастей от производителя!`
        ]
        this.correctWebsiteUrls = [
            `https://${this.users.correctUserNames[0].toLocaleLowerCase()}.com`,
            `https://${this.users.correctUserNames[1].toLocaleLowerCase()}.com`,
            `https://${this.users.correctUserNames[2].toLocaleLowerCase()}.com`,
            `https://${this.users.correctUserNames[3].toLocaleLowerCase()}.com`,
        ]
    }
    public async addShopStateTest({
        numShop,
        addShop
    }: {
        numShop: number;
        addShop: MyShopsViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 1. Если массив пустой
        if (!this.createdShops.length) {
            this.createdShops = [addShop];
            this.total_number_of_shops_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdShops.length > numShop) {
            this.createdShops = this.createdShops.map((shop, index) =>
                index === numShop ? addShop : shop
            );
            this.total_number_of_shops_in_tests++
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdShops = [
            ...this.createdShops,
            ...Array(numShop - this.createdShops.length).fill(null),
            addShop,
        ];
        this.total_number_of_shops_in_tests++
    }
    public async updateShopStateTest({
        numShop,
        updateShop
    }: {
        numShop: number;
        updateShop: MyShopsViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 2. Если индекс существует -> обновляем
        if (this.createdShops.length > numShop) {
            this.createdShops = this.createdShops.map((shop, index) =>
                index === numShop ? updateShop : shop
            );
            return;
        }
    }
    public async deleteShopStateTest({
        numShop
    }: {
        numShop: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdShops.length > numShop) {
            this.createdShops = this.createdShops.map((shop, index) =>
                index === numShop ? null : shop
            );
            this.total_number_of_shops_in_tests--
            return;
        }
    }
    public async deleteAllShopsStateTest() {
        this.total_number_of_shops_in_tests = 0
        this.createdShops = []
    }
}