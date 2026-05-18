import { BlogViewDto } from "src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto";
import { UserContextClass } from "./user-context";
import { AiAssistantMessageViewDto } from "src/modules/admin/ai-assistant/ai-assistant-chats/ai-assistant-msg/ai-assistant-msg-api/viev-dto-msg/msg-all.view-dto";

export class AiAssistantContextClass {
    public correctBlogNames: string[]
    public correctBlogDescriptions: string[]
    public correctWebsiteUrls: string[]

    public createdBlogs: (AiAssistantMessageViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdBlogs = [];

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
    public async addBlogStateTest({
        numBlog,
        addBlog
    }: {
        numBlog: number;
        addBlog: AiAssistantMessageViewDto;
    }) {
        // console.log('BlogsContextClass: addBlogStateTest - numBlog, addBlog 😡 ', numBlog, addBlog)
        // 1. Если массив пустой
        if (!this.createdBlogs.length) {
            this.createdBlogs = [addBlog];
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdBlogs.length > numBlog) {
            this.createdBlogs = this.createdBlogs.map((blog, index) =>
                index === numBlog ? addBlog : blog
            );
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdBlogs = [
            ...this.createdBlogs,
            ...Array(numBlog - this.createdBlogs.length).fill(null),
            addBlog,
        ];
    }
    public async deleteBlogStateTest({
        numBlog
    }: {
        numBlog: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdBlogs.length > numBlog) {
            this.createdBlogs = this.createdBlogs.map((user, index) =>
                index === numBlog ? null : user
            );
            return;
        }
    }
    public async deleteAllBlogsStateTest() {
        this.createdBlogs = []
    }
}