import { Comment } from "../../domain/Comment";

type CreateCommentDtoProps = {
    content: string;
    userId: string;
    postId: string;
};

export class CreateCommentDto {
    public content: string;
    public userId: string;
    public postId: string;

    constructor({ content, userId, postId }: CreateCommentDtoProps) {
        this.content = content;
        this.userId = userId;
        this.postId = postId;
    }
    public static from(comment: Comment): CreateCommentDto {
        return new CreateCommentDto({ ...comment });
    }
}
