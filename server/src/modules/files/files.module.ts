import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileParserService } from './fileParserService';

@Module({
    providers: [FilesService, FileParserService],
    exports: [FilesService, FileParserService]
})
export class FilesModule { }
