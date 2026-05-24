import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MaterialService } from '../material.service';
import { Material, MaterialCreateRequest, MaterialUploadRequest } from '../../models/academic/material';

@Injectable({ providedIn: 'root' })
export class MaterialsFacade {
    private materialService = inject(MaterialService);

    loading = signal(false);
    error = signal<string | null>(null);
    materials = signal<Material[]>([]);

    async loadByEntity(entityType: string, entityId: string): Promise<void> {
        this.loading.set(true);
        this.error.set(null);
        try {
            const result = await firstValueFrom(
                this.materialService.getMaterialsByEntity(entityType, entityId)
            );
            this.materials.set(result ?? []);
        } catch (err: any) {
            this.error.set(err?.error?.message ?? err?.message ?? 'Erro ao carregar materiais');
        } finally {
            this.loading.set(false);
        }
    }

    clearMaterials(): void {
        this.materials.set([]);
        this.error.set(null);
    }

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

    async uploadMaterialWithRelations(file: File, request: MaterialUploadRequest): Promise<Material | null> {
        this.loading.set(true);
        this.error.set(null);
        try {
            return await firstValueFrom(this.materialService.uploadMaterialWithRelations(file, request));
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
