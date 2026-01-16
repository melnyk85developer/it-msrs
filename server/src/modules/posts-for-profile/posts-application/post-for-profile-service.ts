import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PostForProfile, type PostForProfileModelType } from '../posts-domain/posts-for-profile-entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { PostForProfileRepository } from '../posts-infrastructure/posts.repository';
import { CreatePostForProfileDomainDto } from '../posts-dto/posts.dto';
import { CreatePostForProfileDto } from '../posts-for-profile-api/posts-for-profile-input-dto/posts.input-dto';
import { UsersRepository } from 'src/modules/user.accounts/users-infrastructure/users.repository';
import { Multer } from 'multer';
import { FilesService } from 'src/modules/files/files.service';
import { UpdatePostForProfileDto } from '../posts-for-profile-api/posts-for-profile-input-dto/posts-update.input-dto';

@Injectable()
export class PostForProfileService {
    constructor(
        @InjectModel(PostForProfile.name) private PostForProfileModel: PostForProfileModelType,
        private postForProfileRepository: PostForProfileRepository,
        private usersRepository: UsersRepository,
        private filesService: FilesService,
    ) { }

    async createPostForProfileService(id: string, image: Multer.File, dto: Omit<CreatePostForProfileDto, 'userId' | 'authorPost'>): Promise<string> {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(id)
        const fileName = image ? await this.filesService.createAvatarFile(image) : null;
        const post = this.PostForProfileModel.createPostForProfileInstance(
            {
                ...dto,
                image: fileName,
                userId: user.id,
                authorPost: {
                    avatar: user.profileData.avatar,
                    name: user.profileData.name ? user.profileData.name : user.accountData.login,
                    surname: user.profileData.surname ? user.profileData.surname : user.accountData.email
                }
            }
        );
        // console.log('PostForProfileService: createPostForProfileService - post 😡 ', post)
        await this.postForProfileRepository.save(post);
        // console.log('PostForProfileService: createPostForProfileService - post2 😡 ', post)
        return post._id.toString();
    }
    async updatePostForProfileService(postId: string, userId: string, image: Multer.File, dto: Omit<UpdatePostForProfileDto, 'postId' | 'image' | 'userId'>): Promise<string> {
        const post = await this.postForProfileRepository.findPostForProfileByIdOrNotFoundFailRepository(postId)
        // console.log('PostForProfileService: updatePostForProfileService - post1 😡 ', post)
        const fileName = image ? await this.filesService.createAvatarFile(image) : null;
        post.updatePostForProfile({
            ...dto,
            postId,
            userId,
            image: fileName
        })
        // console.log('PostForProfileService: updatePostForProfileService - post2 😡 ', post)
        await this.postForProfileRepository.save(post);
        // console.log('PostForProfileService: updatePostForProfileService - post3 😡 ', post)
        return post._id.toString();
    }
    async deletePostForProfileService(postId: string, userId: string) {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const post = await this.postForProfileRepository.findPostForProfileByIdOrNotFoundFailRepository(postId)
        // console.log('UsersService: deleteUserService - user 😡 ', user)
        // console.log('UsersService: deleteUserService - post 😡 ', post)
        if(post.userId !== userId){
            throw new DomainException(INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_POST);
        }
        post.makeDeletedPostForProfile();
        // console.log('UsersService: deleteUserService - post 😡 ', post)
        await this.postForProfileRepository.save(post);
    }
}
