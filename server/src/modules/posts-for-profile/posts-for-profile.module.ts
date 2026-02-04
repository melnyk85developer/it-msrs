import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostForProfile, PostForProfileSchema } from './posts-domain/posts-for-profile-entity';
import { PostForProfileController } from './posts-for-profile-api/posts-for-profile.controller';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { PostForProfileRepository } from './posts-infrastructure/posts.repository';
import { PostForProfileService } from './posts-application/post-for-profile-service';
import { PostsForProfileQueryRepository } from './posts-infrastructure/posts.query-repository';
import { PostForProfileMapper } from './posts-for-profile-api/posts-for-profile-view-dto/post-for-profile.mapper';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PostForProfile.name, schema: PostForProfileSchema }]),
        UserAccountsModule
    ],
    controllers: [
        PostForProfileController
    ],
    providers: [
        PostForProfileService,
        PostForProfileRepository,
        PostsForProfileQueryRepository,
        PostForProfileMapper
    ],
    exports: [
        PostForProfileService,
        PostForProfileRepository,
        PostsForProfileQueryRepository,
        PostForProfileMapper
    ],
})
export class PostForProfileModule { }
