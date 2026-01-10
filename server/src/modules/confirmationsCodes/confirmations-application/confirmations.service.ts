import { Injectable } from '@nestjs/common';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Confirmation, ConfirmationDocument, type ConfirmationModelType } from '../confirmations-domain/confirmation-entity';
import { ConfDto, UodateConfDto } from '../dto/confDto';

export type ParseDeviceNameType = {
    osName: string | null;
    osVersion: string | null;
    browserName: string | null;
    browserVersion: string | null;
    device: string | null;
    country: string | null;
    city: string | null;
}

@Injectable()
export class ConfirmationsCodesService {
    constructor(
        @InjectModel(Confirmation.name) private ConfirmationModel: ConfirmationModelType,
        private confirmationRepository: ConfirmationRepository,
    ) { }
    async createConfirmationsCodesService(dto: ConfDto): Promise<Confirmation> {
        // console.log('ConfirmationsCodesService: - dto 😡 ', dto)
        const confirmation = await this.ConfirmationModel.createConfirmationInstance({
            confirmationCode: dto.confirmationCode,
            isBlocked: dto.isBlocked,
            isCooldown: dto.isCooldown,
            add: dto.add,
            minutes: dto.minutes,
            field: dto.field,
            userId: dto.userId
        });
        // console.log('ConfirmationsCodesService: - confirmation 😡 ', confirmation)
        await this.confirmationRepository.saveConfirmation(confirmation);
        // console.log('ConfirmationsCodesService: - saveConfirmation 😡 ', confirmation)
        return confirmation;
    }
    async updateConfirmationCodesService(confirmationId: string, dto: UodateConfDto): Promise<Confirmation | null> {
        const confirmation = await this.confirmationRepository.findByCodeConfirmationRepository(
            confirmationId
        )
        if (confirmation) {
            confirmation.updateConfirmationDate(
                {
                    id: confirmationId,
                    confirmationCode: dto.confirmationCode,
                    isBlocked: dto.isBlocked,
                    isCooldown: dto.isCooldown,
                    add: dto.add,
                    minutes: dto.minutes,
                    field: dto.field,
                    userId: dto.userId
                }
            )

        }
        await this.confirmationRepository.saveConfirmation(confirmation as ConfirmationDocument)
        return confirmation
    }
    async findAllConfirmationsCodesByUserIdRepository(userId: string): Promise<Confirmation[]> {
        return this.confirmationRepository.findAllConfirmationsCodesByUserIdRepository(userId)
    }
    async findByCodeConfirmationCodesService(confirmationCode: string): Promise<Confirmation | null> {
        return this.confirmationRepository.findByCodeConfirmationRepository(confirmationCode)
    }
}