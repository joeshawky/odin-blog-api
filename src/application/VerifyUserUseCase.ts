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

    async execute({
        email,
        password,
    }: ILoginUserDto): Promise<ILoginUserResult> {
        const user = await this._userRepo.getByEmail(email);
        if (!user) {
            return {
                success: false,
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
                errors: ["Invalid password"],
            };
        }

        const tokenResult = this._jwtService.generateToken({
            username: user.name,
            email: user.email,
        });
        if (!tokenResult.isValid) {
            return {
                success: false,
                errors: tokenResult.errors,
            };
        }

        if (tokenResult.data)
            return {    
                success: true,
                data: tokenResult.data
            };
        
        return {    
            success: true,
            errors: ["Could not grab user data from token"],
        };
    }
}
