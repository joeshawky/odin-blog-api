import { Post } from "../domain/Post";

export interface IPostRepo {
    create(post: Post): Promise<boolean>;
    update(post: Post): Promise<boolean>;
    getAll(): Promise<Post[]>;
    getById(id: string): Promise<Post | null>;
    deleteById(id: string): Promise<boolean>;
}