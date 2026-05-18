import { PostViewDto } from "src/modules/bloggers-platform/posts/posts-api/posts-view-dto/posts.view-dto";
import { UserContextClass } from "./user-context";

export class PostsForBlogContextClass {
    public correctTitleBlog1Posts: string[]
    public shortDescriptionBlog1Posts: string[]
    public contentBlog1Posts: string[]

    public createdBlog1Posts: (PostViewDto | null)[] = [];
    public total_number_of_posts_for_blog_1_in_tests: number = 0;

    public createdBlog2Posts: (PostViewDto | null)[] = [];
    public total_number_of_posts_for_blog_2_in_tests: number = 0;

    public createdBlog3Posts: (PostViewDto | null)[] = [];
    public total_number_of_posts_for_blog_3_in_tests: number = 0;

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
    public async countPosts(posts: PostViewDto[]) {
        // console.log('PostsForBlogContextClass: countPosts - posts 😡 ', posts)
        const count = posts.filter(p => p !== null)
        console.log('PostsForBlogContextClass: countPosts - count 😡 ', count.length)
        return count.length
    }
    public async addPostsForBlogStateTest({
        numBlog,
        numPost,
        addPost
    }: {
        numBlog: number;
        numPost: number;
        addPost: PostViewDto;
    }) {
        // console.log('PostsForBlogContextClass: addPostsStateTest - numBlog, addBlog 😡 ', numBlog, addPost)

        // 1. Если массив пустой
        if (!this[`createdBlog${numBlog + 1}Posts`].length) {
            console.log('PostsForBlogContextClass: 1. Если массив пустой - создаем первый пост: numBlog, numPost, addBlog 😡 ', numBlog, numPost, addPost)

            this[`createdBlog${numBlog + 1}Posts`] = [addPost];

            this[`total_number_of_posts_for_blog_${numBlog + 1}_in_tests`] = await this.countPosts(this[`createdBlog${numBlog + 1}Posts`])

            console.log(`PostsForBlogContextClass: this[total_number_of_posts_for_blog_${numBlog + 1}_in_tests]++ 😡 `, await this.countPosts(this[`createdBlog${numBlog + 1}Posts`]))
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this[`createdBlog${numBlog + 1}Posts`].length > numPost) {
            console.log('PostsForBlogContextClass: 2. Если индекс существует -> обновляем - numBlog, numPost, addBlog 😡 ', numBlog, numPost, addPost)

            const updatedPosts = this[`createdBlog${numBlog + 1}Posts`].map((post, index) =>
                index === numPost ? addPost : post
            );
            this[`createdBlog${numBlog + 1}Posts`] = updatedPosts
            this[`total_number_of_posts_for_blog_${numBlog + 1}_in_tests`] = await this.countPosts(this[`createdBlog${numBlog + 1}Posts`])
            console.log(`PostsForBlogContextClass: this[total_number_of_posts_for_blog_${numBlog + 1}_in_tests]++ 😡 `, await this.countPosts(this[`createdBlog${numBlog + 1}Posts`]))
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this[`createdBlog${numBlog + 1}Posts`] = [
            ...this[`createdBlog${numBlog + 1}Posts`],
            ...Array(numPost - this[`createdBlog${numBlog + 1}Posts`].length).fill(null),
            addPost,
        ];
        console.log('PostsForBlogContextClass: 3. Если индекса нет -> расширяем массив до нужного индекса - numBlog, numPost, addBlog 😡 ', numBlog, numPost, addPost)
        this[`total_number_of_posts_for_blog_${numBlog + 1}_in_tests`] = await this.countPosts(this[`createdBlog${numBlog + 1}Posts`])
        console.log(`PostsForBlogContextClass: this[total_number_of_posts_for_blog_${numBlog + 1}_in_tests]++ 😡  😡 `, await this.countPosts(this[`createdBlog${numBlog + 1}Posts`]))

    }
    public async deletePostsForBlogStateTest({
        numBlog,
        numPost
    }: {
        numBlog: number;
        numPost: number;
    }) {
        // 2. Если индекс существует -> удаляем/меняем по индексу на null
        if (this[`createdBlog${numBlog + 1}Posts`].length > numPost) {
            this[`createdBlog${numBlog + 1}Posts`] = this[`createdBlog${numBlog + 1}Posts`].map((post, index) =>
                index === numPost ? null : post
            );
            console.log('PostsForBlogContextClass: deletePostsForBlogStateTest - numBlog, numPost 😡 ', numBlog, numPost)
            this[`total_number_of_posts_for_blog_${numBlog + 1}_in_tests`] = await this.countPosts(this[`createdBlog${numBlog + 1}Posts`])
            return;
        }
    }
    public async deleteAllPostsForBlogStateTest({
        numBlog
    }: {
        numBlog: number | null;
    }) {
        // 3. Если индекс существует, но индекс === null или индекс === undefined -> удаляем/меняем по индексу на null
        if (numBlog === null || numBlog === undefined) {
            this[`createdBlog${1}Posts`] = []
            this[`total_number_of_posts_for_blog_${1}_in_tests`] = 0
            this[`createdBlog${2}Posts`] = []
            this[`total_number_of_posts_for_blog_${2}_in_tests`] = 0
            this[`createdBlog${3}Posts`] = []
            this[`total_number_of_posts_for_blog_${3}_in_tests`] = 0
            console.log('PostsForBlogContextClass: deleteAllPostsForBlogStateTest - Удаляем все посты - всех блогов с контекста тестов!!! 😡 numBlog', numBlog)
        } else {
            console.log(`PostsForBlogContextClass: deleteAllPostsForBlogStateTest - Удаляем все посты блога №${numBlog + 1} с контекста тестов!!! 😡`)
            this[`createdBlog${numBlog + 1}Posts`] = []
            console.log('PostsForBlogContextClass: deleteAllPostsForBlogStateTest - this[`createdBlog${numBlog + 1}Posts`] 😡 ', this[`createdBlog${numBlog + 1}Posts`])
            this[`total_number_of_posts_for_blog_${numBlog + 1}_in_tests`] = await this.countPosts(this[`createdBlog${numBlog + 1}Posts`])
            console.log('PostsForBlogContextClass: deleteAllPostsForBlogStateTest - this[`total_number_of_posts_for_blog_${numBlog + 1}_in_tests`] 😡 ', this[`total_number_of_posts_for_blog_${numBlog + 1}_in_tests`])
        }
    }
}