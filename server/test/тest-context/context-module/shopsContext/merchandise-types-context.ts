import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "../user-context";
import { MerchandiseTypeViewDto } from "src/modules/shops-platform/merchandise-type/merchandise-type-dto/merchandise-type.view-dto";

export class MerchandiseTypesContextClass {
    public correctMerchandiseTypesNames: string[]
    public total_number_of_merchandise_types_in_tests: number = 0;

    public createdMerchandiseTypes: (MerchandiseTypeViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdMerchandiseTypes = [];

        this.correctMerchandiseTypesNames = [
            `Мясные изделия`,
            `Хлебобулочные изделия`,
            `Кондитерские изделия`,
            `Молочные изделия`,
            `Крупы`,
            `Колбасы`,
            `Рыба`,
        ]
    }
    public async addMerchandiseStateTest({
        numMerchandiseType,
        addMerchandiseType
    }: {
        numMerchandiseType: number;
        addMerchandiseType: MerchandiseTypeViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 1. Если массив пустой
        if (!this.createdMerchandiseTypes.length) {
            this.createdMerchandiseTypes = [addMerchandiseType];
            this.total_number_of_merchandise_types_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdMerchandiseTypes.length > numMerchandiseType) {
            this.createdMerchandiseTypes = this.createdMerchandiseTypes.map((shop, index) =>
                index === numMerchandiseType ? addMerchandiseType : shop
            );
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdMerchandiseTypes = [
            ...this.createdMerchandiseTypes,
            ...Array(numMerchandiseType - this.createdMerchandiseTypes.length).fill(null),
            addMerchandiseType,
        ];
    }
    public async deleteMerchandiseTest({
        numMerchandiseType
    }: {
        numMerchandiseType: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdMerchandiseTypes.length > numMerchandiseType) {
            this.createdMerchandiseTypes = this.createdMerchandiseTypes.map((user, index) =>
                index === numMerchandiseType ? null : user
            );
            this.total_number_of_merchandise_types_in_tests--
            return;
        }
    }
    public async deleteAllMerchandiseStateTest() {
        this.createdMerchandiseTypes = []
        this.total_number_of_merchandise_types_in_tests = 0
    }
}