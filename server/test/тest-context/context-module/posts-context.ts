import { PostViewDto } from "src/modules/bloggers-platform/posts/posts-api/posts-view-dto/posts.view-dto";
import { UserContextClass } from "./user-context";

export class PostsContextClass {
    public correctTitleBlog1Posts: string[]
    public shortDescriptionBlog1Posts: string[]
    public contentBlog1Posts: string[]

    public createdBlog1Posts: (PostViewDto | null)[] = [];
    public createdBlog2Posts: (PostViewDto | null)[] = [];
    public createdBlog3Posts: (PostViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdBlog1Posts = [];
        this.createdBlog2Posts = [];
        this.createdBlog3Posts = [];
        this.correctTitleBlog1Posts = [
            `My Title Post ${this.users.correctUserNames[0]}`,
            `My Title Post ${this.users.correctUserNames[1]}`,
            `My Title Post ${this.users.correctUserNames[2]}`,
            `My Title Post ${this.users.correctUserNames[3]}`,
        ]
        this.shortDescriptionBlog1Posts = [
            `MyPost 1 - shortDescription ${this.users.correctUserNames[0]}`,
            `MyPost 2 - shortDescription ${this.users.correctUserNames[1]}`,
            `MyPost 3 - shortDescription ${this.users.correctUserNames[2]}`,
            `MyPost 4 - shortDescription ${this.users.correctUserNames[3]}`,
        ]
        this.contentBlog1Posts = [
            `content 1 content 1 content 1 content 1 content`,
            `content 2 content 2 content 2 content 2 content`,
            `content 3 content 3 content 3 content 3 content`,
            `content 4 content 4 content 4 content 4 content`,
        ]
    }
    public async addPostsStateTest({
        numBlog,
        numPost,
        addPost
    }: {
        numBlog: number;
        numPost: number;
        addPost: PostViewDto;
    }) {
        console.log('PostsContextClass: addPostsStateTest - numBlog, addBlog 😡 ', numBlog, addPost)
        // if(numBlog === undefined || numPost === undefined || addPost === undefined){
        //     return 
        // }

        // 1. Если массив пустой
        if (!this[`createdBlog${numBlog +1}Posts`].length) {
            this[`createdBlog${numBlog +1}Posts`] = [addPost];
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this[`createdBlog${numBlog +1}Posts`].length > numPost) {
            const updatedPosts = this[`createdBlog${numBlog +1}Posts`].map((post, index) =>
                index === numPost ? addPost : post
            );
            this[`createdBlog${numBlog +1}Posts`] = updatedPosts
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this[`createdBlog${numBlog +1}Posts`] = [
            ...this[`createdBlog${numBlog +1}Posts`],
            ...Array(numPost - this[`createdBlog${numBlog +1}Posts`].length).fill(null),
            addPost,
        ];
    }
    public async deletePostsStateTest({
        numBlog,
        numPost
    }: {
        numBlog: number;
        numPost: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this[`createdBlog${numBlog +1}Posts`].length > numPost) {
            this[`createdBlog${numBlog +1}Posts`] = this[`createdBlog${numBlog +1}Posts`].map((user, index) =>
                index === numPost ? null : user
            );
            return;
        }
    }
    public async deleteAllPostsStateTest({
        numBlog
    }: {
        numBlog: number | null;
    }) {
        if (numBlog === null || numBlog === undefined) {
            this[`createdBlog${1}Posts`] = []
            this[`createdBlog${2}Posts`] = []
            this[`createdBlog${3}Posts`] = []
        } else {
            this[`createdBlog${numBlog +1}Posts`] = []
        }
    }
}