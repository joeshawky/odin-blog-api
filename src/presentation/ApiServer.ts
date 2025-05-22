import express, { RequestHandler } from "express";
import { CreateUserController } from "./controllers/CreateUserController";
import { GetUsersController } from "./controllers/GetUsersController";
import {} from "express"
interface ApiServerRunProps {
    port: number;
    createUserController: CreateUserController;
    getUsersController: GetUsersController;
    loginUserController: any;
    authMiddleware: RequestHandler
}

export class ApiServer {
    public static async run({
        port,
        authMiddleware,
        createUserController,
        getUsersController,
        loginUserController,
    }: ApiServerRunProps): Promise<void> {
        const app = express();
        app.use(express.json());

        app.get("/", authMiddleware, (req, res) => {
            if ((req as any).user) {
                res.send({message: "authenticated", user: (req as any).user})
                return;
            }
            res.send("Not Authenticated");
        });

        app.post("/users", (req, res) => createUserController.handle(req, res));
        app.get("/users", (req, res) => getUsersController.handle(req, res));
        
        app.post("/login", (req, res) => loginUserController.handle(req, res));

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
