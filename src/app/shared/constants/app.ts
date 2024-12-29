import { SelectItem } from 'primeng/api';

export const INSTALATIONS: string[] = [
    'Cidade',
    'Patriota',
    'Nova Vida',
    'Maculusso',
    'Talatona',
];

export const COUNTRIES: any[] = [
    { name: 'Angola', code: 'AO' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
];

export const STATUSES: any[] = [
    { label: 'Ativo', value: 'active' },
    { label: 'Inativo', value: 'inactive' },
];

export const LEVELS: SelectItem[] = [
    { label: 'Adults - Beginner', value: 'AO' },
    { label: 'Adults - Elementary', value: 'BR' },
    { label: 'Adults - Pre Intermediate 1', value: 'EG' },
    { label: 'Adults - Pre Intermediate 2', value: 'FR' },
    { label: 'Adults - Intermediate 1', value: 'DE' },
    { label: 'Adults - Intermediate 2', value: 'IN' },
    { label: 'Adults - Upper Intermediate 1', value: 'JP' },
    { label: 'Adults - Upper Intermediate 2', value: 'ES' },
    { label: 'Adults - Advanced 1', value: 'US' },
    { label: 'Adults - Advanced 2', value: 'US' },
    { label: 'Proficiency', value: 'US' },
    { label: 'ATL Talatona', value: 'US' },
    { label: 'Kids - Flyers 1', value: 'US' },
    { label: 'Kids - Flyers 2', value: 'US' },
    { label: 'Kids - Flyers 3', value: 'US' },
    { label: 'Kids - Flyers 4', value: 'US' },
    { label: 'Kids - Flyers 5', value: 'US' },
];

export const ENTITIES: SelectItem[] = [
    { label: 'BCA', value: 'AO' },
    { label: 'EMIS', value: 'BR' },
    { label: 'BNA', value: 'EG' },
    { label: 'BAI', value: 'FR' },
    { label: 'AGT', value: 'DE' },
    { label: 'Ministério das FInanças', value: 'IN' },
    { label: 'SOMOIL', value: 'US' },
];

export const DISCOUNTS: SelectItem[] = [
    { label: 'Desconto 10%', value: '10' },
    { label: 'Desconto 20%', value: '20' },
    { label: 'Desconto 30%', value: '30' },
];
