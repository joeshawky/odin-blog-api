import { IUserRepo } from "../infrastructure/IUserRepo";
import { DisplayUserWithPostsDto } from "../shared/Dtos/DisplayUserWithPostsDto";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface IGetUsersWithPostsUseCase
    extends IUseCase<null, IUseCaseResult<DisplayUserWithPostsDto[]>> {}

export class GetUsersWIthPostsUseCase implements IGetUsersWithPostsUseCase {
    constructor(private _userRepository: IUserRepo) {}

    async execute(): Promise<IUseCaseResult<DisplayUserWithPostsDto[]>> {
        const users = await this._userRepository.getAllWithPosts();
        const usersDtos = users.map((user) => DisplayUserWithPostsDto.from(user));
        return {
            success: true,
            data: usersDtos,
            errors: [],
        };
    }
}
