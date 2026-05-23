import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MaterialService } from '../material.service';
import { Material, MaterialCreateRequest } from '../../models/academic/material';

@Injectable({ providedIn: 'root' })
export class MaterialsFacade {
    private materialService = inject(MaterialService);

    loading = signal(false);
    error = signal<string | null>(null);

    async createMaterialWithRelations(request: MaterialCreateRequest): Promise<Material | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            return await firstValueFrom(this.materialService.createMaterialWithRelations(request));
        } catch (err: any) {
            const message =
                err?.error?.message ||
                err?.error?.detail ||
                err?.message ||
                'Erro desconhecido';
            this.error.set(typeof message === 'string' ? message : 'Erro desconhecido');
            return null;
        } finally {
            this.loading.set(false);
        }
    }
}
