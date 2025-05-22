import { Request, Response, NextFunction } from "express";
import { IController } from "../shared/IController";
import { IGetUsersUseCase } from "../application/GetUsersUseCase";
import { SendApiResponse } from "./ApiResponse";

export class GetUsersController implements IController {
    public constructor(private readonly _getUsersUseCase: IGetUsersUseCase) {}

    async handle(req: Request, res: Response): Promise<void> {
        const usersResult = await this._getUsersUseCase.execute();
        if (usersResult.success) {
            SendApiResponse({ res, statusCode: 200, data: usersResult.data });
        } else {
            SendApiResponse({
                res,
                statusCode: 400,
                errors: usersResult.errors,
            });
        }
    }
}
