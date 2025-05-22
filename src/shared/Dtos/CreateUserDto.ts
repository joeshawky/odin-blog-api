import { User } from "../../domain/User";

export class CreateUserDto{
    constructor(
        public name: string,
        public email: string,
        public password: string
    ) {}
    public static from(user: User): CreateUserDto {
        return new CreateUserDto(user.name, user.email, user.password);
    }
}