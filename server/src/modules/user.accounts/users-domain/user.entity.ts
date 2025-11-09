import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateUserDto } from '../users-dto/create-user.dto';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { AccountData, AccountDataSchema } from './account.data';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import { add } from "date-fns";
import { Confirmation, ConfirmationSchema } from 'src/modules/confirmation/confirmation-domain/confirmation.entity';

@Schema({
    // _id: false,
    // timestamps: true, 
    toJSON: { virtuals: true }
})
export class User {
    @Prop({ type: AccountDataSchema, required: true })
    accountData: AccountData;

    @Prop({ type: [ConfirmationSchema], required: false, default: [] })
    confirmations: Confirmation[];

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static async createUserInstance(dto: Omit<CreateUserDomainDto, 'passwordHash' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<UserDocument> {
        const user = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // TODO Вынести в отдельный Injectable сервис 
        const passwordHash = await bcrypt.hash(dto.password, 10);

        // console.log('UserEntity: createInstance - user 😡 ', user)

        user.accountData = {
            userName: dto.login,
            email: dto.email,
            passwordHash: passwordHash,
            createdAt: createdAt,
            updatedAt: createdAt,
            deletedAt: null,
            isEmailConfirmed: false,
        };
        return user as UserDocument;
    }
    update(dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>) {
        const date = new Date();
        const updatedAt = date.toISOString();

        if (dto.email !== this.accountData.email) {
            this.accountData.isEmailConfirmed = false;
            this.accountData.email = dto.email;
            this.accountData.userName = dto.login;
            this.accountData.updatedAt = updatedAt;
            this.accountData.deletedAt = null;
        }
    }
    makeDeleted() {
        const date = new Date();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.deletedAt)
        if (this.accountData.deletedAt !== null) {
            throw new Error('Пользователь удален! 😡😡😡');
        }
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 PREV', this.deletedAt)
        this.accountData.deletedAt = date.toISOString();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.deletedAt)
    }
    setConfirmationCode(code: string) {
        this.confirmations.push({
            confirmationCode: code,
            expirationDate: add(new Date(), {
                // hours: 1,
                minutes: 3
            }),
            isBlocked: true,
            field: 'registration'
        })
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