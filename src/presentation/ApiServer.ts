import express, { RequestHandler } from "express";
import {} from "express";
import { UserControllerHandlers } from "./controllers/UserController";
import { PostControllerHandlers } from "./controllers/PostController";
import { CommentControllerHandlers } from "./controllers/CommentController";
interface ApiServerRunProps {
    port: number;
    userController: UserControllerHandlers;
    postController: PostControllerHandlers;
    commentController: CommentControllerHandlers;
    authMiddleware: RequestHandler;
}

export class ApiServer {
    public static async run({
        port,
        authMiddleware,
        userController,
        commentController,
        postController,
    }: ApiServerRunProps): Promise<void> {
        const app = express();
        app.use(express.json());

        app.post("/users", (req, res) =>
            userController.createUserHandler(req, res)
        );
        app.get("/users", (req, res) =>
            userController.getUsersHandler(req, res)
        );
        app.get("/usersWithPosts", (req, res) =>
            userController.getUsersWithPostsHandler(req, res)
        );

        app.get("/posts", (req, res) =>
            postController.getPostsHandler(req, res)
        );
        app.post("/posts", authMiddleware, (req, res) =>
            postController.createPostHandler(req, res)
        );

        app.get("/comments", (req, res) =>
            commentController.getCommentsHandler(req, res)
        );
        app.post("/comments", authMiddleware, (req, res) =>
            commentController.createCommentHandler(req, res)
        );

        app.post("/login", (req, res) =>
            userController.loginUserHandler(req, res)
        );

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
