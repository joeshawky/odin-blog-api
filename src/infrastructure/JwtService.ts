import { IJwtService } from "../shared/IJwtService";
import jwt from "jsonwebtoken";
import { IDataResult } from "../shared/IDataResult";

export class JwtService implements IJwtService {
    constructor(private readonly _secret: string) {}

    generateToken(userId: string): IDataResult<string> {
        try {
            const token = jwt.sign({ userId }, this._secret, {
                expiresIn: "1h",
            });
            return {
                isValid: true,
                data: token,
                errors: [],
            };
        } catch (error) {
            console.error("Error generating token:", error);
            return {
                isValid: false,
                data: null,
                errors: ["Failed to generate token"],
            };
        }
    }
    verifyToken(token: string): IDataResult<boolean> {
        throw new Error("Method not implemented.");
    }
}
