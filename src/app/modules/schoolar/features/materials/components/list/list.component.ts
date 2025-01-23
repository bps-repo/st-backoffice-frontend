import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { Material } from 'src/app/core/models/material';
import { MaterialService } from 'src/app/core/services/material.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [CommonModule, GlobalTableComponent],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
    columns: any[] = [];

    materials: Material[] = [];

    constructor(private materialService: MaterialService) {}

    ngOnInit(): void {
        this.loadMaterials();

        this.columns = [
            { header: 'ID', field: 'id' },
            { header: 'Título', field: 'title' },
            { header: 'Tipo', field: 'type' },
            { header: 'Data de Publicacao', field: 'createdDate' },
            { header: 'Descrição', field: 'description' },
            { header: 'Estado', field: 'status' },
        ];
    }

    loadMaterials(): void {
        this.materialService.getMaterials().subscribe((materials) => {
            this.materials = materials;
        });
    }
}
