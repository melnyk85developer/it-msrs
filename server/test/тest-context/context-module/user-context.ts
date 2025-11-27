import { DomainExceptionCode } from "src/core/exceptions/domain-exception-codes";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { MeViewDto, UserViewDto } from "src/modules/user.accounts/users-dto/users.view-dto";
import { UsersRepository } from "src/modules/user.accounts/users-infrastructure/users.repository";

export class UserContextClass {
    public usersRepository: UsersRepository;

    public correctUserNames: string[]
    public correctUserSurNames: string[]
    public correctUserEmails: string[];
    public correctUserPasswords: string[];

    public createdUsers: (MeViewDto | null)[] = [];

    constructor() {
        this.createdUsers = [];
        this.correctUserNames = [
            'Maksym',
            'Viktor',
            'Nataly',
            'Aleksandra'
        ]
        this.correctUserSurNames = [
            'Melnyk'
        ]
        this.correctUserEmails = [
            'webmars1@example.com',
            'webmars2@example.com',
            'webmars3@example.com',
            'webmars4@example.com',
        ]
        this.correctUserPasswords = [
            'password',
            'qwerty',
            'vikram',
            'drowssap',
        ]
    }
    public async addUserStateTest({
        numUser,
        addUser
    }: {
        numUser: number;
        addUser: MeViewDto;
    }) {
        // 1. Если массив пустой
        if (!this.createdUsers.length) {
            this.createdUsers = [addUser];
            return;
        }
        // 2. Если индекс существует -> обновляем
        if (this.createdUsers.length > numUser) {
            this.createdUsers = this.createdUsers.map((user, index) =>
                index === numUser ? addUser : user
            );
            return;
        }
        // 3. Если индекса нет -> расширяем массив до нужного индекса
        this.createdUsers = [
            ...this.createdUsers,
            ...Array(numUser - this.createdUsers.length).fill(null),
            addUser,
        ];
    }
    public async deleteUserStateTest({
        numUser
    }: {
        numUser: number;
    }) {
        // 2. Если индекс существует -> обновляем
        if (this.createdUsers.length > numUser) {
            this.createdUsers = this.createdUsers.map((user, index) =>
                index === numUser ? null : user
            );
            return;
        }
    }
    public async deleteAllUsersStateTest() {
        this.createdUsers = []
    }
}