import { UserDocument } from "src/modules/user.accounts/users-domian/user.entity";

export class UserExternalDto {
    id: string;
    login: string;
    email: string;
    createdAt: string;

    static mapToView(user: UserDocument): UserExternalDto {
        const dto = new UserExternalDto();

        dto.email = user.email;
        dto.login = user.login;
        dto.id = user._id.toString();
        dto.createdAt = user.createdAt;

        return dto;
    }
}