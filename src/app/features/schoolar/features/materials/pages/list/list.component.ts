import {Component, ElementRef, OnInit, ViewChild, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {GlobalTable, TableColumn} from 'src/app/shared/components/tables/global-table/global-table.component';
import {Material} from "../../../../../../core/models/academic/material";


@Component({
    selector: 'app-general',
    imports: [
        CommonModule,
        GlobalTable,
        FormsModule,
        ButtonModule,
        DropdownModule,
        InputTextModule
    ],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    materiais: Partial<Material>[] = [];
    loading: boolean = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['titulo', 'tipo', 'dataPublicacao', 'disponivel'];

    tiposDeMateriais: any[] = [];
    instalations: SelectItem[] = [];
    options: SelectItem[] = [];

    selectedOption = signal('table_material');
    selectedDrop: SelectItem = {value: ''};

    @ViewChild('filter') filter!: ElementRef;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        this.materiais = [
            {
                title: 'Guia de Estudos - Matemática',
                type: 'PDF',
                uploadDate: new Date('2024-01-15').toISOString(),
                active: true,
                availabilityStartDate: new Date('2024-01-01').toISOString(),
                availabilityEndDate: new Date('2024-12-31').toISOString(),
                units: [],
                createdAt: new Date('2023-01-01').toISOString(),
                updatedAt: new Date('2023-01-01').toISOString(),
                id: '1',
                description: 'Guia de estudos abrangente para o exame de Matemática.',
                fileUrl: 'https://example.com/guia-matematica.pdf',
            },
        ];

        this.tiposDeMateriais = [
            {label: 'PDF', value: 'PDF'},
            {label: 'Vídeo', value: 'Vídeo'},
            {label: 'Documento Word', value: 'Word'},
        ];

        this.options = [
            {label: 'Materiais Didáticos', value: 'table_materials'},
            {label: 'Relatórios de Presença', value: 'table_presences'},
        ];

        this.instalations = [
            {
                label: 'Cidade',
                value: {id: 1, name: 'New York', code: 'NY'},
            },
            {label: 'Centro', value: {id: 2, name: 'Rome', code: 'RM'}},
            {
                label: 'Maculusso',
                value: {id: 3, name: 'London', code: 'LDN'},
            },
            {
                label: 'Nova Vida',
                value: {id: 4, name: 'Istanbul', code: 'IST'},
            },
            {label: 'Patriota', value: {id: 5, name: 'Paris', code: 'PRS'}},
        ];

        // Define columns for the table
        this.columns = [
            {
                field: 'titulo',
                header: 'Título',
                filterType: 'text',
            },
            {
                field: 'tipo',
                header: 'Tipo',
                filterType: 'text',
            },
            {
                field: 'dataPublicacao',
                header: 'Data de Publicação',
                filterType: 'date',
            },
            {
                field: 'disponivel',
                header: 'Disponibilidade',
                filterType: 'boolean',
                customTemplate: true,
            },
            {
                field: 'actions',
                header: 'Ações',
                customTemplate: true,
            },
        ];
    }

    navigateToCreateMaterial() {
        this.router.navigate(['/schoolar/materials/create']);
    }

    viewDetails(material: Material): void {
        this.router.navigate(['/schoolar/materials', material.id]);
    }
}
