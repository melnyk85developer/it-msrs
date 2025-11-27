import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreateTokenDomainDto, UpdateTokenDto } from "./dto/add-token-black-list.domain.dto";

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true, versionKey: false }
})
export class Token {
    @ApiProperty({ example: 'token123', description: 'Уникальный идентификатор пользователя!' })
    @Prop({ type: String, required: false })
    userId: string;

    @ApiProperty({ example: 'refreshToken', description: 'refreshToken' })
    @Prop({ type: String, required: false })
    refreshToken: string;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createTokenInstance(dto: CreateTokenDomainDto): TokenDocument {
        // console.log('TokenEntity: createTokenInstance - dto 😡 ', dto)
        const token = new this();

        token.userId = dto.userId;
        token.refreshToken = dto.refreshToken;

        // token.createdAt = new Date().toISOString();
        // token.updatedAt = new Date().toISOString();
        // token.deletedAt = null;

        // console.log('TokenEntity: createInstance - token 😡 ', token)
        return token as TokenDocument;
    }
    update(dto: UpdateTokenDto) {
        if (dto.userId !== this.userId) {
            this.userId = dto.userId;
            this.refreshToken = dto.refreshToken;

            // this.updatedAt = new Date().toISOString();
            // this.deletedAt = null
        }
    }
}
export const TokenSchema = SchemaFactory.createForClass(Token);
//регистрирует методы сущности в схеме
TokenSchema.loadClass(Token);
// Подключает виртуально BlogSchema в UserSchema
TokenSchema.virtual('blogs', {
    ref: 'Blog',
    localField: '_id',
    foreignField: 'blogId',
});
//Типизация документа
export type TokenDocument = HydratedDocument<Token>;
//Типизация модели + статические методы
export type TokenModelType = Model<TokenDocument> & typeof Token;