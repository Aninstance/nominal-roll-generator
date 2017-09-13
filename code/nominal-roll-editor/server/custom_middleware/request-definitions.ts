import { Request } from 'express';
/*
Extend Request to define 'user' property, for TypeScript typing.
*/
export interface RequestPlusUserInfo extends Request {
    user: String
}
