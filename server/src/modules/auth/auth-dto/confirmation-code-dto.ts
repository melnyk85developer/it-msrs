import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "src/core/decorators/transform/trim";

export class ConfirmationCodeDto {
    @ApiProperty({ example: '0865ef49-83b9-4b80-82b3-b051d4d35c8e', description: 'Код подтверждения/активации!' })
    @IsString({ message: 'confirmationCode должен быть строкой!' })
    @IsNotEmpty({ message: 'Поле confirmationCode не должно быть пустым!' })
    readonly code: string;
}
