import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/demo/api/user';
import { ChatService } from '../service/chat.service';

@Component({
    selector: 'app-chat-sidebar',
    templateUrl: './chat-sidebar.component.html'
})
export class ChatSidebarComponent implements OnInit {
    private chatService = inject(ChatService);


    searchValue: string = '';

    users: User[] = [];

    filteredUsers: User[] = [];

    ngOnInit(): void {
        this.chatService.getChatData().then(data => {
            this.users = data;
            this.filteredUsers = this.users;
        });
    }

    filter() {
        let filtered: User[] = [];
        for (let i = 0; i < this.users.length; i++) {
            let user = this.users[i];
            if (user.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) == 0) {
                filtered.push(user)
            }
        }

        this.filteredUsers = [...filtered];
    }

}
