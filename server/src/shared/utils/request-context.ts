import { AsyncLocalStorage } from 'async_hooks';
import type { Request, Response } from 'express';

type Store = { req?: Request; res?: Response };
const als = new AsyncLocalStorage<Store>();

export const RequestContext = {
    run: (req: Request, res: Response, next: () => void) => {
        als.run({ req, res }, next);
    },
    getRequest: (): Request | undefined => als.getStore()?.req,
    getResponse: (): Response | undefined => als.getStore()?.res,
};
