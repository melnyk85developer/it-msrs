import { DomainExceptionCode } from "../domain-exception-codes";
import { Extension } from "../domain-exceptions";

export type ErrorResponseBody = {
    // timestamp: string;
    // path: string | null;
    // message: string;
    errorsMessages: Extension[];
    // code: DomainExceptionCode;
    // field?: string;
};