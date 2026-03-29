import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from 'src/app/shared/components/demo/components/apps/mail/service/mail.service';

@Component({
    templateUrl: './mail-trash.component.html'
})
export class MailTrashComponent implements OnDestroy {
    private mailService = inject(MailService);


    trashMails: Mail[] = [];

    subscription: Subscription;

    constructor() {
        this.subscription = this.mailService.mails$.subscribe(data => {
            this.trashMails = data.filter(d => d.trash);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
