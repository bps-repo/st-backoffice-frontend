import { Injectable, signal } from '@angular/core';

export interface PaletteCommand {
    id: string;
    label: string;
    description: string;
    icon: string;
    group: string;
    routerLink: string[];
    keywords: string[];
}

@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
    isOpen = signal(false);

    readonly commands: PaletteCommand[] = [
        // Escolar
        {
            id: 'schoolar-dashboard', label: 'Dashboard', description: 'Visão geral escolar',
            icon: 'pi-th-large', group: 'Escolar', routerLink: ['/schoolar/dashboards'],
            keywords: ['inicio', 'home', 'overview'],
        },
        {
            id: 'schoolar-students', label: 'Alunos', description: 'Gerir alunos',
            icon: 'pi-users', group: 'Escolar', routerLink: ['/schoolar/students'],
            keywords: ['estudantes', 'alunos', 'students'],
        },
        {
            id: 'schoolar-lessons', label: 'Aulas', description: 'Gestão de aulas',
            icon: 'pi-book', group: 'Escolar', routerLink: ['/schoolar/lessons'],
            keywords: ['lessons', 'aulas', 'classes'],
        },
        {
            id: 'schoolar-schedule', label: 'Marcação de Aulas', description: 'Agendar aulas',
            icon: 'pi-calendar-plus', group: 'Escolar', routerLink: ['/schoolar/lessons/schedule'],
            keywords: ['agendar', 'schedule', 'marcar', 'marcacao'],
        },
        {
            id: 'schoolar-calendar', label: 'Calendário', description: 'Ver calendário',
            icon: 'pi-calendar', group: 'Escolar', routerLink: ['/schoolar/calendar'],
            keywords: ['calendario', 'agenda', 'calendar'],
        },
        {
            id: 'schoolar-assessments', label: 'Avaliações', description: 'Gerir avaliações',
            icon: 'pi-file-edit', group: 'Escolar', routerLink: ['/schoolar/assessments'],
            keywords: ['avaliacoes', 'testes', 'exames', 'assessments'],
        },
        {
            id: 'schoolar-materials', label: 'Materiais Didáticos', description: 'Materiais de apoio',
            icon: 'pi-book', group: 'Escolar', routerLink: ['/schoolar/materials'],
            keywords: ['materiais', 'apoio', 'livros', 'materials'],
        },
        {
            id: 'schoolar-levels', label: 'Níveis', description: 'Gerir níveis',
            icon: 'pi-sitemap', group: 'Escolar', routerLink: ['/schoolar/levels'],
            keywords: ['niveis', 'levels', 'categorias'],
        },
        {
            id: 'schoolar-reports', label: 'Relatórios', description: 'Relatórios escolares',
            icon: 'pi-file-pdf', group: 'Escolar', routerLink: ['/schoolar/reports'],
            keywords: ['relatorios', 'reports', 'escolar'],
        },
        // Financeiro
        {
            id: 'finance-dashboard', label: 'Dashboard Financeiro', description: 'Visão geral financeira',
            icon: 'pi-th-large', group: 'Financeiro', routerLink: ['/finances/dashboards'],
            keywords: ['financeiro', 'dashboard', 'finance'],
        },
        {
            id: 'finance-contracts', label: 'Gestão de Contratos', description: 'Gerir contratos',
            icon: 'pi-file', group: 'Financeiro', routerLink: ['/finances/contracts'],
            keywords: ['contratos', 'contracts'],
        },
        {
            id: 'finance-payments', label: 'Pagamentos', description: 'Gerir pagamentos',
            icon: 'pi-credit-card', group: 'Financeiro', routerLink: ['/finances/payments'],
            keywords: ['pagamentos', 'payments', 'pagar'],
        },
        {
            id: 'finance-sales', label: 'Vendas Avulsas', description: 'Vendas avulsas',
            icon: 'pi-shopping-cart', group: 'Financeiro', routerLink: ['/finances/sales'],
            keywords: ['vendas', 'sales', 'avulsas'],
        },
        {
            id: 'finance-reports', label: 'Relatórios Financeiros', description: 'Relatórios financeiros',
            icon: 'pi-file-pdf', group: 'Financeiro', routerLink: ['/finances/reports'],
            keywords: ['relatorios', 'financeiro', 'reports'],
        },
        // Empresa
        {
            id: 'corporate-dashboard', label: 'Dashboard Empresa', description: 'Visão geral empresarial',
            icon: 'pi-th-large', group: 'Empresa', routerLink: ['/corporate/dashboards'],
            keywords: ['empresa', 'dashboard', 'corporate'],
        },
        {
            id: 'corporate-centers', label: 'Centros', description: 'Gerir centros',
            icon: 'pi-building', group: 'Empresa', routerLink: ['/corporate/centers'],
            keywords: ['centros', 'centers', 'filiais'],
        },
        {
            id: 'corporate-services', label: 'Produtos e Serviços', description: 'Catálogo de produtos',
            icon: 'pi-box', group: 'Empresa', routerLink: ['/corporate/services'],
            keywords: ['servicos', 'produtos', 'services', 'catalogo'],
        },
        {
            id: 'corporate-employees', label: 'Utilizadores', description: 'Utilizadores do backoffice',
            icon: 'pi-users', group: 'Empresa', routerLink: ['/corporate/employees'],
            keywords: ['utilizadores', 'users', 'funcionarios', 'employees'],
        },
        {
            id: 'corporate-roles', label: 'Perfis', description: 'Perfis e permissões',
            icon: 'pi-id-card', group: 'Empresa', routerLink: ['/corporate/roles'],
            keywords: ['perfis', 'roles', 'permissoes', 'acessos'],
        },
        {
            id: 'corporate-reports', label: 'Relatórios Empresa', description: 'Relatórios empresariais',
            icon: 'pi-file-pdf', group: 'Empresa', routerLink: ['/corporate/reports'],
            keywords: ['relatorios', 'empresa', 'reports'],
        },
        // Configurações
        {
            id: 'settings-alerts', label: 'Alertas', description: 'Configurar alertas',
            icon: 'pi-bell', group: 'Configurações', routerLink: ['/settings/alerts'],
            keywords: ['alertas', 'notificacoes', 'alerts'],
        },
        {
            id: 'settings-general', label: 'Info Geral', description: 'Informações gerais da empresa',
            icon: 'pi-info-circle', group: 'Configurações', routerLink: ['/settings/general-info'],
            keywords: ['geral', 'info', 'empresa', 'configuracoes'],
        },
        {
            id: 'settings-support', label: 'Suporte', description: 'Suporte técnico',
            icon: 'pi-question-circle', group: 'Configurações', routerLink: ['/settings/support'],
            keywords: ['suporte', 'ajuda', 'help', 'support'],
        },
    ];

    open() { this.isOpen.set(true); }
    close() { this.isOpen.set(false); }
    toggle() { this.isOpen.update(v => !v); }
}
