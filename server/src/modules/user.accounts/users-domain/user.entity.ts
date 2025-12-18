import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccountData, AccountDataSchema } from './account.data';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './roles-user.data';
import { UpdateUserDto } from '../users-dto/create-user.dto';
import { CreateUserDomainDto } from '../users-dto/create-user.domain.dto';
import { ProfileData, ProfileDataSchema } from './profile.data';
import { SystemUserData, SystemUserSchema } from './system-user.data';

@Schema({
    // _id: false,
    // timestamps: true, 
    toJSON: { virtuals: true }
})
export class User {
    @ApiProperty({ example: 'AccountData', description: 'Главные регистрационные данные пользователя в проекте.' })
    @Prop({ type: AccountDataSchema, required: true })
    accountData: AccountData;

    @ApiProperty({ example: 'ProfileData', description: 'Главные анкетные данные пользователя в проекте.' })
    @Prop({ type: ProfileDataSchema, required: true })
    profileData: ProfileData;

    @ApiProperty({ example: 'SystemUserData', description: 'Все главные системные данные пользователя в проекте.' })
    @Prop({ type: SystemUserSchema, required: true })
    systemUserData: SystemUserData;

    @ApiProperty({ example: 'passwordHash', description: 'Хешь пароля пользователя.' })
    @Prop({ type: String, required: true })
    passwordHash: string;

    @ApiProperty({ example: 'lastSeen', description: 'Последнее посещение пользователя.' })
    @Prop({ type: String, required: false })
    lastSeen: string;

    @ApiProperty({ example: 'createdAt', description: 'Число создания аккаунта.' })
    @Prop({ type: String, required: true })
    createdAt: string;

    @ApiProperty({ example: 'updatedAt', description: 'Число обновления аккаунта.' })
    @Prop({ type: String, required: false })
    updatedAt: string;

    @ApiProperty({ example: 'deletedAt', description: 'Число удаления  аккаунта.' })
    @Prop({ type: String, nullable: true })
    deletedAt: string | null;

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
            login: dto.login,
            email: dto.email,
        };
        user.profileData = {
            avatar: dto.avatar ? dto.avatar : null,
            name: dto.name ? dto.name : null,
            surname: dto.surname ? dto.surname : null,
            gender: null,
            liveIn: null,
            originallyFrom: null,
            status: null,
            imWorkingIn: null,
            lookingForAJob: null,
            lookingForAJobDescription: null,
            aboutMe: null,
            telephone: null,
            website: null
        };
        user.systemUserData = {
            isEmailConfirmed: false,
            isBanned: false,
            bannReason: null,
            isBot: dto.isBot,
            banneds: [],
            roles: [dto.role]
        }
        user.passwordHash = dto.passwordHash
        user.createdAt = createdAt
        user.updatedAt = createdAt
        user.lastSeen = createdAt
        user.deletedAt = null

        return user as UserDocument;
    }
    updateAccountData(id: string, dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>) {
        const date = new Date();
        const updatedAt = date.toISOString();

        if (this.id === id) {
            this.accountData.email = dto.email;
            this.accountData.login = dto.login;
            this.updatedAt = updatedAt;
            this.deletedAt = null;
        }
    }
    updateUserPassword(passwordHash: string, userId: string) {
        if (this.id === userId) {
            this.passwordHash = passwordHash;
        }
    }
    static async makeUpdatedConfirmedAccount(userId: string) {
        const user = new this();
        if (userId === user.id) {
            // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.accountData.deletedAt)
            if (user.systemUserData.isEmailConfirmed !== true) {
                user.systemUserData.isEmailConfirmed = true;
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
            }
        }
    }
    static async addRole(role: Role) {
        const user = new this();
        user.systemUserData.roles.push(role)
        return user as UserDocument;
    }
    static async updateLastSeen(userId: string) {
        const date = new Date();
        const user = new this();

        if (user.id === userId) {
            user.lastSeen = date.toISOString();
        }
    }
    makeDeletedAccount() {
        const date = new Date();
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 ', this.accountData.deletedAt)
        if (this.deletedAt !== null) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        // console.log('UsersService: deleteUserService - this.deletedAt 😡 PREV', this.accountData.deletedAt)
        this.deletedAt = date.toISOString();
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