export interface IUseCase<inputType, outputType> {
    execute(input?: inputType): Promise<outputType>;
}