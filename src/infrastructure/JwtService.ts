import { IJwtService, ITokenData } from "../shared/IJwtService";
import jwt from "jsonwebtoken";
import { IDataResult } from "../shared/IDataResult";

export class JwtService implements IJwtService {
    constructor(private readonly _secret: string) {}

    generateToken({ email, username }: ITokenData): IDataResult<string> {
        try {
            const token = jwt.sign({ email, username }, this._secret, {
                expiresIn: "1h",
            });
            return {
                isValid: true,
                data: token,
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
    verifyToken(token: string): IDataResult<ITokenData> {
        try {
            const decoded = jwt.verify(token, this._secret);
            if (
                typeof decoded === "object" &&
                decoded !== null &&
                "email" in decoded &&
                "username" in decoded
            ) {
                return {
                    isValid: true,
                    data: {
                        email: (decoded as any).email,
                        username: (decoded as any).username,
                    },
                    errors: [],
                };
            }

            return {
                isValid: false,
                errors: ["Failed to grab token information"],
            };
            
        } catch (error) {
            return {
                isValid: false,
                errors: ["Failed to verify token"],
            };
        }
    }
}
