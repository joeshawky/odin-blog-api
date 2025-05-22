import { User } from "../domain/User";

export interface IUserRepo {
    create(user: User): Promise<boolean>;
    update(user: User): Promise<boolean>;
    getAll(): Promise<User[]>;
    getByEmail(email: string): Promise<User | null>;
    getById(id: string): Promise<User | null>;
    deleteById(id: string): Promise<boolean>;
}