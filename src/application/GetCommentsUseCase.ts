import { ICommentRepo } from "../infrastructure/ICommentRepo";
import { IPostRepo } from "../infrastructure/IPostRepo";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { DisplayCommentDto } from "../shared/Dtos/DisplayCommentDto";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface IGetCommentUseCase
    extends IUseCase<null, IUseCaseResult<DisplayCommentDto[]>> {}

interface GetCommentsUseCaseProps {
    commentRepo: ICommentRepo;
    postRepo: IPostRepo;
    userRepo: IUserRepo;
}

export class GetCommentsUseCase implements IGetCommentUseCase {
    private _commentRepo: ICommentRepo;
    private _postRepo: IPostRepo;
    private _userRepo: IUserRepo;

    constructor({
        postRepo,
        userRepo,
        commentRepo,
    }: GetCommentsUseCaseProps) {
        this._commentRepo = commentRepo;
        this._postRepo = postRepo;
        this._userRepo = userRepo;
    }

    async execute(): Promise<IUseCaseResult<DisplayCommentDto[]>> {
        const comments = await this._commentRepo.getAll();
        const commentsDto = comments.map((comment) =>
            DisplayCommentDto.from({ comment })
        );
        return {
            success: true,
            data: commentsDto,
        };
    }
}
