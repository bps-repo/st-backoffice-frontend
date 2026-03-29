import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/shared/components/demo/components/apps/mail/service/mail.service';

@Component({
    selector: 'app-mail-important',
    templateUrl: './mail-important.component.html',
})
export class MailImportantComponent implements OnDestroy {
    private mailService = inject(MailService);

    importantMails: Mail[] = [];

    subscription: Subscription;

    constructor() {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.importantMails = data.filter(
                (d) => d.important && !d.spam && !d.trash && !d.archived
            );
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
