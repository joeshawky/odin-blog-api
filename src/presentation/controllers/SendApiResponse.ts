import { Response } from "express";

interface IResponse {
    status: "error" | "success";
}

interface IErrorResponse extends IResponse {
    errors: string[];
}

interface ISuccessResponse<dataType> extends IResponse {
    data?: dataType;
}

type SendApiResponseType<dataType> = {
    res: Response;
    statusCode: number;
    data?: dataType;
    errors?: string[];
};

export function SendApiResponse<dataType>({
    res,
    statusCode,
    data,
    errors,
}: SendApiResponseType<dataType>): void {
    if (errors && errors.length > 0) {
        res.status(statusCode).json({
            status: "error",
            errors,
        } as IErrorResponse);
        return;
    }

    res.status(statusCode).json({
        status: "success",
        data,
    } as ISuccessResponse<dataType>);
}
