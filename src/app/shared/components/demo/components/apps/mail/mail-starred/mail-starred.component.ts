import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/shared/components/demo/components/apps/mail/service/mail.service';

@Component({
    selector: 'app-mail-starred',
    templateUrl: './mail-starred.component.html',
})
export class MailStarredComponent implements OnDestroy {
    private mailService = inject(MailService);

    starredMails: Mail[] = [];

    subscription: Subscription;

    constructor() {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.starredMails = data.filter(
                (d) => d.starred && !d.archived && !d.trash
            );
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
