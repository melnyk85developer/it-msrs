import { PostViewDto } from "src/modules/bloggers-platform/posts/posts-api/posts-view-dto/posts.view-dto";
import { UserContextClass } from "./user-context";
import { PostForProfileViewDto } from "src/modules/posts-for-profile/posts-for-profile-api/posts-for-profile-view-dto/posts-for-profile.view-dto";

export class PostsForProfileContextClass {
    public correctTitleUser1Posts: string[]
    public shortDescriptionUser1Posts: string[]
    public contentUser1Posts: string[]

    public createdUser1Posts: (PostForProfileViewDto | null)[] = [];
    public createdUser2Posts: (PostForProfileViewDto | null)[] = [];
    public createdUser3Posts: (PostForProfileViewDto | null)[] = [];
    public readonly users: UserContextClass;

    constructor() {
        this.users = new UserContextClass();
        this.createdUser1Posts = [] as PostForProfileViewDto[];
        this.createdUser2Posts = [] as PostForProfileViewDto[];
        this.createdUser3Posts = [] as PostForProfileViewDto[];
        this.correctTitleUser1Posts = [
            `My Title Post ${this.users.correctUserNames[0]}`,
            `My Title Post ${this.users.correctUserNames[1]}`,
            `My Title Post ${this.users.correctUserNames[2]}`,
            `My Title Post ${this.users.correctUserNames[3]}`,
        ]
        this.contentUser1Posts = [
            `content 1 content 1 content 1 content 1 content`,
            `content 2 content 2 content 2 content 2 content`,
            `content 3 content 3 content 3 content 3 content`,
            `content 4 content 4 content 4 content 4 content`,
        ]
    }
    public async addPostsForProfileStateTest({
        numUser,
        numPost,
        addPost
    }: {
        numUser: number;
        numPost: number;
        addPost: PostViewDto;
    }) {
        // console.log('PostsContextClass: addPostsStateTest - numBlog, addBlog 😡 ', numBlog, addPost)
        // if(numBlog === undefined || numPost === undefined || addPost === undefined){
        //     return 
        // }

        // 1. Если массив пустой
        if (!this[`createdUser${numUser +1}Posts`].length) {
            this[`createdUser${numUser +1}Posts`] = [addPost];
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this[`createdUser${numUser +1}Posts`].length > numPost) {
            const updatedPosts = this[`createdUser${numUser +1}Posts`].map((post, index) =>
                index === numPost ? addPost : post
            );
            this[`createdUser${numUser +1}Posts`] = updatedPosts
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this[`createdUser${numUser +1}Posts`] = [
            ...this[`createdUser${numUser +1}Posts`],
            ...Array(numPost - this[`createdUser${numUser +1}Posts`].length).fill(null),
            addPost,
        ];
    }
    public async deletePostsForProfileStateTest({
        numUser,
        numPost
    }: {
        numUser: number;
        numPost: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this[`createdUser${numUser +1}Posts`].length > numPost) {
            this[`createdUser${numUser +1}Posts`] = this[`createdUser${numUser +1}Posts`].map((user, index) =>
                index === numPost ? null : user
            );
            return;
        }
    }
    public async deleteAllPostsForProfileStateTest({
        numUser
    }: {
        numUser: number | null;
    }) {
        if (numUser === null || numUser === undefined) {
            this[`createdUser${1}Posts`] = []
            this[`createdUser${2}Posts`] = []
            this[`createdUser${3}Posts`] = []
        } else {
            this[`createdUser${numUser +1}Posts`] = []
        }
    }
}