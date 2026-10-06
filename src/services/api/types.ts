export type ApiResponse<T> = {
    message: string;
    data: T;
};

export type ApiError = {
    message?: string;
    title?: string;
    errors?: Record<string, string[]>;
    errorCode?: number;
};
