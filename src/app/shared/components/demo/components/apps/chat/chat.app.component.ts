import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/demo/api/user';
import { ChatService } from './service/chat.service';

@Component({
    templateUrl: './chat.app.component.html'
})
export class ChatAppComponent implements OnDestroy {
    private chatService = inject(ChatService);


    subscription: Subscription;

    activeUser!: User;
    
    constructor() { 
        this.subscription = this.chatService.activeUser$.subscribe(data => this.activeUser = data);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
