import { Injectable } from '@nestjs/common';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { DomainException } from '../exceptions/domain-exceptions';
import { INTERNAL_STATUS_CODE } from './utils';

@Injectable()
export class IsBlockedEmailResendingService {
    constructor(
        private confirmationsCodesService: ConfirmationsCodesService,
        private confirmationRepository: ConfirmationRepository,
    ) { }

    // ДОБАВЛЕНЫ ПАРАМЕТРЫ: blockMinutes, cooldownMinutes, windowMinutes, maxRequests
    async isBlockedResending({
        getUser,
        field,
        date,
        confirmationCode,
        blockMinutes,    // например: 40
        cooldownMinutes, // например: 3
        windowMinutes,   // например: 18
        maxRequests      // например: 5
    }) {
        // console.log('IsBlockedEmailResendingService: - getUser 😡😡😡', getUser)

        if (!getUser) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER);
        }

        const confirmation = await this.confirmationsCodesService.findAllConfirmationsCodesByUserIdRepository(getUser.id);
        const all = confirmation.filter((i) => i.field === field);
        const block = all.filter(c => c.isBlocked === true);
        const cooldown = all.filter(c => c.isCooldown === true);
        const active = all.filter(c => c.isBlocked === false);

        if (all) {
            await this._checkBlockStatus(block, date);
            await this._checkCooldownStatus(cooldown, date);
            this._checkActiveCodes(active, date);

            // Прокидываем новые параметры в проверку лимитов
            await this._checkRateLimit(
                active,
                cooldown,
                field,
                getUser,
                confirmationCode,
                blockMinutes,
                windowMinutes,
                maxRequests
            );
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_CONFIRMATION_CODE)
        }
    }

    // --- ПРИВАТНЫЕ МЕТОДЫ ---

    private async _checkBlockStatus(block: any[], date: string): Promise<void> {
        // console.log('ressetPasswordService blocked length: ', block.length)
        if (block.length > 0) {
            for (let i = 0; block.length > i; i++) {
                const confirmation = block[i]
                if (date < confirmation.expirationDate) {
                    // console.log('ressetPasswordService blocked length: ', block.length)
                    throw new DomainException(
                        INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED,
                        `⛔️ Функция отпрвки сообщения на E-Mail временно заблокирована в связи с частыми запросами! ${confirmation.expirationDate}`
                    )
                } else {
                    const deleteBlock = block[i]
                    const confirm = await this.confirmationRepository.findConfirmationByIdOrNotFoundFail(deleteBlock.id);
                    confirm.updateBlocked(deleteBlock.id, false)
                    await this.confirmationRepository.saveConfirmation(confirm);
                }
            }
        }
    }

    private async _checkCooldownStatus(cooldown: any[], date: string): Promise<void> {
        if (cooldown.length) {
            for (let i = 0; cooldown.length > i; i++) {
                const confirmation = cooldown[i]
                if (date < confirmation.expirationDate) {
                    // console.log('ressetPasswordService cooldown.length: ', cooldown.length)
                    throw new DomainException(
                        INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET,
                        `⛔️ Время еще не истекло до следующего запроса! ${confirmation.expirationDate}`
                    )
                } else {
                    const deleteCooldown = cooldown[i]
                    const confirm = await this.confirmationRepository.findConfirmationByIdOrNotFoundFail(deleteCooldown.id);
                    confirm.updateBlocked(deleteCooldown.id, false)
                    await this.confirmationRepository.saveConfirmation(confirm);
                }
            }
        }
    }

    private _checkActiveCodes(active: any[], date: string): void {
        if (active) {
            for (let i = 0; active.length > i; i++) {
                if (date < active[i].expirationDate) {
                    // console.log('ressetPasswordService _checkActiveCodes: ', active[i].expirationDate)
                    throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET, `${active[i].expirationDate}`)
                }
            }
        }
    }

    private async _checkRateLimit(
        active: any[],
        cooldown: any[],
        field: string,
        getUser: any,
        confirmationCode: string,
        blockMinutes: number,   // Параметр: на сколько блокировать (40)
        windowMinutes: number,  // Параметр: окно времени (18)
        maxRequests: number     // Параметр: лимит запросов (5)
    ): Promise<void> {

        // Тут 3 - это просто проверка, есть ли смысл фильтровать дальше, можно оставить хардкод или заменить на maxRequests - 2, но лучше не трогать логику "если мало запросов - не паримся"
        if (active.length > 3) {
            // console.log('UsersService ressetPasswordService: - ⛔️⛔️ Блокировка сброса пароля', active.length)

            // Используем windowMinutes вместо хардкода 18
            const timeWindowAgo = Date.now() - windowMinutes * 60 * 1000;

            const confirTime = active.filter((i) => {
                const expirationDate = new Date(i.expirationDate).getTime();
                return expirationDate > timeWindowAgo;
            })

            // Используем maxRequests вместо хардкода 5
            if (confirTime.length >= maxRequests) {
                // console.log('UsersService ressetPasswordService: - ⛔️⛔️⛔️ Блокировка!', confirTime.length);

                for (let i = 0; cooldown.length > i; i++) {
                    await this.confirmationRepository.deleteConfirmationIdRepository(cooldown[i].id);
                }

                // Используем blockMinutes вместо хардкода 40
                const expirationDate = await this.confirmationsCodesService.createConfirmationsCodesService({
                    confirmationCode: confirmationCode,
                    isBlocked: true,
                    isCooldown: false,
                    add: new Date().toISOString(),
                    minutes: blockMinutes, // <-- СЮДА ВСТАВЛЯЕТСЯ ПАРАМЕТР
                    field: field,
                    userId: getUser.id,
                })

                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER, `⛔️ Слишком много запросов за последнее время, Вам последнее предупреждение! ${expirationDate.expirationDate}`)
            }
        }
    }
}