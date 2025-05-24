import { Post } from "../../domain/Post";

type CreatePostDtoProps = {
    title: string;
    content: string;
    userId: string;
};

export class CreatePostDto {
    public title: string;
    public content: string;
    public userId: string;

    constructor({ title, content, userId }: CreatePostDtoProps) {
        this.title = title;
        this.content = content;
        this.userId = userId;
    }
    public static from(post: Post): CreatePostDto {
        return new CreatePostDto({
            ...post,
        });
    }
}
