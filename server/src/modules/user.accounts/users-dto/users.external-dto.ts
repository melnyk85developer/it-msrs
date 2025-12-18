import { UserDocument } from "src/modules/user.accounts/users-domain/user.entity";

export class UserExternalDto {
    id: string;
    login: string;
    email: string;
    createdAt: string;

    static mapToView(user: UserDocument): UserExternalDto {
        const dto = new UserExternalDto();

        dto.email = user.accountData.email;
        dto.login = user.accountData.login;
        dto.id = user._id.toString();
        dto.createdAt = user.createdAt;

        return dto;
    }
}