import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/CreateUserUseCase";
import { SendApiResponse } from "./SendApiResponse";
import { GetUsersUseCase } from "../../application/GetUsersUseCase";
import { LoginUserUseCase } from "../../application/LoginUserUseCase";
import { GetUsersWIthPostsUseCase } from "../../application/GetUsersWithPostsUseCase";

type UserControllerDependencies = {
    createUserUseCase: CreateUserUseCase;
    getUsersUseCase: GetUsersUseCase;
    loginUserUseCase: LoginUserUseCase;
    getUsersWithPostsUseCase: GetUsersWIthPostsUseCase;
};

export type UserControllerHandlers = {
    createUserHandler: (req: Request, res: Response) => Promise<void>;
    getUsersHandler: (req: Request, res: Response) => Promise<void>;
    loginUserHandler: (req: Request, res: Response) => Promise<void>;
    getUsersWithPostsHandler: (req: Request, res: Response) => Promise<void>;
};


export function buildUserController(dependencies: UserControllerDependencies): UserControllerHandlers {
    const createUserHandler = async (req: Request, res: Response) => {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            SendApiResponse({
                res,
                statusCode: 400,
                errors: ["Email, password and name are required"],
            });
            return;
        }

        const result = await dependencies.createUserUseCase.execute({
            email,
            password,
            name,
        });
        if (result.success) {
            SendApiResponse({ res, statusCode: 201, data: result.data });
        } else {
            SendApiResponse({ res, statusCode: 400, errors: result.errors });
        }
    };

    const getUsersHandler = async (req: Request, res: Response) => {
        const usersResult = await dependencies.getUsersUseCase.execute();
        if (usersResult.success) {
            SendApiResponse({ res, statusCode: 200, data: usersResult.data });
        } else {
            SendApiResponse({
                res,
                statusCode: 400,
                errors: usersResult.errors,
            });
        }
    };

    const getUsersWithPostsHandler = async (req: Request, res: Response) => {
        const usersResult = await dependencies.getUsersWithPostsUseCase.execute();
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

    const loginUserHandler = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password)
            return SendApiResponse({
                res,
                statusCode: 400,
                errors: ["Email and password are required"],
            });

        const usersResult = await dependencies.loginUserUseCase.execute({
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
    };

    return {createUserHandler, loginUserHandler, getUsersHandler, getUsersWithPostsHandler}
}
