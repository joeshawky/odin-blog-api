import { Request, Response } from "express";
import { SendApiResponse } from "./SendApiResponse";
import { CreatePostUseCase } from "../../application/CreatePostUseCase";
import { GetPostsUseCase } from "../../application/GetPostsUseCase";

type PostControllerDependencies = {
    createPostUseCase: CreatePostUseCase;
    getPostsUseCase: GetPostsUseCase;
};

export type PostControllerHandlers = {
    createPostHandler: (req: Request, res: Response) => Promise<void>;
    getPostsHandler: (req: Request, res: Response) => Promise<void>;
};

export function buildPostController(
    dependencies: PostControllerDependencies
): PostControllerHandlers {
    const createPostHandler = async (req: Request, res: Response) => {
        const { title, content, userId } = req.body;
        if (!title || !content || !userId) {
            SendApiResponse({
                res,
                statusCode: 400,
                errors: ["Content, title and userId are required"],
            });
            return;
        }

        const result = await dependencies.createPostUseCase.execute({
            content,
            userId,
            title
        });
        if (result.success) {
            SendApiResponse({ res, statusCode: 201, data: result.data });
        } else {
            SendApiResponse({ res, statusCode: 400, errors: result.errors });
        }
    };
    const getPostsHandler = async (req: Request, res: Response) => {
        const result = await dependencies.getPostsUseCase.execute();
        if (result.success) {
            SendApiResponse({ res, statusCode: 201, data: result.data });
        } else {
            SendApiResponse({ res, statusCode: 400, errors: result.errors });
        }
    };

    return { createPostHandler, getPostsHandler };
}
