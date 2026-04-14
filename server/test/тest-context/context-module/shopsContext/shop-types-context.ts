import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "../user-context";
import { ShopTypeViewDto } from "src/modules/shops-platform/shop-type/shop-type-dto/shop-type-view-dto";

export class ShopTypesContextClass {
    public correctShopTypeNames: string[]
    public total_number_of_shop_types_in_tests: number = 0;

    public createdShopTypes: (ShopTypeViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdShopTypes = [];

        this.correctShopTypeNames = [
            `Продукты`,
            `Техника`,
            `Одежда`,
            `Автозапчасти`,
            `Концелярия`,
        ]
    }
    public async addShopTypesStateTest({
        numShopType,
        addShopType
    }: {
        numShopType: number;
        addShopType: ShopTypeViewDto;
    }) {
        console.log('ShopTypesContextClass: addShopTypesStateTest - numShopType, addShopType 😡 ', numShopType, addShopType)
        // 1. Если массив пустой
        if (!this.createdShopTypes.length) {
            this.createdShopTypes = [addShopType];
            this.total_number_of_shop_types_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdShopTypes.length > numShopType) {
            this.createdShopTypes = this.createdShopTypes.map((type, index) =>
                index === numShopType ? addShopType : type
            );
            console.log('ShopTypesContextClass: addShopTypesStateTest - this.total_number_of_shop_types_in_tests 😡 1', this.total_number_of_shop_types_in_tests)
            this.total_number_of_shop_types_in_tests++
            console.log('ShopTypesContextClass: addShopTypesStateTest - this.total_number_of_shop_types_in_tests 😡 2', this.total_number_of_shop_types_in_tests)

            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdShopTypes = [
            ...this.createdShopTypes,
            ...Array(numShopType - this.createdShopTypes.length).fill(null),
            addShopType,
        ];
        this.total_number_of_shop_types_in_tests++
    }
    public async deleteShopTypesStateTest({
        numShopType
    }: {
        numShopType: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdShopTypes.length > numShopType) {
            this.createdShopTypes = this.createdShopTypes.map((user, index) =>
                index === numShopType ? null : user
            );
            this.total_number_of_shop_types_in_tests--
            return;
        }
    }
    public async deleteAllShopTypessStateTest() {
        this.createdShopTypes = []
        this.total_number_of_shop_types_in_tests = 0
    }
}