import { Student, StudentStatus } from 'src/app/core/models/student';

export const STUDENTS: Student[] = [
    {
        id: 1,
        name: 'Amy Elsner',
        email: 'username@gmail.com',
        center: 'Patriota',
        course: 'beginner',
        level: 'beginner',
        birthdate: '12.04-2004',
        phone: 9293736747,
        status: StudentStatus.ACTIVE,
    },
    {
        id: 2,
        name: 'Anna Fali',
        email: 'username@gmail.com',
        center: 'benguela',
        course: 'beginner',
        level: 'beginner',
        birthdate: '12.04-2004',
        phone: 9223736237,
        status: StudentStatus.ACTIVE,
    },
    {
        id: 6,
        name: 'Ioni Bowcher',
        email: 'username@gmail.com',
        center: 'Nova Vida',
        course: 'beginner',
        level: 'beginner',
        birthdate: '12.04-2004',
        phone: 9283736747,
        status: StudentStatus.ACTIVE,
    },
    {
        id: 7,
        name: 'Ivan Magalhaes',
        email: 'username@gmail.com',
        center: 'Maculusso',
        course: 'beginner',
        level: 'beginner',
        birthdate: '12.04-2004',
        phone: 9213736747,
        status: StudentStatus.INACTIVE,
    },
    {
        id: 8,
        name: 'Onyama Limba',
        email: 'username@gmail.com',
        center: 'Benguela',
        course: 'Talatona',
        level: 'beginner',
        birthdate: '12.04-2004',
        phone: 9223736747,
        status: StudentStatus.QUIT,
    },
    {
        id: 9,
        name: 'XuXue Feng',
        email: 'username@gmail.com',
        center: 'Talatona',
        course: 'beginner',
        level: 'beginner',
        birthdate: '12.04-2004',
        phone: 9276736747,
        status: StudentStatus.ACTIVE,
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
