import { HTTP_STATUSES, HttpStatusType } from "src/shared/utils/utils";
import { getRequest } from "./authTestManager";
import { SETTINGS } from "src/shared/settings";
import { CreatePostInputDto } from "src/modules/bloggers-platform/posts/posts-api/posts-input-dto/posts.input-dto";
import { CreateCommentInputDto } from "src/modules/bloggers-platform/comments/comments-api/comments-input-dto/comments.input-dto";
import { UpdateCommentInputDto } from "src/modules/bloggers-platform/comments/comments-api/comments-input-dto/comments-update.input-dto";

export const commetsTestManager = {
    async getAllComments(
        accessToken: string | null,
        postId: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200
    ) {
        // console.log('TEST: - commetsTestManager - getAllComments - accessToken', accessToken)
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.posts}/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode)

        const getAllComments = response.body
        expect(getAllComments).toEqual(
            expect.objectContaining({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: expect.any(Number),
                items: expect.any(Array),
            })
        )
        if (getAllComments.items.length > 0) {
            const comment = getAllComments.items[0]
            expect(comment).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    content: expect.any(String),
                    commentatorInfo: expect.objectContaining({
                        userId: expect.any(String),
                        userLogin: expect.any(String),
                    }),
                    createdAt: expect.any(String),
                    // likesInfo: expect.objectContaining({
                    //     likesCount: expect.any(Number),
                    //     dislikesCount: expect.any(Number),
                    //     myStatus: expect.any(String),
                    // }),
                })
            )
        }
        return { response, getAllComments }
    },
    async getCommentById(
        id: string | null,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('TEST: - commetsTestManager - getCommentById - id', id)
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.comments}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            // .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)

        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            expect(response.body)
                .toEqual(
                    {
                        id: expect.any(String),
                        content: expect.any(String),
                        commentatorInfo: {
                            userId: expect.any(String),
                            userLogin: expect.any(String),
                        },
                        // likesInfo: {
                        //     likesCount: expect.any(Number),
                        //     dislikesCount: expect.any(Number),
                        //     myStatus: expect.any(String)
                        // },
                        createdAt: expect.any(String),
                    }
                )
        }
        // console.log('TEST: - commetsTestManager: getCommentById - response', response.body)
        return { response: response, getCommentById: response.body }
    },
    async getAllCommentsByIdPost(
        data: CreatePostInputDto,
        accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {

        const response = await getRequest()
            .get(SETTINGS.RouterPath.comments)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode)

        let getAllCommentByIdBlog;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            getAllCommentByIdBlog = response.body;
            expect(getAllCommentByIdBlog).toEqual({
                id: expect.any(String),
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String)
            })
        }
        return { response: response, getAllPostsByIdBlog: getAllCommentByIdBlog }
    },
    async createComment(
        postId: string,
        dataComment: CreateCommentInputDto,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('commetsTestManager: createComment - accessToken', accessToken)
        // console.log('commetsTestManager: createComment - postId', postId)
        // console.log('commetsTestManager: createComment - postId, dataComment 😡 ', postId, dataComment)

        const response = await getRequest()
            .post(`${SETTINGS.RouterPath.posts}/${postId}/comments`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(dataComment)
            .expect(expectedStatusCode)
        // console.log('commetsTestManager: createComment - response.body 😡 ', response.body)

        let createdComment;
        // console.log('commetsTestManager: createComment - response', response.body)
        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) {
            expect(expectedStatusCode)
        }
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdComment = response.body;
            expect(createdComment).toEqual({
                id: expect.any(String),
                commentatorInfo: {
                    userId: expect.any(String),
                    userLogin: expect.any(String),
                },
                // likesInfo: {
                //     dislikesCount: expect.any(Number),
                //     likesCount: expect.any(Number),
                //     myStatus: expect.any(String),
                // },
                content: dataComment.content,
                createdAt: expect.any(String)
            });
        }
        return { response: response, createdComment: createdComment }
    },
    async updateComment(
        commentId: string | null,
        data: UpdateCommentInputDto,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('commetsTestManager: updatePosts: - commentId', commentId)
        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.comments}/${commentId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode)

        return { response: response, updateComment: response.body }
    },
    async deleteComment(
        commentId: string,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {

        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.comments}/${commentId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode)

        let deletedComment;

        return { response: response, deletedComment: deletedComment }
    }
}