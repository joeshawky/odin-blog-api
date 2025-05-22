import { User } from "../domain/User";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { CreateUserDto } from "../shared/Dtos/CreateUserDto";
import { DisplayUserDto } from "../shared/Dtos/DisplayUserDto";
import { IPasswordHasher } from "../shared/IPasswordHasher";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

export interface ICreateUserUseCase extends IUseCase<CreateUserDto, IUseCaseResult<DisplayUserDto>> {}

export class CreateUserUseCase implements ICreateUserUseCase {
    constructor(
        private userRepository: IUserRepo,
        private _passwordHasher: IPasswordHasher
    ) {}

    async execute({
        name,
        email,
        password,
    }: CreateUserDto): Promise<IUseCaseResult<DisplayUserDto>> {
        const existingUser = await this.userRepository.getByEmail(email);
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

        await this.userRepository.create(newUserResult.data);
        // TODO: creating inside the user repo may return false, handle later.

        const userDto = DisplayUserDto.from(newUserResult.data);
        return {
            success: true,
            data: userDto
        } 
    }
}
