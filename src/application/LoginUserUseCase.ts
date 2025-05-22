import { IUserRepo } from "../infrastructure/IUserRepo";
import { IUseCaseResult } from "../shared/IUseCaseResult";
import { IJwtService } from "../shared/IJwtService";
import { IPasswordHasher } from "../shared/IPasswordHasher";
import { IUseCase } from "../shared/IUseCase";

interface ILoginUserDto {
    email: string;
    password: string;
}

type token = string;

interface ILoginUserResult extends IUseCaseResult<token> {}

export interface ILoginUserUseCase
    extends IUseCase<ILoginUserDto, ILoginUserResult> {}

export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        private _userRepo: IUserRepo,
        private _jwtService: IJwtService,
        private _passwordHasher: IPasswordHasher
    ) {}

    async execute(input: ILoginUserDto): Promise<ILoginUserResult> {
        const { email, password } = input;
        if (!email || !password) {
            return {
                success: false,
                data: null,
                errors: ["Email and password are required"],
            };
        }

        const user = await this._userRepo.getByEmail(email);
        if (!user) {
            return {
                success: false,
                data: null,
                errors: ["User not found"],
            };
        }

        const isPasswordValid = await this._passwordHasher.verifyPassword(
            password,
            user.password
        );
        if (!isPasswordValid) {
            return {
                success: false,
                data: null,
                errors: ["Invalid password"],
            };
        }

        const tokenResult = this._jwtService.generateToken(user.id);
        if (!tokenResult.isValid) {
            return {
                success: false,
                data: null,
                errors: tokenResult.errors,
            };
        }

        return {
            success: true,
            data: tokenResult.data,
            errors: [],
        };
    }
}
