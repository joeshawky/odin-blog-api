import { Post } from "../../domain/Post";
import { IPostRepo } from "../IPostRepo";

export class InMemorypostRepo implements IPostRepo {
    private _posts: Post[] = [];

    async getAll(): Promise<Post[]> {

        return Promise.resolve(this._posts);
    }

    async create(post: Post): Promise<boolean> {
        this._posts.push(post);
        return Promise.resolve(true);
    }

    update(post: Post): Promise<boolean> {
        const index = this._posts.findIndex((p) => p.id === post.id);
        if (index === -1) return Promise.resolve(false);

        this._posts[index] = post;
        return Promise.resolve(true);
    }


    getById(id: string): Promise<Post | null> {
        const post = this._posts.find((u) => u.id === id);
        if (post) return Promise.resolve(post);
        return Promise.resolve(null);
    }

    deleteById(id: string): Promise<boolean> {
        const index = this._posts.findIndex((u) => u.id === id);
        if (index === -1) return Promise.resolve(false);

        this._posts.splice(index, 1);
        return Promise.resolve(true);
    }
}
