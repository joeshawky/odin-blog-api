import { PrismaClient } from "@prisma/client";
import { ICommentRepo } from "../ICommentRepo";
import { Comment } from "../../domain/Comment";

export class PrismaCommentRepo implements ICommentRepo {
    constructor(private _prismaClient: PrismaClient) {}

    async create(comment: Comment): Promise<boolean> {
        try {
            await this._prismaClient.comment.create({
                data: {
                    content: comment.content,
                    userId: comment.userId,
                    postId: comment.postId,
                    // Do NOT include id or createdAt
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async update(comment: Comment): Promise<boolean> {
        try {
            await this._prismaClient.comment.update({
                where: { id: comment.id },
                data: {
                    userId: comment.userId,
                    postId: comment.postId,
                    content: comment.content,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getAll(): Promise<Comment[]> {
        return await this._prismaClient.comment.findMany();
    }

    async getById(id: string): Promise<Comment | null> {
        const post = await this._prismaClient.comment.findUnique({
            where: { id },
        });
        if (!post) return null;
        return post;
    }

    async deleteById(id: string): Promise<boolean> {
        try {
            await this._prismaClient.comment.delete({ where: { id } });
            return true;
        } catch (error) {
            return false;
        }
    }
}
