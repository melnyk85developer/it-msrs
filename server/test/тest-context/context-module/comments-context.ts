import { CommentViewDto } from "src/modules/bloggers-platform/comments/comments-api/comments-view-dto/comments.view-dto";

export class CommentsContextClass {
    public contentBlog1Post1Comments: string[];
    public createdBlog1Post1Comments: CommentViewDto[];
    public total_number_of_comments_in_tests: number = 0;

    constructor() {
        this.createdBlog1Post1Comments = [];
        this.contentBlog1Post1Comments = [
            `Комментарий test1 content1`,
            `Комментарий test2 content2`,
            `Комментарий test3 content3`
        ]
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
        // console.log('CommentsContextClass: addCommentStateTest - numBlog, numPost, addBlog 😡 ', numBlog, numPost, addComment)
        // if(numBlog === undefined || numPost === undefined || addPost === undefined){
        //     return 
        // }
        const commentsKey = this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`]
        // console.log('CommentsContextClass: addCommentStateTest - commentsKey 😡 ', commentsKey)

        // 1. Если массив пустой
        if (commentsKey === undefined || commentsKey === null || !commentsKey.length) {
            this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`] = [addComment];
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (commentsKey.length > numComment) {
            const updatedComments = commentsKey.map((comment, index) =>
                index === numComment ? addComment : comment
            );
            this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`] = updatedComments
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`] = [
            ...this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`],
            ...Array(numComment - this[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`].length).fill(null),
            addComment,
        ];
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
            this[`createdBlog${1}Posts${numPost + 1}Comments`] = []
            this[`createdBlog${2}Posts${numPost + 1}Comments`] = []
            this[`createdBlog${3}Posts${numPost + 1}Comments`] = []
        } else {
            this[`createdBlog${numBlog + 1}Posts${numPost + 1}Comments`] = []
        }
    }
}