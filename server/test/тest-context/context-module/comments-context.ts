import { CommentViewDto } from "src/modules/comments/comments-api/comments-view-dto/comments.view-dto";

export class CommentsContextClass {
    public contentForComments: string[];

    public createdBlog1Post1Comments: CommentViewDto[];
    public total_number_of_comments_for_blog_1_post_1_in_tests: number = 0;

    public createdBlog1Post2Comments: CommentViewDto[];
    public total_number_of_comments_for_blog_1_post_2_in_tests: number = 0;

    public createdBlog1Post3Comments: CommentViewDto[];
    public total_number_of_comments_for_blog_1_post_3_in_tests: number = 0;

    constructor() {
        this.createdBlog1Post1Comments = [];
        this.createdBlog1Post2Comments = [];
        this.createdBlog1Post3Comments = [];

        this.contentForComments = [
            `Комментарий test1 content1`,
            `Комментарий test2 content2`,
            `Комментарий test3 content3`
        ]
    }
    public async countComments(comments: CommentViewDto[]) {
        // console.log('CommentsContextClass: countComments - comments 😡 ', comments)
        const count = comments.filter(c => c !== null)
        // console.log('CommentsContextClass: countComments - count 😡 ', count.length)
        return count.length
    }
    public async addCommentsStateTest({
        numBlog,
        numPost,
        numComment,
        addComment
    }: {
        numBlog: number;
        numPost: number;
        numComment: number;
        addComment: CommentViewDto;
    }) {
        // console.log('CommentsContextClass: addCommentStateTest - numBlog, numPost, numComment addComment 😡 ', numBlog, numPost, numComment, addComment)

        const commentsKey = this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`]
        // console.log('CommentsContextClass: addCommentStateTest - commentsKey 😡 ', commentsKey)

        // 1. Если массив пустой
        if (commentsKey === undefined || commentsKey === null || !commentsKey.length) {
            // console.log('CommentsContextClass: 1. Если массив пустой - создаем первый комментарий: numBlog, numPost, numComment, addComment 😡 ', numBlog, numPost, numComment, addComment)

            this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`] = [addComment];
            this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`] = await this.countComments(this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`])

            // console.log(`CommentsContextClass: this[total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests]++ 😡 `, this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`])
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (commentsKey.length > numComment) {
            // console.log('CommentsContextClass: 2. Если индекс существует -> обновляем: numBlog, numPost, numComment, addComment 😡 ', numBlog, numPost, numComment, addComment)

            const updatedComments = commentsKey.map((comment, index) =>
                index === numComment ? addComment : comment
            );
            this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`] = updatedComments
            this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`] = await this.countComments(this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`])

            // console.log(`CommentsContextClass: this[total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests]++ 😡 `, this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`])
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`] = [
            ...this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`],
            ...Array(numComment - this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`].length).fill(null),
            addComment,
        ];
        // console.log('CommentsContextClass: 3. Если индекса нет -> расширяем массив до нужного индекса - numBlog, numPost, addBlog 😡 ', numBlog, numPost, addComment)
        this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`] = await this.countComments(this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`])
        // console.log(`CommentsContextClass: this[total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests]++ 😡 `, this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`])
    }
    public async deleteCommentsStateTest({
        numBlog,
        numPost,
        numComment
    }: {
        numBlog: number;
        numPost: number;
        numComment: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this[`createdBlog${numBlog + 1}Posts${numPost + 1}Comments`].length > numComment) {
            this[`createdBlog${numBlog + 1}Posts${numPost + 1}Comments`] = this[`createdBlog${numBlog + 1}Posts${numPost + 1}Comments`].map(
                (comment, index) => index === numComment ? null : comment
            );
            // console.log('CommentsContextClass: deleteCommentsStateTest - numBlog, numPost 😡 ', numBlog, numPost)
            this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`] = await this.countComments(this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`])
            // console.log(`CommentsContextClass: this[total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests]-- 😡 `, this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`])
            return;
        }
    }
    public async deleteAllCommentsStateTest({
        numBlog,
        numPost
    }: {
        numBlog: number | null;
        numPost: number;
    }) {
        if (numBlog === null) {
            this[`createdBlog${1}Post${numPost + 1}Comments`] = []
            this[`total_number_of_comments_for_blog_${1}_post_${1}_in_tests`] = 0
            this[`total_number_of_comments_for_blog_${1}_post_${2}_in_tests`] = 0
            this[`total_number_of_comments_for_blog_${1}_post_${3}_in_tests`] = 0
            this[`createdBlog${2}Post${numPost + 1}Comments`] = []
            this[`total_number_of_comments_for_blog_${2}_post_${1}_in_tests`] = 0
            this[`total_number_of_comments_for_blog_${2}_post_${2}_in_tests`] = 0
            this[`total_number_of_comments_for_blog_${2}_post_${3}_in_tests`] = 0
            this[`createdBlog${3}Post${numPost + 1}Comments`] = []
            this[`total_number_of_comments_for_blog_${3}_post_${1}_in_tests`] = 0
            this[`total_number_of_comments_for_blog_${3}_post_${2}_in_tests`] = 0
            this[`total_number_of_comments_for_blog_${3}_post_${3}_in_tests`] = 0
            // console.log('CommentsContextClass: deleteAllCommentsStateTest - Удаляем все комментарии всех постов со всех блогов с контекста тестов!!! 😡 numBlog', numBlog)
        } else {
            this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`] = []
            this[`total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests`] = await this.countComments(this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`])
            // console.log(`CommentsContextClass: deleteAllCommentsStateTest - Удаляем все комментарии конкретного поста ${numPost + 1} от конкретного блога ${numBlog + 1} с контекста тестов!!! 😡`)
            // console.log(`CommentsContextClass: this[total_number_of_comments_for_blog_${numBlog + 1}_post_${numPost + 1}_in_tests] = 0 😡 `, await this.countComments(this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`]))
        }
    }
}