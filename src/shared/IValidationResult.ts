interface IValidationResult<dataType> {
    isValid: boolean;
    data?: dataType | null;
    errors: string[];
}


