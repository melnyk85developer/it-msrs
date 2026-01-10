import { BlogDocument } from "../../blogs-domain/blog.entity";

export class AboutPageBlogViewDto {
    id: string;
    titleAbout: string | null;
    subtitleAbout: string | null;
    contentAbout: string | null;
    missionAbout: string | null;
    seoDescriptionAbout: string | null;

    static mapToBlogsView(blog: BlogDocument): AboutPageBlogViewDto {
        const dto = new AboutPageBlogViewDto();

        dto.id = blog._id.toString();

        dto.titleAbout = blog.aboutDataPageBlog.titleAbout;
        dto.subtitleAbout = blog.aboutDataPageBlog.subtitleAbout;
        dto.contentAbout = blog.aboutDataPageBlog.contentAbout;
        dto.missionAbout = blog.aboutDataPageBlog.missionAbout;
        dto.seoDescriptionAbout = blog.aboutDataPageBlog.seoDescriptionAbout;
        console.log('AboutPageBlogViewDto 😡 ', dto, dto)

        return dto;
    }
}