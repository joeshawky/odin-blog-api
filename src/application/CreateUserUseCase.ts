import { User } from "../domain/User";
import { IUserRepo } from "../infrastructure/IUserRepo";
import { IPasswordHasher } from "../shared/IPasswordHasher";
import { IUseCase } from "../shared/IUseCase";
import { IUseCaseResult } from "../shared/IUseCaseResult";

interface CreateUserDto {
    email: string;
    password: string;
    name: string;
}

export interface ICreateUserCaseResult extends IUseCaseResult<CreateUserDto> {}

export interface ICreateUserUseCase
    extends IUseCase<CreateUserDto, ICreateUserCaseResult> {}

export class CreateUserUseCase implements ICreateUserUseCase {
    constructor(
        private userRepository: IUserRepo,
        private _passwordHasher: IPasswordHasher
    ) {}

    async execute(userData: CreateUserDto): Promise<ICreateUserCaseResult> {
        const { email, password, name } = userData;
        if (!email || !password || !name) {
            return {
                success: false,
                data: null,
                errors: ["Email, password, and name are required"],
            };
        }

        const existingUser = await this.userRepository.getByEmail(email);
        if (existingUser) {
            return {
                success: false,
                data: null,
                errors: ["User already exists"],
            };
        }

        const newUserResult = User.Create(name, email, password);
        if (!newUserResult.isValid || !newUserResult.data) {
            return {
                success: false,
                data: null,
                errors: newUserResult.errors,
            };
        }

        const hashedPassword = await this._passwordHasher.hashPassword(
            password
        );
        newUserResult.data.password = hashedPassword;

        await this.userRepository.create(newUserResult.data);
        // TODO: creating inside the user repo may return false, handle later.
        return {
            success: true,
            data: newUserResult.data,
            errors: [],
        };
    }
}
