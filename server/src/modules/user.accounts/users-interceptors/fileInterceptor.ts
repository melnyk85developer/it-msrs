import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as path from 'path';
import { Request } from 'express';
import { AdminService } from 'src/modules/notifications/service/adminSrvice/adminSrvice';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';

@Injectable()
export class ValidateFtpFileInterceptor implements NestInterceptor {
    constructor(private readonly adminService: AdminService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest<Request>();
        const folder = String(req.params.folder)
        const fileName = String(req.query.fileName)

        console.log('ValidateFtpFileInterceptor: fileName, folder 😡 ', fileName, folder)

        if (!folder || !fileName) {
            console.log('ValidateFtpFileInterceptor: - fileName, folder 😡', fileName, folder)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }

        // Проверка разрешённых папок через сервис
        if (!this.adminService['allowedFolders']?.includes(folder)) {
            console.log('ValidateFtpFileInterceptor: - fileName, folder 😡', fileName, folder)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }

        let safeFileName: string;
        try {
            const decoded = decodeURIComponent(String(fileName));
            safeFileName = path.basename(decoded);
        } catch {
            console.log('ValidateFtpFileInterceptor: - fileName, folder 😡 Invalid fileName encoding ', fileName, folder)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }

        if (!safeFileName || !/\.(jpg|jpeg|png|webp|gif)$/i.test(safeFileName)) {
            console.log('ValidateFtpFileInterceptor: - fileName, folder 😡 Invalid or unsupported file name ', fileName, folder)
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST)
        }

        const filePath = await this.adminService.getFtpFileByFolderAndName(folder, fileName);
        if (!filePath) {
            console.log('ValidateFtpFileInterceptor: - fileName, folder 😡 File not found ', fileName, folder)
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
        }

        // Пробрасываем данные в контроллер
        (req as any).filePath = filePath;
        (req as any).safeFileName = safeFileName;

        return next.handle();
    }
}
