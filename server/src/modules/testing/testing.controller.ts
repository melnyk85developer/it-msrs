import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('/testing')
export class TestingController {
    constructor(
        @InjectConnection() private readonly databaseConnection: Connection,
    ) { }

    @Delete('/all-data')
    @HttpCode(HttpStatus.NO_CONTENT)
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