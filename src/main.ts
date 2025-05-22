import { ApiServer } from "./presentation/ApiServer";
import dotenv from "dotenv";
import { CreateUserController } from "./presentation/CreateUserController";
import { CreateUserUseCase } from "./application/CreateUserUseCase";
import { InMemoryUserRepo } from "./infrastructure/InMemoryUserRepo";
import { PasswordHasher } from "./infrastructure/PasswordHasher";
import { GetUsersController } from "./presentation/GetUsersController";
import { GetUsersUseCase } from "./application/GetUsersUseCase";
import { LoginUserUseCase } from "./application/LoginUserUseCase";
import { LoginUserController } from "./presentation/LoginUserController";
import { JwtService } from "./infrastructure/JwtService";
import { AuthMiddleware } from "./presentation/middleware/AuthMiddleware";

async function main(): Promise<void> {
    dotenv.config({ path: "local.env" });
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const PORT = Number(process.env.PORT) || 3000;

    const inMemoryRepo = new InMemoryUserRepo();
    const passwordHasher = new PasswordHasher(SALT_ROUNDS);

    const createUserUseCase = new CreateUserUseCase(
        inMemoryRepo,
        passwordHasher
    );
    const createUserController = new CreateUserController(createUserUseCase);

    const getUsersUseCase = new GetUsersUseCase(inMemoryRepo);
    const getUsersController = new GetUsersController(getUsersUseCase);

    const jwtService = new JwtService(JWT_SECRET);
    const authMiddleware = AuthMiddleware(jwtService);

    const loginUserUseCase = new LoginUserUseCase(
        inMemoryRepo,
        jwtService,
        passwordHasher
    );
    const loginUserController = new LoginUserController(loginUserUseCase);

    ApiServer.run({
        port: PORT,
        authMiddleware,
        createUserController,
        getUsersController,
        loginUserController,
    });
}

main();
