import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';

export enum FileType {
    AUDIO = 'music',
    IMAGE = 'post-images',
    AVATAR = 'avatars',
    MESSAGE = 'message-files',
    SHOP = 'shop'
}

@Injectable()
export class FilesService {
    private getStaticPath(...segments: string[]): string {
        return path.resolve(process.cwd(), 'static', ...segments);
    }

    private generateAvailableFileName(dir: string, originalName: string): string {
        const ext = path.extname(originalName); // .jpg
        const base = path.basename(originalName, ext); // file
        let filename = originalName;
        let counter = 1;

        while (fs.existsSync(path.join(dir, filename))) {
            filename = `${base}(${counter})${ext}`;
            counter++;
        }

        return filename;
    }

    async createFile(type: FileType, file: { originalname: string; buffer: Buffer }): Promise<string> {
        // console.log('FilesService: createFile - file 👽 😡 👽', file)
        // console.log('FilesService: createFile - originalname 👽😡👽', file.originalname)

        try {
            const filePath = this.getStaticPath(type);
            // console.log('FilesService: createFile - filePath 👽 😡 👽', filePath)

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            // console.log('FilesService: createFile - filePath, file.originalname 👽👽😡👽👽', filePath, file.originalname)

            const fileName = this.generateAvailableFileName(filePath, file.originalname);
            // console.log('FilesService: createFile - fileName 👽 😡 👽', fileName)

            fs.writeFileSync(path.join(filePath, fileName), file.buffer);

            return `${type}/${fileName}`;
        } catch (error) {
            console.error(error);
            throw new DomainException(
                INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_RECORDING_FILES,
                ` - createFile(${type}): ${error}`,
            );
        }
    }

    async createPostFile(file: { originalname: string; buffer: Buffer }): Promise<string> {
        return this.createFile(FileType.IMAGE, file);
    }

    async createMusicFile(file: { originalname: string; buffer: Buffer }): Promise<string> {
        return this.createFile(FileType.AUDIO, file);
    }

    async createAvatarFile(file: { originalname: string; buffer: Buffer }): Promise<string> {
        return this.createFile(FileType.AVATAR, file);
    }

    async createMessageFile(file: { originalname: string; buffer: Buffer }): Promise<string> {
        return this.createFile(FileType.MESSAGE, file);
    }

    async createShopFile(file: { originalname: string; buffer: Buffer }): Promise<string> {
        return this.createFile(FileType.SHOP, file);
    }
}
