import { IUserRepo } from "../infrastructure/IUserRepo";
import { DisplayUserWithoutPostsDto } from "../shared/Dtos/DisplayUserWithoutPostsDto";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface IGetUsersUseCase
    extends IUseCase<null, IUseCaseResult<DisplayUserWithoutPostsDto[]>> {}

export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(private _userRepository: IUserRepo) {}

    async execute(): Promise<IUseCaseResult<DisplayUserWithoutPostsDto[]>> {
        const users = await this._userRepository.getAll();
        const usersDtos = users.map((user) => DisplayUserWithoutPostsDto.from(user));
        return {
            success: true,
            data: usersDtos,
            errors: [],
        };
    }
}
