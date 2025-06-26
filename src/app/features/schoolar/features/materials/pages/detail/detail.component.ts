import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

interface Material {
    id: string;
    titulo: string;
    tipo: string;
    dataPublicacao: string;
    disponivel: boolean;
    descricao?: string;
    autor?: string;
    tamanho?: string;
    downloads?: number;
}

@Component({
    selector: 'app-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule, SkeletonModule, InputTextModule, InputTextareaModule, ButtonModule]
})
export class DetailComponent implements OnInit {
    materialId: string = '';
    material: Material | null = null;
    loading: boolean = true;

    // general data - in a real app, this would come from a service
    materials: Material[] = [
        {
            id: '1',
            titulo: 'Guia de Estudos - Matemática',
            tipo: 'PDF',
            dataPublicacao: '2024-01-15',
            disponivel: true,
            descricao: 'Guia completo para estudos de matemática básica e avançada.',
            autor: 'Prof. João Silva',
            tamanho: '2.5 MB',
            downloads: 125
        },
        {
            id: '2',
            titulo: 'Aula Introdução à Física',
            tipo: 'Vídeo',
            dataPublicacao: '2024-02-10',
            disponivel: true,
            descricao: 'Vídeo introdutório sobre conceitos básicos de física.',
            autor: 'Profa. Maria Santos',
            tamanho: '150 MB',
            downloads: 87
        },
        {
            id: '3',
            titulo: 'Exercícios Práticos de Química',
            tipo: 'PDF',
            dataPublicacao: '2023-12-05',
            disponivel: false,
            descricao: 'Conjunto de exercícios práticos para reforço do aprendizado em química.',
            autor: 'Prof. Carlos Oliveira',
            tamanho: '1.8 MB',
            downloads: 210
        }
    ];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.materialId = params['id'];
            this.loadMaterial();
        });
    }

    loadMaterial(): void {
        // Simulate API call
        setTimeout(() => {
            this.material = this.materials.find(m => m.id === this.materialId) || null;
            this.loading = false;
        }, 500);
    }

    downloadMaterial(): void {
        // In a real app, this would trigger a download of the material
        console.log('Downloading material:', this.material);
        alert('Material download started');
    }

    toggleAvailability(): void {
        // In a real app, this would update the material's availability
        if (this.material) {
            this.material.disponivel = !this.material.disponivel;
            console.log('Material availability toggled:', this.material.disponivel);
            alert(`Material is now ${this.material.disponivel ? 'available' : 'unavailable'}`);
        }
    }
}
