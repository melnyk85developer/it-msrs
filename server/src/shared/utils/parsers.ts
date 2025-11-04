import { UAParser } from 'ua-parser-js';

const geoip = require('geoip-lite');

export const parser = (ip: string, userAgent: any) => {
    const parser = new UAParser(userAgent);
    const geo = geoip.lookup(ip);
    const uaResult = parser.getResult();

    return {
        browserName: uaResult.browser.name ? uaResult.browser.name : undefined,
        browserVersion: uaResult.browser.version ? uaResult.browser.version : undefined,
        osName: uaResult.os.name ? uaResult.os.name : undefined,
        osVersion: uaResult.os.version ? uaResult.os.version : undefined,
        country: geo && geo.country ? geo.country : undefined,
        city: geo && geo.city ? geo.city : undefined
    }
}