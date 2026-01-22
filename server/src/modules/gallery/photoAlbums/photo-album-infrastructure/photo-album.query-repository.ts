import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { PhotoAlbum, PhotoAlbumDocument, type PhotoAlbumModelType } from '../photo-album-domain/photo-album-entity';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';
import { GetPhotoAlbumQueryParams } from '../photo-album-dto/get-photo-album-query-params.input-dto';
import { PhotoAlbumViewDto } from '../photo-album-dto/photo-album.view-dto';

@Injectable()
export class PhotoAlbumQueryRepository {
    constructor(
        @InjectModel(PhotoAlbum.name) private photoAlbumModel: PhotoAlbumModelType
    ) { }

    async findPhotoAlbumById(albumId: string): Promise<PhotoAlbumDocument | null> {
        return this.photoAlbumModel.findOne({
            _id: new Types.ObjectId(albumId),
            deletedAt: null,
        });
    }

    async findPhotoAlbumByIdOrNotFoundFailRepository(albumId: string): Promise<PhotoAlbumViewDto> {
        let photoAlbum
        if (!albumId || albumId === undefined || albumId === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            photoAlbum = await this.findPhotoAlbumById(albumId);
        }
        if (!photoAlbum) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return PhotoAlbumViewDto.mapToView(photoAlbum);
    }

    async getAllPhotoAlbumsQueryRepository(query: GetPhotoAlbumQueryParams, userId?: string): Promise<PaginatedViewDto<PhotoAlbumViewDto[]>> {
        // console.log('getAllPhotoAlbumsQueryRepository: query, userId 😡 ', query, userId)

        const normalizedQuery = GetPhotoAlbumQueryParams.normalize(query);
        // console.log('getAllPhotoAlbumsQueryRepository: normalizedQuery 😡 ', normalizedQuery)

        const filter: FilterQuery<PhotoAlbum> = {
            deletedAt: null,
        };

        if (userId) filter.userId = userId;

        // console.log('getAllPhotoAlbumsQueryRepository: base filter 😡 ', filter)

        if (normalizedQuery.searchPhotoAlbum) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                albumName: { $regex: normalizedQuery.searchPhotoAlbum, $options: 'i' },
            });
        }

        const photoAlbum = await this.photoAlbumModel.find(filter)
            .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection, _id: 1 })
            .skip(normalizedQuery.calculateSkip())
            .limit(normalizedQuery.pageSize);

        const totalCount = await this.photoAlbumModel.countDocuments(filter);

        const items = photoAlbum.map(PhotoAlbumViewDto.mapToView);

        // console.log('getAllPhotoAlbumsQueryRepository: RES items 😡 ', items)

        // items.reverse()

        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: normalizedQuery.pageNumber,
            size: normalizedQuery.pageSize,
        });
    }
}