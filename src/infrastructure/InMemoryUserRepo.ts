import { User } from "../domain/User";
import { IUserRepo } from "./IUserRepo";

export class InMemoryUserRepo implements IUserRepo {
    private _users: User[] = [];

    async getAll(): Promise<User[]> {

        return Promise.resolve(this._users);
    }

    async create(user: User): Promise<boolean> {
        this._users.push(user);
        return Promise.resolve(true);
    }

    update(user: User): Promise<boolean> {
        const index = this._users.findIndex((u) => u.id === user.id);
        if (index === -1) return Promise.resolve(false);

        this._users[index] = user;
        return Promise.resolve(true);
    }

    getByEmail(email: string): Promise<User | null> {
        const user = this._users.find((u) => u.email === email);
        if (user) return Promise.resolve(user);
        return Promise.resolve(null);
    }

    getById(id: string): Promise<User | null> {
        const user = this._users.find((u) => u.id === id);
        if (user) return Promise.resolve(user);
        return Promise.resolve(null);
    }

    deleteById(id: string): Promise<boolean> {
        const index = this._users.findIndex((u) => u.id === id);
        if (index === -1) return Promise.resolve(false);

        this._users.splice(index, 1);
        return Promise.resolve(true);
    }
}
