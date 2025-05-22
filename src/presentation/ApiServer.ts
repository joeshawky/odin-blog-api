import express from "express";
import { CreateUserController } from "./CreateUserController";
import { GetUsersController } from "./GetUsersController";

export class ApiServer {
    public static async run(
        port: number,
        createUserController: CreateUserController,
        getUsersController: GetUsersController,
        LoginUserController: any
    ): Promise<void> {
        const app = express();
        app.use(express.json());

        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        app.post("/users", (req, res) => createUserController.handle(req, res));
        app.get("/users", (req, res) => getUsersController.handle(req, res));

        app.post("/login", (req, res) => LoginUserController.handle(req, res));

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
