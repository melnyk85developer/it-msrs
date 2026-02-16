import { HTTP_STATUSES } from "src/core/utils/utils";
import { CreatePostInputDto } from "src/modules/bloggers-platform/posts/posts-api/posts-input-dto/posts.input-dto";
import { contextTests } from "test/helpers/init-settings";
import { CreatePostForProfileInputDto } from "../posts-for-profile-api/posts-for-profile-input-dto/posts.input-dto";

export const isCreatedPostForProfile = async (
    numUser: number,
    numPost: number,
    postData: CreatePostForProfileInputDto,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    const postKey = contextTests.posts_for_profile[`createdUser${numUser + 1}Posts`]
    const isPostTestStore = postKey[numPost + 1]

    if (isPostTestStore === undefined || isPostTestStore === null) {
        const { response } = await contextTests.postsForProfileTestManager.createPostForProfile(
            postData,
            contextTests.sessions.accessTokenUser1Devices[0],
            contextTests.sessions.refreshTokenUser1Devices[0],
            statusCode
        );
        if (response.status === statusCode) {
            // console.log('TEST isCreatedPostForProfile: - response.body 😡😡😡', response.body)
            contextTests.posts_for_profile.addPostsForProfileStateTest({
                numUser,
                numPost,
                addPost: response.body
            })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return contextTests.posts_for_profile[`createdUser${numUser +1}Posts`][numPost]
        // return null
    }
}