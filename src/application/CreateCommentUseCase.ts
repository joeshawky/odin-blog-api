import { Comment } from "../domain/Comment";
import { ICommentRepo } from "../infrastructure/ICommentRepo";
import { IPostRepo } from "../infrastructure/IPostRepo";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { CreateCommentDto } from "../shared/Dtos/CreateCommentDto";
import { DisplayCommentDto } from "../shared/Dtos/DisplayCommentDto";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface ICreateCommentUseCase
    extends IUseCase<CreateCommentDto, IUseCaseResult<DisplayCommentDto>> {}

interface CreateCommentUseCaseProps {
    commentRepo: ICommentRepo;
    postRepo: IPostRepo;
    userRepo: IUserRepo;
}

export class CreateCommentUseCase implements ICreateCommentUseCase {
    private _commentRepo: ICommentRepo;
    private _postRepo: IPostRepo;
    private _userRepo: IUserRepo;

    constructor({
        postRepo,
        userRepo,
        commentRepo,
    }: CreateCommentUseCaseProps) {
        this._commentRepo = commentRepo;
        this._postRepo = postRepo;
        this._userRepo = userRepo;
    }

    async execute({
        content,
        userId,
        postId,
    }: CreateCommentDto): Promise<IUseCaseResult<DisplayCommentDto>> {
        const user = await this._userRepo.getById(userId);
        if (!user)
            return {
                success: false,
                errors: ["Invalid user id"],
            };

        const post = await this._postRepo.getById(postId);
        if (!post)
            return {
                success: false,
                errors: ["Invalid post id"],
            };

        const newCommentResult = Comment.Create({ content, postId, userId });
        if (!newCommentResult.isValid || !newCommentResult.data)
            return {
                success: false,
                errors: newCommentResult.errors,
            };

        const newComment = newCommentResult.data;
        const commentSaved = await this._commentRepo.create(newComment);
        if (!commentSaved)
            return {
                success: false,
                errors: ["Couldn't save post to DB."],
            };

        const postDto = DisplayCommentDto.from({comment: newCommentResult.data});
        return {
            success: true,
            data: postDto,
        };
    }
}
