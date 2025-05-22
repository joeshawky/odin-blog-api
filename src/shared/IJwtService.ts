import { IDataResult } from "./IDataResult";

export interface IJwtService {
    generateToken(userId: string): IDataResult<string>;
    verifyToken(token: string): IDataResult<boolean>;
}