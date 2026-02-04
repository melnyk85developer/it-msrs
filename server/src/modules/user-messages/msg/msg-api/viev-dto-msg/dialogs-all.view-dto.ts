import { Dialog, DialogDocument } from "src/modules/user-messages/dialog/dialog-domain/dialog-entity";
import { MessageDocument } from "../../msg-domain/msg-entity";

export class DialogsAllViewDto {
    dialogId: string;
    userAId: string;
    userBId: string;
    createdAt: string;
    updatedAt: string;

    static mapToDialogsAllView(dialog: Dialog): DialogsAllViewDto {
        const dto = new DialogsAllViewDto();
        dto.dialogId = dialog.id.toString();
        dto.userAId = dialog.userAId;
        dto.userBId = dialog.userBId;
        dto.createdAt = dialog.createdAt;
        dto.updatedAt = dialog.updatedAt;

        return dto;
    }
}