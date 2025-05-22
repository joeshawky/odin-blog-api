import { IDataResult } from "./IDataResult";

export interface ITokenData {
    username: string;
    email: string;
}

export interface IJwtService {
    generateToken({ username, email }: ITokenData): IDataResult<string>;
    verifyToken(token: string): IDataResult<ITokenData>;
}
