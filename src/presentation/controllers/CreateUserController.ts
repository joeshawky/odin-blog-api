import { ICreateUserUseCase } from "../../application/CreateUserUseCase";
import { Request, Response } from "express";
import { IController } from "../../shared/IController";
import { SendApiResponse } from "./SendApiResponse"; 

export class CreateUserController implements IController {
    public constructor(
        private readonly _createUserUseCase: ICreateUserUseCase
    ) {}

    public async handle(req: Request, res: Response): Promise<void> {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            SendApiResponse({
                res,
                statusCode: 400,
                errors: ["Email, password and name are required"],
            });
            return;
        }

        const result = await this._createUserUseCase.execute({
            email,
            password,
            name,
        });
        if (result.success) {
            SendApiResponse({ res, statusCode: 201, data: result.data });
        } else {
            SendApiResponse({ res, statusCode: 400, errors: result.errors });
        }
    }
}
