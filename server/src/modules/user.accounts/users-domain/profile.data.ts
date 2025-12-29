import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const loginConstraints = {
    minLength: 3,
    maxLength: 10,
};

export const passwordConstraints = {
    minLength: 6,
    maxLength: 20,
};

export const emailConstraints = {
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};
@Schema({
    _id: false,
})
export class ProfileData {
    @ApiProperty({ example: 'Avatar', description: 'Фотография пользователя или картинка' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    avatar: string | null

    @ApiProperty({ example: 'name', description: 'Имя пользователя.' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    name: string | null;

    @ApiProperty({ example: 'surname', description: 'Фамилия пользователя или псевдоним' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    surname: string | null;

    @ApiProperty({ example: 'Мужской', description: 'Пол' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    gender: string | null;

    @ApiProperty({ example: 'Проживаю в', description: 'Маёрка' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    liveIn: string | null;

    @ApiProperty({ example: 'Родом из', description: 'Новая Каховка' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    originallyFrom: string | null;

    @ApiProperty({ example: 'Статус', description: 'Всё сложно' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    status: string | null;

    @ApiProperty({ example: 'Работаю в', description: 'IT Компания ...' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    imWorkingIn: string | null;

    @ApiProperty({ example: 'Ищу работу', description: 'Да или нет' })
    @Prop({ type: Boolean, required: false, nullable: true }) // unique: true
    lookingForAJob: boolean | null;

    @ApiProperty({ example: 'Мои профессиональные навыки', description: 'React, Redux, TypeScript ...' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    lookingForAJobDescription: string | null;

    @ApiProperty({ example: 'Обо мне', description: 'Обожаю IT' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    aboutMe: string | null;

    @ApiProperty({ example: 'Мой номер телефона', description: '+38 999 99 99' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    telephone: string | null;

    @ApiProperty({ example: 'Мой вебсайт', description: 'webmars.net' })
    @Prop({ type: String, required: false, nullable: true }) // unique: true
    website: string | null;
}

export const ProfileDataSchema = SchemaFactory.createForClass(ProfileData);