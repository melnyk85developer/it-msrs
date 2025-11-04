import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Types } from 'mongoose';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { SortDirection } from 'src/core/dto/base.query-params.input-dto';
import { GetBlogsQueryParams } from 'src/modules/bloggers-platform/blogs/blogs-api/input-dto-blogs/get-blogs-query-params.input-dto';
import { BlogViewDto } from 'src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto';
import { Blog, type BlogModelType } from 'src/modules/bloggers-platform/blogs/blogs-domian/blog.entity';

@Injectable()
export class BlogsQueryRepository {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
    ) { }

    async getAllBlogRepository(query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {
        // console.log('BlogsQueryRepository: getAllBlogRepository: query 😡 ', query)
        const normalizedQuery = GetBlogsQueryParams.normalize(query);
        // console.log('BlogsQueryRepository: getAllBlogRepository: normalizedQuery 😡 ', normalizedQuery)
        const filter: FilterQuery<Blog> = {
            deletedAt: null,
        };
        // console.log('BlogsQueryRepository: getAllBlogRepository: filter 😡 ', filter)

        if (normalizedQuery.searchNameTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                name: { $regex: normalizedQuery.searchNameTerm, $options: 'i' },
            });
        }
        if (normalizedQuery.searchDescriptionTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                description: { $regex: normalizedQuery.searchDescriptionTerm, $options: 'i' },
            });
        }
        if (normalizedQuery.searchWebsiteUrlTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                websiteUrl: { $regex: normalizedQuery.searchWebsiteUrlTerm, $options: 'i' },
            });
        }
        // console.log('BlogsQueryRepository: getAllBlogRepository: normalizedQuery 😡 PREV REQ', normalizedQuery)

        const blogs = await this.BlogModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1})
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.BlogModel.countDocuments(filter);

        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = blogs.map(BlogViewDto.mapToBlogsView);

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async getBlogByIdOrNotFoundFailQueryRepository(blogId: string): Promise<BlogViewDto> {
        // console.log('BlogsQueryRepository: getBlogByIdOrNotFoundFailQueryRepository - RES blogId typeof 😡 ', blogId, typeof blogId)

        // if (!blogId || !Types.ObjectId.isValid(blogId)) {
        //     throw new NotFoundException('blog not found');
        // }
        if (!blogId) {
            throw new BadRequestException('Корявый 😡😡😡 blogId');
        }
        const blog = await this.BlogModel.findOne({
            _id: blogId,
            deletedAt: null,
        });

        if (!blog) {
            throw new NotFoundException('blog not found');
        }

        return BlogViewDto.mapToBlogsView(blog);
    }
}