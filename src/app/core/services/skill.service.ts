// src/app/core/services/skill.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';
import { Skill } from '../models/academic/skill';

export interface SkillListParams {
    page?: number;
    size?: number;
}

export interface CreateSkillRequest {
    name: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class SkillService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/skills`;

    listSkills(params: SkillListParams = {}): Observable<ApiResponse<PageableResponse<Skill>>> {
        let httpParams = new HttpParams();
        if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
        if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
        return this.http.get<ApiResponse<PageableResponse<Skill>>>(this.apiUrl, { params: httpParams });
    }

    /** Convenience flat-array wrapper for dropdowns/selects. */
    getSkills(): Observable<Skill[]> {
        return this.listSkills({ page: 0, size: 100 }).pipe(
            map((res) => res.data.content)
        );
    }

    createSkill(body: CreateSkillRequest): Observable<Skill> {
        return this.http.post<ApiResponse<Skill>>(this.apiUrl, body).pipe(
            map((res) => res.data)
        );
    }

    updateSkill(id: string, body: Partial<CreateSkillRequest>): Observable<Skill> {
        return this.http.patch<ApiResponse<Skill>>(`${this.apiUrl}/${id}`, body).pipe(
            map((res) => res.data)
        );
    }

    deleteSkill(id: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
            map(() => undefined)
        );
    }
}
