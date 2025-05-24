import { randomUUID } from "crypto";

type CommentCreationProps = {
    content: string;
    userId: string;
    postId: string;
    createdAt?: Date;
};

type NewCommentProps = CommentCreationProps & {
    id?: string
}

export class Comment {
    private static readonly CONTENT_MIN_LENGTH = 1;
    private static readonly CONTENT_MAX_LENGTH = 500;

    public content: string;
    public postId: string;
    public userId: string;
    public createdAt: Date;
    public id: string;

    private constructor(
        {content,
        userId,
        postId,
        createdAt = new Date(),
        id = (() => randomUUID())()}: NewCommentProps
    ) {
        this.content = content;
        this.userId = userId;
        this.postId = postId;
        this.createdAt = createdAt;
        this.id = id;
    }

    public static Create({
        content,
        userId,
        postId,
        createdAt = new Date()
    }: CommentCreationProps): IValidationResult<Comment> {
        const contentValidation = this.validateContent(content);
        const postIdValidation = this.validatePostId(postId);
        const userIdValidation = this.validateUserId(userId);
        const errors: string[] = [
            ...contentValidation,
            ...postIdValidation,
            ...userIdValidation,
        ];

        if (errors.length > 0)
            return {
                isValid: false,
                data: null,
                errors: errors,
            };

        const comment = new Comment({content, postId, userId, createdAt});
        return {
            isValid: true,
            data: comment,
            errors: [],
        };
    }

    

    private static validateContent(content: string): string[] {
        const errors: string[] = [];

        if (!content) errors.push("Content is required");

        if (content.length < this.CONTENT_MIN_LENGTH)
            errors.push(
                `Content must be at least ${this.CONTENT_MIN_LENGTH} characters long`
            );

        if (content.length > this.CONTENT_MAX_LENGTH)
            errors.push(
                `Content must be at most ${this.CONTENT_MAX_LENGTH} characters long`
            );

        return errors;
    }

    private static validatePostId(postId: string): string[] {
        const errors: string[] = [];

        if (!postId) errors.push("Post ID is required");

        return errors;
    }

    private static validateUserId(userId: string): string[] {
        const errors: string[] = [];

        if (!userId) errors.push("User ID is required");

        return errors;
    }
}
