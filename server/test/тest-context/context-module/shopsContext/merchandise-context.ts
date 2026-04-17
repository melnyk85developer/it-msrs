import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "../user-context";
import { MerchandiseViewDto } from "src/modules/shops-platform/merchandise/merchandise-dto/merchandise.view-dto";

export class MerchandiseContextClass {
    public correctShopNames: string[]
    public correctShopDescriptions: string[]
    public total_number_of_merchandise_in_tests: number = 0;
    public createdMerchandises: (MerchandiseViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdMerchandises = [];

        this.correctShopNames = [
            `My ${this.users.correctUserNames[0]} Blog`,
            `My ${this.users.correctUserNames[1]} Blog`,
            `My ${this.users.correctUserNames[2]} Blog`,
            `My ${this.users.correctUserNames[3]} Blog`,
        ]
        this.correctShopDescriptions = [
            `Description ${this.users.correctUserNames[0]} Blog`,
            `Description ${this.users.correctUserNames[1]} Blog`,
            `Description ${this.users.correctUserNames[2]} Blog`,
            `Description ${this.users.correctUserNames[3]} Blog`,
        ]
    }
    public async addMerchandiseStateTest({
        numMerchandise,
        addMerchandise
    }: {
        numMerchandise: number;
        addMerchandise: MerchandiseViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 1. Если массив пустой
        if (!this.createdMerchandises.length) {
            this.createdMerchandises = [addMerchandise];
            this.total_number_of_merchandise_in_tests++
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdMerchandises.length > numMerchandise) {
            this.createdMerchandises = this.createdMerchandises.map((shop, index) =>
                index === numMerchandise ? addMerchandise : shop
            );
            this.total_number_of_merchandise_in_tests++
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdMerchandises = [
            ...this.createdMerchandises,
            ...Array(numMerchandise - this.createdMerchandises.length).fill(null),
            addMerchandise,
        ];
        this.total_number_of_merchandise_in_tests++
    }
    public async updateMerchandiseStateTest({
        numMerchandise,
        updateMerchandise
    }: {
        numMerchandise: number;
        updateMerchandise: MerchandiseViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        if (this.createdMerchandises.length > numMerchandise) {
            this.createdMerchandises = this.createdMerchandises.map((m, index) =>
                index === numMerchandise ? updateMerchandise : m
            );
            return;
        }
    }
    public async deleteMerchandiseStateTest({
        numMerchandise
    }: {
        numMerchandise: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdMerchandises.length > numMerchandise) {
            this.createdMerchandises = this.createdMerchandises.map((user, index) =>
                index === numMerchandise ? null : user
            );
            this.total_number_of_merchandise_in_tests--
            return;
        }
    }
    public async deleteAllMerchandiseStateTest() {
        this.total_number_of_merchandise_in_tests = 0
        this.createdMerchandises = []
    }
}