import { Component, Input, EventEmitter, Output, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Mail } from 'src/app/demo/api/mail';
import { MailService } from '../service/mail.service';

@Component({
    selector: 'app-mail-reply',
    templateUrl: './mail-reply.component.html',
})
export class MailReplyComponent {
    private messageService = inject(MessageService);
    private mailService = inject(MailService);


    newMail: Mail = {
        id: '',
        to: '',
        email: '',
        image: '',
        title: '',
        message: '',
        date: '',
        important: false,
        starred: false,
        trash: false,
        spam: false,
        archived: false,
        sent: true
    }

    displayMessage: boolean = false;

    @Input() content: Mail = {};

    @Output() hide: EventEmitter<any> = new EventEmitter();

    sendMail() {
        let { image, from, title } = this.content
        this.newMail = { ...this.newMail, to: from, title: title, image: image };
        this.mailService.onSend(this.newMail);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Mail sent' });
        this.hide.emit();
    }

    toggleMessage() {
        this.displayMessage = !this.displayMessage;
    }
}
