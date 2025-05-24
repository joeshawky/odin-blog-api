import { ApiServer } from "./presentation/ApiServer";
import dotenv from "dotenv";
import { CreateUserUseCase } from "./application/CreateUserUseCase";
import { PasswordHasher } from "./infrastructure/PasswordHasher";
import { GetUsersUseCase } from "./application/GetUsersUseCase";
import { LoginUserUseCase } from "./application/LoginUserUseCase";
import { JwtService } from "./infrastructure/JwtService";
import { AuthMiddleware } from "./presentation/middleware/AuthMiddleware";
import { PrismaClient } from "@prisma/client";
import { buildUserController } from "./presentation/controllers/UserController";
import { buildPostController } from "./presentation/controllers/PostController";
import { CreatePostUseCase } from "./application/CreatePostUseCase";
import { GetPostsUseCase } from "./application/GetPostsUseCase";
import { PrismaPostRepo } from "./infrastructure/prisma/PrismaPostRepo";
import { GetUsersWIthPostsUseCase } from "./application/GetUsersWithPostsUseCase";
import { buildCommentController } from "./presentation/controllers/CommentController";
import { CreateCommentUseCase } from "./application/CreateCommentUseCase";
import { PrismaCommentRepo } from "./infrastructure/prisma/PrismaCommentRepo";
import { GetCommentsUseCase } from "./application/GetCommentsUseCase";
import { PrismaUserRepo } from "./infrastructure/prisma/PrismaUserRepo";

async function main(): Promise<void> {
    dotenv.config({ path: "local.env" });
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const PORT = Number(process.env.PORT) || 3000;

    // Repos
    const prismaClient = new PrismaClient();
    const userRepo = new PrismaUserRepo(prismaClient);
    const postRepo = new PrismaPostRepo(prismaClient);
    const commentRepo = new PrismaCommentRepo(prismaClient)

    // const userRepo = new InMemoryUserRepo();
    // const postRepo = new InMemorypostRepo();

    const passwordHasher = new PasswordHasher(SALT_ROUNDS);

    const jwtService = new JwtService(JWT_SECRET);
    const authMiddleware = AuthMiddleware(jwtService);

    // User Controller Init
    const createUserUseCase = new CreateUserUseCase({
        userRepo,
        passwordHasher,
    });
    const loginUserUseCase = new LoginUserUseCase(
        userRepo,
        jwtService,
        passwordHasher
    );
    const getUsersWithPostsUseCase = new GetUsersWIthPostsUseCase(userRepo);
    const getUsersUseCase = new GetUsersUseCase(userRepo);
    const userController = buildUserController({
        getUsersUseCase,
        createUserUseCase,
        loginUserUseCase,
        getUsersWithPostsUseCase,
    });

    // Post Controller Init
    const createPostUseCase = new CreatePostUseCase({ postRepo, userRepo });
    const getPostsUseCase = new GetPostsUseCase({ postRepo, userRepo });
    const postController = buildPostController({
        createPostUseCase,
        getPostsUseCase,
    });

    // Comment Controller Init
    const createCommentUseCase = new CreateCommentUseCase({commentRepo, postRepo, userRepo})
    const getCommentsUseCase = new GetCommentsUseCase({commentRepo, postRepo, userRepo})
    const commentController = buildCommentController({
        createCommentUseCase,
        getCommentsUseCase
    });
    ApiServer.run({
        port: PORT,
        authMiddleware,
        postController,
        userController,
        commentController
    });
}

main();
