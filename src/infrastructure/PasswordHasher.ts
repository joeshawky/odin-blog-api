import { IPasswordHasher } from "../shared/IPasswordHasher";
import bcrypt from "bcrypt";

export class PasswordHasher implements IPasswordHasher {
    constructor(private readonly _saltRounds: number) {

    }
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this._saltRounds);
    }
    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}