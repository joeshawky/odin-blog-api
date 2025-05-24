import { Comment } from "../domain/Comment";

export interface ICommentRepo {
    create(comment: Comment): Promise<boolean>;
    update(comment: Comment): Promise<boolean>;
    getAll(): Promise<Comment[]>;
    getById(id: string): Promise<Comment | null>;
    deleteById(id: string): Promise<boolean>;
}