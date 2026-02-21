import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { HTTP_STATUSES } from 'src/core/utils/utils';

@Controller('/testing')
export class TestingController {
    constructor(
        @InjectConnection() private readonly databaseConnection: Connection,
    ) { }

    @Delete('/all-data')
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    async deleteAll() {
        console.log('⏳ TestingController обнуляет DB...');
        const collections = await this.databaseConnection.listCollections();
        console.log('⏳ TestingController DB обнулена!');

        const promises = collections.map((collection) =>
            this.databaseConnection.collection(collection.name).deleteMany({}),
        );
        await Promise.all(promises);

        return {
            status: 'succeeded',
        };
    }
}