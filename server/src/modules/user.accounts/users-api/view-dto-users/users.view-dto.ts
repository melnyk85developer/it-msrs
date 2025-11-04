import { UserDocument } from "../../users-domian/user.entity";

export class UserViewDto {
    id: string;
    login: string;
    email: string;
    createdAt: string;

    static mapToView(user: UserDocument): UserViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new UserViewDto();
        
        dto.id = user._id.toString();
        dto.email = user.email;
        dto.login = user.login;
        dto.createdAt = user.createdAt;

        // console.log('UsersController: mapToView - dto 😡 ', dto)

        return dto;
    }
}