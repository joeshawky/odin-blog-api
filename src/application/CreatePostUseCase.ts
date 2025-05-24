import { Post } from "../domain/Post";
import { IPostRepo } from "../infrastructure/IPostRepo";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { CreatePostDto } from "../shared/Dtos/CreatePostDto";
import { DisplayPostDto } from "../shared/Dtos/DisplayPostDto";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface ICreatePostUseCase
    extends IUseCase<CreatePostDto, IUseCaseResult<DisplayPostDto>> {}

interface CreatePostUseCaseProps {
    postRepo: IPostRepo;
    userRepo: IUserRepo;
}

export class CreatePostUseCase implements ICreatePostUseCase {
    private _postRepo: IPostRepo;
    private _userRepo: IUserRepo;

    constructor({ postRepo, userRepo }: CreatePostUseCaseProps) {
        this._postRepo = postRepo;
        this._userRepo = userRepo;
    }

    async execute({
        content,
        title,
        userId,
    }: CreatePostDto): Promise<IUseCaseResult<DisplayPostDto>> {
        const postCreatorUser = await this._userRepo.getById(userId);
        if (!postCreatorUser)
            return {
                success: false,
                errors: ["Invalid user id"],
            };

        const newPostResult = Post.Create({ content, title, userId });
        if (!newPostResult.isValid || !newPostResult.data)
            return {
                success: false,
                errors: newPostResult.errors,
            };

        const newPost = newPostResult.data;
        const postSaved = await this._postRepo.create(newPost);
        if (!postSaved)
            return {
                success: false,
                errors: ["Couldn't save post to DB."],
            };

        const postDto = DisplayPostDto.from({
            post: newPost,
            username: postCreatorUser.name,
        });
        return {
            success: true,
            data: postDto,
        };
    }
}

// type function_args = {
//     deps: { postRepo: IPostRepo; userRepo: IUserRepo };
//     post: { content: string; title: string; userId: string };
// };

// export async function CreatePostUseCaseFunc({
//     deps,
//     post,
// }: function_args): Promise<IUseCaseResult<DisplayPostDto>> {
//     const { title, content, userId } = post;

//     const postCreatorUser = await deps.userRepo.getById(userId);
//     if (!postCreatorUser)
//         return {
//             success: false,
//             errors: ["Invalid user id"],
//         };

//     const newPostResult = Post.Create({ content, title, userId });
//     if (!newPostResult.isValid || !newPostResult.data)
//         return {
//             success: false,
//             errors: newPostResult.errors,
//         };

//     const newPost = newPostResult.data;
//     const postSaved = await deps.postRepo.create(newPost);
//     if (!postSaved)
//         return {
//             success: false,
//             errors: ["Couldn't save post to DB."],
//         };

//     const postDto = DisplayPostDto.from({
//         post: newPost,
//         username: postCreatorUser.name,
//     });
//     return {
//         success: true,
//         data: postDto,
//     };
// }
