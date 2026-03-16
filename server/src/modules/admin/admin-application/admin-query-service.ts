import { Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AdminService {
    private readonly allowedFolders = ['avatars', 'post-images', 'gallery'];

    private resolveFolderPath(folder: string): string | null {
        if (!this.allowedFolders.includes(folder)) return null;
        return path.resolve(process.cwd(), 'static', 'ftp', folder);
    }

    async getFtpFilesByFolder(folder: string): Promise<string[]> {
        const dir = this.resolveFolderPath(folder);
        if (!dir) return [];

        try {
            const files = await fs.readdir(dir);
            return files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        } catch {
            return [];
        }
    }

    async getFtpFileByFolderAndName(folder: string, fileName: string): Promise<string | null> {
        // console.log('AdminService: getFtpFileByFolderAndName: folder, fileName', folder, fileName)
        const dir = this.resolveFolderPath(folder);
        if (!dir) return null;
        // убираем decodeURIComponent
        const safeName = path.basename(fileName);
        const filePath = path.resolve(dir, safeName);
        // console.log('AdminService: getFtpFileByFolderAndName: safeName, filePath', safeName, filePath)
        try {
            const stat = await fs.stat(filePath);
            // console.log('AdminService: getFtpFileByFolderAndName: stat', stat)
            if (stat.isFile() && filePath.startsWith(dir + path.sep)) {
                // console.log('AdminService: getFtpFileByFolderAndName: if (stat.isFile() && filePath.startsWith(dir + path.sep))', filePath)
                return filePath;
            }
            return null
        } catch(error) {
            // console.error('AdminService: getFtpFileByFolderAndName: catch(error)', error)
            return null;
        }
    }

    getMimeType(fileName: string): string {
        return mime.lookup(fileName) || 'application/octet-stream';
    }
}
