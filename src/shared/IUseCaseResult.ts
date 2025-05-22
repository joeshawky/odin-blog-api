export interface IUseCaseResult<T> {
    success: boolean;
    data?: T;
    errors?: string[];
}

