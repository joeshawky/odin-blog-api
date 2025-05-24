import { randomUUID } from "crypto";
import { Comment } from "./Comment";

type PostCreationProps = {
    title: string;
    content: string;
    userId: string;
    createdAt?: Date;
};

export class Post {
    private static readonly TITLE_MIN_LENGTH = 3;
    private static readonly TITLE_MAX_LENGTH = 100;
    private static readonly CONTENT_MIN_LENGTH = 10;
    private static readonly CONTENT_MAX_LENGTH = 5000;

    public static Create({
        title,
        content,
        userId,
        createdAt = new Date(),
    }: PostCreationProps): IValidationResult<Post> {
        const titleValidation = this.validateTitle(title);
        const contentValidation = this.validateContent(content);
        const userIdValidation = this.validateUserId(userId);
        const errors: string[] = [
            ...titleValidation,
            ...contentValidation,
            ...userIdValidation,
        ];

        // if (errors.length > 0) return new ErrorValidationResult(errors);
        if (errors.length > 0)
            return {
                isValid: false,
                data: null,
                errors: errors,
            };

        const post = new Post(title, content, userId, createdAt);
        return {
            isValid: true,
            data: post,
            errors: [],
        };
    }

    private constructor(
        public title: string,
        public content: string,
        public userId: string,
        public createdAt: Date = new Date(),
        public id: string = randomUUID(),
        public comments?: Comment[],
    ) {}

    private static validateTitle(title: string): string[] {
        const errors: string[] = [];

        if (!title) errors.push("Title is required");

        if (title.length < this.TITLE_MIN_LENGTH)
            errors.push(
                `Title must be at least ${this.TITLE_MIN_LENGTH} characters long`
            );

        if (title.length > this.TITLE_MAX_LENGTH)
            errors.push(
                `Title must be at most ${this.TITLE_MAX_LENGTH} characters long`
            );

        return errors;
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

    private static validateUserId(userId: string): string[] {
        const errors: string[] = [];
        if (!userId) errors.push("User ID is required");
        return errors;
    }
}
