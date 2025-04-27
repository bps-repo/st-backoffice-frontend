import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface Certificate {
    id: string;
    name: string;
    student: string;
    course: string;
    issueDate: string;
    status: string;
    description?: string;
    validUntil?: string;
    issuedBy?: string;
}

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class DetailComponent implements OnInit {
    certificateId: string = '';
    certificate: Certificate | null = null;
    loading: boolean = true;

    // Sample data - in a real app, this would come from a service
    certificates: Certificate[] = [
        {
            id: '1',
            name: 'Certificate of Completion',
            student: 'John Doe',
            course: 'English Level 1',
            issueDate: '2023-01-15',
            status: 'Issued',
            description: 'This certificate is awarded for successfully completing the English Level 1 course.',
            validUntil: '2025-01-15',
            issuedBy: 'Language School'
        },
        {
            id: '2',
            name: 'Certificate of Achievement',
            student: 'Jane Smith',
            course: 'Mathematics Advanced',
            issueDate: '2023-02-20',
            status: 'Pending',
            description: 'This certificate is awarded for outstanding achievement in the Mathematics Advanced course.',
            validUntil: '2025-02-20',
            issuedBy: 'Math Academy'
        },
        {
            id: '3',
            name: 'Certificate of Excellence',
            student: 'Bob Johnson',
            course: 'Science Fundamentals',
            issueDate: '2023-03-10',
            status: 'Issued',
            description: 'This certificate is awarded for excellence in the Science Fundamentals course.',
            validUntil: '2025-03-10',
            issuedBy: 'Science Institute'
        }
    ];

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.certificateId = params['id'];
            this.loadCertificate();
        });
    }

    loadCertificate(): void {
        // Simulate API call
        setTimeout(() => {
            this.certificate = this.certificates.find(c => c.id === this.certificateId) || null;
            this.loading = false;
        }, 500);
    }

    downloadCertificate(): void {
        // In a real app, this would trigger a download of the certificate
        console.log('Downloading certificate:', this.certificate);
        alert('Certificate download started');
    }

    sendCertificate(): void {
        // In a real app, this would send the certificate to the student
        console.log('Sending certificate to:', this.certificate?.student);
        alert('Certificate sent to ' + this.certificate?.student);
    }
}
