import { PrismaClient } from "@prisma/client";
import { Post } from "../../domain/Post";
import { IPostRepo } from "../IPostRepo";

export class PrismaPostRepo implements IPostRepo {
    constructor(private _prismaClient: PrismaClient) {}

    async create(post: Post): Promise<boolean> {
        try {
            await this._prismaClient.post.create({
                data: {
                    userId: post.userId,
                    content: post.content,
                    title: post.title
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async update(post: Post): Promise<boolean> {
        try {
            await this._prismaClient.post.update({
                where: { id: post.id },
                data: {
                    userId: post.userId,
                    content: post.content,
                    title: post.title
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getAll(): Promise<Post[]> {
        return await this._prismaClient.post.findMany();
    }

    async getById(id: string): Promise<Post | null> {
        const post = await this._prismaClient.post.findUnique({
            where: { id },
        });
        if (!post) return null;
        return post;
    }

    async deleteById(id: string): Promise<boolean> {
        try {
            await this._prismaClient.post.delete({ where: { id } });
            return true;
        } catch (error) {
            return false;
        }
    }
}
