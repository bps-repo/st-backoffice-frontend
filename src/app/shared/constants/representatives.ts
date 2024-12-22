import { Student } from 'src/app/core/models/student';

export const STUDENTS: Student[] = [
    {
        id: 1,
        name: 'Amy Elsner',
        email: 'username@gmail.com',
        city: 'luanda',
        course: 'beginner',
        grade: 'beginner',
        birtdate: '12.04-2004',
        phone: 9283736747,
        nif: 83373,
    },
    {
        id: 2,
        name: 'Anna Fali',
        email: 'username@gmail.com',
        city: 'benguela',
        course: 'beginner',
        grade: 'beginner',
        birtdate: '12.04-2004',
        phone: 9283736747,
        nif: 83373,
    },
    {
        id: 6,
        name: 'Ioni Bowcher',
        email: 'username@gmail.com',
        city: 'Bie',
        course: 'beginner',
        grade: 'beginner',
        birtdate: '12.04-2004',
        phone: 9283736747,
        nif: 83373,
    },
    {
        id: 7,
        name: 'Ivan Magalhaes',
        email: 'username@gmail.com',
        city: 'luanda',
        course: 'beginner',
        grade: 'beginner',
        birtdate: '12.04-2004',
        phone: 9283736747,
        nif: 83373,
    },
    {
        id: 8,
        name: 'Onyama Limba',
        email: 'username@gmail.com',
        city: 'Benguela',
        course: 'beginner',
        grade: 'beginner',
        birtdate: '12.04-2004',
        phone: 9283736747,
        nif: 83373,
    },
    {
        id: 9,
        name: 'XuXue Feng',
        email: 'username@gmail.com',
        city: 'Uige',
        course: 'beginner',
        grade: 'beginner',
        birtdate: '12.04-2004',
        phone: 9283736747,
        nif: 83373,
    },
];

export const STATUSES: any[] = [
    { label: 'Unqualified', value: 'unqualified' },
    { label: 'Qualified', value: 'qualified' },
    { label: 'New', value: 'new' },
    { label: 'Negotiation', value: 'negotiation' },
    { label: 'Renewal', value: 'renewal' },
    { label: 'Proposal', value: 'proposal' },
];

export const INSTALATIONS: any[] = [
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
