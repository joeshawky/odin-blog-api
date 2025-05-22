import { NextFunction, Request, Response } from "express";
import { IJwtService } from "../../shared/IJwtService";
import { SendApiResponse } from "../SendApiResponse";

export function AuthMiddleware(
    jwtService: IJwtService
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            SendApiResponse({res, statusCode: 401, errors: ["No token provided"]})
            return;
        } 

        const token = authHeader.split(" ")[1];
        const result = jwtService.verifyToken(token);
        if (!result.isValid) {
            SendApiResponse({res, statusCode: 401, errors: ["Invalid or expired token"]})
            return 
        }
        
        // Attach user info to request
        (req as any).user = result.data;
        next();
    }
}
