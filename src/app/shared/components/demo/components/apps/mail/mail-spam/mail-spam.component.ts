import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/shared/components/demo/components/apps/mail/service/mail.service';

@Component({
    selector: 'app-mail-spam',
    templateUrl: './mail-spam.component.html',
})
export class MailSpamComponent implements OnDestroy {
    private mailService = inject(MailService);

    spamMails: Mail[] = [];

    subscription: Subscription;

    constructor() {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.spamMails = data.filter(
                (d) =>
                    d.spam &&
                    !d.archived &&
                    !d.trash &&
                    !d.hasOwnProperty('sent')
            );
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
