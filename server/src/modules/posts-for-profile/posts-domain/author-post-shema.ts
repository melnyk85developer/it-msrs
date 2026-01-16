import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model } from "mongoose";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { CreatePostForProfileDomainDto } from "../posts-dto/posts.dto";
import { UpdatePostForProfileDto } from "../posts-for-profile-api/posts-for-profile-input-dto/posts-update.input-dto";

@Schema({
    _id: false,
    // timestamps: true,
    toJSON: { virtuals: true, versionKey: false }
})
export class AuthorPost {
    @ApiProperty({ example: 'avatar', description: 'avatar пользователя.' })
    @Prop({ type: String, nullable: true })
    avatar: string | null;;

    @ApiProperty({ example: 'name', description: 'name пользователя.' })
    @Prop({ type: String, required: true }) // unique: true
    name: string;

    @ApiProperty({ example: 'surname', description: 'surname пользователя.' })
    @Prop({ type: String, required: true }) // unique: true
    surname: string;
}
export const AuthorPostSchema = SchemaFactory.createForClass(AuthorPost);