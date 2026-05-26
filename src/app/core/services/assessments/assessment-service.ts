import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map, Observable } from "rxjs";
import { PageableResponse } from "../../models/ApiResponseService";
import { ApiResponse } from "../../models/ApiResponseService";


@Injectable({
    providedIn: 'root',
})
export class AssessmentService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/assessments`;

    getAssessments(): Observable<PageableResponse<any[]>> {
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
            map((response) => response.data)
        );
    }
}
