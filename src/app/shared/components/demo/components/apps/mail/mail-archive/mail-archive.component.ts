import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/shared/components/demo/components/apps/mail/service/mail.service';

@Component({
    selector: 'app-mail-archive',
    templateUrl: './mail-archive.component.html',
})
export class MailArchiveComponent implements OnDestroy {
    private mailService = inject(MailService);

    archivedMails: Mail[] = [];

    subscription: Subscription;

    constructor() {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.archivedMails = data.filter((d) => d.archived);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
