import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { GlobalRateLimit, GlobalRateLimitDocument, type GlobalRateLimitModelType } from '../request-limit-domain/request-limit.entity';
import { FilterQuery } from 'mongoose';

@Injectable()
export class GlobalRateLimitRepository {
    constructor(
        @InjectModel(GlobalRateLimit.name) private GlobalRateLimitModel: GlobalRateLimitModelType
    ) { }
    async saveLimit(limit: GlobalRateLimitDocument) {
        // console.log('GlobalRateLimitRepository: save() - limit 😡 ', limit)
        await limit.save();
    }
    async findGlobalRateLimitById(id: string): Promise<GlobalRateLimitDocument | null> {
        return this.GlobalRateLimitModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }
    async findGlobalRateLimitByIdOrNotFoundFail(id: string): Promise<GlobalRateLimitDocument> {
        const limit = await this.findGlobalRateLimitById(id);
        if (!limit) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
        }
        return limit;
    }
    async findCountDocuments(filter: FilterQuery<GlobalRateLimitDocument>): Promise<number> {
        return this.GlobalRateLimitModel.countDocuments(filter);
    }
}