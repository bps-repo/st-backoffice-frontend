import { HttpClient } from '@angular/common/http';
import { Material } from '../models/material';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PATH_TO_MOCK_DATA } from 'src/app/shared/constants/app';

@Injectable({ providedIn: 'root' })
export class MaterialService extends BaseService<number, Material> {
    constructor(httpClient: HttpClient) {
        super(httpClient, PATH_TO_MOCK_DATA + 'materials.json');
    }

    getMaterials(): Observable<Material[]> {
        return this.getAll();
    }

    getMaterialById(id: number): Observable<Material> {
        return this.getById(id);
    }
}
