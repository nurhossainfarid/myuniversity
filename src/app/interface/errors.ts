export type TErrorSource = {
    path: string | number;
    message: string | null;
}[]

export type TGenericErrorResponse  = {
    statusCode: number;
    message: string;
    errorSource: TErrorSource;
}