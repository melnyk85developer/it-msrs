import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Token, TokenDocument, type TokenModelType } from './token-entity';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';

@Injectable()
export class TokenRepository {
    constructor(
        @InjectModel(Token.name) private TokenModel: TokenModelType
    ) { }

    async findTokenById(id: string): Promise<TokenDocument | null> {
        return this.TokenModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null,
        });
    }
    async findTokenByToken(token: string): Promise<TokenDocument | null> {
        return this.TokenModel.findOne({
            token: token,
        });
    }

    async save(token: TokenDocument) {
        await token.save();
    }

    async findTokenByIdOrNotFoundFailRepository(id: string): Promise<TokenDocument> {
        let token
        if (!id || id === undefined || id === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'id сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            token = await this.findTokenById(id);
        }
        if (!token) {
            throw new DomainException(INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID);
        }
        return token;
    }

    async findTokenByTokenOrNotFoundFailRepository(token: string): Promise<TokenDocument> {
        let isToken
        if (!token || token === undefined || token === 'undefined') {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - IF id 😡😡😡 typeof', id, typeof id)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, 'token сука говняный 😡😡😡😡😡😡');
        } else {
            // console.log('BlogsRepository: findBlogOrNotFoundFailBlogsRepository - ELSE id 😡😡😡 typeof', id, typeof id)
            isToken = await this.findTokenByToken(token);
        }
        if (!isToken) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND);
        }
        return isToken;
    }

    async deleteTokenInBlackList(token: string): Promise<any> {
        return this.TokenModel.deleteOne({
            token: token,
        });
    }
}