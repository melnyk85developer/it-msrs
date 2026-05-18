import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "../user-context";
import { ShopTypeViewDto } from "src/modules/shops-platform/shop-type/shop-type-dto/shop-type-view-dto";
import { ShopBrandViewDto } from "src/modules/shops-platform/shop-brand/shop-brand-dto/shop-brand-view-dto";

export class ShopBrandsContextClass {
    public correctShopBrandNames: string[]
    public correctShopBrandsNames: string[]
    public total_number_of_shop_brands_in_tests: number = 0;

    public createdShopBrands: (ShopBrandViewDto | null)[] = [];

    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdShopBrands = [];

        this.correctShopBrandNames = [
            `Продукты`,
            `Техника`,
            `Одежда`,
            `Автозапчасти`,
            `Концелярия`,
        ]
        this.correctShopBrandsNames = [
            `Apple`,
            `Samsung`,
            `Lenowo`,
            `ASUS`,
            `LG`,
        ]
    }
    public async addShopBrandsStateTest({
        numShopBrand,
        addShopBrand
    }: {
        numShopBrand: number;
        addShopBrand: ShopBrandViewDto;
    }) {
        // console.log('ShopTypesContextClass: addShopTypesStateTest - numShopType, addShopType 😡 ', numShopType, addShopType)
        // 1. Если массив пустой
        if (!this.createdShopBrands.length) {
            this.createdShopBrands = [addShopBrand];
            this.total_number_of_shop_brands_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdShopBrands.length > numShopBrand) {
            this.createdShopBrands = this.createdShopBrands.map((brand, index) =>
                index === numShopBrand ? addShopBrand : brand
            );
            // console.log('ShopTypesContextClass: addShopTypesStateTest - this.total_number_of_shop_types_in_tests 😡 1', this.total_number_of_shop_types_in_tests)
            this.total_number_of_shop_brands_in_tests++
            // console.log('ShopTypesContextClass: addShopTypesStateTest - this.total_number_of_shop_types_in_tests 😡 2', this.total_number_of_shop_types_in_tests)

            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdShopBrands = [
            ...this.createdShopBrands,
            ...Array(numShopBrand - this.createdShopBrands.length).fill(null),
            addShopBrand,
        ];
        this.total_number_of_shop_brands_in_tests++
    }
    public async updateShopBrandsStateTest({
        numShopBrand,
        updateShopBrand
    }: {
        numShopBrand: number;
        updateShopBrand: ShopBrandViewDto;
    }) {
        // console.log('ShopTypesContextClass: addShopTypesStateTest - numShopType, addShopType 😡 ', numShopType, addShopType)
        // 2. Если индекс существует -> обновляем
        if (this.createdShopBrands.length > numShopBrand) {
            this.createdShopBrands = this.createdShopBrands.map((brand, index) =>
                index === numShopBrand ? updateShopBrand : brand
            );
            return;
        }
    }
    public async deleteShopBrandsStateTest({
        numShopBrand
    }: {
        numShopBrand: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdShopBrands.length > numShopBrand) {
            this.createdShopBrands = this.createdShopBrands.map((brand, index) =>
                index === numShopBrand ? null : brand
            );
            this.total_number_of_shop_brands_in_tests--
            return;
        }
    }
    public async deleteAllShopTypessStateTest() {
        this.createdShopBrands = []
        this.total_number_of_shop_brands_in_tests = 0
    }
}