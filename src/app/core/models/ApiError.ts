export interface ApiValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    timestamp: string;
    status: number;
    error: string;       // user-facing category label, e.g. "Validação falhou"
    message: string;     // developer-facing detail, e.g. "Invalid input parameters"
    errorCode: string;
    path: string;
    validationErrors?: ApiValidationError[];
}
