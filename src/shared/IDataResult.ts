export interface IDataResult<dataType> {
    isValid: boolean;
    data?: dataType | null;
    errors: string[]; 
}
