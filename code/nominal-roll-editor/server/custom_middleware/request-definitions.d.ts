/// <reference types="express" />
import { Request } from 'express';
export interface RequestPlusUserInfo extends Request {
    user: String;
}
