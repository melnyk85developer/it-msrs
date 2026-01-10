import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "./user-context";

export class CodeConfirmationContextClass {
    public correctBlogNames: string[]
    public correctBlogDescriptions: string[]
    public correctWebsiteUrls: string[]

    public allCodesConfirmation: [{ code: string, name: string }];
    public nameConfirmation: string;
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.allCodesConfirmation = [] as any
        this.nameConfirmation = '';

        this.correctBlogNames = [
            `My ${this.users.correctUserNames[0]} Blog`,
            `My ${this.users.correctUserNames[1]} Blog`,
            `My ${this.users.correctUserNames[2]} Blog`,
            `My ${this.users.correctUserNames[3]} Blog`,
        ]
        this.correctBlogDescriptions = [
            `Description ${this.users.correctUserNames[0]} Blog`,
            `Description ${this.users.correctUserNames[1]} Blog`,
            `Description ${this.users.correctUserNames[2]} Blog`,
            `Description ${this.users.correctUserNames[3]} Blog`,
        ]
        this.correctWebsiteUrls = [
            `https://${this.users.correctUserNames[0].toLocaleLowerCase()}.com`,
            `https://${this.users.correctUserNames[1].toLocaleLowerCase()}.com`,
            `https://${this.users.correctUserNames[2].toLocaleLowerCase()}.com`,
            `https://${this.users.correctUserNames[3].toLocaleLowerCase()}.com`,
        ]
    }
    public async addCodeConfirmationStateTest({
        numConfirmation,
        nameConfirmation,
        newCode
    }: {
        numConfirmation: number,
        nameConfirmation: 'Registration' | 'Password',
        newCode: string
    }) {
        console.log('CodeConfirmationContextClass: - nameConfirmation, newCode 😡 ', nameConfirmation, newCode)
        if (nameConfirmation === 'Registration') {
            // 1. Если массив пустой
            if (this.allCodesConfirmation && !this.allCodesConfirmation.length) {
                this.allCodesConfirmation = [{
                    code: newCode,
                    name: nameConfirmation
                }];
                return;
            }
            // 2. Если индекс существует -> обновляем
            if (this.allCodesConfirmation && this.allCodesConfirmation.length > numConfirmation) {
                let codes
                for (let i = 0; this.allCodesConfirmation.length > i; i++) {
                    if (i === numConfirmation) {
                        codes = newCode
                    } else {
                        codes = this.allCodesConfirmation[i]?.code ?? null
                    }
                }
                this.allCodesConfirmation = codes
                return;
            }
            // 3. Если индекса нет -> расширяем массив до нужного индекса
            if (this.allCodesConfirmation && this.allCodesConfirmation.length < numConfirmation) {
                let codes
                for (let i = 0; this.allCodesConfirmation.length < i; i++) {
                    codes = this.allCodesConfirmation[i]?.code ?? null
                }
                for (let i = 0; numConfirmation - this.allCodesConfirmation.length > i; i++) {
                    codes.push(null)
                }
                this.allCodesConfirmation = codes
                return;
            }
        }
    }
    public async deleteBlogStateTest({
        numBlog
    }: {
        numBlog: number;
    }) {
        // // 2. Если индекс существует -> обновляем
        // if (this.createdBlogs.length > numBlog) {
        //     this.createdBlogs = this.createdBlogs.map((user, index) =>
        //         index === numBlog ? null : user
        //     );
        //     return;
        // }
    }
    public async deleteAllBlogsStateTest() {
        // this.createdBlogs = []
    }
}