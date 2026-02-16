import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostForProfile, PostForProfileSchema } from './posts-domain/posts-for-profile-entity';
import { PostForProfileController } from './posts-for-profile-api/posts-for-profile.controller';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { PostForProfileRepository } from './posts-infrastructure/posts.repository';
import { PostsForProfileQueryRepository } from './posts-infrastructure/posts.query-repository';
import { PostForProfileMapper } from './posts-for-profile-api/posts-for-profile-view-dto/post-for-profile.mapper';
import { CreatePostForProfileUseCase } from './posts-application/post-for-profile.use-cases/create-post-for-profile.use-case';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdatePostForProfileUseCase } from './posts-application/post-for-profile.use-cases/update-post-for-profile.use-case';
import { DeletePostForProfileUseCase } from './posts-application/post-for-profile.use-cases/delete-post-for-profile.use-case';

const useCases = [
    CreatePostForProfileUseCase,
    UpdatePostForProfileUseCase,
    DeletePostForProfileUseCase
]
@Module({
    imports: [
        MongooseModule.forFeature([{ name: PostForProfile.name, schema: PostForProfileSchema }]),
        UserAccountsModule,
        CqrsModule,
    ],
    controllers: [
        PostForProfileController
    ],
    providers: [
        ...useCases,
        PostForProfileRepository,
        PostsForProfileQueryRepository,
        PostForProfileMapper
    ],
    exports: [
        PostForProfileRepository,
        PostsForProfileQueryRepository,
        PostForProfileMapper
    ],
})
export class PostForProfileModule { }
