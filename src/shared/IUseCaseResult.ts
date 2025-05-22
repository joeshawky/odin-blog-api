export interface IUseCaseResult<T> {
    success: boolean;
    data?: T | null;
    errors?: string[];
}

