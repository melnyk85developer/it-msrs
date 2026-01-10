import { BlogDocument } from "../../blogs-domain/blog.entity";

export class HomePageBlogViewDto {
    id: string;
    // name: string;
    // description: string;
    // websiteUrl: string;
    // createdAt: string;
    // isMembership: boolean;

    contentHome: string | null;
    ctaLinkHome: string | null;
    ctaTextHome: string | null;
    seoDescriptionHome: string | null;
    subtitleHome: string | null;
    titleHome: string | null;
    // about: About;

    static mapToBlogsView(blog: BlogDocument): HomePageBlogViewDto {
        const dto = new HomePageBlogViewDto();

        dto.id = blog._id.toString();
        // dto.name = blog.name;
        // dto.description = blog.description;
        // dto.websiteUrl = blog.websiteUrl;
        // dto.createdAt = blog.createdAt;
        // dto.isMembership = blog.isMembership;

        dto.contentHome = blog.homeDataPageBlog.contentHome;
        dto.ctaLinkHome = blog.homeDataPageBlog.ctaLinkHome;
        dto.ctaTextHome = blog.homeDataPageBlog.ctaTextHome;
        dto.seoDescriptionHome = blog.homeDataPageBlog.seoDescriptionHome;
        dto.subtitleHome = blog.homeDataPageBlog.subtitleHome;
        dto.titleHome = blog.homeDataPageBlog.titleHome;
        // dto.about = blog.about;

        return dto;
    }
}