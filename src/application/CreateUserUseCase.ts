import { User } from "../domain/User";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { CreateUserDto } from "../shared/Dtos/CreateUserDto";
import { DisplayUserWithoutPostsDto } from "../shared/Dtos/DisplayUserWithoutPostsDto";
import { IPasswordHasher } from "../shared/IPasswordHasher";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface ICreateUserUseCase
    extends IUseCase<CreateUserDto, IUseCaseResult<DisplayUserWithoutPostsDto>> {}

interface CreateUserUseCaseProps {
    userRepo: IUserRepo;
    passwordHasher: IPasswordHasher;
}

export class CreateUserUseCase implements ICreateUserUseCase {
    private _userRepo: IUserRepo;
    private _passwordHasher: IPasswordHasher;

    constructor({ userRepo, passwordHasher }: CreateUserUseCaseProps) {
        this._userRepo = userRepo;
        this._passwordHasher = passwordHasher;
    }

    async execute({
        name,
        email,
        password,
    }: CreateUserDto): Promise<IUseCaseResult<DisplayUserWithoutPostsDto>> {
        const existingUser = await this._userRepo.getByEmail(email);
        if (existingUser) {
            return {
                success: false,
                errors: ["User already exists"],
            };
        }

        const newUserResult = User.Create(name, email, password);
        if (!newUserResult.isValid || !newUserResult.data) {
            return {
                success: false,
                errors: newUserResult.errors,
            };
        }

        const hashedPassword = await this._passwordHasher.hashPassword(
            password
        );
        newUserResult.data.password = hashedPassword;

        await this._userRepo.create(newUserResult.data);
        // TODO: creating inside the user repo may return false, handle later.

        const userDto = DisplayUserWithoutPostsDto.from(newUserResult.data);
        return {
            success: true,
            data: userDto,
        };
    }
}
