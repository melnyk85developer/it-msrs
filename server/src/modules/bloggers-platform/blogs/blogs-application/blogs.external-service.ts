import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';;
import * as blogsEntity from '../blogs-domain/blog.entity';
import { BlogsRepository } from '../blogs-infrastructure/blogs.repository';

@Injectable()
export class BlogsExternalService {
    constructor(
        //инжектирование модели в сервис через DI
        @InjectModel(blogsEntity.Blog.name)
        private BlogModel: blogsEntity.BlogModelType,
        private blogsRepository: BlogsRepository,
    ) { }

    async makeUserAsSpammer(userId: string) {
        const blog = await this.blogsRepository.findBlogOrNotFoundFailRepository(userId);
        // blog.makeSpammer();
        await this.blogsRepository.save(blog);
    }
}