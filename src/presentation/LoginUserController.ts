import { Request, Response, NextFunction } from "express";
import { IController } from "../shared/IController";
import { ILoginUserUseCase } from "../application/LoginUserUseCase";
import { SendApiResponse } from "./ApiResponse";

export class LoginUserController implements IController {
    public constructor(private readonly _loginUserUseCase: ILoginUserUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password)
            return SendApiResponse({
                res,
                statusCode: 400,
                errors: ["Email and password are required"],
            });
            
        const usersResult = await this._loginUserUseCase.execute({
            email,
            password,
        });

        if (usersResult.success) {
            SendApiResponse({
                res,
                statusCode: 200,
                data: { token: usersResult.data },
            });
            return;
        }

        SendApiResponse({
            res,
            statusCode: 400,
            errors: usersResult.errors,
        });
    }
}
