import {randomUUID} from "crypto";

export class User {
    private static readonly NAME_MIN_LENGTH = 3;
    private static readonly NAME_MAX_LENGTH = 20;
    private static readonly passwordMinLength = 8;
    private static readonly passwordMaxLength = 20;
    private static readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    public static Create(
        name: string,
        email: string,
        password: string,
        createdAt: Date = new Date()
    ): IValidationResult<User> {
        const nameValidation = this.validateName(name);
        const emailValidation = this.validateEmail(email);
        const passwordValidation = this.validatePassword(password);
        const errors: string[] = [
            ...nameValidation,
            ...emailValidation,
            ...passwordValidation,
        ];

        if (errors.length > 0) {
            return {
                isValid: false,
                data: null,
                errors: errors,
            };
        }

        const user = new User(name, email, password, createdAt);
        return {
            isValid: true,
            data: user,
            errors: [],
        };
    }

    private constructor(
        public name: string,
        public email: string,
        public password: string,
        public createdAt: Date = new Date(),
        public id: string = randomUUID()
    ) {}

    private static validateName(name: string): string[] {
        const errors: string[] = [];

        if (!name) errors.push("Name is required");

        if (name.length < this.NAME_MIN_LENGTH)
            errors.push(
                `Name must be at least ${this.NAME_MIN_LENGTH} characters long`
            );

        if (name.length > this.NAME_MAX_LENGTH)
            errors.push(
                `Name must be at most ${this.NAME_MAX_LENGTH} characters long`
            );

        return errors;
    }

    private static validateEmail(email: string): string[] {
        const errors: string[] = [];

        if (!email) errors.push("Email is required");

        if (!this.emailRegex.test(email)) errors.push("Invalid email format");

        return errors;
    }

    private static validatePassword(password: string): string[] {
        const errors: string[] = [];
        if (!password) errors.push("Password is required");

        if (password.length < this.passwordMinLength)
            errors.push(
                `Password must be at least ${this.passwordMinLength} characters long`
            );

        if (password.length > this.passwordMaxLength)
            errors.push(
                `Password must be at most ${this.passwordMaxLength} characters long`
            );

        return errors;
    }
}
