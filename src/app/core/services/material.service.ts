import { HttpClient } from '@angular/common/http';
import { Material } from '../models/material';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MaterialService extends BaseService<number, Material> {
    constructor(httpClient: HttpClient) {
        super(httpClient, 'assets/mock-data/materials.json');
    }

    getMaterials(): Observable<Material[]> {
        return this.getAll();
    }

    getMaterialById(id: number): Observable<Material> {
        return this.getById(id);
    }
}
