import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateUserDto } from '../users-dto/create-user.dto';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { Sity, SitySchema } from './sity.schema';
import { Blog } from 'src/modules/bloggers-platform/blogs/blogs-domian/blog.entity';

@Schema({
    // timestamps: true, 
    toJSON: { virtuals: true }
})
export class User {

    @Prop({ type: String, required: true })
    login: string;

    @Prop({ type: String, required: true })
    passwordHash: string;

    @Prop({ type: String, min: 5, required: true })
    email: string;

    @Prop({ type: Boolean, required: true, default: false })
    isEmailConfirmed: boolean;

    @Prop({ type: String, required: true })
    createdAt: string;

    @Prop({ type: String, required: false })
    updatedAt: string;

    @Prop({ type: SitySchema })
    sity: Sity;

    blogs?: Blog[];

    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static createInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this();
        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;
        user.createdAt = dto.createdAt;
        user.updatedAt = dto.updatedAt;
        user.deletedAt = dto.deletedAt;
        user.isEmailConfirmed = false;

        // user.name = {
        //     firstName: 'firstName xxx',
        //     lastName: 'lastName yyy',
        // };

        return user as UserDocument;
    }
    update(dto: UpdateUserDto) {
        if (dto.email !== this.email) {
            this.isEmailConfirmed = false;
            this.email = dto.email;
            this.login = dto.login;
            this.updatedAt = dto.updatedAt;
            this.deletedAt = dto.deletedAt;
        }
    }
    makeDeleted() {
        const date = new Date();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.deletedAt)
        if (this.deletedAt !== null) {
            throw new Error('Пользователь удален! 😡😡😡');
        }
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 PREV', this.deletedAt)
        this.deletedAt = date.toISOString();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.deletedAt)
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);
// Подключает виртуально BlogSchema в UserSchema
UserSchema.virtual('blogs', {
    ref: 'Blog',
    localField: '_id',
    foreignField: 'blogId',
});

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;