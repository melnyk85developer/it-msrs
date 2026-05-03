import { Injectable } from "@nestjs/common";
import { Multer } from 'multer';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileParserService {
    async parseFile(file: Multer.File): Promise<string> {
        const extension = path.extname(file.originalname).toLowerCase();

        switch (extension) {
            case '.pdf':
                return this.parsePdf(file.buffer);
            case '.docx':
                return this.parseDocx(file.buffer);
            case '.txt':
            case '.js':
            case '.ts':
            case '.json':
            case '.md':
                return file.buffer.toString('utf-8');
            default:
                // Если формат неизвестен, пробуем прочитать как текст, 
                // чтобы не блокировать работу с новыми типами конфигов
                return file.buffer.toString('utf-8');
        }
    }

    private async parsePdf(buffer: Buffer): Promise<string> {
        const pdf = require('pdf-parse'); // Нужно будет установить: npm install pdf-parse
        const data = await pdf(buffer);
        return data.text;
    }

    private async parseDocx(buffer: Buffer): Promise<string> {
        const mammoth = require('mammoth'); // Нужно будет установить: npm install mammoth
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }
}