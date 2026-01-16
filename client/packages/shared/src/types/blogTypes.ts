export type CreateBlogType = {
    name: string;
    description: string;
    websiteUrl: string;
    // createdAt?: string;
    // isMembership?: boolean;
}
export type BlogType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    // createdAt?: string;
    // isMembership?: boolean;
}
export type HomePageBlogType = {
    titleHome: string | null;
    subtitleHome: string | null;
    contentHome: string | null;
    ctaTextHome: string | null;
    ctaLinkHome: string | null;
    seoDescriptionHome: string | null;
}
export type AboutPageBlogType = {
    titleAbout: string | null;
    subtitleAbout: string | null;
    contentAbout: string | null;
    missionAbout: string | null;
    seoDescriptionAbout: string | null;
}
export type CreatePostBlogType = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}
export type UpdatePostBlogType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}
export type PostBlogType = {
    id: string

    blogName: string;
    // blogId: string;
    title: string;
    shortDescription: string;
    content: string;
    extendedLikesInfo: ExtendedLikesInfo
    createdAt: string;
}
export type ExtendedLikesInfo = {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: []
}