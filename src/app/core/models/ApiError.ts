import {HttpStatusCode} from "@angular/common/http";
import {ApiResponse} from "./ApiResponseService";

export interface ApiError extends ApiResponse<any> {
    timestamp: string,
    status: HttpStatusCode,
    error: string,
    message: string,
    errorCode: string,
    path: string,
    validationErrors: {
        field: string,
        message: string
    }[]
}
