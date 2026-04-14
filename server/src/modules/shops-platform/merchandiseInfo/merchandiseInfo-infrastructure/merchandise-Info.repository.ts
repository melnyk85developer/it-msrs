import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { MerchandiseInfo, MerchandiseInfoDocument, type MerchandiseInfoModelType } from '../merchandiseInfo-domain/merchandise-Info-entity';

@Injectable()
export class MerchandiseInfoRepository {
    constructor(
        @InjectModel(MerchandiseInfo.name) private photoAlbumModel: MerchandiseInfoModelType
    ) { }
    async save(info: MerchandiseInfoDocument) {
        await info.save();
    }
    async findMerchandiseInfoById(infoId: string): Promise<MerchandiseInfoDocument | null> {
        return this.photoAlbumModel.findOne({
            _id: new Types.ObjectId(infoId),
            deletedAt: null,
        });
    }
    async findMerchandiseInfoByIdOrNotFoundFailRepository(infoId: string): Promise<MerchandiseInfoDocument> {
        let info
        if (!infoId || infoId === undefined || infoId === 'undefined') {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - IF albumId 😡😡😡 typeof', albumId, typeof albumId)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('PhotoAlbumRepository: findBlogOrNotFoundFailBlogsRepository - ELSE albumId 😡😡😡 typeof', albumId, typeof albumId)
            info = await this.findMerchandiseInfoById(infoId);
        }
        if (!info) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_ALBUM_NAME);
        }
        return info;
    }
    async deleteMerchandiseInfo(infoId: string): Promise<any> {
        return this.photoAlbumModel.deleteOne({
            _id: new Types.ObjectId(infoId),
        });
    }
}