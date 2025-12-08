import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccountData, AccountDataSchema } from './account.data';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './roles-user.data';
import { Banneds } from './all-banneds-user.data';
import { UpdateUserDto } from '../users-dto/create-user.dto';
import { CreateUserDomainDto } from '../users-dto/create-user.domain.dto';

@Schema({
    // _id: false,
    // timestamps: true, 
    toJSON: { virtuals: true }
})
export class User {
    @ApiProperty({ example: 'AccountData', description: 'Главние анкетные данные пользователя в проекте.' })
    @Prop({ type: AccountDataSchema, required: true })
    accountData: AccountData;

    @ApiProperty({ example: 'Roles', description: 'Роль или несколько ролей и полномочий пользователя в проекте.' })
    @Prop({ type: [Role], required: false })
    roles: Role[]

    @ApiProperty({ example: 'isBanned', description: 'Является ли заблокированным в данный момент?' })
    @Prop({ type: Boolean, required: false })
    isBanned: boolean;

    @ApiProperty({ example: 'bannReason', description: 'Причина блокировки!' })
    @Prop({ type: String, required: false })
    bannReason: string | null;

    @ApiProperty({ example: 'Blockages', description: 'Блокировки пользователя в проекте.' })
    @Prop({ type: [Banneds], required: false })
    banneds: Banneds[]

    get id() {
        // @ts-ignore
        return this._id.toString();
    }

    static async createUserInstance(dto: Omit<CreateUserDomainDto, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<UserDocument> {
        const user = new this();
        const date = new Date();
        const createdAt = date.toISOString();
        // console.log('UserEntity: createInstance - user 😡 ', user)
        user.accountData = {
            userName: dto.login,
            email: dto.email,
            passwordHash: dto.passwordHash,
            createdAt: createdAt,
            updatedAt: createdAt,
            lastSeen: createdAt,
            deletedAt: null,
            isEmailConfirmed: false,
        };
        user.roles.push(dto.role)
        user.isBanned = false;
        user.bannReason = null;
        return user as UserDocument;
    }
    updateAccountData(id: string, dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>) {
        const date = new Date();
        const updatedAt = date.toISOString();

        if (this.id === id) {
            this.accountData.email = dto.email;
            this.accountData.userName = dto.login;
            this.accountData.updatedAt = updatedAt;
            this.accountData.deletedAt = null;
        }
    }
    updateUserPassword(passwordHash: string, userId: string) {
        if (this.id === userId) {
            this.accountData.passwordHash = passwordHash;
        }
    }
    static async makeUpdatedConfirmedAccount(userId: string) {
        const user = new this();
        if (userId === user.id) {
            // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.accountData.deletedAt)
            if (user.accountData.isEmailConfirmed !== true) {
                user.accountData.isEmailConfirmed = true;
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
            }
        }
    }
    // setConfirmationCode(code: string) {
    //     this.confirmations.push({
    //         confirmationCode: code,
    //         expirationDate: add(new Date(), {
    //             // hours: 1,
    //             minutes: 3
    //         }),
    //         isBlocked: true,
    //         field: 'registration'
    //     })
    // }
    static async addRole(role: Role) {
        const user = new this();
        user.roles.push(role)
        return user as UserDocument;
    }
    static async updateLastSeen(userId: string) {
        const date = new Date();
        const user = new this();

        if (user.id === userId) {
            user.accountData.lastSeen = date.toISOString();
        }
    }
    makeDeletedAccount() {
        const date = new Date();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.accountData.deletedAt)
        if (this.accountData.deletedAt !== null) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 PREV', this.accountData.deletedAt)
        this.accountData.deletedAt = date.toISOString();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.accountData.deletedAt)
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