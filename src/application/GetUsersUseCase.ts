import { User, UserDisplayDto } from "../domain/User";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { IUserDisplayDto } from "../shared/Dtos/IUserDIsplay";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface IGetUsersUseCase
    extends IUseCase<null, IUseCaseResult<IUserDisplayDto[]>> {}

export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(private _userRepository: IUserRepo) {}

    async execute(): Promise<IUseCaseResult<IUserDisplayDto[]>> {
        const users = await this._userRepository.getAll();
        const usersDtos = users.map((user) => UserDisplayDto.from(user));
        return {
            success: true,
            data: usersDtos,
            errors: [],
        };
    }
}
