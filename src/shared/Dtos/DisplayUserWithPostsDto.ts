import { Post } from "../../domain/Post";
import { User } from "../../domain/User";

export class DisplayUserWithPostsDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly posts?: Post[]
    ) {}

    public static from(user: User): DisplayUserWithPostsDto {
        return new DisplayUserWithPostsDto(user.id, user.name, user.email, user.posts);
    }
}