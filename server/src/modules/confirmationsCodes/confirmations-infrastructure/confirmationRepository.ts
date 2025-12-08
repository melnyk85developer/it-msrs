import { Injectable } from '@nestjs/common';
import { Confirmation, ConfirmationDocument, type ConfirmationModelType } from '../confirmations-domain/confirmation-entity';
import { ConfDto } from '../dto/confDto';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongoose';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';

@Injectable()
export class ConfirmationRepository {
    constructor(
        @InjectModel(Confirmation.name) private ConfirmationModel: ConfirmationModelType,
    ) { }
    async saveConfirmation(confirmation: ConfirmationDocument) {
        await confirmation.save();
    }
    async findConfirmationById(id: string): Promise<ConfirmationDocument | null> {
        return this.ConfirmationModel.findOne({
            _id: id,
            // deletedAt: null,
        });
    }
    async findConfirmationByIdOrNotFoundFail(id: string): Promise<ConfirmationDocument> {
        const user = await this.findConfirmationById(id);
        if (!user) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_CONFIRMATION_CODE)
        }

        return user;
    }
    async findByCodeConfirmationRepository(confirmationCode: string): Promise<Confirmation | null> {
        return await this.ConfirmationModel.findOne(
            {
                confirmationCode: confirmationCode
            }
        )
    }
    async findAllConfirmationsCodesByUserIdRepository(userId: string): Promise<Confirmation[]> {
        return await this.ConfirmationModel.find(
            {
                userId: userId
            }
        )
    }
    async deleteConfirmationUserIdRepository(userId: number): Promise<DeleteResult> {
        return await this.ConfirmationModel.deleteOne({
            userId: userId,
        })
    }
    async deleteConfirmationIdRepository(id: number): Promise<DeleteResult> {
        return await this.ConfirmationModel.deleteOne({
            id: id
        })
    }
}
