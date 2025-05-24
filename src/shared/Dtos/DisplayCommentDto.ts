import { Comment } from "../../domain/Comment";

type DisplayCommentDtoProps = {
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: Date;
};

export class DisplayCommentDto {
    public id: string;
    public content: string;
    public userId: string;
    public postId: string;
    public createdAt: Date;

    constructor({
        content,
        userId,
        postId,
        createdAt,
        id,
    }: DisplayCommentDtoProps) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.postId = postId;
        this.createdAt = createdAt;
    }
    public static from({comment}: {comment: Comment}): DisplayCommentDto {
        return new DisplayCommentDto({ ...comment });
    }
}
