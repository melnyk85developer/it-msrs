import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Photo, PhotoDocument, type PhotoModelType } from '../photos-domain/photos-entity';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { PhotoViewDto } from '../photos-dto/photo-view-dto';
import { GetPhotoQueryParams } from '../photos-dto/get-photos-query-params.input-dto';

@Injectable()
export class PhotoQueryRepository {
    constructor(
        @InjectModel(Photo.name) private photoModel: PhotoModelType
    ) { }

    async getAllPhotoQueryRepository(query: GetPhotoQueryParams, userId: string): Promise<PaginatedViewDto<PhotoViewDto[]>> {

        const normalizedQuery = GetPhotoQueryParams.normalize(query);
        // console.log('UsersQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<Photo> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('UsersQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchImage) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchImage: { $regex: normalizedQuery.searchImage, $options: 'i' },
            });
        }
        if (normalizedQuery.searchMiniature) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchMiniature: { $regex: normalizedQuery.searchMiniature, $options: 'i' },
            });
        }
        if (normalizedQuery.searchAlbumName) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                searchAlbumName: { $regex: normalizedQuery.searchAlbumName, $options: 'i' },
            });
        }
        const photo = await this.photoModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.photoModel.countDocuments(filter);

        // const items = blogs.map(BlogViewDto.mapToBlogsView).reverse();
        const items = photo.map(PhotoViewDto.mapPhotoToView);

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }

    async findPhotoById(photoId: string): Promise<PhotoDocument | null> {
        return this.photoModel.findOne({
            _id: new Types.ObjectId(photoId),
            deletedAt: null,
        });
    }

    async findPhotoByIdOrNotFoundFailRepository(photoId: string): Promise<PhotoViewDto> {
        let photo
        if (!photoId || photoId === undefined || photoId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            photo = await this.findPhotoById(photoId);
        }
        if (!photo) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_PHOTO);
        }
        return PhotoViewDto.mapPhotoToView(photo);
    }
}