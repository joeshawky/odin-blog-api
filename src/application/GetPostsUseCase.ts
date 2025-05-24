import { IPostRepo } from "../infrastructure/IPostRepo";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { DisplayPostDto } from "../shared/Dtos/DisplayPostDto";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface IGetPostsUseCase
    extends IUseCase<null, IUseCaseResult<DisplayPostDto[]>> {}

interface GetPostsUseCaseProps {
    postRepo: IPostRepo;
    userRepo: IUserRepo;
}

export class GetPostsUseCase implements IGetPostsUseCase {
    private _postRepo: IPostRepo;
    private _userRepo: IUserRepo;

    constructor({ postRepo, userRepo }: GetPostsUseCaseProps) {
        this._postRepo = postRepo;
        this._userRepo = userRepo;
    }

    async execute(): Promise<IUseCaseResult<DisplayPostDto[]>> {
        const posts = await this._postRepo.getAll();
        const users = await this._userRepo.getAll();

        const postsDto: DisplayPostDto[] = [];

        for (const post of posts) {
            const user = users.find((user) => user.id === post.userId);
            if (!user)
                return {
                    success: false,
                    errors: ["Invalid user id inside post"],
                };
            postsDto.push(DisplayPostDto.from({ post, username: user.name }));
        }

        return {
            success: true,
            data: postsDto,
        };
    }
}
