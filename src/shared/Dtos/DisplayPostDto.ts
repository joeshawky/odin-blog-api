import { Post } from "../../domain/Post";

type DisplayPostDtoProps = {
    id: string;
    content: string;
    title: string;
    createdAt: Date;
    username: string;
};

export class DisplayPostDto {
    public readonly content: string;
    public readonly title: string;
    public readonly createdAt: Date;
    public readonly username: string;
    public readonly id: string;

    constructor({ content, title, createdAt, username, id }: DisplayPostDtoProps) {
        this.id = id
        this.title = title;
        this.content = content;
        this.username = username;
        this.createdAt = createdAt;
    }

    public static from({post, username}: {post: Post, username: string}): DisplayPostDto {
        return new DisplayPostDto({
            content: post.content,
            createdAt: post.createdAt,
            title: post.title,
            id: post.id,
            username,
        });
    }
}
