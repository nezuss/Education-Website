export type ApiResponse<T> = {
    message: string;
    data: T;
};

export type ApiError = {
    message: string;
    errorCode?: number;
};
