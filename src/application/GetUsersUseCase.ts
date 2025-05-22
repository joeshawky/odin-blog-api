import { IUserRepo } from "../infrastructure/IUserRepo";
import { DisplayUserDto } from "../shared/Dtos/DisplayUserDto";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface IGetUsersUseCase
    extends IUseCase<null, IUseCaseResult<DisplayUserDto[]>> {}

export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(private _userRepository: IUserRepo) {}

    async execute(): Promise<IUseCaseResult<DisplayUserDto[]>> {
        const users = await this._userRepository.getAll();
        const usersDtos = users.map((user) => DisplayUserDto.from(user));
        return {
            success: true,
            data: usersDtos,
            errors: [],
        };
    }
}
