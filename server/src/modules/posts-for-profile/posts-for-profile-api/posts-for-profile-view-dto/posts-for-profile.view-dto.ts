import { PostForProfileDocument } from "../../posts-domain/posts-for-profile-entity";

export class PostForProfileViewDto {
    postId: string;
    title: string;
    content: string;
    userId: string;
    profileId: string;
    // authorPost: {
    //     avatar: string | null;
    //     name: string;
    //     surname: string;
    // }
    image: string | null;
    createdAt: string;

    static mapToViewPosts(post: PostForProfileDocument): PostForProfileViewDto {
        const dto = new PostForProfileViewDto();

        dto.postId = post._id.toString();
        dto.title = post.title;
        dto.content = post.content;
        dto.userId = post.userId;
        dto.profileId = post.profileId;
        // dto.authorPost = post.authorPost;
        dto.image = post.image;
        dto.createdAt = post.createdAt;

        return dto;
    }
}