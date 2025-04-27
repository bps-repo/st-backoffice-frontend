import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GlobalTable, TableColumn } from 'src/app/shared/components/tables/global-table/global-table.component';

interface Material {
    titulo: string;
    tipo: string; // Ex.: 'PDF', 'Vídeo'
    dataPublicacao: string;
    disponivel: boolean;
}

@Component({
    selector: 'app-list',
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
    materiais: Material[] = [];
    loading: boolean = false;

    columns: TableColumn[] = [];
    globalFilterFields: string[] = ['titulo', 'tipo', 'dataPublicacao', 'disponivel'];

    tiposDeMateriais: any[] = [];
    instalations: SelectItem[] = [];
    options: SelectItem[] = [];

    selectedOption = signal('table_material');
    selectedDrop: SelectItem = { value: '' };

    @ViewChild('filter') filter!: ElementRef;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.materiais = [
            {
                titulo: 'Guia de Estudos - Matemática',
                tipo: 'PDF',
                dataPublicacao: new Date('2024-01-15').toISOString(),
                disponivel: true,
            },
            {
                titulo: 'Aula Introdução à Física',
                tipo: 'Vídeo',
                dataPublicacao: new Date('2024-02-10').toISOString(),
                disponivel: true,
            },
            {
                titulo: 'Exercícios Práticos de Química',
                tipo: 'PDF',
                dataPublicacao: new Date('2023-12-05').toISOString(),
                disponivel: false,
            },
        ];

        this.tiposDeMateriais = [
            { label: 'PDF', value: 'PDF' },
            { label: 'Vídeo', value: 'Vídeo' },
            { label: 'Documento Word', value: 'Word' },
        ];

        this.options = [
            { label: 'Materiais Didáticos', value: 'table_materials' },
            { label: 'Relatórios de Presença', value: 'table_presences' },
        ];

        this.instalations = [
            {
                label: 'Cidade',
                value: { id: 1, name: 'New York', code: 'NY' },
            },
            { label: 'Centro', value: { id: 2, name: 'Rome', code: 'RM' } },
            {
                label: 'Maculusso',
                value: { id: 3, name: 'London', code: 'LDN' },
            },
            {
                label: 'Nova Vida',
                value: { id: 4, name: 'Istanbul', code: 'IST' },
            },
            { label: 'Patriota', value: { id: 5, name: 'Paris', code: 'PRS' } },
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
        this.router.navigate(['/modules/schoolar/materials/create']);
    }
}
