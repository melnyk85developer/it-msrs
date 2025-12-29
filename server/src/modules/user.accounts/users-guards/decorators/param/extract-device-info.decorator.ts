import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as uuid from 'uuid';

export interface DeviceInfo {
    ip: string;
    title: string;
    refreshToken: string;
}

export const ExtractDeviceInfo = createParamDecorator(
    (data: unknown, context: ExecutionContext): DeviceInfo => {
        const request = context.switchToHttp().getRequest();

        // 1. Извлечение IP
        const ip = request.ip
            ? request.ip
            : `There's no ip address on the darknet`;

        // 2. Извлечение User-Agent
        const userAgentHeader = request.headers['user-agent'];
        const title = userAgentHeader
            ? userAgentHeader
            : `device unknown='${uuid.v4()}'`;

        // 3. Извлечение старого Refresh Token из куки
        const rawToken = request.cookies?.['refreshToken'];

        const refreshToken = (!rawToken || rawToken === 'null' || rawToken === 'undefined')
            ? undefined
            : rawToken;

        // console.log('ExtractDeviceInfo: refreshToken - 👽👽👽', refreshToken)
        return { ip, title, refreshToken };
    },
);