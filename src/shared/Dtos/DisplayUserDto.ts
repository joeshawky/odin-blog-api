import { User } from "../../domain/User";

export class DisplayUserDto {
    constructor(
        public readonly name: string,
        public readonly email: string
    ) {}

    public static from(user: User): DisplayUserDto {
        return new DisplayUserDto(user.name, user.email);
    }
}