import { Request, Response } from "express";
import { SendApiResponse } from "./SendApiResponse";
import { CreateCommentUseCase } from "../../application/CreateCommentUseCase";
import { GetCommentsUseCase } from "../../application/GetCommentsUseCase";
type CommentControllerDependencies = {
    createCommentUseCase: CreateCommentUseCase;
    getCommentsUseCase: GetCommentsUseCase;
};

export type CommentControllerHandlers = {
    createCommentHandler: (req: Request, res: Response) => Promise<void>;
    getCommentsHandler: (req: Request, res: Response) => Promise<void>;
};

export function buildCommentController(
    dependencies: CommentControllerDependencies
): CommentControllerHandlers {
    const createCommentHandler = async (req: Request, res: Response) => {
        const { content, postId, userId } = req.body;
        if (!content || !postId || !userId) {
            SendApiResponse({
                res,
                statusCode: 400,
                errors: ["Content, postId and userId are required"],
            });
            return;
        }

        const result = await dependencies.createCommentUseCase.execute({
            content,
            postId,
            userId,
        });
        if (result.success) {
            SendApiResponse({ res, statusCode: 201, data: result.data });
        } else {
            SendApiResponse({ res, statusCode: 400, errors: result.errors });
        }
    };
    const getCommentsHandler = async (req: Request, res: Response) => {
        const result = await dependencies.getCommentsUseCase.execute();
        if (result.success) {
            SendApiResponse({ res, statusCode: 201, data: result.data });
        } else {
            SendApiResponse({ res, statusCode: 400, errors: result.errors });
        }
    };

    return { getCommentsHandler, createCommentHandler };
}
