import { UserContextClass } from "../user-context";
import { MerchandiseBrandViewDto } from "src/modules/shops-platform/merchandise-brand/merchandise-brand-dto/merchandise-brand.view-dto";

export class MerchandiseBrandContextClass {
    public correctMerchandiseBrandNames: string[];
    public total_number_of_merchandise_brands_in_tests: number = 0;

    public createdMerchandiseBrands: (MerchandiseBrandViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdMerchandiseBrands = [];

        this.correctMerchandiseBrandNames = [
            `APPLE`,
            `ASUS`,
            `SAMSUNG`,
            `DELL`,
            `NVIDIA`,
        ]
    }
    public async addMerchandiseBrandStateTest({
        numMerchandiseBrand,
        addMerchandiseBrand
    }: {
        numMerchandiseBrand: number;
        addMerchandiseBrand: MerchandiseBrandViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 1. Если массив пустой
        if (!this.createdMerchandiseBrands.length) {
            this.createdMerchandiseBrands = [addMerchandiseBrand];
            this.total_number_of_merchandise_brands_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdMerchandiseBrands.length > numMerchandiseBrand) {
            this.createdMerchandiseBrands = this.createdMerchandiseBrands.map((shop, index) =>
                index === numMerchandiseBrand ? addMerchandiseBrand : shop
            );
            this.total_number_of_merchandise_brands_in_tests++
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdMerchandiseBrands = [
            ...this.createdMerchandiseBrands,
            ...Array(numMerchandiseBrand - this.createdMerchandiseBrands.length).fill(null),
            addMerchandiseBrand,
        ];
        this.total_number_of_merchandise_brands_in_tests++
    }
    public async updateMerchandiseBrandStateTest({
        numMerchandiseBrand,
        updateMerchandiseBrand
    }: {
        numMerchandiseBrand: number;
        updateMerchandiseBrand: MerchandiseBrandViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 2. Если индекс существует -> обновляем
        if (this.createdMerchandiseBrands.length > numMerchandiseBrand) {
            this.createdMerchandiseBrands = this.createdMerchandiseBrands.map((mb, index) =>
                index === numMerchandiseBrand ? updateMerchandiseBrand : mb
            );
            return;
        }
    }
    public async deleteMerchandiseBrandStateTest({
        numMerchandiseBrand
    }: {
        numMerchandiseBrand: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdMerchandiseBrands.length > numMerchandiseBrand) {
            this.createdMerchandiseBrands = this.createdMerchandiseBrands.map((user, index) =>
                index === numMerchandiseBrand ? null : user
            );
            this.total_number_of_merchandise_brands_in_tests--
            return;
        }
    }
    public async deleteAllMerchandiseBrandStateTest() {
        this.total_number_of_merchandise_brands_in_tests--
        this.createdMerchandiseBrands = []
    }
}