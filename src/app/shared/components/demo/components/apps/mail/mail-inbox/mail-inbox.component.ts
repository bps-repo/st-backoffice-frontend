import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/shared/components/demo/components/apps/mail/service/mail.service';

@Component({
    selector: 'app-mail-inbox',
    templateUrl: './mail-inbox.component.html',
})
export class MailInboxComponent implements OnDestroy {
    private mailService = inject(MailService);
    private router = inject(Router);

    mails: Mail[] = [];

    subscription: Subscription;

    constructor() {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.mails = data.filter(
                (d) =>
                    !d.archived &&
                    !d.spam &&
                    !d.trash &&
                    !d.hasOwnProperty('sent')
            );
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
