import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccountData, AccountDataSchema } from './account.data';
import { add } from "date-fns";
import { Confirmation, ConfirmationSchema } from 'src/modules/user.accounts/users-domain/confirmation.entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './roles-user.data';
import { Banneds } from './all-banneds-user.data';
import { CreateSessionDomainDto, UpdateSessionDto } from 'src/modules/usersSessions/sessions-dto/create-sessions.domain.dto';
import { Session } from 'src/modules/usersSessions/sessions-domain/sessions.entity';
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

    // @ApiProperty({ example: 'Devices', description: 'Устройства пользователя с которых осуществлен вход!.' })
    // @Prop({ type: [Session], required: false, default: [] })
    // devices: Session[];

    @ApiProperty({ example: 'isBanned', description: 'Является ли заблокированным в данный момент?' })
    @Prop({ type: Boolean, required: false })
    isBanned: boolean;

    @ApiProperty({ example: 'bannReason', description: 'Причина блокировки!' })
    @Prop({ type: String, required: false })
    bannReason: string | null;

    @ApiProperty({ example: 'Blockages', description: 'Блокировки пользователя в проекте.' })
    @Prop({ type: [Banneds], required: false })
    banneds: Banneds[]

    // @Prop({ type: [ConfirmationSchema], required: false, default: [] })
    // confirmations: Confirmation[];

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
    static async addRole(role: Role) {
        const user = new this();
        user.roles.push(role)
        return user as UserDocument;
    }
    updateAccountData(dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>) {
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
    static async updateLastSeen(userId) {
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