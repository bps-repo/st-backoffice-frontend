import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    inject,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil, switchMap, of, catchError, BehaviorSubject} from 'rxjs';
import {MessageService, ConfirmationService} from 'primeng/api';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SkeletonModule} from 'primeng/skeleton';
import {DividerModule} from 'primeng/divider';
import {CertificateService} from 'src/app/core/services/certificate.service';
import {StudentCertificate} from 'src/app/core/models/academic/students/student-certificate';

@Component({
    selector: 'scholar-student-certificates-tab',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        TagModule,
        TooltipModule,
        ToastModule,
        ConfirmDialogModule,
        SkeletonModule,
        DividerModule,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './certificates.tab.component.html',
})
export class StudentCertificatesTabComponent implements OnInit, OnChanges, OnDestroy {
    @Input() studentId: string | null = null;

    private destroy$ = new Subject<void>();
    private loadTrigger$ = new BehaviorSubject<string | null>(null);

    private certService = inject(CertificateService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    certificates: StudentCertificate[] = [];
    loading = false;
    error: string | null = null;

    // Per-certificate loading flags
    publishing: Set<string> = new Set();
    downloading: Set<string> = new Set();
    issuing = false;

    ngOnInit(): void {
        this.loadTrigger$
            .pipe(
                switchMap((sid) => {
                    if (!sid) return of([]);
                    return this.certService.getStudentCertificates(sid).pipe(
                        catchError(() => {
                            this.error = 'Erro ao carregar certificados.';
                            return of([]);
                        }),
                    );
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((certs) => {
                this.certificates = certs;
                this.loading = false;
                this.cdr.detectChanges();
            });

        if (this.studentId) {
            this.triggerLoad();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['studentId'] && !changes['studentId'].firstChange && this.studentId) {
            this.triggerLoad();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    reload(): void {
        this.triggerLoad();
    }

    private triggerLoad(): void {
        if (!this.studentId) return;
        this.loading = true;
        this.error = null;
        this.loadTrigger$.next(this.studentId);
    }

    // ── Issue certificate ─────────────────────────────────────────────────────

    issueForCurrentLevel(): void {
        if (!this.studentId) return;
        this.confirmationService.confirm({
            header: 'Emitir Certificado',
            message:
                'Deseja emitir um certificado de conclusão para o nível actual do aluno?',
            icon: 'pi pi-verified',
            acceptLabel: 'Emitir',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.issuing = true;
                this.cdr.detectChanges();
                this.certService
                    .issueCertificate(this.studentId!)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (cert) => {
                            this.certificates = [...this.certificates, cert];
                            this.issuing = false;
                            this.cdr.detectChanges();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Certificado emitido',
                                detail: `Certificado nº ${cert.certificateNumber} emitido com sucesso.`,
                            });
                        },
                        error: () => {
                            this.issuing = false;
                            this.cdr.detectChanges();
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erro',
                                detail: 'Não foi possível emitir o certificado.',
                            });
                        },
                    });
            },
        });
    }

    // ── Publish to student ────────────────────────────────────────────────────

    publishToStudent(cert: StudentCertificate): void {
        this.confirmationService.confirm({
            header: 'Publicar Certificado',
            message: `Publicar o certificado nº ${cert.certificateNumber} para o aluno?`,
            icon: 'pi pi-send',
            acceptLabel: 'Publicar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.publishing.add(cert.id);
                this.cdr.detectChanges();
                this.certService
                    .publishCertificate(cert.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (updated) => {
                            this.publishing.delete(cert.id);
                            this.certificates = this.certificates.map((c) =>
                                c.id === updated.id ? updated : c,
                            );
                            this.cdr.detectChanges();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Publicado',
                                detail: 'Certificado publicado com sucesso.',
                            });
                        },
                        error: () => {
                            this.publishing.delete(cert.id);
                            this.cdr.detectChanges();
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erro',
                                detail: 'Não foi possível publicar o certificado.',
                            });
                        },
                    });
            },
        });
    }

    // ── Download ──────────────────────────────────────────────────────────────

    downloadCertificate(cert: StudentCertificate): void {
        if (!this.studentId) return;
        this.downloading.add(cert.id);
        this.cdr.detectChanges();
        this.certService
            .downloadCertificate(cert.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (blob) => {
                    this.downloading.delete(cert.id);
                    this.cdr.detectChanges();

                    // Guard: if the server returned JSON (ApiResponse envelope) instead of
                    // a real PDF, read it and extract the download URL from data.url / data.
                    const isPdf =
                        blob.type === 'application/pdf' ||
                        (!blob.type.includes('json') && !blob.type.includes('text'));

                    if (!isPdf) {
                        blob.text().then((text) => {
                            try {
                                const json = JSON.parse(text);
                                const url: unknown =
                                    json?.data?.url ??
                                    json?.data?.downloadUrl ??
                                    json?.data;
                                if (typeof url === 'string' && /^https?:\/\//.test(url)) {
                                    window.open(url, '_blank');
                                    return;
                                }
                            } catch {
                                // fall through to error toast
                            }
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Formato inesperado',
                                detail:
                                    'O servidor não devolveu um PDF. Verifique o endpoint de download.',
                            });
                        });
                        return;
                    }

                    this.triggerBlobDownload(blob, `certificado-${cert.certificateNumber}.pdf`);
                },
                error: () => {
                    this.downloading.delete(cert.id);
                    this.cdr.detectChanges();
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível descarregar o certificado.',
                    });
                },
            });
    }

    /**
     * Creates a temporary anchor, triggers the browser download dialog, then
     * revokes the object URL after a safe delay so inline PDF renderers
     * (Chrome, Edge) have time to start reading the bytes.
     */
    private triggerBlobDownload(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // 30 s grace period — same pattern used by contract downloads
        setTimeout(() => window.URL.revokeObjectURL(url), 30_000);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    isPublishing(cert: StudentCertificate): boolean {
        return this.publishing.has(cert.id);
    }

    isDownloading(cert: StudentCertificate): boolean {
        return this.downloading.has(cert.id);
    }

    formatDate(dateString: string | null | undefined): string {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('pt-AO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    }

    trackById(_: number, cert: StudentCertificate): string {
        return cert.id;
    }
}
