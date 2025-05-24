import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/User";
import { IUserRepo } from "../IUserRepo";

export class PrismaUserRepo implements IUserRepo {
    constructor(private _prismaClient: PrismaClient) {}

    getAllWithPosts(): Promise<User[]> {
        const users = this._prismaClient.user.findMany(
            {include: {posts: true}}
        )
        return users;
    }

    async create(user: User): Promise<boolean> {
        try {
            await this._prismaClient.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    createdAt: user.createdAt,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async update(user: User): Promise<boolean> {
        try {
            await this._prismaClient.user.update({
                where: { id: user.id },
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getAll(): Promise<User[]> {
        return await this._prismaClient.user.findMany();
    }
       

    async getByEmail(email: string): Promise<User | null> {
        const u = await this._prismaClient.user.findUnique({ where: { email } });
        if (!u) return null;
        return u;
    }

    async getById(id: string): Promise<User | null> {
        const user = await this._prismaClient.user.findUnique({ where: { id } });
        if (!user) return null;
        return user
    }

    async deleteById(id: string): Promise<boolean> {
        try {
            await this._prismaClient.user.delete({ where: { id } });
            return true;
        } catch (error) {
            return false;
        }
    }
}