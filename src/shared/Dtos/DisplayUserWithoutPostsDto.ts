import { Post } from "@prisma/client";
import { User } from "../../domain/User";

export class DisplayUserWithoutPostsDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string
    ) {}

    public static from(user: User): DisplayUserWithoutPostsDto {
        return new DisplayUserWithoutPostsDto(user.id, user.name, user.email);
    }
}